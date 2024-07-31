<script lang="ts">
    export let text: string;
    export let value: string | undefined;
    export let isError: boolean = false;
    export let onInput: (event: Event) => void;

</script>
<div class="component-name-cont">
    {text}:
    <span
    class="input"
    role="textbox" 
    bind:innerText={value}
    on:input={onInput}
    style={isError ? "outline: solid 2px var(--main-error-color-dark);" : ""}
    contenteditable>{value}</span>
</div>
<style>
    /* component name field */
    .component-name-cont {
        color: rgba(255, 255, 255, 0.9);
        display: inline-block;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        height: fit-content;
        margin-left: -48px;
        height: fit-content;
        align-self: center;
    }
    .component-name-cont .input {
        line-height: 1;
        padding: 8px;
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: 5px;
        border: solid 2px rgba(255, 255, 255, 0.1);
        color:rgba(255, 255, 255, 0.9);
        font-family: 'Inter', sans-serif;
        width: fit-content;
        font-weight: 600;
        margin-left: 8px;
    }
</style>