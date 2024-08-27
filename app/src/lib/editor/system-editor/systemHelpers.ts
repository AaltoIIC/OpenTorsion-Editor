import type { ComponentType, SystemType } from "$lib/types/types"
import {
    currentSystemJSON,
    notification,
    getSystem
} from '$lib/stores/stores';
import { get, type Writable } from 'svelte/store';
import type { Node, Edge } from '@xyflow/svelte';
import { isComponentType } from "$lib/types/typeguards";
import { isNameValid } from "$lib/utils";


// Find possible output elements of a component
export const findComponentOutputs = (component: ComponentType): string[] => {
    const outputs: string[] = [];
    for (let i = 0; i < component.elements.length; i++) {
        const nextEl = component.elements[i+1];
        if (i === component.elements.length - 1) {
            outputs.push(component.elements[i].name);
        } else if (nextEl.type === "GearElement" &&
            nextEl.parent &&
            component.elements.slice(0, i+1).map(el => el.name).includes(nextEl.parent)) {
        
            outputs.push(component.elements[i].name);
        
        }
    }

    return outputs;
}

// Update the currentSystemJSON with the given component being connected
// to the last component in the structure
export const addConnectionTolastComponent = (component: ComponentType) => {
    let currentJSON = get(currentSystemJSON).json

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
    let currentJSON = get(currentSystemJSON)
    let currentEdges = get(edges)

    // Add new nodes for newly added components
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
                origin: [0.5, 0.0]
            } as Node
            nodes.update(nodes => [...nodes, newNode])
        }
    })

    // Remove nodes that had their corresponding component removed
    let componentNames = currentJSON.json.components.map(comp => comp.name)
    nodes.update(nodes => nodes.filter(node => componentNames.includes(node.id)))

    // Add new edges for newly added connections
    currentJSON.json.structure.forEach((connection: string[]) => {
        let sourceComponent = connection[0].split('.')[0]
        let targetComponent = connection[1].split('.')[0]
        let isEdgeAdded = currentEdges.find(edge => edge.id === `${sourceComponent}-${targetComponent}`)

        if (!isEdgeAdded) {
            let newEdge = {
                id: `${sourceComponent}-${targetComponent}`,
                source: sourceComponent,
                target: targetComponent,
                class: ''
            } as Edge
            edges.update(edges => [...edges, newEdge])
        }
    })

    // Remove edges that had their corresponding connection removed
    let connectionIds = currentJSON.json.structure.map(
        connection => `${connection[0].split('.')[0]}-${connection[1].split('.')[0]}`
    )
    edges.update(edges => edges.filter(edge => connectionIds.includes(edge.id)))


    // Update position of nodes
    let newNodes = get(nodes)

    const connections = new Map<Node, Node>();
    get(edges).forEach(edge => {
        let sourceNode = newNodes.find(node => node.id === edge.source)
        let targetNode = newNodes.find(node => node.id === edge.target)
        if (sourceNode && targetNode) connections.set(sourceNode, targetNode)
    })
    
    const values = Array.from(connections.values());
    let startingComponents: Node[] = newNodes.filter(node => !values.includes(node))
    
    let currentY = 0
    startingComponents.forEach(comp => {
        let currentX = 0;
        let currentComp: Node | undefined = comp;

        while (currentComp) {
            const nextComp = connections.get(currentComp)
            currentComp.position = { x: currentX, y: currentY }
            currentComp = nextComp;

            currentX += 280;
        }

        currentY += 280;
    })

    nodes.set(newNodes)
}

const hasDuplicates = (array: any[]) => {
    const uniqueElements = new Set(array);
    return uniqueElements.size !== array.length;
}

// Handle JSON editing
// Do not let invalid JSON to be set, notify user about errors
export const handleJSONEditing = (text: string) => {
    try {
        const json = JSON.parse(text);
        const newJson = {...get(currentSystemJSON).json}
        
        // Check name and set if it is valid
        if (json.name === undefined) {
            notification.set(
            {
                message: "Name field is missing from JSON.",
                type: "error",
                duration: 3600000
            });
            return
        } else if (typeof json.name !== 'string') {
            notification.set(
            {
                message: "Name field in JSON has to be a string.",
                type: "error",
                duration: 3600000
            });
            return
        } else if (!isNameValid(json.name)) {
            notification.set(
            {
                message: "Name field in JSON is invalid.",
                type: "error",
                duration: 3600000
            });
            return 
        } else {
            newJson.name = json.name;
        }

        // Check date and set it if valid
        if (!json.date) {
            notification.set(
            {
                message: "Date field is missing from JSON.",
                type: "error",
                duration: 3600000
            });
            return
        } else if (typeof json.date !== 'string') {
            notification.set(
            {
                message: "Date field in JSON has to be a string in ISO 8601 format.",
                type: "error",
                duration: 3600000
            });
            return
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
            return
        } else if (json.components.some((comp: any) => !isComponentType(comp))) {
            notification.set(
            {
                message: "Some component(s) in JSON are invalid.",
                type: "error",
                duration: 3600000
            });
            return
        } else if (hasDuplicates(json.components.map((comp: any) => comp.name))) {
            notification.set(
            {
                message: "Component names in JSON are not unique.",
                type: "error",
                duration: 3600000
            });
            return
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
            return 
        } else if (!Array.isArray(json.structure) || json.structure.some((row: any) => !Array.isArray(row))) {
            notification.set(
            {
                message: "Structure field in JSON has to be an array of name pairs.",
                type: "error",
                duration: 3600000
            });
            return
        } else if (!checkConnections(json.structure)) {
            notification.set(
            {
                message: "Structure defined in JSON is invalid.",
                type: "error",
                duration: 3600000
            });
            return
        } else {
            newJson.structure = json.structure;
        }


        currentSystemJSON.update(value => ({ ...value, json: newJson }));
        notification.set(null);
    } catch (e) {
        notification.set(
            {
                message: "System JSON is not valid.",
                type: "info",
                duration: 3600000
            }
        );
    }
}

// Check if the connections in the structure are valid
// i.e. if they form a valid path (no loops or multiple connections)
export const checkConnections = (structure: string[][]) => {

    let connections: Record<string, string> = {}
    structure.forEach((connection: string[]) => {
        connections[connection[0].split(".")[0]] = connection[1].split(".")[0]
    })

    let startingComponents = Object.keys(connections).filter(key => !Object.values(connections).includes(key))
    startingComponents.forEach((key: string) => {
        let currentKey = key
        while (connections[currentKey]) {
            const nextKey = connections[currentKey]
            delete connections[currentKey]
            currentKey = nextKey
        }
    })
    const isLoop = Object.keys(connections).length > 0

    
    // Check if there are any multiple connections
    const sources = structure.map(connection => connection[0].split(".")[0])
    const targets = structure.map(connection => connection[1].split(".")[0])
    let areMultiples = (new Set(sources)).size !== sources.length || (new Set(targets)).size !== targets.length

    // Check if all components exist in the components array
    const components = get(currentSystemJSON).json.components.map(comp => comp.name)
    const allComponentsExist = sources.every(comp => components.includes(comp)) && targets.every(comp => components.includes(comp))

    return !isLoop && !areMultiples && allComponentsExist
}

export const nameComponentInstance = (componentType: string, components: ComponentType[]): string => {
    // Get the maximum number
    const compToNum = (comp: ComponentType) => {
        const nameList = comp.name.split(" ")
        const nameWithoutLastWord = nameList.slice(0, -1).join(' ')
        if (nameWithoutLastWord === componentType) {
            return parseInt(nameList.at(-1) || '0')
        } else {
            return null
        }
    }
    const largestNum = components.map(compToNum).filter(el => el !== null).sort().at(-1)

    return `${componentType} ${largestNum ? largestNum + 1 : 1}`;
}

// function to automatically give a unique name to a new system
export const nameSystem = (systems: SystemType[]) => {
    let systemNames = systems.map(sys => sys.name as string);
    let largestNum = 0;

    // check if there is a component with the name "New System"
    if (systemNames.includes('New System')) {
        largestNum = 1;
    }

    // check if there are components with the name "New System (n)"
    const regex = new RegExp(/^New System \(\d+\)$/);
    if (systemNames.filter(name => regex.test(name)).length > 0) {
        largestNum = (systemNames.filter(name => regex.test(name))
                    .map(name => parseInt(name.split(" (")[1].replace(')',''))).sort().at(-1) as number)
    }
    
    return `New System${largestNum > 0 ? ` (${largestNum + 1})` : ''}`;
}