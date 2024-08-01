<script lang="ts">
    import {type NodeProps } from '@xyflow/svelte';
    import ElementLayover from './element-layover/ElementLayover.svelte';
    import type { ElementType } from '$lib/types/types';
   
    // NodeProps used by Svelte Flow
    export let id, selected, selectable, deletable, sourcePosition, targetPosition, zIndex, dragging, draggable, dragHandle, parentId, type, isConnectable, positionAbsoluteX, positionAbsoluteY, width, height;
   
    export let data: ElementType;

    let layoverElement: any;
    let onHover = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="shaft-outer"
    on:mouseenter={() => onHover = true}
    on:mouseleave={() => onHover = false}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="shaft"
        on:click={() => (layoverElement ? layoverElement.nodeClick() : '')}></div>
    <p>Shaft</p>
    <ElementLayover
        bind:this={layoverElement}
        nodeOnHover={onHover}
        params={data}
        possibleParams={['name', 'type', 'damping', 'excitation', 'stiffness']} />
</div>
<style>
    .shaft {
        height: 14px;
        width: 72px;
        background-color: var(--main-color);
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
        margin: 42px auto;
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
    }
</style>