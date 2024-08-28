<script lang="ts">
    import { Handle, Position, } from '@xyflow/svelte';
    import { createEventDispatcher } from 'svelte';

    export let type: 'input' | 'output';
    export let elementName: string;
    export let componentName: string;

    const dispatch = createEventDispatcher();
    let hover = false;
</script>
<div class="handle-outer"
    style={`transform: translate(${type === 'input' ? '-' : ''}50%, 0);`}>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="handle-inner"
        on:mouseenter={() => {hover = true; dispatch('mouseenter')}}
        on:mouseleave={() => {hover = false; dispatch('mouseleave')}}>
        <Handle
            type={type === 'input' ? 'target' : 'source'}
            id={`${componentName}.${elementName}`}
            position={type === 'input' ? Position.Left : Position.Right}
            style="position: relative; top: 0; left: 0; transform: none;"
            />
    </div>
    <div class="tooltip {hover ? "hover" : ""}">
        {elementName}
    </div>
</div>
<style>
    .handle-outer {
        position: relative;
    }
    .tooltip {
        position: absolute;
        top: 29px;
        visibility: hidden;
        opacity: 0;
        transition: .2s;
        padding: 6px 10px;
        background-color: var(--main-color-dark);
        border-radius: 50px;
        color: rgba(255, 255, 255, 0.9);
        width: max-content;
        font-size: 14px;
        font-family: 'Roboto Mono', monospace;
        transform: translate(calc(-50% + 11px), 0);
        z-index: 99;
    }
    .tooltip::after {
        content: " ";
        position: absolute;
        bottom: 100%;
        left: 50%;
        z-index: 100;
        margin-left: -7px;
        border-width: 7px;
        border-style: solid;
        border-color: transparent transparent var(--main-color-dark) transparent;
    }
    .tooltip.hover {
        visibility: visible;
        opacity: 1;
    }
    .handle-inner {
        padding: 2px;
    }
</style>