<script lang="ts">
    import { currentComponentJSON } from "$lib/stores/stores";
    import { defaultElement, possibleParams } from "../editor/component-editor/componentHelpers";
    import Button from "$lib/Button.svelte";

    const addEl = (type: string) => {
        currentComponentJSON.update(value => {
            let newVal = {...value};
            newVal.json.elements = [...value.json.elements,
                defaultElement((value.json.elements ? value.json.elements : []), type)];
            return newVal;
        });
    }

    const onDragStart = (event: DragEvent, type: string) => {
        if (!event.dataTransfer) {
            return null;
        }

        let data = {event: 'addNew', element: type};
        event.dataTransfer.setData('application/svelteflow', JSON.stringify(data));
        event.dataTransfer.effectAllowed = 'move';
    };
</script>
<div class="element-cont">
    <div class="element-upper">
        <h3>Elements:</h3>
    </div>
    <div class="element-list">
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="element-list-item"
            on:dragstart={(e) => onDragStart(e, 'Disk')}
            draggable={true}
            on:dragover={(e) => {e.preventDefault()}} on:drop={(e) => {e.preventDefault()}}>
            <div class="main-illustration-cont">
                <div class="disk">
                </div>
            </div>
            <div class="element-info">
                <div>
                    <h4>Disk</h4>
                    <p>Disk</p>
                </div>
                <div>
                    <Button
                        onClick={() => addEl('Disk')}    
                        color="var(--main-dark-color)"
                        icon={`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg> `}
                    >                            
                        Add to Component
                        <svg class="icon-chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>                            
                    </Button>
                </div>
            </div>
        </div>
        
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="element-list-item"
            on:dragstart={(e) => onDragStart(e, 'GearElement')}
            draggable={true}
            on:dragover={(e) => {e.preventDefault()}} on:drop={(e) => {e.preventDefault()}}>
            <div class="main-illustration-cont">
                <div class="gear">
                </div>
            </div>
            <div class="element-info">
                <div>
                    <h4>Gear</h4>
                    <p>GearElement</p>
                </div>
                <div>
                    <Button
                        onClick={() => addEl('GearElement')}    
                        color="var(--main-dark-color)"
                        icon={`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg> `}
                    >                            
                        Add to Component
                        <svg class="icon-chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>                            
                    </Button>
                </div>
            </div>
        </div>

        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="element-list-item"
            on:dragstart={(e) => onDragStart(e, 'ShaftDiscrete')}
            draggable={true}
            on:dragover={(e) => {e.preventDefault()}} on:drop={(e) => {e.preventDefault()}}>
            <div class="main-illustration-cont">
                <div class="shaft">
                </div>
            </div>
            <div class="element-info">
                <div>
                    <h4>Shaft <span class="light-txt">(Discrete)</span></h4>
                    <p>ShaftDiscrete</p>
                </div>
                <div>
                    <Button
                        onClick={() => addEl('ShaftDiscrete')}    
                        color="var(--main-dark-color)"
                        icon={`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg> `}
                    >                            
                        Add to Component
                        <svg class="icon-chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>                            
                    </Button>
                </div>
            </div>
        </div>

        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="element-list-item"
            on:dragstart={(e) => onDragStart(e, 'ShaftContinuous')}
            draggable={true}
            on:dragover={(e) => {e.preventDefault()}} on:drop={(e) => {e.preventDefault()}}>
            <div class="main-illustration-cont">
                <div class="shaft continuous">
                </div>
            </div>
            <div class="element-info">
                <div>
                    <h4>Shaft <span class="light-txt">(Continuous)</span></h4>
                    <p>ShaftContinuous</p>
                </div>
                <div>
                    <Button
                        onClick={() => addEl('ShaftContinuous')}    
                        color="var(--main-dark-color)"
                        icon={`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg> `}
                    >                            
                        Add to Component
                        <svg class="icon-chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>                            
                    </Button>
                </div>
            </div>
        </div>
    </div>
</div>
<style>
    .light-txt {
        color: rgba(0, 0, 0, 0.4);
    }
    .element-info p {
        margin: 0;
        padding: 0;
        padding: 0;
        line-height: 1.5;
        display: flex;
        flex-wrap: wrap;
        white-space: normal;
        width: 100%;
        font-family: 'Roboto Mono', monospace;
        color: rgba(0, 0, 0, 0.6);
        font-size: 12px;
    }
    .element-cont {
        -moz-user-select: -moz-none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .icon-chevron {
        width: 17px;
        height: 17px;
        margin: 0 0 -4px 0;
        fill: none;
    }
    .element-info h4 {
        margin: 0;
    }
    .disk {
        height: 80px;
        width: 20px;
        background-color: var(--main-color);
        margin: 8px 40px;
        box-sizing: border-box;
        border-radius: 2px;
        border: solid 2px rgba(0, 0, 0, 0.04);
        box-shadow: var(--main-shadow);
    }
    .shaft {
        height: 18px;
        width: 72px;
        background-color: var(--main-color-light);
        margin: 39px 14px;
        box-sizing: border-box;
        border: solid 2px rgba(0, 0, 0, 0.04);
        border-radius: 2px;
        box-shadow: var(--main-shadow);
    }
    .shaft.continuous {
        background-color: var(--main-color-dark);
    }
    .gear {
        height: 60px;
        width: 20px;
        margin: 18px 40px;
        box-sizing: border-box;
        border-radius: 2px;
        border: solid 2px rgba(0, 0, 0, 0.04);
        box-shadow: var(--main-shadow);
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
        height: 120px;
        width: 100px;
        overflow: hidden;
    }
    .element-list-item {
        display: flex;
        width: calc(100% - 12px);
        margin: 0 5px 5px 5px;
        height: 100px;
        overflow: hidden;
        transition: .2s;
        cursor: grab;
        border-radius: var(--main-border-radius);
        border: var(--main-border);
    }
    .element-list-item:active {
        cursor: grabbing;
    }
    .element-list-item:hover {
        background: var(--main-hover-color);
    }
    .element-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 12px;
        width: calc(100% - 100px);
    }
    .element-upper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 5px;
        vertical-align: middle;
        margin-top: 25px;
        z-index: 10;
        position: relative;
    }
    .element-upper h3 {
        font-size: 16px;
    }
    .element-list {
        width: 100%;
        background: white;
        height: calc(100vh - 126px);
        padding-top: 5px;
        border-top: var(--main-border);
    }
</style>