import type { ElementType } from '$lib/types/types';
import _ from 'lodash';

// edit an element in the list of elements
export const editElement = (elements: ElementType[], elementName: string, newValues: Partial<ElementType> ): ElementType[] => {
    console.log("editElement called");
    console.log(newValues);
    
    let newElements = [...elements];
    newElements.forEach((el, index) => {
        if (el.name === elementName) {
            newElements[index] = {...el, ...newValues};
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

// function to automatically give a unique name to a new element
const nameElement = (type: string, elements: ElementType[]) => {
    const typeToName: { [key: string]: string } = {
        "Disk": "Disk",
        "ShaftDiscrete": "Shaft",
        "Gear": "Gear"
    }
    // Get the maximum number
    const regex = new RegExp(`^${typeToName[type]} \\d+$`);
    const largestNum = elements.filter(el => el.type === type && regex.test(el.name)).map(el => parseInt(el.name.split(" ")[1])).sort().at(-1)
    return (largestNum ? largestNum + 1 : 1);
}

// function to add nodes to the list of elements
// returns the new list of elements
export const addElement = (elements: ElementType[], elementName: string): ElementType[] => {
    if (elementName === "disk") {
        const newElement = {
            name: `Disk ${nameElement('Disk', elements)}`,
            type: "Disk",
            damping: 0,
            inertia: 8.35e+06
        }
        return [...elements, newElement];
    } else if (elementName === "shaft") {
        const newElement = {
            name: `Shaft ${nameElement('ShaftDiscrete', elements)}`,
            type: "ShaftDiscrete",
            damping: 0,
            stiffness: 4.49e+09
        }
        return [...elements, newElement];
    } else if (elementName === "gear") {
        const newElement = {
            name: `Gear ${nameElement('Gear', elements)}`,
            type: "Gear",
            damping: 0
        }
        return [...elements, newElement];
    } else {
        return elements;
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
            // pass only valid parameters to the node
            const possibleParams = ['name', 'type', 'damping', 'excitation', 'inertia']
            
            nodes.push({
                id: `${index + 1}`,
                type: 'disk',
                dragHandle: '.none',
                data: _.pick(el, possibleParams),
                position: { x: currentPosition, y: 150 }
            });
            currentPosition += 21;

        } else if (el.type === "ShaftDiscrete") {
            const possibleParams = ['name', 'type', 'damping', 'excitation', 'stiffness']

            nodes.push({
                id: `${index + 1}`,
                type: 'shaft',
                dragHandle: '.none',
                data: _.pick(el, possibleParams),
                position: { x: currentPosition, y: 150 }
            });
            currentPosition += 72;

        } else if (el.type === "Gear") {
            const possibleParams = ['name', 'type', 'damping', 'excitation', 'inertia', 'diameter', 'teeth']

            nodes.push({
                id: `${index + 1}`,
                type: 'gear',
                dragHandle: '.none',
                data: _.pick(el, possibleParams),
                position: { x: currentPosition, y: 150 }
            });
            currentPosition += 21;
        }
    });

    return nodes;
}