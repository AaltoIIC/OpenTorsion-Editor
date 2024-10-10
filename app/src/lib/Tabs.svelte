<script lang="ts">
    export let tabs: string[];

    export let selectedTab = tabs[0];
</script>
<div class="main-tab-cont">
        {#each tabs as tab}
            <button
                class="{selectedTab === tab ? 'selected' : ''}"
                on:click={() => selectedTab = tab}>
                {tab}
            </button>
        {/each}
</div>
<style>
    .main-tab-cont {
        width: 100%;
        padding: 4px;
        background-color: white;
        z-index: 10;
        border-bottom: var(--main-border);
        -moz-user-select: -moz-none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    button {
        background-color: transparent;
        border: none;
        font-family: 'Inter', sans-serif;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.6);
        font-size: 14px;
        cursor: pointer;
        margin: 2px;
    }
    button:hover {
        color: rgb(0, 0, 0);
    }
    button.selected {
        font-weight: 550;
        color: rgba(0, 0, 0, 0.9);
    }
</style>