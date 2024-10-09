
<script lang="ts">
    import { goto } from "$app/navigation";
    import Sidebar from "$lib/sidebar/Sidebar.svelte";
    import { onMount, type SvelteComponent } from "svelte";
    import {
        currentSystemJSON,
        getSystem,
        createSystem,
        systems,
        customComponents
    } from "$lib/stores/stores";
    import type { SystemType, ComponentType } from "$lib/types/types";
    import System3dModel from "$lib/System3dModel.svelte";
    import Button from "$lib/Button.svelte";
    import PdfTemplate from "$lib/analysis/PdfTemplate.svelte";
    import { formatDate, trimText } from "$lib/utils";
    
    // load the system or component data from the store
    export let data;
    let isComponent = false;
    if (data.id.includes('-') && $customComponents.has(data.id)) {
        // create temporary system with the component
        isComponent = true;
        const [id, tempSys] = createSystem();
        tempSys.name = $customComponents.get(data.id)?.name || "Component";
        tempSys.components = [$customComponents.get(data.id) as ComponentType];

        currentSystemJSON.set({
            id: id,
            json: tempSys
        })
    } else if (data.id && $systems.has(data.id)) {
        // load the system from the store
        currentSystemJSON.set({
            id: data.id,
            json: getSystem(data.id) as SystemType
        })
    } else {
        // redirect home if the system or component is not found
        onMount(() => {
            goto("/");
        });
    }

    let isError = false;
    type Plot = {
        name: string;
        html: string;
        iframe?: HTMLIFrameElement;
    };
    let plots: Plot[] | undefined;


    let pdfComponent: SvelteComponent;
    let pdfReady = false;
    let pdfText = "Download Analysis Results";
    const downloadAnalysisResults = () => {
        pdfText = "Downloading...";
        pdfComponent.downloadPdf().then(() => {
            pdfText = "Download Analysis Results";
        });
    }

    const runAnalysis = () => {
        isError = false;
        let url = "/api/analysis";
        let data = $currentSystemJSON.json;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
        .then(data => {
            plots = data as Plot[];
        }).catch((error) => {
            isError = true;
        });
    }

    onMount(() => {
        runAnalysis();
    })
</script>
<svelte:head>
    <title>Analysis | OpenTorsion Editor</title>
</svelte:head>
<main>
    <div class="tiles-cont">
        {#if plots}
            {#each plots as { name, html, iframe }}
                <div class="tile main-response" id={name.replaceAll(' ', '')}>
                    <p>{name}</p>
                    <iframe title={name}
                            srcdoc={html}
                            style="width: 100%; height: 100%; border: none;"
                            bind:this={iframe}>  
                    </iframe>
                </div>
            {/each}
        {:else if isError}
            <div class="error-cont">
                <img src="./../error.png" alt="Error illustration">
                <div class="error-desc">
                    <p>There was an error while fetching the analysis results.</p>
                    <Button
                        icon='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>'
                        onClick={runAnalysis}
                        color="var(--main-error-color-dark)"
                        >
                        Retry
                    </Button>
                </div>
            </div>
        {:else}
            <div class="tile loading">
            </div>
            <div class="tile loading">
            </div>
        {/if}
    </div>
</main>
<div class="main-top-bar">
    <div class="links">
        {#if isComponent}
            <a href={`/component-editor/${data.id}`}>
                <svg class="icon-back" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Back to Component Editor
            </a>
        {:else}
            <a href={`/system-editor/${$currentSystemJSON.id}`}>
                <svg class="icon-back" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Back to System Editor
            </a>
        {/if}
    </div>
    <h4>Analysis of {(
        isComponent ?
            trimText($currentSystemJSON.json.components[0].name, 20)
            : 
            trimText($currentSystemJSON.json.name, 20)
        )}</h4>
    <Button
        icon='<svg class="icon-down" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" /></svg>'
        onClick={downloadAnalysisResults}
        isActive={plots !== undefined && !isError && pdfReady}>
        {pdfText}     
    </Button>
</div>
<Sidebar>
    <div class="system-info">
        <System3dModel
            data={$currentSystemJSON.json}
            size={240}
        />
        {#if isComponent}
            <h2>{trimText($currentSystemJSON.json.components[0].name, 20)}</h2>
            <p>Analyzed at {formatDate($currentSystemJSON.json.date)}</p>
            <p>{$currentSystemJSON.json.components.reduce(
                (prevSum, currentComp) => (prevSum + currentComp.elements.length),
                0)}
                elements
            </p>
        {:else}
            <h2>{trimText($currentSystemJSON.json.name, 20)}</h2>
            <p>Created at {formatDate($currentSystemJSON.json.date)}</p>
            <p>{$currentSystemJSON.json.components.reduce(
                (prevSum, currentComp) => (prevSum + currentComp.elements.length),
                0)}
                elements
            </p>
            <p>{$currentSystemJSON.json.components.length} components</p>
        {/if}
    </div>
    <h4 class="plots-header">Analysis Plots:</h4>
    <ul class="main-menu">
        {#if plots}
            {#each plots as {name}}
                <li>
                    <a href={`#${name.replaceAll(' ', '')}`}>{name}</a>
                </li>
            {/each}
        {:else if !isError}
            <li class="loading"></li>
        {/if}
    </ul>
</Sidebar>
<PdfTemplate
    data={$currentSystemJSON.json}
    plots={plots}
    bind:this={pdfComponent}
    bind:ready={pdfReady} />
<style>
    .error-cont {
        background: white;
        border-radius: var(--main-border-radius);
        padding: 30px;
        width: max-content;
        text-align: center;
        margin: 50vh auto 0 auto;
        transform: translateY(-100%);
        display: flex;
        align-items: center;
    }
    .error-desc {
        width: 300px;
        padding: 20px;
        margin-left: 20px;
        border-left: solid 2px var(--main-dark-color);
        padding-left: 20px;
    }   
    .error-cont img {
        width: 200px;
        height: fit-content;
    }
    .error-cont p {
        font-size: 14px;
        margin: 0 0 8px 0;
    }
    li.loading {
        width: 100%;
        height: 100px;
        border-radius: var(--main-border-radius);
    }
    .loading {
        animation-name: placeHolderShimmer;
        animation-duration: 1s;
        animation-iteration-count: infinite;
    }
    .plots-header {
        margin: 32px 40px 0 40px;
        font-size: 16px;
        font-weight: 550;
    }
    .main-menu {
        padding: 0 54px;
    }
    .main-menu li {
        margin: 6px;
        font-size: 16px;
        cursor: pointer;
        list-style-type: none;
    }
    .main-menu li a {
        color: rgba(0, 0, 0, 0.6);
        text-decoration: none;
    }
    .system-info {
        width: 280px;
        padding: 0 20px 20px 20px;
        box-sizing: border-box;
        margin: 40px 40px 0 40px;
        font-size: 14px;
        border-radius: var(--main-border-radius);
        border: var(--main-border);
    }
    .system-info h2, .system-info p {
        margin: 0;
    }
    .system-info h2 {
        font-size: 18px;
    }
    .links {
        height: fit-content;
        align-self: center;
    }
    .links a {
        cursor: pointer;
        color: rgba(255, 255, 255, 0.9);
        text-decoration: none;
    }
    .icon-back {
        width: 20px;
        height: 20px;
        margin: 0 -2px -5px 0;
    }
    .main-top-bar h4 {
        color: rgba(255, 255, 255, 0.9);
        font-weight: 550;
    }
    .main-top-bar {
        width: calc(100vw - 360px);
        height: 68px;
        background: var(--main-dark-color);
        position: fixed;
        top: 0;
        left: 360px;
        z-index: 100;
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
        font-weight: 400;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
        box-sizing: border-box;
    }
    main {
        width: calc(100vw - 360px);
        height: calc(100vh - 68px);
        position: absolute;
        left: 360px;
        bottom: 0;
        overflow-y: scroll;
        background: var(--main-grey-color);
    }
    .tiles-cont {
        padding: 20px;
        margin: 0 auto;
    }
    .tile {
        background: white;
        border-radius: var(--main-border-radius);
        border: var(--main-border);
        width: 648px;
        height: 500px;
        overflow: hidden;
        margin: 26px auto;
        padding: 22px 0 42px 42px;
        position: relative;
    }
    .tile p {
        position: absolute;
        top: 8px;
        left: 50%;
        font-size: 16px;
        font-weight: 550;
        color: rgba(0, 0, 0, 0.9);
        transform: translateX(-50%);
    }
</style>