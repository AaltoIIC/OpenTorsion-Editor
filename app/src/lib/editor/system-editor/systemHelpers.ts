import type { ComponentType } from "$lib/types/types"

export const nameComponentInstance = (componentType: string, components: ComponentType[]): string => {
    // Get the maximum number
    const regex = new RegExp(`^${componentType} \\d+$`);
    const compToNum = (comp: ComponentType) => { return (
        parseInt(comp.name.split(" ")[comp.name.split(" ").length - 1])
    )}
    const largestNum = components.filter(comp => regex.test(comp.name)).map(compToNum).sort().at(-1)

    return `${componentType} ${largestNum ? largestNum + 1 : 1}`;
}