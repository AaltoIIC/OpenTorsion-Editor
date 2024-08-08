import type { ComponentType, SystemType, NotificationType } from './types/types';
import { writable } from 'svelte/store';

export const notification = writable<NotificationType | null>(null);

export const currentComponentJSON = writable<ComponentType>({name: '', elements: []});
export const currentSystemJSON = writable<SystemType>({name: '', date: '', components: [], structure: []});

export const customComponents = writable<ComponentType[]>([]);
export const customSystems = writable<SystemType[]>([]);