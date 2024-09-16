import type { ComponentType, SystemType, NotificationType } from '../types/types';
import { writable } from 'svelte/store';
import { get } from 'svelte/store';
import persistentStore from './persistentStore';
import { nameSystem } from '../editor/system-editor/systemHelpers';
import { nameComponentDesign } from '../editor/component-editor/componentHelpers';
import * as THREE from 'three';
import _ from 'lodash';

export const notification = writable<NotificationType | null>(null);
export const highlightLinesInEditor = writable<((from: number, to: number) => void)>((from: number, to: number) => {});
export const threeRenderer = writable<THREE.WebGLRenderer | null>(null);

// components persistent store

export const customComponents = persistentStore<Map<string, ComponentType>>('customComponents', new Map<string, ComponentType>()); // custom components persistent store

export const getComponent = (id: string): ComponentType | null => {
    return (get(customComponents).get(id) || null);
}

export const createComponent = (component: ComponentType | null = null, saveComponent: boolean = false) => {
    const componentIds = Array.from(get(customComponents).keys())
        .filter(compId => compId.startsWith(`${get(currentSystemJSON).id}-`))
        .map(compId => compId.split('-')[1]);
    const componentsInSystem = Array.from(get(customComponents).entries())
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

    currentComponentJSON.set({
        id: id,
        json: component
    });
    if (saveComponent) {
        saveCurrentComponent();
    }

    return [id, component] as [string, ComponentType];
}

export const removeComponent = (id: string) => {
    customComponents.update((components) => {
        components.delete(id);
        return components;
    });
}

export const currentComponentJSON = persistentStore<{id: string, json: ComponentType}>('currentComponentJSON', {
    id: '',
    json: {
        name: "",
        elements: []
    } as ComponentType
})

export const resetCurrentComponent = () => {
    currentComponentJSON.set({
        id: '',
        json: {
            name: "",
            elements: []
        } as ComponentType
    });
}

export const saveCurrentComponent = () => {
    customComponents.update((components) => {
        components.set(get(currentComponentJSON).id, _.cloneDeep(get(currentComponentJSON).json));
        return components;
    });
}


// systems persistent store

export const systems = persistentStore<Map<string, SystemType>>('systems', new Map<string, SystemType>());


export const saveSystem = (id: string, system: SystemType) => {
    if (Array.from(get(systems).keys()).includes(id)) {
        systems.update((systems) => {
            systems.set(id, system);
            return systems;
        });
    }
}

export const getSystem = (id: string): SystemType | null => {
    if (Array.from(get(systems).keys()).includes(id)) {
        return get(systems).get(id) || null;
    }
    return null;
}

export const createSystem = (system: SystemType|null = null) => {
    const id = generateId(Array.from(get(systems).keys()));
    if (!system) {
        system = {
            name: nameSystem(Array.from(get(systems).values())),
            date: new Date().toISOString(),
            components: [],
            structure: []
        } as SystemType;
    }
    systems.update((value) => {
        value.set(id, system);
        return value;
    });

    return [id, system] as [string, SystemType];
}

export const setCurrentSystem = (id: string) => {
    if (Array.from(get(systems).keys()).includes(id)) {
        currentSystemJSON.set({
            id: id,
            json: get(systems).get(id) as SystemType
        });
    }
}

export const removeSystem = (id: string) => {
    systems.update((systems) => {
        systems.delete(id);
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
            systems.set(value.id, value.json);
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