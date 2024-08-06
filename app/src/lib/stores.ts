import type { ComponentType, SystemType, NotificationType } from './types/types';
import type { SvelteComponent } from 'svelte';
import { writable } from 'svelte/store';


export const notification = writable<NotificationType | null>(null);

export const currentComponentJSON = writable<ComponentType>({name: '', elements: []});
export const currentSystemJSON = writable<SystemType>({name: '', date: '', components: [], structure: []});

export const allComponents = writable<ComponentType[]>([]);