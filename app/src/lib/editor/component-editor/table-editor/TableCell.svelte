<script lang="ts">
    import { currentComponentJSON } from "$lib/stores/stores";
    import type { ElementType } from "$lib/types/types";
    import { isExcitationType } from "$lib/types/typeguards";
    import { paramTypes } from "../params";

    export let editable: Boolean = false;
    export let element: string;
    export let param: string;
    export let required: Boolean = true;


    const toString = (val: any) => {
        if (val === null || val === undefined) {
            return "";
        } else if (param === 'excitation') {
            return JSON.stringify(val);
        } else {
            return val.toString();
        }
    }

    let displayValue: string;
    let paramType: string;

    currentComponentJSON.subscribe(val => {
        const elementObj = val.json.elements.find((el) => el.name === element)
        if (!elementObj) return;
        displayValue = (typeof elementObj[param as keyof ElementType] !== 'undefined' ?
            toString(elementObj[param as keyof ElementType]) : "");
        paramType = displayValue && paramTypes[param] === 'number' ? 'number' : 'text';
    });

    const updateJSON = () => {
        let newValue: any;
        if (paramType === 'number') {
            newValue = Number(displayValue);
        } else if (param === 'excitation') {
            newValue = JSON.parse(displayValue);
        } else {
            newValue = displayValue;
        }

        currentComponentJSON.update((val) => {
            const elementIndex = val.json.elements.findIndex((el) => el.name === element);
            val.json.elements[elementIndex] = {
                ...val.json.elements[elementIndex],
                [param]: newValue
            }
            return val;
        });
    }

    let isError = false;
    const handleInput = () => {
        if (displayValue === '' || displayValue === null) {
            if (required) {
                isError = true;
                return;
            } else {
                isError = false;
                currentComponentJSON.update((val) => {
                    const elementIndex = val.json.elements.findIndex((el) => el.name === element);
                    delete val.json.elements[elementIndex][param as keyof ElementType];
                    return val;
                });
                return;
            }
        }

        if (param === 'name') {
            if (displayValue != element &&
                $currentComponentJSON.json.elements.some((el) => el.name === displayValue)) {
                isError = true;
            } else {
                isError = false;
            }
            return;
        } else if (param === 'excitation') {
            try {
                const excitation = JSON.parse(displayValue);
                if (!isExcitationType(excitation)) {
                    isError = true;
                } else {
                    isError = false;
                }
            } catch (e) {
                isError = true;
            }
            return;
        }

        updateJSON();
        isError = false;
    }

    const resetDisplayValue = () => {
        if (param === 'name' && !isError) {
            updateJSON();
            return;
        } else if (param === 'excitation' && !isError) {
            updateJSON();
            return;
        }

        const elementIndex = $currentComponentJSON.json.elements
                                .findIndex((el) => el.name === element);
        const currentValue = $currentComponentJSON.json.elements[elementIndex][param as keyof ElementType];
        displayValue = typeof currentValue !== 'undefined' ? toString(currentValue) : "";
        isError = false;
    }

</script>
<td>
    <div
        class="cell-inner"
        style={`min-width: ${toString(displayValue).length*8.5 + (paramType === 'number' ? 35 : 16)}px;`}>
        {#if editable}
            {#if paramType === 'number'}
                <input
                    class={isError ? 'error' : ''}
                    type='number'
                    bind:value={displayValue}
                    on:input={handleInput}
                    on:blur={resetDisplayValue}
                />
            {:else}
                <input
                    class={isError ? 'error' : ''}
                    type='text'
                    bind:value={displayValue}
                    on:input={handleInput}
                    on:blur={resetDisplayValue}
                />
            {/if}
        {:else}
            <span class="no-edit">{displayValue}</span>
        {/if}
    </div>
</td>

<style>
    td {
        text-align: left;
        font-family: 'Roboto Mono', monospace;
        font-size: 14px;
        padding: 0;
        white-space:nowrap;
        border: var(--main-border);
    }
    .cell-inner {
        display: flex;  
    }
    input {
        padding: 8px;
        border: none;
        font-family: 'Roboto Mono', monospace;
        font-size: 14px;
        background-color: rgba(0, 0, 0, 0.03);
        width: 100%;
    }
    .error:focus {
        outline: solid 2px var(--main-error-color);
        border-radius: 2px;
    }
    .no-edit {
        white-space: nowrap;
        padding: 8px;
    }
</style>