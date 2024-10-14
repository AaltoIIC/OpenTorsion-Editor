// object with possible parameters for each element type
export const possibleParams = {
    Disk: {
        required: ["name", "type", "damping", "inertia"],
        optional: ["excitation"]
    },
    GearElement: {
        required: ["name", "type", "inertia", "diameter"],
        optional: ["parent", "teeth", "excitation"]
    },
    ShaftDiscrete: {
        required: ["name", "type", "damping", "stiffness"],
        optional: ["excitation"]
    },
    ShaftContinuous: {
        required: ["name", "type", "damping", "length", "innerDiameter", "outerDiameter"],
        optional: ["density","excitation"]
    }
}
export const paramUnits: Record<string, string> = {
    "damping": "Nms/rad",
    "inertia": "kgm²",
    "stiffness": "Nm/rad",
    "length": "mm",
    "innerDiameter": "mm",
    "outerDiameter": "mm",
    "density": "kg/m³"
}

export const paramTypes: Record<string, string> = {
    "name": "string",
    "type": "string",
    "damping": "number",
    "inertia": "number",
    "stiffness": "number",
    "length": "number",
    "innerDiameter": "number",
    "outerDiameter": "number",
    "density": "number",
    "teeth": "number",
    "excitation": "object",
    "parent": "string",
    "diameter": "number"
}