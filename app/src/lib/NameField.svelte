<script lang="ts">
    import { onMount } from 'svelte';
    export let text: string;
    export let value: string | undefined;
    export let isError: boolean = false;
    export let onInput: (text: string) => void;
    let spanWidth = 0;
    let inputElement: HTMLInputElement;

    const measureWidth = () => {
        if (!inputElement) return;
        spanWidth = (inputElement.nextElementSibling as HTMLSpanElement).offsetWidth;
    }

    $: if (value) {
        setTimeout(() => {
            measureWidth();
        }, 0);
    }

    onMount(() => {
        measureWidth();
    });
</script>
<div class="component-name-cont">
    {text}:
    <input
        class="input"
        type="text"
        bind:value={value}
        bind:this={inputElement}
        on:input={() => {onInput(value || '');}}
        style={
            `${isError ? "outline: solid 2px var(--main-error-color-dark);" : ""} width: ${spanWidth}px;`
        } />
    <span class="hidden-span">{value}</span>
</div>
<style>
    .hidden-span {
        visibility: hidden;
        white-space: pre;
        position: absolute;
        font-size: 14px;
        font-family: 'Inter', sans-serif;  
    }
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
        max-width: 24ch;
    }
</style>