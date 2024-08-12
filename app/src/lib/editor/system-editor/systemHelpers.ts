import type { ComponentType } from "$lib/types/types"
import { currentSystemJSON, notification } from '$lib/stores';
import { get, type Writable } from 'svelte/store';
import type { Node, Edge } from '@xyflow/svelte';
import { isComponentType } from "$lib/types/typeguards";
import { isNameValid } from "$lib/utils";

// Update nodes and edges of the System Editor based on currentSystemJSON 
export const updateSystemEditor = (nodes: Writable<Node[]>, edges: Writable<Edge[]>) => {
    // Go through nodes
    let currentJSON = get(currentSystemJSON)
    let currentEdges = get(edges)

    // Add new nodes for newly added components
    currentJSON.components.forEach((comp: ComponentType) => {
        // Check if node with this name already exists
        const existingNode = get(nodes).find(node => node.id === comp.name)
        if (!existingNode) {
            // Add new node
            let newNode = {
                id: comp.name,
                type: 'component',
                data: {
                    img: "default-custom.png",
                    label: comp.name
                },
                position: { x: 0, y: 0 },
                origin: [0.5, 0.0]
            } as Node
            nodes.update(nodes => [...nodes, newNode])
        }
    })

    // Remove nodes that had their corresponding component removed
    let componentNames = currentJSON.components.map(comp => comp.name)
    nodes.update(nodes => nodes.filter(node => componentNames.includes(node.id)))

    // Add new edges for newly added connections
    currentJSON.structure.forEach((connection: string[]) => {
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
    let connectionIds = currentJSON.structure.map(
        connection => `${connection[0].split('.')[0]}-${connection[1].split('.')[0]}`
    )
    edges.update(edges => edges.filter(edge => connectionIds.includes(edge.id)))
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
        const newJson = {...get(currentSystemJSON)}
        
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
        } else {
            newJson.structure = json.structure;
        }


        currentSystemJSON.set(newJson);
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

export const nameComponentInstance = (componentType: string, components: ComponentType[]): string => {
    // Get the maximum number
    const regex = new RegExp(`^${componentType} \\d+$`);
    const compToNum = (comp: ComponentType) => { return (
        parseInt(comp.name.split(" ")[comp.name.split(" ").length - 1])
    )}
    const largestNum = components.filter(comp => regex.test(comp.name)).map(compToNum).sort().at(-1)

    return `${componentType} ${largestNum ? largestNum + 1 : 1}`;
}