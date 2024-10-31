<script lang="ts">
    import type { SvelteComponent } from "svelte";
    import { goto } from "$app/navigation";
    import type { ComponentType } from "$lib/types/types";
    import Component3dModel from "$lib/Component3dModel.svelte";
    import {
        currentSystemJSON,
        removeComponent,
        createComponent
    } from "$lib/stores/stores";
    import { nameComponentInstance, addConnectionTolastComponent } from "$lib/editor/system-editor/systemHelpers";
    import DropdownMenu from "$lib/DropdownMenu.svelte";
    import DialogBox from "$lib/DialogBox.svelte";
    import Button from "$lib/Button.svelte";
    import { trimText } from "$lib/utils";
    
    let dialogBox: SvelteComponent;

    export let data: ComponentType;
    export let type: string;
    export let id = "";

    let twinRepo = '';
    let twinBaseUrl = '';
    if (type === "twin") {
        const org = id.split('/')[2].split('.')[0];
        const repo = id.split('/')[3];
        twinRepo = trimText(`${org}/${repo}`, 25);
        twinBaseUrl = `https://${org}.github.io/${repo}`;
    }

    const onDragStart = (event: DragEvent) => {
        if (!event.dataTransfer) {
        return null;
        }
        event.dataTransfer.setData('application/svelteflow', JSON.stringify(data));
        event.dataTransfer.effectAllowed = 'move';
    };

    const onAdd = () => {
        const componentData = { ...data };
        componentData.name = nameComponentInstance(componentData.name, $currentSystemJSON.json.components);

        // add new component to system JSON
        currentSystemJSON.update((json) => {
            const newJson = { ...json };
            newJson.json.components.push(componentData);
            return newJson;
        });

        // add connection to last component
        addConnectionTolastComponent(componentData);
    };

    let hover = false;

    const handleMenu = (option: string) => {
        if (option === "Duplicate") {
            createComponent({...data, name: `Copy of ${data.name}`}, true);
        } else if (option === "Edit") {
            goto(`/component-editor/${id}`);
        } else if (option === "Delete") {
            dialogBox.openDialog(`Are you sure you want to delete ${data.name} component?`,
                "Yes", "No").then((result: Boolean) => {
                if (result) {
                    removeComponent(id);
                }
            });
        }
    };
</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="component-list-item {hover ? 'hover' : ''}"
    on:mouseenter={() => {hover = true}}
    on:mouseleave={() => {hover = false}}
    on:dragstart={(event) => onDragStart(event)}
    draggable={true}>
    <div class="illustration-cont">
        <Component3dModel data={data} hoverable={false} />
    </div>
    <div class="component-info">
        <div>
            <h4>
                <span class="comp-name">{trimText(data.name, 19)}</span>
                <DropdownMenu
                    options={id ? ["Duplicate", "Edit", "Delete"] : ["Duplicate"]}
                    optionIcons={[
                    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6" /></svg>',
                    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>',
                    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>']}
                    onClick={handleMenu}
                />
            </h4>
            {#if type === "custom"}
                <p>Custom Component</p>
            {:else if type === "twin"}
                <a class="twin-repo" href={twinBaseUrl} target="_blank">
                    {twinRepo}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>                      
                </a>
            {:else}
                <p>Generic Component</p>
            {/if}
        </div>
        <div>
            <Button
                onClick={onAdd}
                color={"rgb(30, 30, 30)"}>
                Add
                <svg class="add-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>  
            </Button>
        </div>
    </div>
</div>
<DialogBox bind:this={dialogBox} />
<style>
    .twin-repo {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
        text-decoration: none;
        background-color: rgb(243, 243, 243);
        border-radius: 50px;
        padding: 1px 6px;
        transition: .2s;
    }
    .twin-repo:hover {
        background-color: var(--main-grey-color-2);
    }
    .twin-repo svg {
        width: 12px;
        height: 12px;
        margin-bottom: -2px;
        
    }
    p {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
        margin: 0;
    }
    h4 {
        margin: 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
    .add-icon {
        width: 18px;
        height: 18px;
        margin: 0 0 -4.5px 0;
        stroke: rgba(255, 255, 255, 0.9);
        stroke-width: 2px;
        stroke-linejoin: round;
    }
    .component-info {
        width: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 8px;
        flex-grow: 1;
    }
    .comp-name {
        max-width: 200px;
        overflow: hidden;
    }
    .component-list-item {
        display: flex;
        width: calc(100% - 12px);
        margin: 5px;
        height: 100px;
        -moz-user-select: -moz-none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: grab;
        border-radius: var(--main-border-radius);
        background: white;
        border: var(--main-border);
    }
    .component-list-item.hover {
        background: var(--main-hover-color);
    }
    .component-list-item:active {
        cursor: grabbing;
    }
    .illustration-cont {
        width: 100px;
        height: 100px;
        overflow: hidden;
        border-top-left-radius: var(--main-border-radius);
        border-bottom-left-radius: var(--main-border-radius);
        overflow: hidden;
        mask-image: linear-gradient(90deg, rgba(0,0,0,1) 86%, rgba(0,0,0,0) 100%);
        mask-size: cover;
    }
    button {
        color: rgba(255, 255, 255, 0.9);
        background-color: rgb(30, 30, 30);
        cursor: pointer;
        transition: .2s;
        background-color: rgb(34, 34, 34);
        font-family: "Inter", sans-serif;
        font-weight: 550;
        font-size: 14px;
        border-radius: 100px;
        padding: 9px 12px 11px 12px;
        border: 1px solid rgba(255, 255, 255, 0.4);
    }
    button:hover {
        border: 1px solid rgba(255, 255, 255, 0.8);
    }
</style>
