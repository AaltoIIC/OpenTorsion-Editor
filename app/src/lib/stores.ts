import type { ComponentType, SystemType, NotificationType } from './types/types';
import { browser } from "$app/environment"
import { writable } from 'svelte/store';
import { get } from 'svelte/store';

export const notification = writable<NotificationType | null>(null);
export const highlightLinesInEditor = writable<((from: number, to: number) => void)>((from: number, to: number) => {});

export const currentComponentJSON = writable<ComponentType>({name: '', elements: []});


// System names persistent store
let storedSystemNames: string[] = [];
if (browser) {
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('system.')) {
                storedSystemNames.push(key.split('.')[1]);
            }
        }
    } catch (e) {
        console.error(e);
    }
}

export const systemNames = writable<string[]>(storedSystemNames);


export const currentSystemJSON = writable<SystemType>({
    name: "",
    date: "",
    components: [],
    structure: []
} as SystemType);

// Custom components persistent store
export const customComponents = writable<ComponentType[]>([]);
// Sync custom components with current system
customComponents.subscribe(value => {
    if (browser && get(currentSystemJSON).name) {
        localStorage.setItem(`custom-components.${ get(currentSystemJSON).name}`, JSON.stringify(value));
    }
});
