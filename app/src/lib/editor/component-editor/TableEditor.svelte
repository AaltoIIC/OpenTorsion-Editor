<script lang="ts">
    import {
        possibleParams,
        assignNodeNumbers
    } from "./componentHelpers";
    import { currentComponentJSON } from "$lib/stores/stores";
    import type { ElementType } from "$lib/types/types";

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
        let newLength = 0;
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

</script>

<div class="table-outer"
    bind:this={tableOuter}>
    <table class="main-table-editor"
        on:pointerdown={() => {pointerdown = true;}}
        on:pointerup={() => {pointerdown = false;}}
        on:pointermove={handlePan}>
        <tr>
            {#each columns as column}
                <th>{column}</th>
            {/each}
        </tr>
        {#each elements as element}
            <tr>
                <td class="nodeNo">{nodeNos[element.name]}</td>
                {#each columns.slice(1) as column }
                    {#if possibleParamsList[element.type]?.includes(column)}
                        <td>
                            <input
                                type="text" value={element[column] ? element[column] : ""}
                                style={`min-width: ${column.length*9.5}px;
                                        width: ${columnLengths[column]*9.5}px;
                                `}
                                on:input={(e) => handleInput(element.name, column, e)}
                            />
                        </td>
                    {:else}
                        <td class="no-prop">
                        </td>
                    {/if}
                {/each}
            </tr>
        {/each}
    </table>
</div>
<style>
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
    .main-table-editor {
        width: 100%;
        border-collapse: collapse;
        position: relative;
    }
    td, th {
        text-align: left;
        padding: 0;
        font-family: 'Roboto Mono', monospace;
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
    input {
        padding: 8px;
        border: none;
        font-family: 'Roboto Mono', monospace;
        font-size: 14px;
    }
    .no-prop {
        background-color: rgb(247, 247, 247);
    }
</style>