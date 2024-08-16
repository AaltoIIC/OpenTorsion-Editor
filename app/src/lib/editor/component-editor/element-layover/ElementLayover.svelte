<script lang="ts">
    import { onMount } from 'svelte';
    import Portal from "svelte-portal";
    import type { ElementType, ExcitationType } from '$lib/types/types';
    import { isExcitationType } from '$lib/types/typeguards';
    import { editElement } from '../componentHelpers';
    import { currentComponentJSON, highlightLinesInEditor } from '../../../stores';
    import { nthLinesInJSON } from '$lib/utils';
    import LayoverProperty from './LayoverProperty.svelte';
    
    export let params: ElementType;
    export let possibleParams: {required: string[], optional: string[]};

    // handle deletion
    const deleteElement = () => {
        isOpen = false;
        isEditing = false;
        currentComponentJSON.update(value => {
            return {
                ...value,
                elements: value.elements ? value.elements.filter((el: any) => el.name !== params.name) : []
            }
        })
    }

    // handle parameter change
    $: undefinedParams = possibleParams.optional
        .filter(item => !(item in params))
        .reduce((acc, key) => {
            acc[key] = undefined;
            return acc;
        }, {} as { [key: string]: undefined });

    let allProperties: ElementType;
    $: allProperties = {...params, ...undefinedParams};
    const handleParamChange = (key: string, value: any) => {
        const isValidNumber = /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(value);
        
        // try to convert to list if it's a list
        const isObjectStr = typeof value === 'string' && value.startsWith("{") && value.endsWith("}");
        try {
            let parsedValue = isObjectStr ? JSON.parse(value) : value;
            if (isExcitationType(parsedValue)) {
                value = parsedValue as ExcitationType;
            }
        } catch (e) {}

        allProperties = {...allProperties, [key]: isValidNumber ? Number(value) : value};
    }

    // handle element name change
    let isNameError = false;
    let nameField: HTMLInputElement;
    const handleNameChange = (event: any) => {
        // remove illegal characters
        const illegalChars = /['"\n]/g;
        if (illegalChars.test(event.target.value)) {
            event.target.value = event.target.value.replace(illegalChars, '');
        }

        // check if the name is already taken or empty
        const nameExists = $currentComponentJSON.elements.some((el: any) => el.name !== params.name && el.name === event.target.value);
        if (nameExists || event.target.value === '') {
            isNameError = true;

        } else {
            isNameError = false;
        }

        allProperties.name = event.target.value;

        // set width of the input field
        setNameFieldWidth();
    }

    const setNameFieldWidth = () => {
        const span = nameField.nextElementSibling as HTMLSpanElement;
        span.textContent = allProperties.name;
        nameField.style.width = `${span.offsetWidth}px`;
    }

    // handle layover behavior (position, visibility, etc.)
    let onHover = false;
    let isOpen = false;
    let isEditing = false;
    $: isOpen = isEditing || nodeOnHover || onHover;

    export let nodeOnHover = false;
    export const nodeClick = () =>{
        isEditing = true;
        setNameFieldWidth();
        
        // highligt JSON corresponding to the element in the JSON editor
        if (highlightLinesInEditor) {
            let [startIndex, endIndex] = nthLinesInJSON($currentComponentJSON, 'elements', 'name', params.name);
            $highlightLinesInEditor(startIndex, endIndex);
        }
    }
    let x = 0;
    let y = 0;
    const handleMouseMove = (event: any) => {
        if (!isOpen || isEditing) return;
        x = event.clientX;
        y = event.clientY;
    };

    const closeLayover = () => {
        if (isEditing) {
            // if name is invalid, revert to the original name
            if (isNameError) {
                allProperties.name = params.name;
                nameField.value = params.name;
                isNameError = false;
            }

            // update the element with the new properties
            if (isEditing) {
                currentComponentJSON.update(value => {
                return {
                        ...value,
                        elements: editElement(value.elements, params.name, allProperties, true)
                    }
                })
            }
        }

        isOpen = false;
        isEditing = false;
        $highlightLinesInEditor(-1, -1);
    }
    
    const handleClickOutside = (event: any) => {
        if (onHover || nodeOnHover) return;
        closeLayover();
    };

    const handleKeydown = (event: any) => {
        if (event.key === 'Escape') {
            closeLayover();
        }
    };

    onMount(() => {
        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('pointerdown', handleClickOutside);
        document.addEventListener('keydown', handleKeydown);

        const flowEditor = document.querySelector('.svelte-flow__pane');
        if (flowEditor) {
            flowEditor.addEventListener('wheel', closeLayover);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('pointerdown', handleClickOutside);
            document.removeEventListener('keydown', handleKeydown);
            flowEditor?.removeEventListener('wheel', closeLayover);
        };
    });

</script>
<Portal target="body">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="main-layover-cont {isOpen ? 'active' : ''}"
        style="top: {y + 15}px; left: {x + 15}px; border: {isEditing ? 'solid 1px var(--main-color)' : 'solid 1px rgba(0, 0, 0, 0.06)'};"
        on:mouseenter={() => {onHover = true}}
        on:mouseleave={() => {onHover = false}}>
        <div class="name-cont {isEditing ? 'editing' : ''}">
            <input
                type="text"
                value={allProperties.name}
                on:input={handleNameChange}
                bind:this={nameField}
                class="main-name-field {(isNameError ? "name-error" : "")}"
            />
            <span class="hidden-span"></span>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <svg
                on:click={deleteElement}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>              
        </div>
        <span class="name-error-info {(isNameError ? "active" : "")}">
            Name has to be unique and non-empty.  
        </span>
        <div class="params-cont">
            {#each Object.entries(allProperties) as [paramName, paramValue]}
                {#if paramName != 'name'}
                    <LayoverProperty
                        paramName={paramName}
                        paramValue={paramValue}
                        isEditing={isEditing}
                        required={possibleParams.required.includes(paramName)}
                        onChange={handleParamChange}
                    />
                {/if}
            {/each}
        </div>
        <button class="close-btn"
            on:click={() => {closeLayover()}}
            style="display: {isEditing ? 'block' : 'none'};">
            Done
        </button>
    </div>
</Portal>
<style>
    .hidden-span {
        visibility: hidden;
        white-space: pre;
        position: absolute;
        font-size: 13.5px;
        font-family: 'Inter', sans-serif;  
        font-weight: 550;
        padding: 1px;
        width: fit-content;
    }
    .name-cont.editing svg {
        display: block;
    }
    .name-cont svg {
        cursor: pointer;
        width: 14px;
        height: 14px;
        padding: 4px;
        border-radius: 50px;
        background-color: rgba(0, 0, 0, 0.1);
        border: solid 1px rgba(255, 255, 255, 0.2);
        color: rgba(0, 0, 0, 0.4);
        display: none;
    }
    .name-cont svg:hover {
        background-color:  rgb(240, 100, 100);
        color: rgba(255, 255, 255, 0.9)
    }
    .name-error-info {
        width: 100%;
        font-size: 10px;
        line-height: 1;
        display: none;
        padding: 0 12px 6px 12px;
        font-weight: 450;
        color: var(--main-error-color);
    }
    .name-error-info.active {
        display: block;
    }
    .main-name-field {
        padding: 1px;
        outline: none;
        border: none;
        min-width: 16px;
        font-family: 'Inter', sans-serif;
        font-weight: 550;
        max-width: 16ch;
        width: 16ch; 
    }
    .name-cont.editing .main-name-field {
        border-bottom: solid 2px rgba(0, 0, 0, 0.1);
    }
    .name-error {
        border-bottom: solid 2px var(--main-error-color) !important;
    }
    .close-btn {
        width: 100%;
        padding: 8px;
        background-color: var(--main-color);
        color: white;
        border: none;
        font-family: 'Inter', sans-serif;
        font-size: 12px;
        border: solid 1px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        border-radius: 0;
    }
    .close-btn:hover {
        border: solid 1px rgba(255, 255, 255, 0.3);
    }
    .params-cont {
        display: flex;
        flex-direction: column;
        padding: 4px 2px 4px 2px;
        border-top: solid 1px rgba(0, 0, 0, 0.06);
    }
    .name-cont {
        padding: 8px 12px;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        font-weight: 600;
        display: flex;
        justify-content: space-between;
    }
    .main-layover-cont {
        display: none;
        position: absolute;
        width: 210px;
        height: fit-content;
        background-color: rgba(255, 255, 255, 1);
        border: solid 1px rgba(0, 0, 0, 0.06);
        z-index: 1000000;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.9);
    }

    .main-layover-cont.active {
        display: block;
    }
</style>