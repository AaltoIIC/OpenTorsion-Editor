<script lang="ts">
    import { type NodeProps } from '@xyflow/svelte';
    import type { Writable } from 'svelte/store';
   
    type $$Props = NodeProps;
    $$restProps
</script>

<div class="node-cont">
    <h1>System is Empty</h1>
    <p>Drag and Drop Components from Sidebar.</p>
</div>
<style>
    h1 {
        font-size: 40px;
        color: rgba(0, 0, 0, 0.4);
        text-align: center;
        font-family: 'Inter', sans-serif;
        font-weight: 400;
        margin: 12px;
    }
    p {
        font-size: 20px;
        color: rgba(0, 0, 0, 0.4);
        text-align: center;
        font-family: 'Inter', sans-serif;
        margin: 0;
    }
    .node-cont {
        cursor: auto;
    }
</style>