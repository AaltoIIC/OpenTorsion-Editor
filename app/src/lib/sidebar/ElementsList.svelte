<script lang="ts">
    import { currentComponentJSON } from "$lib/stores";
    import type { ElementType } from "$lib/types/types";
    import { defaultElement } from "../editor/component-editor/componentHelpers";

    // Constraints for elements
    let isActive: { [key: string]: boolean }  = {
        disk: true,
        shaft: false,
        gear: true
    }
    
    const addEl = (type: string) => {
        if (!isActive[type]) return;
        currentComponentJSON.update(value => {
            return {
                ...value,
                elements: [...value.elements,
                    defaultElement((value.elements ? value.elements : []), type)]
            }
        });
    }

    const onDragStart = (event: DragEvent, type: string) => {
        if (!event.dataTransfer || !isActive[type]) {
            return null;
        }

        let data = {event: 'addNew', element: type};
        event.dataTransfer.setData('application/svelteflow', JSON.stringify(data));
        event.dataTransfer.effectAllowed = 'move';
    };

    const updateConstraints = (elements: ElementType[]) => {
        if (elements.length === 0) {
            isActive = {
                disk: true,
                shaft: false,
                gear: true
            }
        }
        
        const lastElement = elements.at(-1)
        if (lastElement?.type === "Disk") {
            isActive = {
                disk: false,
                shaft: true,
                gear: true
            }
        } else if (lastElement?.type === "ShaftDiscrete") {
            isActive = {
                disk: true,
                shaft: false,
                gear: true
            }
        } else if (lastElement?.type === "GearElement") {
            isActive = {
                disk: false,
                shaft: true,
                gear: true
            }
        }
    }
    currentComponentJSON.subscribe(value => {
        updateConstraints(value.elements);
    });

</script>
<div class="element-cont">
    <div class="element-upper">
        <h3>Elements:</h3>
    </div>
    <div class="element-list">
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="element-list-item {isActive.disk ? '' : 'disabled'}"
            on:dragstart={(e) => onDragStart(e, 'disk')}
            draggable={true}>
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
                    <button on:click={() => addEl('disk')}>Add to Component
                        <svg class="icon-add-to-component" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>                                                          
                    </button>
                </div>
            </div>
        </div>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="element-list-item {isActive.shaft ? '' : 'disabled'}"
            on:dragstart={(e) => onDragStart(e, 'shaft')}
            draggable={true}>
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
                    <button on:click={() => addEl('shaft')}>Add to Component
                        <svg class="icon-add-to-component" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>                                      
                    </button>
                </div>
            </div>
        </div>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="element-list-item {isActive.gear ? '' : 'disabled'}"
            on:dragstart={(e) => onDragStart(e, 'gear')}
            draggable={true}>
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
                    <button on:click={() => addEl('gear')}>Add to Component
                        <svg class="icon-add-to-component" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
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
        border: solid 1px rgba(0, 0, 0, 0.4);
        width: calc(100% - 12px);
        margin: 5px;
        height: 108px;
        overflow: hidden;
        transition: .2s;
        cursor: grab;
    }
    .element-list-item.disabled {
        pointer-events: none;
        opacity: 0.6;
        background-color: rgb(244, 244, 244);
        border: solid 1px rgba(0, 0, 0, 0.1) !important;
        cursor: auto;
    }
    .element-list-item:active {
        cursor: grabbing;
    }
    .element-list-item:hover {
        border: solid 1px rgba(0, 0, 0, 0.8);
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
    .disabled button {
        cursor: auto;
    }
    button {
        color: rgba(255, 255, 255, 0.9);
        padding: 8px;
        font-weight: 500;
        border: 1px solid rgba(255, 255, 255, 0.4);
        border-radius: 50px;
        cursor: grab;
        transition: .2s;
    }
    button:hover {
        border: 1px solid rgba(255, 255, 255, 0.8);
    }
</style>