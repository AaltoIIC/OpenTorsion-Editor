<script lang="ts">
    import { onMount } from 'svelte';
    import Portal from "svelte-portal";
    import _ from 'lodash';
    import type { ElementType } from '$lib/types/types';
    import { defaultElement, possibleParams } from '../componentHelpers';
    import { currentComponentJSON } from '../../../stores';
    import LayoverPropery from '../element-layover/LayoverPropery.svelte';
    import PrevElementListItem from './PrevElementListItem.svelte';
    
    let params: ElementType = {name: '', type: '', damping: 0, excitation: 0};
    let possibleParameters: string[] = possibleParams['disk'];
    let isOpen: boolean = false;
    let onHover = false;

    export const open = (type: string) => {
        params = defaultElement($currentComponentJSON.elements, type);
        possibleParameters = possibleParams[type];
        isOpen = true;
    }

    const types: {[key: string]: string;} = {
        Disk: 'Disk',
        ShaftDiscrete: 'Shaft',
        Gear: 'Gear'
    }

    // handle parameter change
    $: undefinedParams = possibleParameters
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

    // create list of previous elements
    let possibleElements: ElementType[];
    $: possibleElements = $currentComponentJSON.elements
                                            .filter((el: any) => el.type === params.type)
                                            .reverse()
                                            .slice(0, 5)
    let possibleElementNames: string[];
    $: possibleElementNames = possibleElements.map((el: any) => el.name);

    const handlePrevClick = (name: string) => {
        // mindig akkor kezd el baja lenni amikor masodjara nyomod meg ugyanazt

        let newProperties = possibleElements.find((el: any) => el.name === name) as ElementType;
        allProperties = {...newProperties};

        allProperties.name += " (Copy)";
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
    }

        // save the element
        const addElement = () => {
        // if name is invalid, revert to the original name
        if (isNameError) {
            allProperties.name = params.name;
            nameField.value = params.name;
            isNameError = false;
        }

        // update the element with the new properties
        currentComponentJSON.update(value => {
            return {
                ...value,
                elements: [...value.elements, _.omitBy(allProperties, _.isUndefined) as ElementType]
            }
        })

        closePopup();
    }

    // handle popup behavior
    const closePopup = () => {
        isOpen = false;
    }
    
    const handleClickOutside = (event: any) => {
        if (onHover) return;
        closePopup();
    };

    const handleKeydown = (event: any) => {
        if (event.key === 'Escape') {
            closePopup();
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
    <div class="main-layover-bg {isOpen ? 'active' : ''}">
    </div>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="main-popup {isOpen ? 'active' : ''}"
        on:mouseenter={() => {onHover = true}}
        on:mouseleave={() => {onHover = false}}>
        <div class="main-title">
            <p>Add New {types[params.type]}</p>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <svg
                on:click={() => {closePopup()}}
                class="icon-close" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>              
        </div>
        <div class="sections-cont">
            <div class="element-icon-cont">
                <div class="element-icon {params.type}">
                </div>
                <p>{types[params.type]}</p>
            </div>
            <div class="section-normal">
                <div class="section-flex">
                    <div class="main-props-cont">
                        <div class="name-cont editing">
                            <span>Element Name:</span>
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
                    </div>
                    {#if possibleElementNames.length > 0}
                        <div class="previous-elems">
                            <p class="prev-title">Copy Previous:</p>
                            <div class="prev-elems-cont">
                                {#each possibleElementNames as name}
                                    <PrevElementListItem name={name} onClick={handlePrevClick} />
                                {/each}
                            </div>
                        </div>
                    {/if}
                </div>
                <div class="add-btn-cont">
                    <button class="add-btn"
                    on:click={() => {addElement()}}>
                        Add to Component
                        <svg class="icon-add" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>              
                    </button>
                </div>
            </div>
        </div>
    </div>
</Portal>
<style>
    .section-flex {
        display: flex;
        justify-content: space-between;
    }
    .prev-elems-cont {
        padding: 8px 0;
    }
    .prev-title {
        padding: 8px 18px 8px 16px;
        font-weight: 600;
        margin: 0;
    }
    .previous-elems {
        width: 170px;
        height: 260px;
        border-left: solid 1px rgba(0, 0, 0, 0.1);
    }
    .icon-add {
        width: 18px;
        height: 18px;
        margin-bottom: -4px;
    }
    .icon-close {
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
        width: 16px;
        height: 16px;
        color: rgba(255, 255, 255, 0.9);
    }
    .main-title {
        width: 100%;
        padding: 10px 0;;
        text-align: center;
        border-bottom: solid 1px rgba(0, 0, 0, 0.1);
        background:rgb(30, 30, 30);
    }
    .main-title p {
        margin: 0;
        font-size: 14px;
        font-weight: 550;
        color: rgba(255, 255, 255, 0.9);
    }
    .main-props-cont {
        width: 280px;
        height: 260px;
    }
    .sections-cont {
        display: flex;
        justify-content: middle;
    }
    .element-icon.Disk {
        height: 120px;
        width: 30px;
        background-color: var(--main-color);
        background-image: linear-gradient( to bottom, rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0));
        margin: 10px 0 0 0;
        border-radius: 2.5px;
        border: solid 1.5px rgba(0, 0, 0, 0.04);
        box-shadow: rgba(149, 157, 165, 0.2) 0px 1.6px 4.8px;
    }
    .element-icon.ShaftDiscrete {
        height: 21px;
        width: 108px;
        background-color: var(--main-color);
        background-image:
            linear-gradient( to bottom, rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.15), rgba(0, 0, 0, 0)),
            ;
        border: solid 1.5px rgba(0, 0, 0, 0.04);
        border-radius: 2.5px;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 1.6px 4.8px;
    }
    .element-icon.Gear {
        height: 90px;
        width: 30px;
        border-radius: 2.5px;
        border: solid 1px rgba(0, 0, 0, 0.04);
        box-shadow: rgba(149, 157, 165, 0.2) 0px 1.6px 4.8px;
        background-color: var(--main-color);
        background-image: repeating-linear-gradient(
            0deg,
            transparent 0%,
            transparent 9.09%,
            rgba(0,0,0,0.1) 9.09%,
            rgba(0,0,0,0.1) 18.18%
        );
    }
    .element-icon-cont {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 180px;
        height: 312px;
        background-color: var(--main-color-tr-2);
        border-right: solid 1px rgba(0, 0, 0, 0.1);
    }
    .element-icon-cont p {
        font-family: 'Roboto Mono', monospace;
        font-size: 12px;
        color:rgba(0, 0, 0, 0.7)
    }

    .main-layover-bg  {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.2);
        z-index: 10000001;
        display: none;
    }
    .main-layover-bg.active {
        display: block;
    }
    .name-error-info {
        width: 100%;
        font-size: 10px;
        line-height: 1;
        display: none;
        padding: 0 16px 6px 16px;
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
    .add-btn-cont {
        padding: 6px;
        border-top: solid 1px rgba(0, 0, 0, 0.1);
    }
    .add-btn {
        float: right;
        padding: 10px 20px 11px 20px;
        background-color: var(--main-color);
        color: rgba(255, 255, 255, 0.9);
        border: none;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        border: 1px solid rgba(255, 255, 255, 0.4);
        cursor: pointer;
        border-radius: 0;
        display: block;
        font-weight: 550;
        border-radius: 50px;
    }
    .add-btn:hover {
        border: solid 1px rgba(255, 255, 255, 0.8);
    }
    .params-cont {
        display: flex;
        flex-direction: column;
        padding: 4px 2px 4px 2px;
        border-top: solid 1px rgba(0, 0, 0, 0.1);
    }
    .name-cont {
        padding: 8px 18px 8px 16px;
        font-weight: 600;
        display: flex;
        justify-content: space-between;
    }
    .main-popup {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: fit-content;
        height: fit-content;
        background-color: rgba(255, 255, 255, 1);
        z-index: 10000002;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.9);
        border: solid 1px rgba(0, 0, 0, 0.3);
        box-shadow: rgba(149, 157, 165, 0.4) 0px 8px 24px;
    }


    .main-popup.active {
        display: block;
    }
</style>