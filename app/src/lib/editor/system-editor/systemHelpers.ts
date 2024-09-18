import type { ComponentType, SystemType } from "$lib/types/types"
import {
    currentSystemJSON,
    notification,
    systems
} from '$lib/stores/stores';
import { get, type Writable } from 'svelte/store';
import type { Node, Edge } from '@xyflow/svelte';
import { isComponentType } from "$lib/types/typeguards";
import { isNameValid } from "$lib/utils";
import { findComponentOutputs } from "../component-editor/componentHelpers";

// Update the currentSystemJSON with the given component being connected
// to the last component in the structure
export const addConnectionTolastComponent = (component: ComponentType) => {
    let currentJSON = get(currentSystemJSON).json;

    // If there are no components, don't add connection
    if (currentJSON.components.length === 1) return;

    let componentObj: Record<string, string> = {}
    currentJSON.structure.forEach((connection: string[]) => {
        componentObj[connection[0].split(".")[0]] = connection[1].split(".")[0]
    })
    let endComponent = currentJSON.components.map(c => c.name).find(cName => !Object.keys(componentObj).includes(cName))
    if (endComponent) {
        const endElement = currentJSON.components.find(comp => comp.name === endComponent)?.elements.at(-1)?.name
        currentJSON.structure.push([`${endComponent}.${endElement}`, `${component.name}.${component.elements[0].name}`])
        currentSystemJSON.update(value => ({ ...value, json: currentJSON }))
    } else {
        notification.set(
            {
                message: "Components are connected in a loop.",
                type: "error",
                duration: 8000
            });
    }
}

// Update nodes and edges of the System Editor based on currentSystemJSON 
export const updateSystemEditor = (nodes: Writable<Node[]>, edges: Writable<Edge[]>) => {
    // Go through nodes
    let currentJSON = get(currentSystemJSON);
    let currentEdges = get(edges);

    // Add new nodes for newly added components and remove nodes for removed components
    let newNodes: Node[] = [];
    currentJSON.json.components.forEach((comp: ComponentType) => {
        // Check if node with this name already exists
        const existingNode = get(nodes).find(node => node.id === comp.name)
        if (!existingNode) {
            // Add new node
            let newNode = {
                id: comp.name,
                type: 'component',
                draggable: false,
                data: comp,
                position: { x: 0, y: 0 },
                origin: [0.5, 0.5]
            } as Node
            newNodes.push(newNode);
        } else {
            newNodes.push(existingNode);
        }
    });


    // Add new edges for newly added connections
    currentJSON.json.structure.forEach((connection: string[]) => {
        let source = connection[0];
        let target = connection[1];
        let isEdgeAdded = currentEdges.find(edge => edge.id === `${source}..${target}`);

        if (!isEdgeAdded) {
            let newEdge = {
                id: `${source}..${target}`,
                source: source.split(".")[0],
                target: target.split(".")[0],
                sourceHandle: source,
                targetHandle: target,
                class: ''
            } as Edge;
            edges.update(edges => [...edges, newEdge]);
        }
    })

    // Remove edges that had their corresponding connection removed
    let connectionIds = currentJSON.json.structure.map(
        connection => `${connection[0]}..${connection[1]}`
    );
    edges.update(edges => edges.filter(edge => connectionIds.includes(edge.id)));


    // Update position of nodes
    const gridSize = 270;
    const components = get(currentSystemJSON).json.components.map(comp => comp.name);
    const structure = get(currentSystemJSON).json.structure;
    const componentsWithInputs = get(edges).map(edge => edge.target);
    const componentsWithOutputs = get(edges).map(edge => edge.source);
    
    const startingNodes = components.filter(comp => (
        !componentsWithInputs.includes(comp)
    ));
    const endingNodes = components.filter(comp => (
        !componentsWithOutputs.includes(comp)
    ));
    
    // Calculate the height of the subtrees for each component
    const subtreeHeight = new Map<string, number>();
    endingNodes.forEach((compName: string) => {
        subtreeHeight.set(compName, 1);
        let inputNode = structure.find(row => row[1].split(".")[0] === compName)?.[0].split(".")[0];
        while (inputNode) {
            subtreeHeight.set(inputNode, (subtreeHeight.get(inputNode) || 0) + 1);
            inputNode = structure.find(row => row[1].split(".")[0] === inputNode)?.[0].split(".")[0];
        }
    })

    let systemWidth = 0;

    // Recursive function to place nodes in the correct position
    const placeNode = (node: Node, currentX: number, currentY: number, parentId: string) => {
        const compName = node.id;
        const height = (subtreeHeight.get(compName) || 0) * gridSize;
        node.position.x = currentX;
        node.position.y = currentY + height / 2;
        node.parentId = parentId;
        node.expandParent = true;

        const connectedComponents = get(edges)
            .filter(edge => edge.source === compName)
            .map(edge => newNodes.find(node => node.id === edge.target)) as Node[];
        let newY = currentY;
        connectedComponents.forEach((node: Node) => {
            if (currentX + gridSize > systemWidth) {
                systemWidth = currentX + gridSize;
            }
            newY = placeNode(node, currentX + gridSize, newY, parentId);
        })

        currentY += height;
        return currentY;
    }

    startingNodes.forEach((compName: string) => {
        const node = newNodes.find(node => node.id === compName);
        if (node) {

            let partNode = get(nodes).find(node => node.id === `group.${compName}`);
            if (!partNode) {
                partNode = {
                    id: `group.${compName}`,
                    type: 'group',
                    data: {},
                    draggable: false,
                    position: { x: systemWidth, y: 0 },
                    origin: [0.5, 0.5],
                    style: 'display: none;'
                }
            }
            newNodes.unshift(partNode);

            placeNode(node, 0, 0, `group.${compName}`);
            systemWidth += gridSize*1.5;
        }
    });
    nodes.set(newNodes);

}

const hasDuplicates = (array: any[]) => {
    const uniqueElements = new Set(array);
    return uniqueElements.size !== array.length;
}

const isSystemNameUnique = (name: string, excludeId: string | null = null) => {
    let systemNames = Array.from(get(systems).entries())
            .filter(([id, system]) => id !== excludeId)
            .map(([id, val]) => (
            val.name
                .replace(' ', '')
                .toUpperCase()
            ));
    
    return !systemNames.includes(name.replace(' ', '').toUpperCase());
}

export const handleSystemNameChange = (name: string, excludeId: string | null = null) => {
    if (name === undefined) {
        notification.set(
        {
            message: "Name field is missing from JSON.",
            type: "error",
            duration: 3600000
        });
        return false;
    } else if (typeof name !== 'string') {
        notification.set(
        {
            message: "Name field in JSON has to be a string.",
            type: "error",
            duration: 3600000
        });
        return false;
    } else if (!isNameValid(name)) {
        notification.set(
        {
            message: "Name field in JSON is invalid.",
            type: "error",
            duration: 3600000
        });
        return false;
    } else if (!isSystemNameUnique(name, excludeId)) {
        notification.set(
            {
                message: "System name has to be unique.",
                type: "error",
                duration: 3600000
        });
        return false;       
    } else {
        currentSystemJSON.update(json => {
            let newJson = {...json};
            newJson.json.name = name;
            return newJson;
        });

        return true
    }
}

// checks if system can be converted into openTorsion assembly
export const checkIfOTCompatible = () => {
    const currentJSON = get(currentSystemJSON).json;

    const connectionStarts = currentJSON.structure.map(connection => connection[0].split('.')[0]),
    connectionEnds = currentJSON.structure.map(connection => connection[1].split('.')[0]),
    startingComponents = currentJSON.components
        .filter(component => ( connectionStarts.includes(component.name) &&
        !connectionEnds.includes(component.name))),
    endComponents = currentJSON.components
        .filter(component => ( !connectionStarts.includes(component.name) &&
        connectionEnds.includes(component.name)));
    
    if (startingComponents.length > 1) {
        notification.set(
            {
                message: "System can't consist of multiple connected pieces.",
                type: "info",
                duration: 3600000
        });
        return false;
    }

    for (let component of startingComponents) {
        if (component.elements[0].type === 'ShaftDiscrete') {
            notification.set(
                {
                    message: "System can't start with a shaft.",
                    type: "info",
                    duration: 3600000
            });
            return false;
        }
    }

    for (let component of endComponents) {
        if (component.elements.at(-1)?.type === 'ShaftDiscrete') {
            notification.set(
                {
                    message: "System can't end with a shaft.",
                    type: "info",
                    duration: 3600000
            });
            return false;
        }
    }

    for (let connection of currentJSON.structure) {
        const [sourceCompName, sourceElemName] = connection[0].split('.'),
        sourceComponent = currentJSON.components.find(comp => comp.name === sourceCompName),
        [targetCompName, targetElemName] = connection[1].split('.'),
        targetComponent = currentJSON.components.find(comp => comp.name === targetCompName),
        sourceElemType = sourceComponent?.elements.find(elem => elem.name === sourceElemName)?.type,
        targetElemType = targetComponent?.elements.find(elem => elem.name === targetElemName)?.type;

        // shafts can't be connected to shafts
        if (sourceElemType === 'ShaftDiscrete' && targetElemType === 'ShaftDiscrete') {
            notification.set(
                {
                    message: "System can't contain two shaft elements connected.",
                    type: "info",
                    duration: 3600000
            });
            return false;
        }

        // disks can't be connected to gears
        if (sourceElemType === 'Disk' && targetElemType === 'GearElement') {
            notification.set(
                {
                    message: "System can't contain a disk connected to a gear element.",
                    type: "info",
                    duration: 3600000
            });
            return false;
        }

        // gears can only be connected to shafts
        if (sourceElemType === 'GearElement' && targetElemType !== 'ShaftDiscrete') {
            notification.set(
                {
                    message: "System can't contain a gear element connected to a non-shaft element.",
                    type: "info",
                    duration: 3600000
            });
            return false;
        }

    }

    return true;
}

// handle JSON editing
// do not let invalid JSON to be set, notify user about errors
export const handleJSONEditing = (text: string, excludeId: string | null = null) => {
    try {
        const json = JSON.parse(text);
        const newJson = {...get(currentSystemJSON).json}
        
        // Check name and set if it is valid
        if (!handleSystemNameChange(json.name, excludeId)) {
            return false
        }

        // Check date and set it if valid
        if (!json.date) {
            notification.set(
            {
                message: "Date field is missing from JSON.",
                type: "error",
                duration: 3600000
            });
            return false;
        } else if (typeof json.date !== 'string') {
            notification.set(
            {
                message: "Date field in JSON has to be a string in ISO 8601 format.",
                type: "error",
                duration: 3600000
            });
            return false;
        } else {
            newJson.date = json.date;
        }

        // Check components and set if valid
        if (!json.components) {
            notification.set(
            {
                message: "Components field is missing from JSON.",
                type: "error",
                duration: 3600000
            });
            return false;
        } else if (json.components.some((comp: any) => !isComponentType(comp))) {
            notification.set(
            {
                message: "Some component(s) in JSON are invalid.",
                type: "error",
                duration: 3600000
            });
            return false;
        } else if (hasDuplicates(json.components.map((comp: any) => comp.name))) {
            notification.set(
            {
                message: "Component names in JSON are not unique.",
                type: "error",
                duration: 3600000
            });
            return false;
        } else {
            newJson.components = json.components;
        }

        // Check structure and set if valid
        if (!json.structure) {
            notification.set(
            {
                message: "Structure field is missing from JSON.",
                type: "error",
                duration: 3600000
            });
            return false;
        } else if (!Array.isArray(json.structure) || json.structure.some((row: any) => !Array.isArray(row))) {
            notification.set(
            {
                message: "Structure field in JSON has to be an array of name pairs.",
                type: "error",
                duration: 3600000
            });
            return false;
        } else if (!checkConnections(json.structure)) {
            notification.set(
            {
                message: "Structure defined in JSON is invalid.",
                type: "error",
                duration: 3600000
            });
            return false;
        } else {
            newJson.structure = json.structure;
        }

        currentSystemJSON.update(value => ({ ...value, json: newJson }));
        return true;
    } catch (e) {
        notification.set(
            {
                message: "System JSON is not valid.",
                type: "info",
                duration: 3600000
            }
        );
        return false;
    }
}

// csheck if the connections in the structure are valid
// i.e. if they form a valid path (no loops or multiple connections)
export const checkConnections = (structure: string[][]) => {
    // a multiple connection az hogy nez ki?

    // check if only valid inputs and outputs are present in structure
    for (let connection of structure) {
        const startingComponent = get(currentSystemJSON).json.components.find(component => (
            component.name === connection[0].split('.')[0]
        ));
        
        // if starting component of connection doesn't exist
        if (!startingComponent) return false;

        // if output element is not valid
        if (!findComponentOutputs(startingComponent.elements).includes(connection[0].split('.')[1])) {
            return false;
        }

        const endingComponent = get(currentSystemJSON).json.components.find(component => (
            component.name === connection[1].split('.')[0]
        ));

        // if ending component of connection doesn't exist
        if (!endingComponent) return false;

        // if input element is not the first element of its component
        if (connection[1].split('.')[1] !== endingComponent.elements[0].name) {
            return false;
        }
    }

    // check if there are loops
    if (!isStructureTree(structure)) {
        return false;
    }

    return true;
}

export const nameComponentInstance = (componentType: string, components: ComponentType[]): string => {
    const compToNum = (comp: ComponentType) => {
        const nameList = comp.name.split(" ");
        const nameWithoutLastWord = nameList.slice(0, -1).join(' ');
        if (nameWithoutLastWord === componentType) {
            return parseInt(nameList.at(-1) || '0');
        } else {
            return null;
        }
    }
    const largestNum = components.map(compToNum).filter(el => el !== null).sort((a, b) => a - b).at(-1);

    return `${componentType} ${largestNum ? largestNum + 1 : 1}`;
}

// function to automatically give a unique name to a new system
export const nameSystem = (systems: SystemType[]) => {
    const systemNames = systems.map(system => system.name);
    let newSystemName = 'New System';
    let i = 2;
    while (systemNames.includes(newSystemName)) {
        newSystemName = `New System (${i})`
        i++;
    }

    return newSystemName;
}

// checks if the given structure is a tree (contains no loops)
export const isStructureTree = (structure: string[][]): boolean => {
    let connectedParts: Set<string>[] = [];
    for (let connection of structure) {
        const source = connection[0].split(".")[0];
        const target = connection[1].split(".")[0];

        let sourcePart = connectedParts.find(part => part.has(source));
        let targetPart = connectedParts.find(part => part.has(target));
        if (sourcePart && targetPart) {
            if (sourcePart !== targetPart) {
                connectedParts = connectedParts.filter(part => part !== sourcePart && part !== targetPart);
                connectedParts.push(new Set([...sourcePart, ...targetPart]));
            } else {
                return false;
            }
        } else if (sourcePart) {
            sourcePart.add(target);
        } else if (targetPart) {
            targetPart.add(source);
        } else {
            connectedParts.push(new Set([source, target]));
        }
    } 

    return true;
}