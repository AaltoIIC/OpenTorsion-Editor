<script lang="ts">
    import { Handle, Position, useEdges, useNodes } from '@xyflow/svelte';
    import { currentSystemJSON } from '$lib/stores';

    // NodeProps used by Svelte Flow
    $$restProps

    export let data: { img: string; label: string };
    export let id: string;

    const { img, label } = data;
    let hover = false;

    const nodes = useNodes();
    const edges = useEdges();
    const remove = () => {
        // torolje ki magat nodesbol, edgesbol, jsonbol
        nodes.update((nds) => nds.filter((node) => node.id !== id));
        edges.update((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
        currentSystemJSON.update((json) => {
            const newJson = { ...json };
            newJson.components = newJson.components.filter((component) => component.name !== id);
            newJson.structure = newJson.structure.filter(
                (connection) => !connection.some(elem => elem.startsWith(id))
            );
            return newJson;
        });
    };

</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="main-component-node {hover ? "hover" : ""}"
    on:mouseenter={() => {hover = true}}
    on:mouseleave={() => {hover = false}}>
        <div class="img-cont">
            <img src={`./components/${img}`} alt={label} />
        </div>
        <p>{label}</p>
        <button class="remove-button"
            on:click={remove}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>              
        </button>
    </div>
<div class="handle-wrapper left">
    <Handle type="target" position={Position.Left} isConnectable={false} />
</div>
<div class="handle-wrapper right">
    <Handle type="source" position={Position.Right} isConnectable={false} />
</div>

<style>
    .remove-button svg {
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-52%, -55%);
        width: 10px;
        height: 10px;
        margin: 0 0 0 0;
        stroke-width: 2px;
        stroke-linejoin: round;

    }
    .remove-button {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 20px;
        height: 20px;
        border: 1px solid rgba(255, 255, 255, 0.4);
        background-color: rgb(30, 30, 30);
        color: rgba(255, 255, 255, 0.9);
        cursor: pointer;
        border-radius: 50%;
        line-height: 1;
        transition: .2s;
        opacity: 0;
    }
    .hover .remove-button {
        opacity: 1;
    }
    .remove-button:hover {
        border: 1px solid rgba(255, 255, 255, 0.8);
    }
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
        position: relative;
    }
    .main-component-node img {
        width: 100px;
        height: 100px;
        padding: 4px;
        background-color: rgba(255, 255, 255, 0.6);
        border: 1px solid rgba(0, 0, 0, 0.15);
        backdrop-filter: blur(8px) brightness(0.8);
    }
    .hover img {
        background-color: rgba(255, 255, 255, 0.5);
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