<script lang="ts">
    import { importSystem } from "$lib/utils";
    import Button from "$lib/Button.svelte";

    let fileInput: HTMLInputElement;

</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="main-tile"
    on:click={() => fileInput.click()}>

    <p>Import System</p>
    <div class="btn-cont">
        <Button
        color="rgb(30, 30, 30)" textColor="rgba(255, 255, 255, 0.9)"
        icon='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>'>
            Import
            <svg class="icon-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>          
        </Button>
    </div>
</div>
<input type="file" class="file-input"
    name="DDT-file"
    bind:this={fileInput}
    on:change={importSystem}
    accept=".json"/>
<style>
    .icon-arrow {
        width: 18px;
        height: 18px;
        margin: 0 -2px -4.2px 0;
    }
    .file-input {
        display: none;
    }
    .main-tile {
        width: 175px;
        height: 228px;
        border-radius: var(--main-border-radius);
        background-color: white;
        cursor: pointer;
        margin: 0 0 15px 15px;
        position: relative;
    }
    .main-tile:hover {
        background-color: var(--main-hover-color);
    }
    p {
        font-family: "Inter", sans-serif;
        font-size: 14px;
        opacity: 0.7;
        width: max-content;
        position: absolute;
        top: calc(50% - 22px);
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .btn-cont {
        position: absolute;
        bottom: 14px;
        right: 14px;
    }
</style>