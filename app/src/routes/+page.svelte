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
    <img class="main-logo" src="./logo.svg" alt="Co-Des logo">
    <div class="main-page-area">
        <h2>Your Digital Design Templates:</h2>
        <div class="ddt-cont">
            {#each Object.entries($systems) as [id, system]}
                <SystemTile id={id} system={system} />
            {/each}
            <NewSystemTile />
            <ImportSystemTile />
        </div>
    </div>
</div>
<style>
    .screen {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgb(245, 245, 245);
    }
    .main-logo {
        position: absolute;
        top: 0;
        left: 0;
        width: 114px;
        height: auto;
        margin: 24px 18px;
        display: block;
    }
    .main-page-area {
        width: 1000px;
        margin: 120px auto;
    }
    .ddt-cont {
        display: flex;
        justify-content: start;
        flex-wrap: wrap;
        height: calc(100vh - 168px);
        overflow-x: hidden;
        overflow-y: scroll;
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
