export interface NotificationType {
    message: string;
    type: string;
    duration: number;
}

export interface ExcitationType {
    type: string;
    values: number[][];
}

interface BaseElementType {
    name: string;
    type: string;
    damping: number;
    excitation?: ExcitationType;
}

export interface DiskElementType extends BaseElementType {
    type: "Disk";
    inertia: number;
}

export interface ShaftElementType extends BaseElementType {
    type: "ShaftDiscrete";
    stiffness: number;
}

export interface GearElementType extends BaseElementType {
    type: "GearElement";
    parent?: string;
    inertia: number;
    diameter: number;
    teeth?: number;
}

export type ElementType = DiskElementType | ShaftElementType | GearElementType;

export interface ComponentType {
    name: string;
    elements: ElementType[];
    [key: string]: any;
}

export interface SystemType {
    name: string;
    date: string;
    components: ComponentType[];
    structure: string[][];
}