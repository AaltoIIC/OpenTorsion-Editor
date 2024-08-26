<script lang="ts">
    import { onMount, type SvelteComponent } from 'svelte';
    import {
      SvelteFlowProvider
    } from '@xyflow/svelte';
    import type { ComponentType, SystemType } from '$lib/types/types';
    import ComponentEditor from "$lib/editor/component-editor/ComponentEditor.svelte";
    import Sidebar from "$lib/sidebar/Sidebar.svelte";
    import ElementsList from '$lib/sidebar/ElementsList.svelte';
    import JSONEditor from "$lib/editor/JSONEditor.svelte";
    import DialogBox from '$lib/DialogBox.svelte';
    import {
        currentSystemJSON,
        setCurrentSystem,
        currentComponentJSON,
        customComponents,
        createComponent,
        saveCurrentComponent,
        notification,
        resetCurrentComponent,
        highlightLinesInEditor,
        createSystem,
    } from '$lib/stores/stores.js';
    import { goto } from '$app/navigation';
    import Button from '$lib/Button.svelte';
    import DropdownButton from '$lib/DropdownButton.svelte';
    import { exportJSON } from '$lib/utils';
    import NameField from '$lib/NameField.svelte';
    import {
        handleJSONEditing,
        handleNameChange
    } from '$lib/editor/component-editor/componentHelpers';
    

    let componentEditor: any;
    let isNameError = false;
    let isError = false;
    let componentName: string;
    let JSONEditorComponent: SvelteComponent;
    onMount(() => {
        highlightLinesInEditor.set(JSONEditorComponent.highlightLines)
        isError = !handleJSONEditing(JSONEditorText, originalName);
    });

    export let data;
    let originalName: string;
    let isNewComponent = true;
    let dialogBox: SvelteComponent;

    // initialize the current component JSON
    // if url contained a component id, set the current component JSON to that component
    const newComponent = () => {
        let newComponent: ComponentType;
        [data.componentId, newComponent] = createComponent();
        originalName = newComponent.name;
        currentComponentJSON.set({
            id: data.componentId,
            json: newComponent
        });
    }

    if (data.componentId) {
        if (Object.keys($customComponents).includes(data.componentId)) {
            isNewComponent = false;
            // load the system corresponding to the component
            setCurrentSystem(data.componentId.split('-')[0]);

            // if component has unsaved changes in currentComponentJSON, don't load saved version
            if ($currentComponentJSON.id !== data.componentId) {
                originalName = $customComponents[data.componentId].name;
                currentComponentJSON.set({
                    id: data.componentId,
                    json: $customComponents[data.componentId]
                });
            } else {
                originalName = $currentComponentJSON.json.name;
            }
        } else {
            // component with name in url does not exist
            onMount(() => {
                goto('/');
            });
        }
    } else {
        // if current system is not set, ask user whether to create a new system
        if (!$currentSystemJSON.id) {
            currentComponentJSON.set({
                        id: '-1',
                        json: {
                            name: 'New Component',
                            elements: []
                        }
            });
            onMount(() => {
                dialogBox.openDialog("Do you want to create a new system to store your component?",
                "Yes","Choose an existing system").then((value: boolean) => {
                    if (value) {
                        // create a new system
                        let newSystem: SystemType, systemId: string;
                        [systemId, newSystem] = createSystem();
                        currentSystemJSON.set({id: systemId, json: newSystem});
                        newComponent();
                        window.history.replaceState({}, '', `/component-editor/${data.componentId}`);
                    } else {
                        goto('/');
                    }
                });
            });
        } else {
            newComponent();
            onMount(() => {
                window.history.replaceState({}, '', `/component-editor/${data.componentId}`);
            });
        }
    }

    // sync the JSON editor text with the current component JSON
    let JSONEditorText = '';
    currentComponentJSON.subscribe((value) => {
        notification.set(null);
        JSONEditorText = JSON.stringify(value.json, null, 2);
        isError = false;
        isNameError = false;
        componentName = value.json.name;
    });

    // handle pressing the save button
    const handleSave = () => {
        saveCurrentComponent();
        notification.set({
            message: "Component saved succesfully.",
            type: "success",
            duration: 3000
        });
        goto(`/system-editor/${$currentSystemJSON.id}`);
    }

    // handle pressing the back button
    const handleBack = () => {
        if ($currentComponentJSON.json.elements.length === 0) {
            resetCurrentComponent();
            notification.set(null);
            goto(`/system-editor/${$currentSystemJSON.id}`);
        } else {
            dialogBox.openDialog("You have unsaved changes. Do you want to discard them?",
                "Discard changes","Cancel").then((value: boolean) => {
                    if (value) {
                        resetCurrentComponent();
                        notification.set(null);
                        goto(`/system-editor/${$currentSystemJSON.id}`);
                    }
                });
        }
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
                onInput={(text) => {isError = !handleJSONEditing(text, originalName)}} />
        </div>
    </div>
    <div class="top-menu">
        <div class="links">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <span on:click={handleBack}>
                <svg class="icon-back" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>              
                Back to System Editor
            </span>
        </div>
        <NameField text="Component"
                isError={isNameError} 
                bind:value={componentName}
                onInput={text => {isNameError = !handleNameChange(text, originalName)}} />
        <div class="buttons">
            <DropdownButton
                isActive={!isError}
                onClick={() => exportJSON($currentComponentJSON)}
                icon={'<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>'}
                options={["Download JSON"]}
                optionIcons={['<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>',
                ]}>
                Export
            </DropdownButton>
            <Button
                onClick={handleSave}
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
<DialogBox bind:this={dialogBox} />
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
    .top-menu span {
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
        font-weight: 400;
        text-decoration: none;
        display: inline-block;
        margin: 0 16px;
        cursor: pointer;
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