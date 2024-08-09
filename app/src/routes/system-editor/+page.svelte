<script lang="ts">
    import {
      SvelteFlowProvider
    } from '@xyflow/svelte';
    import SystemEditor from "$lib/editor/system-editor/SystemEditor.svelte";
    import Sidebar from "$lib/sidebar/Sidebar.svelte";
    import ComponentsList from "$lib/sidebar/ComponentsList.svelte";
    import JSONEditor from "$lib/editor/JSONEditor.svelte";
    import Notification from "$lib/Notification.svelte";
    import Button from "$lib/Button.svelte";
    import DropdownButton from '$lib/DropdownButton.svelte';
    import NameField from "$lib/NameField.svelte";
    import { currentSystemJSON } from '$lib/stores';
    import type { SystemType } from '$lib/types/types';
    import { handleJSONEditing } from '$lib/editor/system-editor/systemHelpers';

    let systemName = "New System";

    currentSystemJSON.set({
        name: systemName,
        date: new Date().toISOString(),
        components: [],
        structure: []
    } as SystemType);
    
    let JSONEditorText = '';
    currentSystemJSON.subscribe((value) => {
        JSONEditorText = JSON.stringify(value, null, 2);
        systemName = value.name;
    });

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

    const exportJSON = () => {
        const jsonString = JSON.stringify($currentSystemJSON, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = $currentSystemJSON.name + '.json';
        document.body.appendChild(a);
        a.click();

        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    const handleNameChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        currentSystemJSON.update((json) => {
            json.name = target.value;
            return json;
        });
        systemName = target.value;
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
                <SystemEditor />
            </SvelteFlowProvider>
        </div>
        <div class="json-editor"
            bind:this={editorElement}>
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="resize-slider"
                on:mousedown={() => {isResizing = true;}}>
            </div>
            <JSONEditor bind:textContent={JSONEditorText} onInput={handleJSONEditing} />
        </div>
        <a href="/analysis">
            <button class="analyze-button">
                Analyze DDT
                <svg class="icon-analyze" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>              
            </button>
        </a>
    </div>
    <div class="top-menu">
        <div class="links">
            <a href="/">
                <svg class="icon-back" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>              
                Back
            </a>
            <a href="/analysis">
                Analysis
            </a>
        </div>
        <NameField text="System" value={systemName} onInput={handleNameChange} />
        <div class="buttons">
            <DropdownButton
                isActive={true}
                onClick={exportJSON}
                icon={'<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>'}
                options={["Download JSON"]}
                optionIcons={['<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>',
                ]}>
                Export
            </DropdownButton>
            <Button
                isActive={true}
                icon={'<svg class="icon-save" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>'}>
                Save
            </Button>
        </div>
    </div>
    <Sidebar>
        <ComponentsList />
    </Sidebar>
</div>
<Notification />

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
        stroke-width: 2px;
        stroke-linejoin: round;
    }
    .analyze-button {
        position: fixed;
        bottom: 32px;
        right: 32px;
        z-index: 10;
        font-size: 14px;
        border: solid 2px rgba(255, 255, 255, 0.3);
        background-color: var(--main-color);
        box-shadow: rgba(149, 157, 165, 0.15) 0px 8px 24px;
        padding: 8px 14px 11px 16px;
        font-family: 'Inter', sans-serif;
        font-weight: 550;
        border-radius: 50px;
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