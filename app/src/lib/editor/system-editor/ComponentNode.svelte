<script lang="ts">
    import { Handle, Position, type NodeProps } from '@xyflow/svelte';
    import type { Writable } from 'svelte/store';
    
    // NodeProps used by Svelte Flow
    export let id, selected, selectable, deletable, sourcePosition, targetPosition, zIndex, dragging, draggable, dragHandle, parentId, type, isConnectable, positionAbsoluteX, positionAbsoluteY, width, height;


    export let data: { img: string; label: string };
   
    const { img, label } = data;
</script>
    <div class="main-component-node">
        <div class="img-cont">
            <img src={`./components/${img}`} alt={label} />
        </div>
        <p>{label}</p>
    </div>
<div class="handle-wrapper left">
    <Handle type="target" position={Position.Left} />
</div>
<div class="handle-wrapper right">
    <Handle type="source" position={Position.Right} />
</div>

<style>
    .handle-wrapper {
        position: absolute;
        top: 50%;
    }
    .handle-wrapper.right {
        position: absolute;
        top: 50%;
        right: 1px;
    }
    .main-component-node {
        z-index: -1;
    }
    .main-component-node img {
        width: 100px;
        height: 100px;
        padding: 4px;
        background-color: rgba(255, 255, 255, 0.6);
        border: 1px solid rgba(0, 0, 0, 0.15);
        backdrop-filter: blur(8px) brightness(0.8);
    }
    .main-component-node p {
        margin: 0 4px 4px 4px;
        padding: 0;
        font-family: 'Roboto Mono', monospace;
        font-size: 8px;
        font-weight: 550;
        position: absolute;
        color: rgba(0, 0, 0, 0.9);
    }
</style>