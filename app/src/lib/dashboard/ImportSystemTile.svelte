<script lang="ts">
    import { importSystem } from "$lib/utils";

    let fileInput: HTMLInputElement;

</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="main-tile"
    on:click={() => fileInput.click()}>
    <svg class="import-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>      
            
    <p>Import System</p>
</div>
<input type="file" class="file-input"
    name="DDT-file"
    bind:this={fileInput}
    on:change={importSystem}
    accept=".json"/>
<style>
    .file-input {
        display: none;
    }
    .main-tile {
        width: 175px;
        height: 250px;
        border-radius: var(--main-border-radius);
        background-color: white;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0 0 15px 15px;
    }
    .main-tile:hover {
        background-color: var(--main-hover-color);
    }
    .import-icon {
        width: 42px;
        height: 42px;
        padding: 15px;
        color: var(--main-color);
    }
    p {
        font-family: "Inter", sans-serif;
    }
</style>