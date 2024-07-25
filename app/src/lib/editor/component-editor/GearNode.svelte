<script lang="ts">
    import {type NodeProps } from '@xyflow/svelte';
    import type { Writable } from 'svelte/store';
    import ElementLayover from './ElementLayover.svelte';
   
    type $$Props = NodeProps;
   
    let layoverElement: any;
    export let data: {
        name: Writable<string>,
        damping: Writable<number>,
        excitation: Writable<number>,
        inertia: Writable<number>,
        diameter: Writable<number>,
        teeth: Writable<number>
    };
   
    let onHover = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="disk-outer"
    on:mouseenter={() => onHover = true}
    on:mouseleave={() => onHover = false}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="gear"
        on:click={() => (layoverElement ? layoverElement.nodeClick() : '')}>
        <div class="gear-inner">
        </div>
    </div>
    <p>Gear</p>
    <ElementLayover
        bind:this={layoverElement}
        nodeOnHover={onHover}
        params={data} />
</div>
<style>
    .gear {
        height: 300px;
        width: 100px;
        margin: 100px auto;
        border-radius: 8px;
        border: solid 6px rgba(0, 0, 0, 0.04);
        box-shadow: rgba(149, 157, 165, 0.2) 0px 40px 120px, ;
        background-color: var(--main-color);
        background-image: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.1) 0%,
            rgba(0, 0, 0, 0.1) 7%,
            transparent 7%,
            transparent 14%
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
        font-size: 32px;
        color: rgba(0, 0, 0, 0.6);
        text-align: center;
        font-family: 'Inter', sans-serif;
    }
</style>