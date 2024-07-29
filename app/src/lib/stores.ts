import type { ComponentType, NotificationType } from './types/types';
import { writable } from 'svelte/store';


export const notification = writable<NotificationType | null>(null);

export const currentJSON = writable<ComponentType>({});
export const allComponents = writable<ComponentType[]>([]);