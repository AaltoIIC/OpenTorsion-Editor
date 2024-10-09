// eventBus.js
import { writable } from 'svelte/store';

const createEventBus = () => {
    const initialEvents: Record<string, any> = {};
    const { subscribe, set, update } = writable(initialEvents);

    return {
        listen: (event: string, handler: (details: any) => void) => {
            subscribe(events => {
                if (events[event]) {
                    handler(events[event]);
                }
            })
        },
        dispatch: (event: string, details: any) => {
            update(events => {
                events[event] = details;
                return events;
            });
        },
        clear: () => set({})
    };
}

export const eventBus = createEventBus();