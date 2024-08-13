import type { ComponentType, SystemType, NotificationType } from './types/types';
import { writable } from 'svelte/store';

export const notification = writable<NotificationType | null>(null);
export const highlightLinesInEditor = writable<((from: number, to: number) => void)>((from: number, to: number) => {});

export const currentComponentJSON = writable<ComponentType>({name: '', elements: []});
export const currentSystemJSON = writable<SystemType>({
    name: "New System",
    date: new Date().toISOString(),
    components: [],
    structure: []
} as SystemType);

export const customComponents = writable<ComponentType[]>([]);
export const customSystems = writable<SystemType[]>([]);