<script lang="ts">
    import type { ComponentType } from "$lib/types/types";
    import DropdownButton from "$lib/DropdownButton.svelte";
    import ComponentListItem from "$lib/sidebar/CompontentListItem.svelte";
    import { customComponents, currentSystemJSON } from "$lib/stores/stores";
    import { importComponent } from "$lib/utils";
    import { goto } from "$app/navigation";
    import { twinBaseUrl } from "../../config";
    import { fetchComponents } from "$lib/utils";

    const toComponentType = (json: any) => json as ComponentType;
    let componentInput: HTMLInputElement;

    let shownComponents =  Array.from($customComponents.entries())
                                .filter(([key, val]) => key.startsWith(`${$currentSystemJSON.id}-`))
                                .reverse() as [string, ComponentType][]
    customComponents.subscribe(value => {
        shownComponents = Array.from(value.entries())
            .filter(([key, val]) => key.startsWith(`${$currentSystemJSON.id}-`))
            .reverse() as [string, ComponentType][]
    })

    const handleNewComponent = (option: string) => {
        if (option === 'Create New') {
            goto('/component-editor')
        } else if (option === 'Import New') {
            componentInput.click()
        }
    }

    let digitalTwins: any[];
    fetchComponents(twinBaseUrl).then((components) => {
        digitalTwins = components;
    })
</script>

<div class="component-cont">
    <div class="component-upper">
        <h3>Components:</h3>
            <DropdownButton
                isActive={true}
                lightMode={true}
                icon='<svg class="icon-create" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>'
                options={['Create New','Import New']}
                optionIcons={[
                    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>',
                    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>'
                ]}
                onClick={handleNewComponent}>
                New Component
            </DropdownButton>
            <input type="file" class="hidden"
                name="component-file"
                bind:this={componentInput}
                on:change={importComponent}
                accept=".json">
    </div>
    <div class="component-list">
        {#each shownComponents as [id, component] (id)}
            <ComponentListItem type="custom" id={id} data={component} />
        {/each}
        {#if digitalTwins}
            {#each digitalTwins as {id, component}}
                <ComponentListItem type="twin" id={id} data={component} />
            {/each}
        {:else}
            <div>Loading...</div>
        {/if}
    </div>
</div>
<style>
    .hidden {
        display: none;
    }
    .component-upper h3 {
        font-size: 16px;
    }
    .component-upper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 5px;
        vertical-align: middle;
        margin-top: 25px;
        z-index: 10;
        position: relative;
    }
    .component-list {
        width: 360px;
        height: calc(100vh - 162px);
        overflow-y: scroll;
        background: white;
        border-top: var(--main-border);
    }
    ::-webkit-scrollbar {
        width: 6px;
    }

    ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        cursor: pointer;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.15);
    }
</style>