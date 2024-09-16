<script lang="ts">
    import { currentSystemJSON, highlightLinesInEditor } from '$lib/stores/stores';
    import type { ComponentType } from '$lib/types/types';
    import { nthLinesInJSON, trimText } from '$lib/utils';
    import { findComponentOutputs } from '$lib/editor/component-editor/componentHelpers';
    import TooltipHandle from './TooltipHandle.svelte';
    import { onMount } from 'svelte';
    import Component3dModel from '../../../Component3dModel.svelte';
    import { useSvelteFlow, type Node} from '@xyflow/svelte';

    // NodeProps used by Svelte Flow
    $$restProps

    export let data: ComponentType;
    export let parentId;
    export let id: string;

    let hover = false;
    let isSelected = false;

    let highlightedElement: string | null = null;


    const remove = () => {
        currentSystemJSON.update((json) => {
            const newJson = { ...json };
            newJson.json.components = newJson.json.components.filter((component) => component.name !== id);
            newJson.json.structure = newJson.json.structure.filter(
                (connection) => !connection.some(elem => elem.startsWith(id))
            );
            return newJson;
        });
    };

    const handleSelect = () => {
        isSelected = true;

        // Highlight lines in JSON editor corresponding to this component
        if (highlightLinesInEditor) {
            let [startIndex, endIndex] = nthLinesInJSON($currentSystemJSON.json, 'components', 'name', id);
            $highlightLinesInEditor(startIndex, endIndex);
        }
    }

    const handleClickOut = () => {
        if (!hover) {
            isSelected = false;
            $highlightLinesInEditor(-1, -1);
        }
    }

    // handle dragging
    let isMouseDown = false;
    const { getNode, updateNode, getZoom } = useSvelteFlow();
    let parentNode: Node | undefined;
    $: parentNode = getNode(parentId);
    let lastX = -1;
    let lastY = -1;
    const resetDrag = () => {
        lastX = -1;
        lastY = -1;
    }

    const handleDrag = (e: PointerEvent) => {
        if (lastX !== -1 && parentNode) {
            const diffX = (e.clientX - lastX)/getZoom();
            const diffY = (e.clientY - lastY)/getZoom();

            updateNode(parentId,
                { position: {
                    x: parentNode.position.x + diffX,
                    y: parentNode.position.y + diffY
                }
            });
        }

        lastX = e.clientX;
        lastY = e.clientY;
    }

    onMount(() => {
        document.addEventListener('pointerdown',handleClickOut)
        window.addEventListener('wheel', () => {
            resetDrag();
        })
        window.addEventListener('pointerup', () => {
            isMouseDown = false;
            resetDrag();
        })
        window.addEventListener('pointermove', (e) => {
            if (isMouseDown) {
                handleDrag(e);
            }
        })

    })
</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="main-component-node {hover ? "hover" : ""} {isSelected ? "selected" : ""}"
    on:mouseenter={() => hover = true}
    on:mouseleave={() => hover = false}
    on:pointerdown={() => isMouseDown = true}
    on:click={handleSelect}>
        <div class="img-cont">
            <Component3dModel
                data={data}
                hoverable={isSelected}
                highlightedElement={highlightedElement} />
        </div>
        <p>{trimText(data.name, 20)}</p>
        <button class="remove-button"
            on:click={remove}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>              
        </button>
    </div>
<div class="handle-wrapper left">
    <TooltipHandle 
            type="input"
            componentName={data.name}
            elementName={data.elements[0].name}
            on:mouseenter={() => highlightedElement = data.elements[0].name}
            on:mouseleave={() => highlightedElement = null}
    />
</div>
<div class="handle-wrapper right">
    {#each findComponentOutputs(data.elements) as output}
        <TooltipHandle
            type="output"
            componentName={data.name}
            elementName={output}
            on:mouseenter={() => highlightedElement = output}
            on:mouseleave={() => highlightedElement = null}
        />
    {/each}
</div>

<style>
    .remove-button svg {
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 20px;
        margin: 0 0 0 0;
        stroke-width: 2px;
        stroke-linejoin: round;

    }
    .remove-button {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 40px;
        height: 40px;
        border: 2px solid rgba(255, 255, 255, 0.4);
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
        border: 2px solid rgba(255, 255, 255, 0.8);
    }
    .handle-wrapper {
        position: absolute;
        top: 0;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        flex-direction: column-reverse;
    }
    .handle-wrapper.right {
        right: 2px;
    }
    .main-component-node {
        z-index: -1;
        position: relative;
        cursor: pointer;
    }
    .main-component-node.selected {
        cursor: ew-resize;
    }
    .main-component-node .img-cont {
        width: 200px;
        height: 200px;
        background-color: rgba(255, 255, 255, 0.6);
        border: 3px solid rgba(0, 0, 0, 0.075);
        backdrop-filter: blur(8px) brightness(0.9);
        border-radius: var(--main-border-radius);
        overflow: hidden;
    }
    .hover .img-cont {
        background-color: rgba(255, 255, 255, 0.5);
    }
    .selected  .img-cont {
        background-image: linear-gradient(var(--main-color-tr-2), var(--main-color-tr-2));
        background-blend-mode: overlay;
        outline: 4px solid var(--main-color);
    }
    .main-component-node p {
        margin: 4px 8px 0 8px;
        padding: 0;
        font-family: 'Roboto Mono', monospace;
        font-size: 16px;
        font-weight: 550;
        position: absolute;
        color: rgba(0, 0, 0, 0.9);
    }
</style>