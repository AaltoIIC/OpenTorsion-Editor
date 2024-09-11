<script lang="ts">
    import { goto } from "$app/navigation";
    import Sidebar from "$lib/sidebar/Sidebar.svelte";
    import { onMount } from "svelte";
    import { currentSystemJSON, systems } from "$lib/stores/stores";
    import type { SystemType } from "$lib/types/types";
    import System3dModel from "$lib/System3dModel.svelte";
    import Button from "$lib/Button.svelte";
    import { formatDate } from "$lib/utils";

    // load the system data from the store
    export let data;
    if ($systems.get(data.systemId)) {
        currentSystemJSON.set({
            id: data.systemId,
            json: $systems.get(data.systemId) as SystemType
        })
    } else {
        onMount(() => {
            goto("/");
        });
    }


    let plots: Record<string, string> = {};
    const plotStyles = `
        text {
            font-family: 'Roboto Mono', monospace !important;
        }
    `

    const callCampbell = () => {
        let url = "http://127.0.0.1:5000/analysis";
        let data = $currentSystemJSON.json;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
        .then(data => {
            plots = data as {} as Record<string, string>;
        })
    }

    onMount(() => {
        callCampbell();
    });

</script>
<Sidebar>
    <div class="illustration-cont">
        <System3dModel
            data={$currentSystemJSON.json}
            size={320}
        />
    </div>
    <h2>{$currentSystemJSON.json.name}</h2>
    <p>{formatDate($currentSystemJSON.json.date)}</p>
    <a href="/system-editor">Go back</a>
    <Button color="var(--main-dark-color)">
        Download Analysis Results
        <svg class="icon-down" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
        </svg>          
    </Button>
</Sidebar>
<main>
    <div class="tiles-cont">
        {#each Object.entries(plots) as [plot, value]}
            <div class="tile main-response">
                <iframe title={plot}
                        srcdoc={value}
                        style="width: 100%; height: 100%; border: none;">  
                </iframe>
            </div>
        {/each}
    </div>
</main>
<style>
    .icon-down {
        width: 16px;
        height: 16px;
        margin: 0 -2px -4px 0;
    }
    .illustration-cont {
        width: 320px;
        height: 320px;
        margin: 20px;
    }
    main {
        width: calc(100vw - 360px);
        height: fit-content;
        min-height: 100vh;
        position: absolute;
        top: 0;
        left: 360px;
        background: var(--main-grey-color);
    }
    .tiles-cont {
        padding: 20px;
        margin: 0 auto;
    }
    .tile {
        background: white;
        border-radius: var(--main-border-radius);
        width: 648px;
        height: 500px;
        overflow: hidden;
        margin: 0 auto;
        padding: 0 0 42px 42px;
    }

</style>