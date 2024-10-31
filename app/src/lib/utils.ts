import {
    createSystem,
    customComponents,
    notification,
    createComponent,
    currentSystemJSON,
    currentComponentJSON,
    systems
} from "./stores/stores";
import { goto } from "$app/navigation";
import { get } from "svelte/store";
import type { ElementType, ComponentType, SystemType } from "./types/types";
import {
    isAlmostComponentType,
    isAlmostSystemType,
    isComponentType
} from "./types/typeguards";
import { nameElement } from "./editor/component-editor/componentHelpers";
import _ from 'lodash';

// function to find an element in the current system JSON based on
// its name found in connection strings
export const findElement = (elementId: string): ElementType | undefined => {
    const system = get(currentSystemJSON);
    const componentName = elementId.split('.')[0];
    const elementName = elementId.split('.')[1];
    const component = system.json.components.find((component) => component.name === componentName);
    return component?.elements.find((element) => element.name === elementName);
}

export const exportJSON = (json: any) => {
    const jsonString = JSON.stringify(json, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = json.name + '.json';
    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// function to import a JSON file into the system editor
// to be used as an event handler for an input element
export const importSystem = (event: Event, createNew: boolean = true) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const newJSON = JSON.parse(e.target?.result as string);
                if (isAlmostSystemType(newJSON)) {
                    // rename the system if it has the same name as an existing one
                    const systemNames = Array.from(get(systems).values())
                    .map(val => val.name)

                    if (systemNames.includes(newJSON.name)) {
                        let i = 2;
                        while (systemNames.includes(newJSON.name + ` (${i})`)) {
                            i++;
                        }
                        newJSON.name = newJSON.name + ` (${i})`;
                    }

                    if (createNew) {
                        let [id, sys] = createSystem(makeSystem(newJSON), true);
                        goto(`/system-editor/${id}`);
                    }  else {
                        currentSystemJSON.update(system => ({...system, json: makeSystem(newJSON)}));
                    }
            
                } else if (isAlmostComponentType(newJSON)) {
                    notification.set({
                        message: "Imported JSON file is a component. Please import a system JSON file.",
                        type: "error",
                        duration: 3000
                    });
                } else {
                    throw new Error();
                }
            } catch (error) {
                notification.set({
                    message: "Imported JSON file is invalid. Please check the file and try again.",
                    type: "error",
                    duration: 3000
                });
            }
        };
        reader.readAsText(file);
    }
}

// function to import a component from a json file to the list of components
// to be used as an event handler for an input element
export const importComponent = (event: Event, createNew: boolean = true) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const newJSON = JSON.parse(e.target?.result as string);
                if (isAlmostComponentType(newJSON)) {
                    // rename the component if it has the same name as an existing component
                    const componentNames = Array.from(get(customComponents).entries())
                                            .filter(([id, _]) => id.startsWith(`${get(currentSystemJSON).id}-`))
                                            .map(([key, val]) => val.name)
                    if (componentNames.includes(newJSON.name)) {
                        let i = 2;
                        while (componentNames.includes(newJSON.name + ` (${i})`)) {
                            i++;
                        }
                        newJSON.name = newJSON.name + ` (${i})`;
                    }

                    // add the component to the list of components or update the current component
                    if (createNew) {
                        createComponent(makeComponent(newJSON), true); 
                    } else {
                        currentComponentJSON.update(
                            component => ({...component, json: makeComponent(newJSON)})
                        );
                    }
                } else if (isAlmostSystemType(newJSON)) {
                    notification.set({
                        message: "Imported JSON file is a system. Please import a component JSON file.",
                        type: "error",
                        duration: 3000
                    });
                } else {
                    throw new Error();
                }
            } catch (error) {
                notification.set({
                    message: "Imported JSON file is invalid. Please check the file and try again.",
                    type: "error",
                    duration: 3000
                });
            }
        };
        reader.readAsText(file);
    }  
}

export const makeSystem = (partialSystem: any): SystemType => {
    let newSystem = { ...partialSystem };
    newSystem.components = newSystem.components.map((component: any) => {
        return makeComponent(component);
    });
    return newSystem as SystemType;
}

const makeComponent = (partialComponent: any): ComponentType => {
    let newComponent = { ...partialComponent };
    newComponent.elements = partialComponent.elements.map((element: any) => {
         return makeElement(element, newComponent.elements);
    });
    return newComponent as ComponentType;
}

// Takes an element without name or damping and
// returns a new element with a unique name and damping = 0
const makeElement = (partialElement: any, elements: ElementType[]): ElementType => {
    let newElement = { ...partialElement };
    if (!newElement.name) {
        newElement.name = nameElement(newElement.type, elements);
    }
    if (!newElement.damping) {
        newElement.damping = 0;
    }
    return newElement as ElementType;
}

// finds the line numbers where an object with a specific key-value pair is located in a JSON string
export const nthLinesInJSON = (jsonObj: any, topKey: string, searchKey: string, searchValue: string) => {
    const json: any = { ...jsonObj};
            
    const itemIndex = json[topKey]
                        .findIndex((item: any) => item[searchKey] === searchValue);

    const itemJsonLength = JSON.stringify(json[topKey][itemIndex], null, 2)
                                    .split('\n').length;
    json[topKey] = json[topKey].slice(0, itemIndex);
    const toAdd = json[topKey].length === 0 ? 1 : 0;
    deleteKeysAfter(json, topKey);
    const lineNo = JSON.stringify(json, null, 2).split('\n').length + toAdd - 1;
    return [lineNo, lineNo + itemJsonLength];
}

const deleteKeysAfter = (json: { [key: string]: any }, key: string): void => {
    const keys = _.keys(json);
    const startIndex = _.indexOf(keys, key);
    if (startIndex !== -1) {
        const keysToDelete = _.slice(keys, startIndex + 1);
        _.forEach(keysToDelete, k => {
            delete json[k];
        });
    }
}

export const isNameValid = (name: string) => {
    return (
        (name !== "") && (!name.includes("'")) && (!name.includes('"')) &&
        (!name.includes("`")) && (!name.includes("\\")) && (!name.includes("/")) &&
        (!name.includes("\n")) && (!name.includes("\t")) && (!name.includes("."))
    )
}

export const isNameUnique = (name: string,
    items: ElementType[] | ComponentType[] | SystemType[],
    originalName: string = '') => {
    const cleanedName = name.toUpperCase().replaceAll(" ", "");
    return (!items.filter(item => item.name !== originalName)
        .map(item => item.name.toUpperCase().replaceAll(" ", ""))
        .includes(cleanedName));
}

export const formatDate = (isoString: string) => {
    if (isNaN(Date.parse(isoString))) return '';
    
    const date = new Date(isoString);
    
    const pad = (num: number) => num.toString().padStart(2, '0');
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

export const trimText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
}

export const camelToTitle = (camelCase: string) => {
    return camelCase.replace(/([A-Z])/g, " $1").toLowerCase();
}

export const titleCase = (str: string) => {
    let splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    return splitStr.join(' '); 
 }

export const isTwinBaseUrl = async (url: string) => {
    try {
        const response = await fetch(`${url}/index.json`);
        if (!response.ok) {
            return false;
        }
        const json = await response.json();
        if (json.hasOwnProperty('twins')) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

export const fetchComponents = async (twinBaseUrl: string) => {
    const trimmedUrl = twinBaseUrl.endsWith('/') ? twinBaseUrl.slice(0, -1) : twinBaseUrl;
    
    try {
        const response = await fetch(`${trimmedUrl}/index.json`);
        if (!response.ok) {
            throw new Error('Failed to fetch components');
        }
        const json = await response.json();
        const twinUrls = json.twins.map((twin: any) => twin.url);
        

        const components: {id: string, component: ComponentType}[] = [];

        await Promise.all(twinUrls.map(async (url: string) => {
            const response = await fetch(`${url}/index.json`);
            if (response.ok) {
                const twinJson = await response.json();
                const component = {
                    name: titleCase(twinJson.name),
                    elements: twinJson.elements
                }
                if (isComponentType(component)) {
                    components.push({
                        id: twinJson['dt-id'],
                        component: component
                    });
                }
            }
        }));

        return components;
    } catch (error) {
        console.error(error);
        return [];
    }
}