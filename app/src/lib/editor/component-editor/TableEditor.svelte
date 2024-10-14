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

    const handleInput = (elemName: string, paramName: string, e: Event) => {
        const paramVal = (e.target as HTMLInputElement).value;

        currentComponentJSON.update(val => {
            val.json.elements = val.json.elements.map(element => {
                if (element.name === elemName) {
                    element = {
                        ...element,
                        [paramName]: paramVal
                    };
                }
                return element;
            });
            return val;
        });

        // update columnLengths
        updateColLengths(paramName);
    };

    currentComponentJSON.subscribe(value => {
        elements = value.json.elements as Record<string, any>[];
        nodeNos = assignNodeNumbers(value.json.elements);
        columns.forEach(column => {
            updateColLengths(column);
        }); 
    });

    // handle pan
    let tableOuter: HTMLDivElement;
    let pointerdown = false;
    const handlePan = (e: MouseEvent) => {
        if (pointerdown) {
            console.log(e.movementX);
            tableOuter.scrollTop -= e.movementY;
            tableOuter.scrollLeft -= e.movementX;
        }
    };

    // handle add element button
    let addElementButton: HTMLButtonElement;
    let isAddLayoverOpen = false;

    onMount(() => {
        document.addEventListener("pointerdown", () => {
            pointerdown = true;
        });
        document.addEventListener("pointerup", () => {
            pointerdown = false;
        });
        document.addEventListener("click", (e) => {
            if (e.target !== addElementButton) {
                isAddLayoverOpen = false;
            }
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
        on:pointermove={handlePan}>
        <tr>
            {#each columns as column}
                <th>{column}</th>
            {/each}
        </tr>
        {#each elements as element}
            <tr>
                <td class="nodeNo">{nodeNos[element.name]}</td>
                <td>
                    <input
                        type="text" value={element['name']}
                        style={`width: ${columnLengths['name']*9.5}px;`}
                        on:input={(e) => handleInput(element.name, 'name', e)}
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
                                style={`width: ${columnLengths[column]*9.5}px;`}
                                on:input={(e) => handleInput(element.name, column, e)}
                            />
                        </td>
                    {:else}
                        <td class="no-edit">
                        </td>
                    {/if}
                {/each}
            </tr>
        {/each}
        <tr class="row-add">
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
        background-color: white;
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
        background-color: rgb(247, 247, 247);
    }
    .no-edit {
        background-color: white;
        white-space: nowrap;
        padding: 8px;
    }
</style>