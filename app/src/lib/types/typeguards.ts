import type { ElementType, ComponentType, ExcitationType } from "./types";

export function isExcitationType(obj: any): obj is ExcitationType {
    return (typeof obj.type === 'string' && Array.isArray(obj.values) &&
            obj.values.every((v: any) => Array.isArray(v) && v.every((n: any) => typeof n === 'number')));
}

export function isComponentType(obj: any): obj is ComponentType {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof obj.name === 'string' &&
        Array.isArray(obj.elements) &&
        obj.elements.every(isElementType)
    );
}

export function isElementType(obj: any): obj is ElementType {
    return typeof obj.name === 'string' &&
           typeof obj.type === 'string' &&
           typeof obj.damping === 'number' &&
           (obj.inertia === undefined || typeof obj.inertia === 'number') &&
           (obj.excitation === undefined || typeof obj.excitation === 'object') &&
           (obj.stiffness === undefined || typeof obj.stiffness === 'number') &&
           (obj.diameter === undefined || typeof obj.diameter === 'number') &&
           (obj.teeth === undefined || typeof obj.teeth === 'number');
}