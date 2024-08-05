<script lang="ts">
    import { type NodeProps } from '@xyflow/svelte';
    import type { Writable } from 'svelte/store';
   
    type $$Props = NodeProps;
    $$restProps
</script>

<div class="node-cont">
    <h1>Component is Empty</h1>
    <p>Add Elements from Sidebar.</p>
</div>
<style>
    .disk {
        height: 400px;
        width: 100px;
        background:linear-gradient( to bottom, #dee0ed, #eee, #dee0ed);
        margin: 50px auto;
        border-radius: 10px;
        border: solid 10px rgba(0, 0, 0, 0.04);
        box-shadow: rgba(149, 157, 165, 0.2) 0px 40px 120px;
    }
    h1 {
        font-size: 18px;
        color: rgba(0, 0, 0, 0.6);
        text-align: center;
        font-family: 'Inter', sans-serif;
    }
    p {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
        text-align: center;
        font-family: 'Inter', sans-serif;
    }
</style>