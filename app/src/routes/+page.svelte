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
    <div class="main-page-content">
        <div class="info-cont">

        </div>
        <div class="systems-outer">
            <div class="title-cont">
                <h2>Your Systems:</h2>
                <div class="controls">
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>                      
                    </button>
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>                                       
                    </button>
                </div>
            </div>
            <div class="ddt-cont">
                {#each Array.from($systems.entries()).reverse() as [id, system] (id)}
                    <SystemTile id={id} system={system} />
                {/each}
                <NewSystemTile />
                <ImportSystemTile />
            </div>
        </div>
    </div>
</div>
<style>
    .screen {
        background-color: rgb(245, 245, 245);
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        overflow-y: scroll;
    }
    .main-page-content {
        margin: 108px auto;
        width: 975px;
    }
    .info-cont {
        background-color: white;
        border-radius: var(--main-border-radius);
        width: 100%;
        height: 300px;
        margin: 26px 0;
    }
    .controls button {
        background-color: var(--main-dark-color);
        border: none;
        border-radius: 40px;
        width: 34.5px;
        height: 34.5px;
        color: rgba(255, 255, 255, 0.9);
    }
    .controls button svg {
        width: 18px;
        height: 18px;
        margin: 0 0 -3.5px -0.5px;

    }
    .title-cont {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .title-cont h2 {
        font-size: 18px;
    }
    .main-header {
        border-radius: var(--main-border-radius);
        background: white;
        position: fixed;
        top:10px;
        left: calc(50vw - 550px);
        width: 1100px;
        height: 68px;
        box-shadow: var(--main-shadow);
    }
    .main-logo {
        width: 114px;
        height: auto;
        margin: 24px 18px;
        display: block;
    }
    .systems-outer {
        width: 100%;
        margin: 0 auto;
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
