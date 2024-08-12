<script lang="ts">
    import { onMount, type SvelteComponent } from 'svelte';
    import {
      SvelteFlowProvider
    } from '@xyflow/svelte';
    import ComponentEditor from "$lib/editor/component-editor/ComponentEditor.svelte";
    import Sidebar from "$lib/sidebar/Sidebar.svelte";
    import ElementsList from '$lib/sidebar/ElementsList.svelte';
    import JSONEditor from "$lib/editor/JSONEditor.svelte";
    import { currentComponentJSON, customComponents, notification, highlightLinesInEditor } from '../../lib/stores';
    import { goto } from '$app/navigation';
    import Notification from '$lib/Notification.svelte';
    import Button from '$lib/Button.svelte';
    import NameField from '$lib/NameField.svelte';
    import {
        nameComponentDesign,
        handleJSONEditing,
        handleNameChange
    } from '$lib/editor/component-editor/componentHelpers';

    let componentEditor: any;
    let isNameError = false;
    let isError = false;
    let componentName = nameComponentDesign($customComponents);
    let JSONEditorComponent: SvelteComponent;
    onMount(() => {
        highlightLinesInEditor.set(JSONEditorComponent.highlightLines)
        isError = !handleJSONEditing(JSONEditorText)
    });

    // Initialize JSON Content
    currentComponentJSON.set({
        name: componentName,
        elements: []
    });
 
    let JSONEditorText = '';
    currentComponentJSON.subscribe((value) => {
        notification.set(null);
        JSONEditorText = JSON.stringify(value, null, 2);
        isError = false;
        isNameError = false;
        console.log(value.name);
        componentName = value.name;
    });

    const saveComponent = () => {
        customComponents.update(value => {
            return [
                ...value,
                $currentComponentJSON
            ]
        });

        notification.set({
            message: "Component saved succesfully.",
            type: "success",
            duration: 3000
        });
        goto('/system-editor');
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
            <JSONEditor
                bind:this={JSONEditorComponent}
                bind:textContent={JSONEditorText}
                onInput={(text) => {isError = !handleJSONEditing(text)}} />
        </div>
    </div>
    <div class="top-menu">
        <div class="links">
            <a href="/system-editor" on:click={() => {notification.set(null)}}>
                <svg class="icon-back" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>              
                Back to System Editor
            </a>
        </div>
        <NameField text="Component"
                isError={isNameError} 
                bind:value={componentName}
                onInput={text => {isNameError = !handleNameChange(text)}} />
        <div class="buttons">
            <Button
                onClick={saveComponent}
                isActive={!isError}
                icon={'<svg class="icon-save" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>'}>
                Save Component
            </Button>
        </div>
    </div>
    <Sidebar>
        <ElementsList />
    </Sidebar>
</div>
<Notification />

<style>
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


    .main-editor-area {
        position: absolute;
        top: 68px;
        left: 360px;
        width: calc(100vw - 360px);
        height: calc(100vh - 68px);
        overflow: hidden;
        background-color: rgb(255, 255, 255);
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