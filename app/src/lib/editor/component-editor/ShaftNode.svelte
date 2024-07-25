<script lang="ts">
    import {type NodeProps } from '@xyflow/svelte';
    import type { Writable } from 'svelte/store';
   
    type $$Props = NodeProps;
   
    export let data: { color: Writable<string> };
   
    const { color } = data;
</script>

<div class="disk-outer">
    <div class="shaft"></div>
    <p>Shaft</p>
</div>
<style>
    .shaft {
        height: 70px;
        width: 360px;
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
        margin: 205px auto;
        border-top: solid 6px rgba(0, 0, 0, 0.04);
        border-bottom: solid 6px rgba(0, 0, 0, 0.04);
        box-shadow: rgba(149, 157, 165, 0.2) 0px 40px 120px;
        z-index: -1;
        transition: .3s;
        cursor: pointer;
    }
    .shaft:hover {
        filter: brightness(1.05);
    }
    p {
        font-size: 32px;
        color: rgba(0, 0, 0, 0.6);
        text-align: center;
        font-family: 'Inter', sans-serif;
    }
</style>