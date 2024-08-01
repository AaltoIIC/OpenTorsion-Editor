<script lang="ts">
    import { onMount } from 'svelte';
    import Portal from "svelte-portal";
    import type { ElementType } from '$lib/types/types';
    import { editElement } from './componentHelpers';
    import { currentJSON } from '../../stores';
    import LayoverPropery from './element-layover/LayoverPropery.svelte';
    
    export let params: ElementType;
    export let possibleParams: string[] = ['name', 'type', 'damping', 'excitation'];
    export let isOpen: boolean = true;
    let onHover = false;

    // handle parameter change
    $: undefinedParams = possibleParams
        .filter(item => !(item in params))
        .reduce((acc, key) => {
            acc[key] = undefined;
            return acc;
        }, {} as { [key: string]: undefined });

    let allProperties: ElementType;
    $: allProperties = {...params, ...undefinedParams};
    const handleParamChange = (key: string, value: any) => {
        const isValidNumber = /^-?\d+(\.\d+)?$/.test(value);
        allProperties = {...allProperties, [key]: isValidNumber ? Number(value) : value};
    }
    $: console.log(allProperties);

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
        const nameExists = $currentJSON.elements.some((el: any) => el.name !== params.name && el.name === event.target.value);
        if (nameExists || event.target.value === '') {
            isNameError = true;

        } else {
            isNameError = false;
        }
        
        allProperties.name = event.target.value;
    }

    // handle layover behavior (position, visibility, etc.)

    const closeLayover = () => {
            // if name is invalid, revert to the original name
            if (isNameError) {
                allProperties.name = params.name;
                nameField.value = params.name;
                isNameError = false;
            }

            // update the element with the new properties
            currentJSON.update(value => {
            return {
                    ...value,
                    elements: editElement(value.elements, params.name, allProperties, true)
                }
            })

        isOpen = false;
    }
    
    const handleClickOutside = (event: any) => {
        if (onHover) return;
        closeLayover();
    };

    const handleKeydown = (event: any) => {
        if (event.key === 'Escape') {
            closeLayover();
        }
    };

    onMount(() => {
        document.addEventListener('pointerdown', handleClickOutside);
        document.addEventListener('keydown', handleKeydown);

        return () => {
            document.removeEventListener('pointerdown', handleClickOutside);
            document.removeEventListener('keydown', handleKeydown);
        };
    });

</script>
<Portal target="body">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="main-layover-cont {isOpen ? 'active' : ''}"
        on:mouseenter={() => {onHover = true}}
        on:mouseleave={() => {onHover = false}}>
        <div class="name-cont editing">
            <input
                type="text"
                value={allProperties.name}
                on:input={handleNameChange}
                bind:this={nameField}
                class="main-name-field {(isNameError ? "name-error" : "")}"
                style="width: {allProperties.name.length}ch;"
            />           
        </div>
        <span class="name-error-info {(isNameError ? "active" : "")}">
            Name has to be unique and non-empty.  
        </span>
        <div class="params-cont">
            {#each Object.entries(allProperties) as [paramName, paramValue]}
                {#if paramName != 'name'}
                    <LayoverPropery
                        paramName={paramName}
                        paramValue={paramValue}
                        isEditing={true}
                        onChange={handleParamChange}
                    />
                {/if}
            {/each}
        </div>
        <button class="close-btn"
            on:click={() => {closeLayover()}}>
            Done
        </button>
    </div>
</Portal>
<style>
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
        display: block;
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
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 210px;
        height: fit-content;
        background-color: rgba(255, 255, 255, 1);
        z-index: 1000000;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.9);
        border: solid 1px var(--main-color);
    }

    .main-layover-cont.active {
        display: block;
    }
</style>