<script lang="ts">
    import NewSystemTile from "$lib/dashboard/NewSystemTile.svelte";
    import ImportSystemTile from "$lib/dashboard/ImportSystemTile.svelte";
    import SystemTile from "$lib/dashboard/SystemTile.svelte";
    import { systems } from "$lib/stores/stores";
    import { notification } from "$lib/stores/stores";
    import { importSystem } from "$lib/utils";
    import Header from "$lib/Header.svelte";

    setTimeout(() => {
        notification.set(null);
    }, 1000);

    let fileInput: HTMLInputElement;
</script>
<svelte:head>
    <title>Dashboard | OpenTorsion Editor</title>
</svelte:head>
<div class="screen">
    <Header />
    <div class="main-page-content">
        <div class="info-cont">

        </div>
        <div class="systems-outer">
            <div class="title-cont">
                <h2>Your Systems:</h2>
                <div class="controls">
                    <a data-sveltekit-preload-data="hover" href="/system-editor">
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>                      
                        </button>
                    </a>
                    <button on:click={() => fileInput.click()}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>                                       
                    </button>
                    <input type="file" style:display="none"
                        name="DDT-file"
                        bind:this={fileInput}
                        on:change={importSystem}
                        accept=".json"/>
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
    <footer>
        <p>OpenTorsion Editor</p>
        <p>2024, Aalto IIC</p>
    </footer>
</div>
<style>
    footer {
        height: 68px;
        width: 100%;
        background-color: var(--main-dark-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        box-sizing: border-box;
    }
    footer p {
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
    }
    .screen {
        background-color: white;
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
        border: var(--main-border);
    }
    .controls button {
        background-color: var(--main-dark-color);
        border: none;
        border-radius: 40px;
        width: 34.5px;
        height: 34.5px;
        color: rgba(255, 255, 255, 0.9);
        cursor: pointer;
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
    .systems-outer {
        width: 100%;
        margin: 0 auto;
    }
    .ddt-cont {
        display: flex;
        justify-content: start;
        flex-wrap: wrap;
        height: fit-content;
        padding: 10px 0;
    }
</style>
