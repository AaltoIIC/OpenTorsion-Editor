<script lang="ts">
    import { type NodeProps } from '@xyflow/svelte';
    import ElementLayover from './ElementLayover.svelte';
   
    type $$Props = NodeProps;
   
    export let data: { label: string };

    let layoverElement: any;
    let onHover = false;


    export let params = {
        name: "Disk",
        damping: 0.5,
        excitation: 3432
    };

</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="disk-outer"
    on:mouseenter={() => onHover = true}
    on:mouseleave={() => onHover = false}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="disk"
        on:click={() => (layoverElement ? layoverElement.nodeClick() : '')}></div>
    <p>Disk</p>
    <ElementLayover
        bind:this={layoverElement}
        nodeOnHover={onHover}
        params={params} />
</div>
<style>
    .disk {
        height: 400px;
        width: 100px;
        background-color: var(--main-color);
        background-image: linear-gradient( to bottom, rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0));
        margin: 50px 0 0 0;
        border-radius: 8px;
        border: solid 6px rgba(0, 0, 0, 0.04);
        box-shadow: rgba(149, 157, 165, 0.2) 0px 40px 120px;
        transition: .3s;
        cursor: pointer;
        z-index: -1;
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
    .disk-outer {
        position: relative;
    }
</style>