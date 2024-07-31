import type { ElementType } from "./types";

export function isElementType(obj: any): obj is ElementType {
    return typeof obj.name === 'string' &&
           typeof obj.type === 'string' &&
           typeof obj.damping === 'number' &&
           (obj.inertia === undefined || typeof obj.inertia === 'number') &&
           (obj.excitation === undefined || typeof obj.excitation === 'number') &&
           (obj.stiffness === undefined || typeof obj.stiffness === 'number') &&
           (obj.diameter === undefined || typeof obj.diameter === 'number') &&
           (obj.teeth === undefined || typeof obj.teeth === 'number');
}