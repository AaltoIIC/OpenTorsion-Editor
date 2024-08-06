<script lang="ts">
    import { currentComponentJSON } from "$lib/stores";
    import { addElement } from "../editor/component-editor/componentHelpers";

    
    const addEl = (type: string) => {
        currentComponentJSON.update(value => {
            return {
                ...value,
                elements: addElement((value.elements ? value.elements : []), type)
            }
        });
    }
</script>
<div class="element-cont">
    <div class="element-upper">
        <h3>Elements:</h3>
    </div>
    <div class="element-list">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="element-list-item"
        on:click={() => addEl('disk')}>
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
                    <button>Add to Component
                        <svg class="icon-add-to-component" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>                                           
                    </button>
                </div>
            </div>
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="element-list-item"
            on:click={() => addEl('shaft')}>
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
                    <button>Add to Component
                        <svg class="icon-add-to-component" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>              
                    </button>
                </div>
            </div>
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="element-list-item"
            on:click={() => addEl('gear')}>
            <div class="main-illustration-cont">
                <div class="gear">
                </div>
            </div>
            <div class="element-info">
                <div>
                    <h4>Gear</h4>
                    <p>Parameters: name, damping, excitation, inertia, diameter, teeth</p>
                </div>
                <div>
                    <button>Add to Component
                        <svg class="icon-add-to-component" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>                 
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<style>
    .element-cont {
        -moz-user-select: -moz-none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
    }
    .icon-add-to-component {
        width: 16px;
        height: 16px;
        margin: 0 0 -3px 0;
        fill: none;
        stroke: rgba(255, 255, 255, 0.9);;
        stroke-width: 2.2px;
        stroke-linejoin: round;
    }
    .element-info h4 {
        margin: 0;
    }
    .element-info p {
        font-size: 14px;
        line-height: 1;
        color: rgba(0, 0, 0, 0.6);
        margin: 0;
    }
    .element-info button {
        background-color: rgb(34, 34, 34);
        font-family: "Inter", sans-serif;
        font-weight: 550;
        border-radius: 100px;
        padding: 10px 12px;
    }
    .disk {
        height: 80px;
        width: 20px;
        background-color: var(--main-color);
        margin: 12px auto;
        border-radius: 2px;
        border: solid 2px rgba(0, 0, 0, 0.04);
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    }
    .shaft {
        height: 14px;
        width: 72px;
        background-color: var(--main-color);
        margin: 45px auto;
        border-radius: 2px;
        border: solid 2px rgba(0, 0, 0, 0.04);
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    }
    .gear {
        height: 60px;
        width: 20px;
        margin: 22px auto;
        border-radius: 2px;
        border: solid 2px rgba(0, 0, 0, 0.04);
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        background-color: var(--main-color);
        background-image: repeating-linear-gradient(
            0deg,
            rgba(255,255,255,0.1) 0%,
            rgba(255,255,255,0.1) 9.09%,
            rgba(0,0,0,0.1) 9.09%,
            rgba(0,0,0,0.1) 18.18%
        );
    }
    .main-illustration-cont {
        height: 108px;
        width: 108px;
        background-color: var(--main-color-tr-2);
        border-right: solid 1px rgba(0, 0, 0, 0.1);
    }
    .element-list-item {
        display: flex;
        border: solid 1px rgba(0, 0, 0, 0.1);
        width: calc(100% - 12px);
        margin: 5px;
        height: 108px;
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
    .element-upper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 5px;
        vertical-align: middle;
        margin-top: 25px;
    }
    .element-upper h3 {
        font-size: 16px;
    }
    .element-list {
        width: 100%;
        border-top: solid 2px rgba(0, 0, 0, 0.1);
    }
    button {
        color: rgba(255, 255, 255, 0.9);
        padding: 8px;
        font-weight: 500;
        border: 1px solid rgba(255, 255, 255, 0.4);
        border-radius: 50px;
        cursor: pointer;
        transition: .2s;
    }
    button:hover {
        border: 1px solid rgba(255, 255, 255, 0.8);
    }
</style>