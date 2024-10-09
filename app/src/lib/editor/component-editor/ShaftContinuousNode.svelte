<script lang="ts">
    import ElementLayover from './element-layover/ElementLayover.svelte';
    import type { ElementType } from '$lib/types/types';
    import { possibleParams } from './componentHelpers';
    import DragAndDropHandle from './DragAndDropHandle.svelte';
    import { eventBus } from '$lib/stores/eventBus';
   
    $$restProps

    export let data: {
        nodeNo: string;
        data: ElementType;
    };

    let nodeElement: any;
    let layoverElement: any;
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

    eventBus.listen('newElementPopup', (name: string) => {
        if (name === data.data.name && layoverElement) {
            layoverElement.show(
                nodeElement.getBoundingClientRect().left,
                nodeElement.getBoundingClientRect().top + 60
            )
        }
    });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="shaft-outer"
    bind:this={nodeElement}
    on:mouseenter={() => onHover = true}
    on:mouseleave={() => onHover = false}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="shaft"
        on:click={() => (layoverElement ? layoverElement.nodeClick() : '')}
        on:dragstart={onDragStart}
        draggable={true}></div>
    <p>{data.nodeNo}</p>
    <ElementLayover
        bind:this={layoverElement}
        nodeOnHover={onHover}
        params={data.data}
        possibleParams={possibleParams.ShaftContinuous} />
    <DragAndDropHandle elementName={data.data.name} />
</div>
<style>
    .shaft {
        height: 14px;
        width: 72px;
        background-color: var(--main-color-dark);
        background-image:
            linear-gradient( to bottom, rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.15), rgba(0, 0, 0, 0)),
            linear-gradient(
                90deg,
                rgba(0, 0, 0, 0.05) 0%,
                rgba(0, 0, 0, 0) 10%,
                rgba(0, 0, 0, 0) 90%,
                rgba(0, 0, 0, 0.05) 100%
            )
            ;
        margin: 33px auto;
        border-top: solid 1px rgba(0, 0, 0, 0.04);
        border-bottom: solid 1px rgba(0, 0, 0, 0.04);
        box-shadow: rgba(149, 157, 165, 0.2) 0px 1.6px 4.8px;
        z-index: -1;
        transition: .3s;
        cursor: pointer;
    }
    .shaft:hover {
        filter: brightness(1.05);
    }
    p {
        font-size: 6.4px;
        color: rgba(0, 0, 0, 0.6);
        text-align: center;
        font-family: "Roboto Mono", monospace;
        margin:  2px 0 0 0;
    }
</style>