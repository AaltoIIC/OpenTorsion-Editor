<script lang="ts">
    import {type NodeProps } from '@xyflow/svelte';
    import type { Writable } from 'svelte/store';
   
    type $$Props = NodeProps;
   
    export let data: { color: Writable<string> };
   
    const { color } = data;
</script>

<div class="disk-outer">
    <div class="gear">
        <div class="gear-inner">
        </div>
    </div>
    <p>Gear</p>
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