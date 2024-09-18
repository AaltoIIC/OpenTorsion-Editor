<script lang="ts">
    import { onMount, type SvelteComponent } from 'svelte';
    import { SvelteFlowProvider } from '@xyflow/svelte';
    import SystemEditor from "$lib/editor/system-editor/SystemEditor.svelte";
    import Sidebar from "$lib/sidebar/Sidebar.svelte";
    import ComponentsList from "$lib/sidebar/ComponentsList.svelte";
    import JSONEditor from "$lib/editor/JSONEditor.svelte";
    import Button from "$lib/Button.svelte";
    import DropdownButton from '$lib/DropdownButton.svelte';
    import NameField from "$lib/NameField.svelte";
    import DialogBox from '$lib/DialogBox.svelte';
    import TopBar from '$lib/TopBar.svelte';
    import {
        notification,
        currentSystemJSON,
        highlightLinesInEditor,
        systems,
        removeSystem,
        saveSystem,
        createSystem,

        getSystem

    } from '$lib/stores/stores';
    import {
        handleJSONEditing,
        handleSystemNameChange,
        checkIfOTCompatible
     } from '$lib/editor/system-editor/systemHelpers';
    import { importSystem, exportJSON } from "$lib/utils";
    import type { SystemType } from '$lib/types/types';
    import { goto } from '$app/navigation';
    import _ from 'lodash';

    let fileInput: HTMLInputElement;
    let JSONEditorComponent: SvelteComponent;
    onMount(() => {
        highlightLinesInEditor.set(JSONEditorComponent.highlightLines)
    });

    // handle invalid JSON
    let isJSONError = false,
        isNameError = false,
        isStructureError = false;
    $: if (!(isJSONError || isNameError || isStructureError)) notification.set(null);

    // initialize editor
    let isNewSystem = true;
    let systemName: string;
    export let data;
    if (data.systemId) {
        if ($systems.get(data.systemId)) {
            isNewSystem = false;
            // if system has unsaved changes in currentSystemJSON, don't load saved version
            if ($currentSystemJSON.id !== data.systemId) {
                currentSystemJSON.set({
                    id: data.systemId,
                    json: getSystem(data.systemId) as SystemType
                });
            } else {
                currentSystemJSON.set($currentSystemJSON);
            }
        } else {
            // if system does not exist, redirect to home
            onMount(() => {
                goto('/');
            });
        }

    } else {
        let newSystem: SystemType;
        [data.systemId, newSystem] = createSystem();
        systemName = newSystem.name;
        currentSystemJSON.set({id: data.systemId, json: newSystem});
        onMount(() => {
            goto(`/system-editor/${data.systemId}`, {replaceState: true});
        });
    }
    
    let JSONEditorText = '';
    currentSystemJSON.subscribe((value) => {
        JSONEditorText = JSON.stringify(value.json, null, 2);
        systemName = value.json.name;
        isStructureError = !checkIfOTCompatible();
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

    let dialogBox: DialogBox;
    const handleBack = () => {
        if ($currentSystemJSON.json.components.length === 0 ||
            _.isEqual($currentSystemJSON.json, getSystem($currentSystemJSON.id))) {
            goto('/');
            return;
        } else {
            dialogBox.openDialog(`You have unsaved changes. Do you want to save ${systemName}?`,
                "Yes", "No").then((result: Boolean) => {
                if (result) {
                    handleSave();
                } else {
                    goto('/');
                    return;
                }
            });
        }
    }

    const handleSave = () => {
        saveSystem($currentSystemJSON.id, $currentSystemJSON.json);

        notification.set({
            message: "System saved successfully!",
            type: "success",
            duration: 3000
        });

        goto('/');
    }

</script>
<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
    <title>System Editor | Co-Des Interface</title>
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
            <JSONEditor
                bind:this={JSONEditorComponent}
                bind:textContent={JSONEditorText}
                onInput={(text) => {isJSONError = !handleJSONEditing(text, $currentSystemJSON.id)}} />
        </div>
        <div class="analyze-btn-cont">
            <Button
                lightMode={true}
                isActive={!(isJSONError || isNameError || isStructureError)}
                onClick={() => {goto(`/analysis/${$currentSystemJSON.id}`)}}>
                Analyze System
                <svg class="icon-analyze" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>              
            </Button>
        </div>
    </div>
    <TopBar>
        <svelte:fragment slot="links">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <span on:click={handleBack} class="link-element">
                <svg class="icon-back" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>              
                Back
            </span>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <span on:click={() => fileInput.click()} class="link-element">
                Import
            </span>
            <input type="file" class="hidden"
                name="file"
                bind:this={fileInput}
                on:change={(e) => importSystem(e, false)}
                accept=".json">
            <a href={!(isJSONError || isNameError || isStructureError) ? `/analysis/${$currentSystemJSON.id}` : ''}
                class="link-element">
                Analysis
            </a>
        </svelte:fragment>
        <svelte:fragment slot="name">
            <NameField
                text="System"
                value={systemName}
                isError={isNameError}
                onInput={(text) => isNameError = !handleSystemNameChange(text, $currentSystemJSON.id)}
            />
        </svelte:fragment>
        <svelte:fragment slot="buttons">
            <DropdownButton
                isActive={!(isJSONError || isNameError || isStructureError)}
                onClick={() => exportJSON($currentSystemJSON.json)}
                icon={'<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>'}
                options={["Download JSON"]}
                optionIcons={['<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>',
                ]}>
                Export
            </DropdownButton>
            <Button
                isActive={!(isJSONError || isNameError || isStructureError)}
                icon={'<svg class="icon-save" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>'}
                onClick={handleSave}>
                Save
            </Button>
        </svelte:fragment>
    </TopBar>
    <Sidebar>
        <ComponentsList />
    </Sidebar>
</div>
<DialogBox bind:this={dialogBox} />
<style>
    .analyze-btn-cont {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10;
    }
    .icon-analyze {
        width: 16px;
        height: 16px;
        margin: 0 0 -2.5px 0;
        fill: none;
        stroke: rgba(255, 255, 255, 0.9);;
        stroke-width: 2px;
        stroke-linejoin: round;
    }
    .hidden {
        display: none;
    }
    .resize-slider {
        width: 100%;
        height: 8px;
        background: rgb(240, 240, 240);
        border: none !important;
        border-radius: 0;
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
    .link-element {
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
        font-weight: 400;
        text-decoration: none;
        display: inline-block;
        cursor: pointer;
    }
    .main-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    }
</style>