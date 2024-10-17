<script lang="ts">
    import {
        assignNodeNumbers,
        addElement
    } from "./componentHelpers";
    import {
        possibleParams,
        paramTypes
    } from "./params";
    import { currentComponentJSON } from "$lib/stores/stores";
    import type { ElementType } from "$lib/types/types";
    import { onMount } from "svelte";

    let elements: Record<string, any>[];
    let nodeNos: Record<string, string> = {};

    let columns: string[] = ["node", "name", "type"];
    Object.values(possibleParams).forEach(paramsObj => {
        columns.push(...paramsObj.required);
    });
    Object.values(possibleParams).forEach(paramsObj => {
        columns.push(...paramsObj.optional);
    });
    columns = [...new Set(columns)];

    const possibleParamsList: Record<string, string[]> = {};
    Object.entries(possibleParams).forEach(([key, value]) => {
        possibleParamsList[key] = [...value.required, ...value.optional];
    });

    const columnLengths: Record<string, number> = {};
    const updateColLengths = (paramName: string) => {
        let newLength = paramName.length;
        $currentComponentJSON.json.elements.forEach((element: ElementType) => {
            if (element[paramName as keyof ElementType] &&
                (element[paramName as keyof ElementType]?.toString() || "").length > newLength) {
                newLength = (element[paramName as keyof ElementType]?.toString() || "").length;
            }
        });
        columnLengths[paramName] = newLength;
    };

    let isError: null | {param: string, elem: string} = null;

    let editedCell: {elem: string, param: string, value: string} | null = null;
    const handleFocus = (elemName: string, paramName: string) => {
        editedCell = {
            elem: elemName,
            param: paramName,
            value: elements.find(element => element.name === elemName)?.[paramName] || ""
        };
    };

    const handleInput = (e: Event) => {
        const paramVal = (e.target as HTMLInputElement).value;

        currentComponentJSON.update(val => {
            val.json.elements = val.json.elements.map(element => {
                if (element.name === editedCell?.elem) {
                    // milyen checkek legyenek?
                    // type check (es eleve parseolja)
                    // ha uresen van hagyva, torolje a key-t
                    // nevet csekkolja hogy egyedi-e
                    if (editedCell?.param === "name") {
                        const elemNames = val.json.elements.map(e => e.name);
                        if (elemNames.includes(paramVal)) {
                            console.log("Name already exists");
                            isError = {param: editedCell.param, elem: editedCell.elem};
                            return element;
                        }
                    }

                    element = {
                        ...element,
                        [editedCell.param]: paramVal
                    };
                }
                return element;
            });
            return val;
        });

        // update columnLengths
        updateColLengths(editedCell?.param || '');
    };

    currentComponentJSON.subscribe(value => {
        elements = value.json.elements as Record<string, any>[];
        nodeNos = assignNodeNumbers(value.json.elements);
        columns.forEach(column => {
            updateColLengths(column);
        }); 
    });


    // handle add element button
    let addElementButton: HTMLButtonElement;
    let isAddLayoverOpen = false;

    // handle pan
    let tableOuter: HTMLDivElement;
    let pointerdown = false;
    const handlePan = (e: MouseEvent) => {
        if (pointerdown) {
            tableOuter.scrollTop -= e.movementY;
            tableOuter.scrollLeft -= e.movementX;
            isAddLayoverOpen = false;
        }
    };

    // handle action buttons
    let hoveredElement: string | null = null;

    const handleElementDelete = (elemName: string) => {
        currentComponentJSON.update(val => {
            val.json.elements = val.json.elements.filter(element => element.name !== elemName);
            return val;
        });
    };

    const moveUp = (elemName: string) => {
        currentComponentJSON.update(val => {
            let elements = [...val.json.elements];
            const index = elements.findIndex(element => element.name === elemName);
            if (index === 0) return val;

            const elem = elements[index];
            elements[index] = elements[index - 1];
            elements[index - 1] = elem;

            return {
                ...val,
                json: {
                    ...val.json,
                    elements
                }
            };
        });
    };

    const moveDown = (elemName: string) => {
        currentComponentJSON.update(val => {
            let elements = [...val.json.elements];
            const index = elements.findIndex(element => element.name === elemName);
            if (index === elements.length - 1) return val;

            const elem = elements[index];
            elements[index] = elements[index + 1];
            elements[index + 1] = elem;

            return {
                ...val,
                json: {
                    ...val.json,
                    elements
                }
            };
        });
    };

    onMount(() => {
        document.addEventListener("pointerdown", (e) => {
            pointerdown = true;
        });
        document.addEventListener("click", (e) => {
            if (e.target !== addElementButton) {
                isAddLayoverOpen = false;
            }
        });
        document.addEventListener("dragstart", (e) => {
            pointerdown = false;
        });
        document.addEventListener("pointerup", () => {
            pointerdown = false;
        });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                isAddLayoverOpen = false;
            }
        });
    });

</script>

<div class="table-outer"
    bind:this={tableOuter}>
    <table class="main-table-editor"
        on:mouseleave={() => hoveredElement = null}
        on:pointermove={handlePan}>
        <tr on:mouseenter={() => hoveredElement = null}>
            {#each columns as column}
                <th>{column}</th>
            {/each}
        </tr>
        {#each elements as element}
            <tr on:mouseenter={() => hoveredElement = element.name}
                class={hoveredElement === element.name ? 'hover' : ''}>
                <td class="nodeNo">{nodeNos[element.name]}</td>
                <td>
                    <input
                        type="text" value={element['name']}
                        style={`width: ${columnLengths['name']*9.5 + 15}px;`}
                        class="{(isError &&
                            isError.param === 'name' &&
                            isError.elem === element.name ? 'name-error' : '')}"
                        on:focus={() => handleFocus(element.name, 'name')}
                        on:input={handleInput}
                    />
                </td>
                <td class="no-edit">{element.type}</td>
                {#each columns.slice(3) as column }
                    {#if possibleParamsList[element.type]?.includes(column)}
                        <td>
                            <input
                                type={
                                    paramTypes[column] === "number" ? "number" : "text"
                                }
                                value={element[column] ? element[column] : ""}
                                style={`width: ${
                                    (columnLengths[column]*9 + (paramTypes[column] === "number" ? 15 : 0))
                                    }px;`}
                                on:focus={() => handleFocus(element.name, column)}
                                on:input={handleInput}
                            />
                        </td>
                    {:else}
                        <td class="no-edit">
                        </td>
                    {/if}
                {/each}
                <div class="action-cont">
                    <div class="action-inner">
                        <button class="btn-action"
                            on:click={() => moveUp(element.name)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                            </svg>                                                   
                        </button>
                        <button class="btn-action"
                            on:click={() => moveDown(element.name)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                            </svg>                                                  
                        </button>
                        <button class="btn-action rm"
                            on:click={() => handleElementDelete(element.name)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>                      
                        </button>
                    </div>
                </div>
            </tr>
        {/each}
        <tr class="row-add" on:mouseenter={() => hoveredElement = null}>
            <td class="cell-add" colspan="8">
                <button class="add-inside"
                    bind:this={addElementButton}
                    on:click={() => isAddLayoverOpen = true}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>                  
                    Add Element
                    <div class={`add-layover
                            ${isAddLayoverOpen ? 'open' : ''}
                            ${elements.length < 2 ? 'down' : ''}`}>
                        {#each Object.keys(possibleParams) as type}
                            <button on:click={() => addElement(type)}>
                                {type}
                            </button>
                        {/each}
                    </div>
                </button>
            </td>
        </tr>
    </table>
</div>
<style>
    .action-cont {
        position: absolute;
        right: 0;
        width: 100%;
        pointer-events: none;
    }
    .action-inner {
        width: fit-content;
        position: sticky;
        left: calc(100vw - 470px);
        pointer-events: all;
        margin-top: 4px;
        display: flex;
    }
    .btn-action {
        background: white;
        border: none;
        border-top: var(--main-border);
        border-bottom: var(--main-border);
        border-radius: 0;
        width: 28px;
        height: 28px;
        cursor: pointer;
        visibility: hidden;
        margin: 0;
    }
    .btn-action:first-of-type {
        border-left: var(--main-border);
        border-top-left-radius: var(--main-border-radius);
        border-bottom-left-radius: var(--main-border-radius);
    }
    .btn-action:last-of-type {
        border-right: var(--main-border);
        border-top-right-radius: var(--main-border-radius);
        border-bottom-right-radius: var(--main-border-radius);
    }
    tr.hover .btn-action {
        visibility: visible;
    }
    .btn-action svg {
        width: 14px;
        height: 14px;
        margin-bottom: -3px;
        margin-left: -1px;
        color: rgba(0, 0, 0, 0.7);
    }
    .btn-action.rm svg {
        color: var(--main-error-color-dark);
    }
    .btn-remove:hover {
        background-color: var(--main-hover-color);
    }
    .name-error:focus {
        outline: solid 2px var(--main-error-color);
        border-radius: 2px;
    }
    .add-inside {
        width: fit-content;
        position: relative;
        border: none;
        background-color: white;
        font-family: 'Roboto Mono', monospace;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.8);
    }
    .add-inside:hover {
        color: rgb(0, 0, 0);
    }
    .add-layover {
        position: absolute;
        bottom: 0;
        right: -155px;
        width: 134px;
        background-color: white;
        padding: 8px;
        border: var(--main-border);
        border-radius: var(--main-border-radius);
        display: none;
    }
    .add-layover.down {
        top: 0;
        bottom: auto;
    }
    .add-layover.open {
        display: block;
    }
    .add-layover button {
        margin: 4px;
        color: rgba(0, 0, 0, 0.7);
        font-family: 'Roboto Mono', monospace;
        border: none;
        background: none;
        padding: 0;
        text-align: left;
        cursor: pointer;
        width: 100%;
    }
    .add-layover button:hover {
        color: rgb(0, 0, 0);
    }
    .cell-add {
        background-color: white;
        padding: 8px;
        position: sticky;
        left: 0;
        border: none;
    }
    .cell-add svg {
        width: 18px;
        height: 18px;
        margin-bottom: -3px;
    }
    .nodeNo {
        text-align: center;
        font-weight: 550;
    }
    .table-outer {
        width: 100%;
        height: 100%;
        padding: 0 10px 10px 10px;
        margin-top: 2px;
        box-sizing: border-box;
        overflow: scroll;
        cursor: grab;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .table-outer:active {
        cursor: grabbing;
    }
    .main-table-editor {
        width: 100%;
        border-collapse: collapse;
        position: relative;
    }
    td, th {
        text-align: left;
        padding: 0;
        font-family: 'Roboto Mono', monospace;
        font-size: 14px;
    }
    td {
        border: var(--main-border);
    }
    th {
        font-weight: 550;
        padding: 8px;
        font-family: 'Roboto Mono', monospace;
    }
    tr:first-of-type {
        position: sticky;
        top: 0;
    }
    th:first-of-type {
        position: relative;
        left: -1px;
        background-color: white;
    }
    th:first-of-type::after {
        content: "";
        position: absolute;
        top: 0;
        right: -1px;
        width: 1px;
        height: 100%;
        background-color: white;
    }
    th:last-of-type::after {
        content: "";
        position: absolute;
        top: 0;
        right: -1px;
        width: 1px;
        height: 100%;
        background-color: white;
    }
    input {
        padding: 8px;
        border: none;
        font-family: 'Roboto Mono', monospace;
        font-size: 14px;
        background-color: rgba(0, 0, 0, 0.03);
    }
    .no-edit {
        white-space: nowrap;
        padding: 8px;
    }
    tr {
        background-color: white;
    }
    tr.hover {
        background-color: rgb(250, 250, 250);
    }
</style>