<script lang="ts">
    import { goto } from "$app/navigation";
    import type { SystemType } from "$lib/types/types";
    import DialogBox from "$lib/DialogBox.svelte";
    import { createSystem, removeSystem } from "$lib/stores/stores";
    import DropdownMenu from "$lib/DropdownMenu.svelte";
    import System3dModel from "$lib/System3dModel.svelte";
    import { formatDate } from "$lib/utils";
    import { trimText } from "$lib/utils";

    export let id: string;
    export let system: SystemType;
    let dialogBox: DialogBox;

    const handleMenu = (option: string) => {
        if (option === "Duplicate") {
            let copy = { ...system,
                name: `Copy of ${system.name}`,
                date: new Date().toISOString() };
            createSystem(copy, true);
        } else if (option === "Edit") {
            goto(`/system-editor/${id}`);
        } else if (option === "Delete") {
            dialogBox.openDialog(`Are you sure you want to delete ${system.name}?`,
                "Yes", "No").then((result: Boolean) => {
                if (result) {
                    removeSystem(id);
                }
            });
        }
    }
</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="tile"
    on:click={() => {goto(`/system-editor/${id}`)}}>
    <div class="illustration-cont">
        <System3dModel data={system} size={175} />
        {#if system.components.length === 0}
            <p class="empty-system-txt">No components</p>
        {/if}
    </div>
    <div class="system-info">
        <div class="system-name-cont">
            <h4>{trimText(system.name, 14)}</h4>
            <DropdownMenu
                options={["Duplicate", "Edit", "Delete"]}
                optionIcons={[
                '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6" /></svg>',
                '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>',
                '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>']}
                onClick={handleMenu}
            />
        </div>
        <span>
            {formatDate(system.date)}
        </span>
    </div>
</div>
<DialogBox bind:this={dialogBox} />
<style>
    .illustration-cont {
        width: 175px;
        height: 175px;
        mask-image: linear-gradient(rgba(0,0,0,1) 86%, rgba(0,0,0,0) 100%);
        position: relative;
    }
    .empty-system-txt {
        font-size: 14px;
        opacity: 0.7;
        width: 100%;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    span {
        font-size: 14px;
    }
    .tile {
        width: 175px;
        height: 228px;
        margin: 0 0 15px 15px;
        box-sizing: border-box;
        color: rgba(0, 0, 0, 0.9);
        cursor: pointer;
        border-radius: var(--main-border-radius);
        border: var(--main-border);
    }
    .tile:hover {
        background-color: var(--main-hover-color);
    }
    .tile h4 {
        margin: 0;
        color: rgba(255, 255, 255, 0.9);
    }
    .system-name-cont {
        display: flex;
        justify-content: space-between;
    }
    .system-info {
        padding: 0 14px 14px 14px;
        background-color: var(--main-dark-color);
        border-bottom-left-radius: var(--main-border-radius);
        border-bottom-right-radius: var(--main-border-radius);
        color: rgba(255, 255, 255, 0.9);
    }
</style>