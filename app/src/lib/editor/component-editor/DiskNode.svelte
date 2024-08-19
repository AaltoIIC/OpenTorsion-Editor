<script lang="ts">
    import ElementLayover from './element-layover/ElementLayover.svelte';
    import type { ElementType } from '$lib/types/types';
    import { possibleParams } from './componentHelpers';
    import DragAndDropHandle from './DragAndDropHandle.svelte';
    
    $$restProps
    
    export let data: {
        nodeNo: string;
        data: ElementType;
    };

    let layoverElement: any;
    let onHover = false;

    const onDragStart = (event: DragEvent) => {
        if (!event.dataTransfer) {
        return null;
        }

        let message = {event: 'addExisting', element: data.data.name};
        event.dataTransfer.setData('application/svelteflow', JSON.stringify(message));
        event.dataTransfer.effectAllowed = 'move';
    };

</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="disk-outer"
    on:mouseenter={() => onHover = true}
    on:mouseleave={() => onHover = false}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="disk"
        on:click={() => (layoverElement ? layoverElement.nodeClick() : '')}
        on:dragstart={onDragStart}
        draggable={true}></div>
    <p>{data.nodeNo}</p>
    <ElementLayover
        bind:this={layoverElement}
        nodeOnHover={onHover}
        params={data.data}
        possibleParams={possibleParams.disk} />
    <DragAndDropHandle elementName={data.data.name} />
</div>
<style>
    .disk {
        height: 80px;
        width: 20px;
        background-color: var(--main-color);
        background-image: linear-gradient( to bottom, rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0));
        margin: 0;
        border-radius: 1.6px;
        border: solid 1px rgba(0, 0, 0, 0.04);
        box-shadow: rgba(149, 157, 165, 0.2) 0px 1.6px 4.8px;
        transition: .3s;
        cursor: pointer;
        z-index: -1;
    }
    .disk:hover {
        filter: brightness(1.05);
    }
    p {
        font-size: 6.4px;
        color: rgba(0, 0, 0, 0.6);
        text-align: center;
        font-family: "Roboto Mono", monospace;
        margin: 1px 0 0 0;
    }
    .disk-outer {
        position: relative;
    }
</style>