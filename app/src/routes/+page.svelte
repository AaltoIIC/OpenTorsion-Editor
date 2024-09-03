<script lang="ts">
    import NewSystemTile from "$lib/dashboard/NewSystemTile.svelte";
    import ImportSystemTile from "$lib/dashboard/ImportSystemTile.svelte";
    import SystemTile from "$lib/dashboard/SystemTile.svelte";
    import { systems } from "$lib/stores/stores";

</script>
<svelte:head>
    <title>Dashboard | Co-Des Interface</title>
</svelte:head>
<div class="screen">
    <div class="main-header">
        <img class="main-logo" src="./logo.svg" alt="Co-Des logo">
    </div>
    <div class="main-page-area">
        <h2>Your Systems:</h2>
        <div class="ddt-cont">
            {#each Array.from($systems.entries()).reverse() as [id, system]}
                <SystemTile id={id} system={system} />
            {/each}
            <NewSystemTile />
            <ImportSystemTile />
        </div>
    </div>
</div>
<style>
    .main-header {
        border-radius: var(--main-border-radius);
        background: rgb(30, 30, 30);
        position: fixed;
        top:10px;
        left: calc(50vw - 500px);
        width: 1000px;
        height: 68px;
    }
    .screen {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgb(245, 245, 245);
    }
    .main-logo {
        filter: invert();
        width: 114px;
        height: auto;
        margin: 24px 18px;
        display: block;
    }
    .main-page-area {
        width: 975px;
        margin: 120px auto;
    }
    .ddt-cont {
        display: flex;
        justify-content: start;
        flex-wrap: wrap;
        height: calc(100vh - 200px);
        overflow-x: hidden;
        overflow-y: scroll;
        mask-image: linear-gradient(0deg, rgba(0,0,0,0) 0%,
            rgba(0,0,0,1) 4%,
            rgba(0,0,0,1) 96%,
            rgba(0,0,0,0) 100%);
        padding: 10px 0;
    }
    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.1);
        cursor: pointer;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.15);
    }

</style>
