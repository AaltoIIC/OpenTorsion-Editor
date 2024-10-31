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
    excitation?: ExcitationType;
}

export interface DiskType extends BaseElementType {
    type: "Disk";
    damping: number;
    inertia: number;
}

export interface GearElementType extends BaseElementType {
    type: "GearElement";
    parent?: string;
    inertia: number;
    diameter: number;
    teeth?: number;
}

export interface ShaftDiscreteType extends BaseElementType {
    type: "ShaftDiscrete";
    damping: number;
    stiffness: number;
}

export interface ShaftContinuousType extends BaseElementType {
    type: "ShaftContinuous";
    damping: number;
    length: number;
    innerDiameter: number;
    outerDiameter: number;
    density?: number;
}

export type ElementType = DiskType | GearElementType | ShaftDiscreteType | ShaftContinuousType;

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

export interface SettingsType {
    digitalTwinsEnabled: boolean;
}