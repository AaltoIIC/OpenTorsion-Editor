<script lang="ts">
    import { type NodeProps } from '@xyflow/svelte';
    import type { Writable } from 'svelte/store';
    import ElementLayover from './ElementLayover.svelte';
   
    type $$Props = NodeProps;
   
    export let data: { color: Writable<string> };
   
    const { color } = data;

    let onHover = false;
</script>

<div class="disk-outer">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="disk"
        on:mouseenter={() => onHover = true}
        on:mouseleave={() => onHover = false}></div>
    <p>Disk</p>
</div>
<ElementLayover isOpen={onHover} />
<style>
    .disk {
        height: 400px;
        width: 100px;
        background-color: var(--main-color);
        background-image: linear-gradient( to bottom, rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0));
        margin: 50px auto;
        border-radius: 8px;
        border: solid 6px rgba(0, 0, 0, 0.04);
        box-shadow: rgba(149, 157, 165, 0.2) 0px 40px 120px;
        transition: .3s;
        cursor: pointer;
    }
    .disk:hover {
        filter: brightness(1.05);
    }
    p {
        font-size: 32px;
        color: rgba(0, 0, 0, 0.6);
        text-align: center;
        font-family: 'Inter', sans-serif;
    }
</style>