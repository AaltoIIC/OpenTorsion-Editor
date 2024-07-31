<script>
    import Button from "$lib/Button.svelte";
    import ComponentListItem from "$lib/sidebar/CompontentListItem.svelte";
    import { basicComponents } from "../editor/basicComponents";
    import { allComponents } from "$lib/stores";
</script>

<div class="component-cont">
    <div class="component-upper">
        <h3>Components:</h3>
        <a href="/component-editor">
            <Button
                isActive={true}
                lightMode={true}>
                New Component
                <svg class="icon-create" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>                             
            </Button>
        </a>
    </div>
    <div class="component-list">
        {#each [ ...$allComponents].reverse() as component}
            <ComponentListItem name={component.name} isUnique={true} />
        {/each}
        {#each basicComponents as component}
            <ComponentListItem src={component.icon} name={component.name} isUnique={false} />
        {/each}
    </div>
</div>
<style>
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
    }
    .icon-create {
        width: 18px;
        height: 18px;
        margin: 0 0 -4.7px 0;
        stroke: rgba(255, 255, 255, 0.9);
        stroke-width: 2px;
        stroke-linejoin: round;
    }
    .component-list {
        width: 100%;
        height: calc(100vh - 150px);
        overflow-y: scroll;
        border-top: solid 2px rgba(0, 0, 0, 0.1);
    }
    ::-webkit-scrollbar {
        width: 8px;
    }
    ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.05);
        border: solid 1px rgba(0, 0, 0, 0.05);
    }

    ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.1);
        cursor: pointer;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.15);
    }
</style>