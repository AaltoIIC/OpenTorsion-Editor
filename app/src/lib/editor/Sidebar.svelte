<script lang="ts">
    import ComponentListItem from "$lib/editor/CompontentListItem.svelte";
    import { basicComponents } from "./basicComponents";

    export let mode = "main-editor";
    export let onAddElement = (type: String) => {};
</script>

<div class="main-sidebar">
    <a data-sveltekit-preload-data="hover" href="/">
        <img class="main-logo" src="./logo.svg" alt="Co-Des logo">
    </a>
    {#if mode === "main-editor"}
    <div class="component-cont">
        <div class="component-upper">
            <h3>Components:</h3>
            <a href="/component-editor">
                <button>
                    Create Component
                    <svg class="icon-create" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>                  
                </button>
            </a>
        </div>
        <div class="component-list">
            {#each basicComponents as component}
                <ComponentListItem src={component.icon} name={component.name} isUnique={false} />
            {/each}
        </div>
    </div>
    {:else if mode === "component-editor"}
    <div class="element-cont">
        <div class="element-upper">
            <h3>Elements:</h3>
        </div>
        <div class="element-list">
            <div class="element-list-item">
                <div class="main-illustration-cont">
                    <div class="disk">
                    </div>
                </div>
                <div class="element-info">
                    <div>
                        <h4>Disk</h4>
                        <p>Parameters: name, damping, excitation, inertia</p>
                    </div>
                    <div>
                        <button on:click={() => onAddElement("disk")}>Add to Component
                            <svg class="icon-add-to-component" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>                                           
                        </button>
                    </div>
                </div>
            </div>
            <div class="element-list-item">
                <div class="main-illustration-cont">
                    <div class="shaft">
                    </div>
                </div>
                <div class="element-info">
                    <div>
                        <h4>Shaft</h4>
                        <p>Parameters: name, damping, excitation, stiffness</p>
                    </div>
                    <div>
                        <button on:click={() => onAddElement("shaft")}>Add to Component
                            <svg class="icon-add-to-component" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>              
                        </button>
                    </div>
                </div>
            </div>
            <div class="element-list-item">
                <div class="main-illustration-cont">
                    <div class="gear">
                        <div class="gear-inner">
                        </div>
                    </div>
                </div>
                <div class="element-info">
                    <div>
                        <h4>Gear</h4>
                        <p>Parameters: name, damping, excitation, inertia, diameter, teeth</p>
                    </div>
                    <div>
                        <button on:click={() => onAddElement("gear")}>Add to Component
                            <svg class="icon-add-to-component" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>                 
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    {/if}
</div>
<style>
    .icon-add-to-component {
        width: 16px;
        height: 16px;
        margin: 0 0 -3px 0;
        fill: none;
        stroke: rgba(255, 255, 255, 0.9);;
        stroke-width: 1.8px;
        stroke-linejoin: round;
    }
    .element-info h4 {
        margin: 0;
    }
    .element-info p {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
        margin: 0;
    }
    .element-info button {
        background-color: rgb(34, 34, 34);
    }
    .disk {
        height: 80px;
        width: 20px;
        background-color: var(--main-color);
        background-image:linear-gradient( to bottom, rgba(0,0,0,0.1), rgba(255,255,255,0.1), rgba(0,0,0,0.1));
        margin: 10px auto;
        border-radius: 2px;
        border: solid 2px rgba(0, 0, 0, 0.04);
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    }
    .shaft {
        height: 14px;
        width: 72px;
        background-color: var(--main-color);
        background-image:linear-gradient( to bottom, rgba(0,0,0,0.05), rgba(255,255,255,0.05), rgba(0,0,0,0.05));
        margin: 41px auto;
        border-radius: 2px;
        border: solid 2px rgba(0, 0, 0, 0.04);
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    }
    .gear {
        height: 60px;
        width: 20px;
        margin: 20px auto;
        border-radius: 2px;
        border: solid 2px rgba(0, 0, 0, 0.04);
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        background-color: var(--main-color);
        background-image: repeating-linear-gradient(
            0deg,
            rgba(0,0,0,0.1) 0%,
            rgba(0,0,0,0.1) 7%,
            rgba(255,255,255,0.1) 7%,
            rgba(255,255,255,0.1) 14%
        );
    }
    .gear-inner {
        width: 100%;
        height: 100%;
        background: linear-gradient( to bottom, rgba(0, 0, 0, 0.07), rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.07));
    }
    .main-illustration-cont {
        height: 100px;
        width: 100px;
        background-color: rgba(0, 0, 0, 0.1);
        border-right: solid 1px rgba(0, 0, 0, 0.1);
    }
    .element-list-item {
        display: flex;
        border: solid 1px rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        width: calc(100% - 12px);
        margin: 5px;
        height: 100px;
        overflow: hidden;
        transition: .2s;
    }
    .element-list-item:hover {
        border: solid 1px rgba(0, 0, 0, 0.4);
    }
    .element-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 6px;
        width: calc(100% - 100px);
    }
    .component-upper h3, .element-upper h3 {
        font-size: 16px;
    }
    .component-upper, .element-upper {
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
    .component-list, .element-list {
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