<script lang="ts">
    import { onMount } from 'svelte';
    import Portal from "svelte-portal";
    import type { ElementType } from '$lib/types/types';
    import { currentJSON } from '../../../stores';
    import LayoverPropery from './LayoverPropery.svelte';
    

    export let params: ElementType;
    export let possibleParams: string[] = ['name', 'type', 'damping', 'excitation'];

    // handle layover behavior (position, visibility, etc.)
    
    let onHover = false;
    let isOpen = false;
    let isEditing = false;
    $: isOpen = isEditing || nodeOnHover || onHover;

    export let nodeOnHover = false;
    export const nodeClick = () =>{
        isEditing = true;
    }
    let x = 0;
    let y = 0;
    const handleMouseMove = (event: any) => {
        if (!isOpen || isEditing) return;
        x = event.clientX;
        y = event.clientY;
    };
    
    const handleClickOutside = (event: any) => {
        if (onHover || nodeOnHover) return;
        isOpen = false;
        isEditing = false;
    };

    const handleKeydown = (event: any) => {
        if (event.key === 'Escape') {
            isOpen = false;
            isEditing = false;
        }
    };

    const handleScrollandMove = () => {
        isOpen = false;
        isEditing = false;
    }

    onMount(() => {
        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('pointerdown', handleClickOutside);
        document.addEventListener('keydown', handleKeydown);
        window.addEventListener('wheel', handleScrollandMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('pointerdown', handleClickOutside);
            document.removeEventListener('keydown', handleKeydown);
            window.removeEventListener('wheel', handleScrollandMove);
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
            <span contenteditable>{params.name}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>              
        </div>
        <div class="params-cont">
            {#each Object.entries(params) as [paramName, paramVal]}
                {#if paramName != 'name'}
                    <LayoverPropery
                        paramName={paramName}
                        paramValue={paramVal}
                        isEditing={isEditing}
                    />
                {/if}
            {/each}
            {#each possibleParams.filter(item => !(item in params)) as undefinedParam}
                    <LayoverPropery
                        paramName={undefinedParam}
                        paramValue={undefined}
                        isEditing={isEditing}
                    />
            {/each}
        </div>
        <button class="close-btn"
            on:click={() => {isOpen = false; isEditing = false}}
            style="display: {isEditing ? 'block' : 'none'};">
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
        width: 15px;
        height: 15px;
        padding: 4px;
        border-radius: 5px;
        background-color: rgb(214, 81, 81);
        border: solid 1px rgba(0, 0, 0, 0.1);
        color: rgba(255, 255, 255, 0.9);
        display: none;
    }
    .name-cont.editing svg:hover {
        border: solid 1px rgba(255, 255, 255, 0.1); 
    }
    .name-cont.editing span {
        border-bottom: solid 2px rgba(0, 0, 0, 0.1);
    }
    .name-cont span {
        padding: 1px;
    }
    .close-btn {
        width: 100%;
        padding: 8px;
        background-color: var(--main-color);
        color: white;
        border: none;
        font-family: 'Inter', sans-serif;
        font-size: 12px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        border: solid 1px rgba(0, 0, 0, 0.1);
        cursor: pointer;
    }
    .close-btn:hover {
        border: solid 1px rgba(255, 255, 255, 0.3);
    }
    .params-cont {
        display: flex;
        flex-direction: column;
        padding: 4px 2px 4px 2px;
    }
    .name-cont {
        padding: 8px 12px;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        border-bottom: solid 1px rgba(0, 0, 0, 0.06);
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
        border-radius: 5px;
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