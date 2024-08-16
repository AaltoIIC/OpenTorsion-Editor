import type { ElementType, ComponentType } from '$lib/types/types';
import { currentComponentJSON, notification, customComponents } from '$lib/stores';
import { isNameValid, isNameUnique } from '$lib/utils';
import { get } from 'svelte/store';
import { isElementType } from '$lib/types/typeguards';
import _ from 'lodash';

export const handleNameChange = (name: string) => {
    if (name === undefined) {
        notification.set(
        {
            message: "Name field is missing.",
            type: "error",
            duration: 3600000
        });
        return false
    } else if (typeof name !== 'string') {
        notification.set(
        {
            message: "Name field has to be a string.",
            type: "error",
            duration: 3600000
        });
        return false
    } else if (!isNameValid(name)) {
        notification.set(
        {
            message: "Name field is invalid.",
            type: "error",
            duration: 3600000
        });
        return false
    } else if (!isNameUnique(name, get(customComponents))) {
        notification.set(
        {
            message: "Component name has to be unique.",
            type: "error",
            duration: 3600000
        });
        return false
    } else {
        currentComponentJSON.update(json => ({...json, name: name}));
        notification.set(null);
        return true
    }
}

export const handleJSONEditing = (text: string) => {
    try {
        const json = JSON.parse(text);
        
        // Check name and set if it is valid
        if (!handleNameChange(json.name)) {
            return false
        }

        const newJson = {...get(currentComponentJSON)}

        // Check elements and set if valid
        if (!json.elements) {
            notification.set(
            {
                message: "Elements field is missing from JSON.",
                type: "error",
                duration: 3600000
            });
            return false
        } else if (!Array.isArray(json.elements)) {
            notification.set(
            {
                message: "Elements field in JSON has to be an array.",
                type: "error",
                duration: 3600000
            });
            return false
        } else if (!json.elements.every(isElementType)) {
            notification.set({
                message: "Some elements are invalid. Please check the element properties.",
                type: "info",
                duration: 3600000
            });
            return false

        } else if (!elementOrderValid(json.elements)) {
            notification.set(
            {
                message: "Element order is invalid. Please check the element order.",
                type: "info",
                duration: 3600000
            });
            return false
        } else if (json.elements.length === 0) {
            notification.set(
            {
                message: "Component must have at least one element.",
                type: "info",
                duration: 3600000
            });
            return false

        } else {
            newJson.elements = json.elements;
        }

        currentComponentJSON.set(newJson);
        notification.set(null);
        return true
    } catch (e) {
        notification.set(
            {
                message: "Component JSON is not valid.",
                type: "info",
                duration: 3600000
            }
        );
        return false
    } 
}

// function to check if the order of elements in a component is valid
// (doesn't catch all invalid orders)
const elementOrderValid = (elements: ElementType[]) => {
    let valid = true;
    let prevElemType = "";
    elements.forEach((el, i) => {
        if (el.type === "Disk") {
            if (prevElemType !== "ShaftDiscrete" && prevElemType !== "") {
                valid = false;
            }
        } else if (el.type === "ShaftDiscrete") {
            if (prevElemType !== "Disk" && prevElemType !== "GearElement") {
                valid = false;
            }
        }

        prevElemType = el.type;
    });

    return valid;
}

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
            let newEl: ElementType = {...el, ...newValues} as ElementType;
            
            if (removeUndefined) {
                const undefinedKeys = Object.keys(newValues).filter(key => (newValues as any)[key] === undefined);
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
export const nameComponentDesign = (components: ComponentType[]) => {
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
        "GearElement": "Gear"
    }
    // Get the maximum number
    const regex = new RegExp(`^${typeToName[type]} \\d+$`);
    const largestNum = elements.filter(el => el.type === type && regex.test(el.name))
                                .map(el => parseInt(el.name.split(" ")[1])).sort().at(-1)
    return `${typeToName[type]} ${largestNum ? largestNum + 1 : 1}`;
}

// object with possible parameters for each element type
export const possibleParams = {
    disk: {
        required: ["name", "type", "damping", "inertia"],
        optional: ["excitation"]
    },
    shaft: {
        required: ["name", "type", "damping", "stiffness"],
        optional: ["excitation"]
    },
    gear: {
        required: ["name", "type", "damping", "inertia", "diameter"],
        optional: ["parent", "excitation", "teeth"]
    }
}

// function to construct a default element based on the type
export const defaultElement = (elements: ElementType[], type: string): ElementType => {
    if (type === "disk") {
        return {
            name: nameElement('Disk', elements),
            type: "Disk",
            damping: 0,
            inertia: 5.72e+03
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
            name: nameElement('GearElement', elements),
            type: "GearElement",
            damping: 0,
            inertia: 5.72e+03,
            diameter: 0.23
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

    let currentX = 0;
    let currentY = 150;
    let branches: Record<string, {x: number; y: number;}> = {};
    // loop through elements and create nodes
    elements.forEach((el: ElementType, index: number) => {   
        if (el.type === "Disk") {
            
            nodes.push({
                id: `${index + 1}`,
                type: 'disk',
                dragHandle: '.none',
                data: {
                    nodeNo: index.toString(),
                    data: _.pick(el, [
                        ...possibleParams['disk'].required,
                        ...possibleParams['disk'].optional
                    ] )
                },
                position: { x: currentX, y: currentY }
            });
            currentX += 21;

        } else if (el.type === "ShaftDiscrete") {

            nodes.push({
                id: `${index + 1}`,
                type: 'shaft',
                dragHandle: '.none',
                data: {
                    nodeNo: index.toString(),
                    data: _.pick(el, [
                        ...possibleParams['shaft'].required,
                        ...possibleParams['shaft'].optional
                    ])
                },
                position: { x: currentX, y: currentY }
            });
            currentX += 72;

        } else if (el.type === "GearElement") {
            // add gear to branches
            branches[el.name] = {x: currentX, y: currentY};

            // check if the gear has a parent
            if (el.parent && elements.map((el: ElementType) => el.name).includes(el.parent) &&
                el.name !== el.parent) {
                // if gear's parent also has a parent, gear's parent is the parent's parent
                // TODO: this is a temporary solution, need to find a better way to handle this

                const parentPos = branches[el.parent];
                console.log(branches);
                console.log(el.parent);
                if (!parentPos) {
                    throw new Error("Gear parent position not found");
                }
                currentX = parentPos.x;
                currentY = parentPos.y + 100;

                branches[el.parent] = {x: parentPos.x, y: currentY};

                // add gearbox node
                nodes.unshift({
                    id: `gearbox-${index + 1}`,
                    type: 'gearbox',
                    draggable: false,
                    data: {
                        height: 2
                    },
                    position: { x: parentPos.x, y: parentPos.y }
                });
            }

            nodes.push({
                id: `${index + 1}`,
                type: 'gear',
                dragHandle: '.none',
                data: {
                    nodeNo: index.toString(),
                    data: _.pick(el, [
                        ...possibleParams['gear'].required,
                        ...possibleParams['gear'].optional
                    ] )
                },
                position: { x: currentX, y: currentY }
            });
            currentX += 21;
        }
    });

    return nodes;
}