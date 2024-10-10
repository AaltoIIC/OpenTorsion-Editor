<script lang="ts">
    import { possibleParams } from "./componentHelpers";
    import { currentComponentJSON } from "$lib/stores/stores";

    let elements;
    $: elements = $currentComponentJSON.json.elements as Record<string, any>[];

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

</script>
<div class="table-outer">
    <table class="main-table-editor">
        <tr>
            {#each columns as column}
                <th>{column}</th>
            {/each}
        </tr>
        {#each elements as element}
            <tr>
                <td>1</td>
                {#each columns.slice(1) as column }
                    {#if possibleParamsList[element.type].includes(column)}
                        <td>
                            <input type="text" value={element[column] ? element[column] : ""} />
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
    .table-outer {
        width: 100%;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
        overflow: scroll;
    }
    .main-table-editor {
        width: 100%;
        border-collapse: collapse;
    }
    td, th {
        border: var(--main-border);
        text-align: left;
        padding: 0;
    }
    input {
        padding: 8px;
        border: none;
    }
    .no-prop {
        background-color: rgb(247, 247, 247);
        cursor: not-allowed;
    }
</style>