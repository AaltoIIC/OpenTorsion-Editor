<script lang="ts">
    import ElementLayover from './element-layover/ElementLayover.svelte';
    import type { ElementType } from '$lib/types/types';
    import { possibleParams } from './componentHelpers';
    import DragAndDropHandle from './DragAndDropHandle.svelte';
    import { onMount } from 'svelte';
   
    $$restProps

    let nodeElement: any;
    let layoverElement: any;
    export let data: {
        new: boolean;
        nodeNo: string;
        data: ElementType;
    };
    let onHover = false;

    
    const onDragStart = (event: DragEvent) => {
        if (!event.dataTransfer) {
        return null;
        }
        onHover = false;

        let message = {event: 'addExisting', element: data.data.name};
        event.dataTransfer.setData('application/svelteflow', JSON.stringify(message));
        event.dataTransfer.effectAllowed = 'move';
    };

    onMount(() => {
        if (data.new) {
            layoverElement.show(
                nodeElement.getBoundingClientRect().left,
                nodeElement.getBoundingClientRect().top + 60
            ) 
        }
    });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="gear-outer"
    bind:this={nodeElement}
    on:mouseenter={() => onHover = true}
    on:mouseleave={() => onHover = false}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="gear"
        on:click={() => (layoverElement ? layoverElement.nodeClick() : '')}
        on:dragstart={onDragStart}
        draggable={true}>
        <div class="gear-inner">
        </div>
    </div>
    <p>{data.nodeNo}</p>
    <ElementLayover
        bind:this={layoverElement}
        nodeOnHover={onHover}
        params={data.data}
        possibleParams={possibleParams.gear} />
    <DragAndDropHandle elementName={data.data.name} />
</div>
<style>
    .gear {
        height: 60px;
        width: 20px;
        margin: 10px auto;
        border-radius: 1.6px;
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
        transition: .3s;
        cursor: pointer;
    }
    .gear:hover {
        filter: brightness(1.05);
    }
    .gear-inner {
        width: 100%;
        height: 100%;
        background: linear-gradient( to bottom, rgba(0, 0, 0, 0.07), rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.07));
    }
    p {
        font-size: 6.4px;
        color: rgba(0, 0, 0, 0.6);
        text-align: center;
        font-family: "Roboto Mono", monospace;
        margin:  2px 0 0 0;
    }
</style>