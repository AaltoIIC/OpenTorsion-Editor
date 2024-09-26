import type { ElementType, ComponentType, ExcitationType, SystemType } from "./types";

export function isExcitationType(obj: any): obj is ExcitationType {
    return (typeof obj.type === 'string' && Array.isArray(obj.values) &&
            obj.values.every((v: any) => Array.isArray(v) && v.every((n: any) => typeof n === 'number')));
}

export function isSystemType(obj: any): obj is SystemType {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof obj.name === 'string' &&
        typeof obj.date === 'string' &&
        Array.isArray(obj.components) &&
        obj.components.every(isComponentType) &&
        Array.isArray(obj.structure) &&
        obj.structure.every(
            (subArray: any) => Array.isArray(subArray) && subArray.every((item: any) => typeof item === 'string')
        )
    );
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
           (obj.damping === undefined || typeof obj.damping === 'number') &&
           (obj.inertia === undefined || typeof obj.inertia === 'number') &&
           (obj.excitation === undefined || typeof obj.excitation === 'object') &&
           (obj.stiffness === undefined || typeof obj.stiffness === 'number') &&
           (obj.diameter === undefined || typeof obj.diameter === 'number') &&
           (obj.teeth === undefined || typeof obj.teeth === 'number') &&
           (obj.parent === undefined || typeof obj.parent === 'string') &&
           (obj.innerDiameter === undefined || typeof obj.innerDiameter === 'number') &&
           (obj.outerDiameter === undefined || typeof obj.outerDiameter === 'number') &&
           (obj.density === undefined || typeof obj.density === 'number');
}

// Checks if an object is a description of a system
// With no names and damping values for all elements
// (official format doesn't require them)
export function isAlmostSystemType(obj: any) {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof obj.name === 'string' &&
        typeof obj.date === 'string' &&
        Array.isArray(obj.components) &&
        obj.components.every(isAlmostComponentType) &&
        Array.isArray(obj.structure) &&
        obj.structure.every(
            (subArray: any) => Array.isArray(subArray) && subArray.every((item: any) => typeof item === 'string')
        )
    );
}
export const isAlmostComponentType = (obj: any) => {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof obj.name === 'string' &&
        Array.isArray(obj.elements) &&
        obj.elements.every(isAlmostElementType)
    );
}

const isAlmostElementType = (obj: any) => {
    return (obj.name === undefined || typeof obj.name === 'string') &&
           typeof obj.type === 'string' &&
           (obj.damping === undefined || typeof obj.damping === 'number') &&
           (obj.inertia === undefined || typeof obj.inertia === 'number') &&
           (obj.excitation === undefined || typeof obj.excitation === 'object') &&
           (obj.stiffness === undefined || typeof obj.stiffness === 'number') &&
           (obj.diameter === undefined || typeof obj.diameter === 'number') &&
           (obj.teeth === undefined || typeof obj.teeth === 'number') &&
           (obj.parent === undefined || typeof obj.parent === 'string') &&
           (obj.innerDiameter === undefined || typeof obj.innerDiameter === 'number') &&
           (obj.outerDiameter === undefined || typeof obj.outerDiameter === 'number') &&
           (obj.density === undefined || typeof obj.density === 'number');
}