import type { ComponentType, SystemType, NotificationType } from '../types/types';
import { browser } from "$app/environment"
import { writable } from 'svelte/store';
import { get } from 'svelte/store';
import persistentStore from './persistentStore';
import { nameSystem } from '../editor/system-editor/systemHelpers';
import { nameComponentDesign } from '$lib/editor/component-editor/componentHelpers';

export const notification = writable<NotificationType | null>(null);
export const highlightLinesInEditor = writable<((from: number, to: number) => void)>((from: number, to: number) => {});


// components persistent store

export const customComponents = persistentStore<Record<string, ComponentType>>('customComponents', {}); // custom components persistent store

export const saveComponent = (id: string, component: ComponentType) => {
    if (Object.keys(get(customComponents)).includes(id)) {
        customComponents.update((components) => {
            components[id] = component;
            return components;
        });
    }
}

export const getComponent = (id: string): ComponentType | null => {
    if (Object.keys(get(customComponents)).includes(id)) {
        return get(customComponents)[id];
    }
    return null;
}

export const createComponent = (component: ComponentType | null = null) => {
    const componentIds = Object.keys(get(customComponents))
        .filter(compId => compId.startsWith(`${get(currentSystemJSON).id}-`))
        .map(compId => compId.split('-')[1]);
    const componentsInSystem = Object.entries(get(customComponents))
        .filter(([compId, _]) => compId.startsWith(`${get(currentSystemJSON).id}-`))
        .map(([_, comp]) => comp);
    
    // generate unique id
    // components ids are in the format systemId-xxxxxx
    const id = `${get(currentSystemJSON).id}-${generateId(componentIds)}`;
    if (!component) {
        component = {
            name: nameComponentDesign(componentsInSystem),
            elements: []
        } as ComponentType;
    }
    customComponents.update((value) => {
        value[id] = component;
        return value;   
    });

    return [id, component] as [string, ComponentType];
}

export const removeComponent = (id: string) => {
    customComponents.update((components) => {
        delete components[id];
        return components;
    });
}

export const currentComponentJSON = writable<{id: string, json: ComponentType}>({
    id: '',
    json: {
        name: "",
        elements: []
    } as ComponentType
});

// autosave current component
currentComponentJSON.subscribe(value => {
    if (value.id && value.json.name) {
        customComponents.update((components) => {
            components[value.id] = value.json;
            return components;
        });
    }
});


// systems persistent store

export const systems = persistentStore<Record<string, SystemType>>('systems', {});


export const saveSystem = (id: string, system: SystemType) => {
    if (Object.keys(get(systems)).includes(id)) {
        systems.update((systems) => {
            systems[id] = system;
            return systems;
        });
    }
}

export const getSystem = (id: string): SystemType | null => {
    if (Object.keys(get(systems)).includes(id)) {
        return get(systems)[id];
    }
    return null;
}

export const createSystem = (system: SystemType|null = null) => {
    const id = generateId(Object.keys(get(systems)));
    if (!system) {
        system = {
            name: nameSystem(Object.values(get(systems))),
            date: new Date().toISOString(),
            components: [],
            structure: []
        } as SystemType;
    }
    systems.update((value) => {
        value[id] = system;
        return value;
    });

    return [id, system] as [string, SystemType];
}

export const removeSystem = (id: string) => {
    systems.update((systems) => {
        delete systems[id];
        return systems;
    });
}


export const currentSystemJSON = writable<{id: string, json: SystemType}>({
    id: '',
    json: {
        name: "",
        date: "",
        components: [],
        structure: []
    } as SystemType
});

// autosave current system
currentSystemJSON.subscribe(value => {
    if (value.id && value.json.name) {
        systems.update((systems) => {
            systems[value.id] = value.json;
            return systems;
        });
    }
});


// generate unique string of 6 characters
const generateId = (ids: string[]) => {
    const generateRandomString = () => {
        const utf8Chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

        let randomString = '';
        for (let i = 0; i < 6; i++) {
            randomString +=utf8Chars.charAt(Math.floor(Math.random() * utf8Chars.length));
        }

        return randomString;
    }
    let randomString = generateRandomString();
    while (ids.includes(randomString)) {
        randomString = generateRandomString();
    }

    return randomString;
}