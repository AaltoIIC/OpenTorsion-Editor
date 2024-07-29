<script lang="ts">
    import {
      SvelteFlowProvider
    } from '@xyflow/svelte';
    import ComponentEditor from "$lib/editor/component-editor/ComponentEditor.svelte";
    import Sidebar from "$lib/editor/Sidebar.svelte";
    import { JSONEditor } from 'svelte-jsoneditor';
    import { currentJSON, allComponents, notification } from '../../lib/stores';
    import { goto } from '$app/navigation';
    import Notification from '$lib/Notification.svelte';

    let componentEditor: any;

    // Initialize JSON Content
    currentJSON.set({
        name: "Untitled Component",
        elements: []
    });

    // JSON editor content
    let content = {
        text: undefined,
        json: {}
    }
    // make sure the JSON editor is updated when the JSON content changes
    currentJSON.subscribe(value => {
        content = {
            text: undefined,
            json: value
        };
    });
    // make sure the JSON content is updated when the JSON editor changes
    $: {
        if (content.json) {
            currentJSON.set(content.json);
        }
    }

    const handleTitleChange = (event: Event) => {
        const illegalChars = /['"\n]/g;
        if (illegalChars.test((event.target as HTMLElement).innerText)) {
            (event.target as HTMLElement).innerText = (event.target as HTMLElement).innerText.replace(illegalChars, '');
        }

        currentJSON.update(value => {
            return {
                ...value,
                name: (event.target as HTMLElement).innerText
            }
        });
    }

    const saveComponent = () => {
        allComponents.update(value => {
            return [
                ...value,
                content.json
            ]
        });

        notification.set({
            message: "Component saved succesfully.",
            type: "success",
            duration: 3000
        });
        goto('/new');
    }


    
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
            <SvelteFlowProvider>
                <ComponentEditor bind:this={componentEditor} />
            </SvelteFlowProvider>
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
    </div>
    <div class="top-menu">
        <div class="links">
            <a href="/new">
                <svg class="icon-back" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>              
                Back to System Editor
            </a>
        </div>
        <div class="component-name-cont">
            Component:
            <span
            class="input"
            role="textbox" 
            bind:innerText={$currentJSON.name}
            on:input={handleTitleChange}
            contenteditable>Untitled Component</span>
        </div>
        <div class="buttons">
            <button class="save-btn" on:click={saveComponent}>
                <svg class="icon-save" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>                  
                <span>Save Component</span>
            </button>
        </div>
    </div>
    <Sidebar mode="component-editor" onAddElement={(value) => {componentEditor ? componentEditor.addElement(value) : ''}} />
</div>
<Notification />

<style>
    .save-btn {
        padding: 0;
        display: flex;
    }
    .save-btn span {
        color: rgba(255, 255, 255, 0.9);
        padding: 9px 10px 9px 12px;
        font-weight: 500;
    }
    .icon-save {
        width: 18px;
        height: 18px;
        stroke: rgba(255, 255, 255, 0.9);
        stroke-width: 2px;
        stroke-linejoin: round;
        padding: 8px 6px 13px 8px;
        border-right: solid 1px rgba(0, 0, 0, 0.1);
        margin: 0 -2px -5px 0;
    }

    /* Resizing JSON editor */
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

    /* component name field */
    .component-name-cont {
        color: rgba(255, 255, 255, 0.9);
        display: inline-block;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        height: fit-content;
        margin-left: -82px;
    }
    .component-name-cont .input {
        line-height: 1;
        padding: 8px;
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: 5px;
        border: solid 2px rgba(255, 255, 255, 0.1);
        color:rgba(255, 255, 255, 0.9);
        font-family: 'Inter', sans-serif;
        width: fit-content;
        font-weight: 600;
        margin-left: 8px;
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

    button {
        color: rgba(255, 255, 255, 0.9);
        background-color: var(--main-color);
        padding: 10px 12px;
        font-weight: 550;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 50px;
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
    .top-menu .buttons, .top-menu .links, .top-menu .component-name-cont {
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