import type { ComponentType } from './types/types';
import { writable } from 'svelte/store';

export const currentJSON = writable<ComponentType>({});
export const allComponents = writable<ComponentType[]>([]);