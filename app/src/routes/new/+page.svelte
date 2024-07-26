<script lang="ts">
    import FlowEditor from "$lib/editor/FlowEditor.svelte";
    import Sidebar from "$lib/editor/Sidebar.svelte";
    import { JSONEditor } from 'svelte-jsoneditor'

    let content = {
        text: undefined, // can be used to pass a stringified JSON document instead
        json: {
            hello: "world"
        }
    }

    // resize editor
    let editorElement: HTMLElement;
    let jsonEditorHeight = 200;
    let jsonEditorHeightPx = "";
    $: jsonEditorHeightPx = `${jsonEditorHeight}px`;
    $: flowEditorHeight = `calc(100% - ${jsonEditorHeight}px)`;
    
    let isResizing = false;
    const resizeEditor = (event: MouseEvent) => {
        const parentRect = editorElement.getBoundingClientRect();
        jsonEditorHeight = parentRect.bottom - event.clientY + 8;
    }


</script>
<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
    <title>Create New | Co-Des Interface</title>
</svelte:head>
<div class="main-screen">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="main-editor-area"
        on:mouseup={() => {isResizing = false;}}
        on:mousemove={(event) => {
            if (isResizing) {
                resizeEditor(event);
            }
        }}
        style="--json-editor-height: {jsonEditorHeightPx}; --flow-editor-height: {flowEditorHeight};">
        <div class="flow-editor">
            <FlowEditor />
        </div>
        <div class="json-editor"
            bind:this={editorElement}>
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="resize-slider"
                on:mousedown={() => {isResizing = true;}}>
            </div>
            <JSONEditor bind:content
            mainMenuBar={false}
            navigationBar={false} />
        </div>
        <button class="analyze-button">
            Analyze DDT
            <svg class="icon-analyze" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>              
        </button>
    </div>
    <div class="top-menu">
        <div class="links">
            <a href="/">
                <svg class="icon-back" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>              
                Back
            </a>
            <a href="/analyze">
                Analysis
            </a>
        </div>
        <div class="buttons">
            <button>
                Export
                <svg class="icon-dropdown" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>              
            </button>
            <button>
                Save
            </button>
        </div>
    </div>
    <Sidebar mode="main-editor" />
</div>

<style>
    .resize-slider {
        width: 100%;
        height: 6px;
        background-color: rgba(0, 0, 0, 0.1);
        border: none !important;
        border-radius: 0;
        border-top: solid 1px rgb(215,215,215) !important;
        cursor: n-resize;
    }
    .flow-editor {
        height: var(--flow-editor-height);
    }
    .json-editor {
        height: var(--json-editor-height);
    }
    .icon-analyze {
        width: 22px;
        height: 22px;
        margin: 0 0 -5px 0;
        fill: none;
        stroke: rgba(255, 255, 255, 0.9);;
        stroke-width: 2.4px;
        stroke-linejoin: round;
    }
    .analyze-button {
        position: fixed;
        bottom: 32px;
        right: 32px;
        z-index: 10;
        font-size: 16px;
        border: solid 2px rgba(255, 255, 255, 0.3);
        background-color: var(--main-color);
        box-shadow: rgba(149, 157, 165, 0.15) 0px 8px 24px;
        padding: 9px 12px 10px 12px;
        font-weight: 500;
        font-family: "Roboto Mono", monospace;
    }
    .analyze-button:hover {
        border: solid 2px rgba(255, 255, 255, 0.6);
    }
    .main-editor-area {
        position: absolute;
        top: 68px;
        left: 360px;
        width: calc(100vw - 360px);
        height: calc(100vh - 68px);
        overflow: hidden;
        background-color: rgb(255, 255, 255);
    }

    .icon-dropdown {
        width: 15px;
        height: 15px;
        margin: 0 0 -3px 0;
        fill: none;
        stroke: rgba(255, 255, 255, 0.9);;
        stroke-width: 2px;
        stroke-linejoin: round;
    }
    button {
        color: rgba(255, 255, 255, 0.9);
        background-color: var(--main-color);
        padding: 8px;
        font-weight: 500;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 5px;
        cursor: pointer;
        transition: .2s;
    }
    button:hover {
        border: 1px solid rgba(255, 255, 255, 0.4);
    }
    .icon-back {
        width: 20px;
        height: 20px;
        margin: 0 -2px -5px 0;
    }
    .top-menu a {
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
        font-weight: 400;
        text-decoration: none;
        display: inline-block;
        margin: 0 16px;
    }
    .top-menu {
        position: absolute;
        top: 0;
        left: 360px;
        height: 68px;
        width: calc(100vw - 360px);
        background-color: rgb(34,34,34);
        display: flex;
        justify-content: space-between;
        vertical-align: middle;
    }
    .top-menu .buttons, .top-menu .links {
        height: fit-content;
        align-self: center;
    }
    .top-menu .buttons {
        margin-right: 16px;
    }


    .main-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    }
</style>