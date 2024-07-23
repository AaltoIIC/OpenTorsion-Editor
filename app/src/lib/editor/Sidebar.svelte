<script>
    import ComponentListItem from "$lib/editor/CompontentListItem.svelte";
    import { basicComponents } from "./basicComponents";
</script>

<div class="main-sidebar">
    <a data-sveltekit-preload-data="hover" href="/">
        <img class="main-logo" src="./logo.svg" alt="Co-Des logo">
    </a>
    <div class="component-cont">
        <div class="component-upper">
            <h3>Components:</h3>
            <button>
                Create Component
                <svg class="icon-create" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>                  
            </button>
        </div>
        <div class="component-list">
            {#each basicComponents as component}
                <ComponentListItem src={component.icon} name={component.name} isUnique={false} />
            {/each}
        </div>
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
        margin: 0 0 -4px 0;
    }
    .component-list {
        width: 100%;
        height: 60vh;
        border-top: solid 2px rgba(0, 0, 0, 0.1);
    }
    .main-logo {
        width: 114px;
        height: auto;
        margin: 12px 18px;
        display: block;
    }
    .main-sidebar {
        position: absolute;
        top: 0;
        left: 0;
        height: 100vh;
        width: 360px;
        border-right: solid 2px rgb(229, 229, 229);
    }
    button {
        color: rgba(255, 255, 255, 0.9);
        background-color: var(--main-color);
        padding: 8px;
        font-weight: 500;
        border: 1px solid rgba(255, 255, 255, 0.4);
        border-radius: 5px;
        cursor: pointer;
        transition: .2s;
    }
    button:hover {
        border: 1px solid rgba(255, 255, 255, 0.8);
    }
</style>