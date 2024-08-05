import type { ElementType, ComponentType } from '$lib/types/types';
import _ from 'lodash';

// edit an element in the list of elements
// removeUndefined: if true, undefined values in newValues are removed even if they were previously defined
export const editElement = (elements: ElementType[] | undefined,
    elementName: string,
    newValues: Partial<ElementType>,
    removeUndefined=false ): ElementType[] => {

    if (!elements) {elements = []};

    let newElements = [...elements];
    newElements.forEach((el, index) => {
        if (el.name === elementName) {
            let newEl: ElementType = {...el, ...newValues};
            
            if (removeUndefined) {
                const undefinedKeys = Object.keys(newValues).filter(key => newValues[key] === undefined);
                newEl = _.omit(newEl, undefinedKeys) as ElementType;
            }

            newElements[index] = newEl;
        }
    });

    return newElements;
}

// remove a parameter of an element in the list of elements
export const removeParam = (elements: ElementType[], elementName: string, paramName: string): ElementType[] => {
    let newElements = [...elements];

    newElements.forEach((el, index) => {
        if (el.name === elementName) {
            const newParams = _.omit(el, paramName);
            newElements[index] = newParams as ElementType;
        }
    });

    return newElements;
}

// function to automatically give a unique name to a new component
export const nameComponent = (components: ComponentType[]) => {
    let largestNum = 0;

    // check if there is a component with the name "New Component"
    if (components.map(component => component.name).includes('New Component')) {
        largestNum = 1;
    }

    // check if there are components with the name "New Component (n)"
    const regex = new RegExp(/^New Component \(\d+\)$/);
    if (components.filter(component => regex.test(component.name)).length > 0) {
        largestNum = (components.filter(component => regex.test(component.name))
                    .map(component => parseInt(component.name.split(" (")[1].replace(')',''))).sort().at(-1) as number)
    }
    
    return `New Component${largestNum > 0 ? ` (${largestNum + 1})` : ''}`;
}

// function to automatically give a unique name to a new element
const nameElement = (type: string, elements: ElementType[]) => {
    const typeToName: { [key: string]: string } = {
        "Disk": "Disk",
        "ShaftDiscrete": "Shaft",
        "Gear": "Gear"
    }
    // Get the maximum number
    const regex = new RegExp(`^${typeToName[type]} \\d+$`);
    const largestNum = elements.filter(el => el.type === type && regex.test(el.name))
                                .map(el => parseInt(el.name.split(" ")[1])).sort().at(-1)
    return `${typeToName[type]} ${largestNum ? largestNum + 1 : 1}`;
}

// object with possible parameters for each element type
export const possibleParams: { [key: string]: string[] } = {
    disk: ["name", "type", "damping", "excitation", "inertia"],
    shaft: ["name", "type", "damping", "excitation", "stiffness"],
    gear: ["name", "type", "damping", "excitation", "inertia", "diameter", "teeth"]
}

// function to construct a default element based on the type
export const defaultElement = (elements: ElementType[], type: string): ElementType => {
    if (type === "disk") {
        return {
            name: nameElement('Disk', elements),
            type: "Disk",
            damping: 0,
            inertia: 8.35e+06
        }
    } else if (type === "shaft") {
        return {
            name: nameElement('ShaftDiscrete', elements),
            type: "ShaftDiscrete",
            damping: 0,
            stiffness: 4.49e+09
        }
    } else if (type === "gear") {
        return {
            name: nameElement('Gear', elements),
            type: "Gear",
            damping: 0
        }
    } else {
        throw new Error("Invalid element type");
    }
}

// function to render nodes based on JSON list of elements
// returns a list of nodes 
export const renderNodes = (elements: any) => {
    let nodes: any[] = [];
    
    // if elements is empty, add "Component is empty" node 
    if (elements.length === 0) {
            nodes = [{
            id: `${elements.length + 1}`,
            type: 'empty',
            dragHandle: '.none',
            data: {label: ''},
            position: { x: 0, y: 150 }
            }];
    }

    let currentPosition = 0;
    // loop through elements and create nodes
    elements.forEach((el: ElementType, index: number) => {    
        if (el.type === "Disk") {
            
            nodes.push({
                id: `${index + 1}`,
                type: 'disk',
                dragHandle: '.none',
                data: _.pick(el, possibleParams['disk']),
                position: { x: currentPosition, y: 150 }
            });
            currentPosition += 21;

        } else if (el.type === "ShaftDiscrete") {

            nodes.push({
                id: `${index + 1}`,
                type: 'shaft',
                dragHandle: '.none',
                data: _.pick(el, possibleParams['shaft']),
                position: { x: currentPosition, y: 150 }
            });
            currentPosition += 72;

        } else if (el.type === "Gear") {

            nodes.push({
                id: `${index + 1}`,
                type: 'gear',
                dragHandle: '.none',
                data: _.pick(el, possibleParams['gear']),
                position: { x: currentPosition, y: 150 }
            });
            currentPosition += 21;
        }
    });

    return nodes;
}