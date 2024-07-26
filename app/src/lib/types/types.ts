export interface ElementType {
    name: string;
    type: string;
    damping: number;
    inertia?: number;
    excitation?: number;
    stiffness?: number;
    diameter?: number;
    teeth?: number;
}

export interface ComponentType {
    name?: string;
    elements?: ElementType[];
}