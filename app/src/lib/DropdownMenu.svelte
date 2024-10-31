<script lang="ts">
    import { onMount } from 'svelte';
    import ToggleSwitch from './ToggleSwitch.svelte';

    export let options: string[] = [];
    export let optionIcons: string[] = [];
    export let onClick: (option: string) => void = () => {};
    export let visible = true;
    export let toggles: boolean = false;

    let isDropdownOpen = false;
    let onHover = false;

    onMount(() => {
        document.addEventListener('pointerdown', (event) => {
            if (!onHover) {
                isDropdownOpen = false;
            }
        });
    });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="main-button-cont {isDropdownOpen ? "open" : ""} {visible ? 'visible' : ''}"
    on:mouseenter={() => {onHover = true}}
    on:mouseleave={() => {onHover = false}}>
<button
    class="btn"
    on:click={(e) => {e.stopPropagation(); isDropdownOpen = !isDropdownOpen}}>
        <svg class="icon-menu" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
        </svg>
</button>
<div class="main-dropdown">
    {#each options as option, index}
        <button on:click={(e) => {e.stopPropagation(); onClick(option); isDropdownOpen = false;}}>
            {#if toggles}
                <ToggleSwitch size={22} />
            {:else}
                {#if optionIcons.length > index}
                    <span class="option-icon">
                        {@html optionIcons[index]}
                    </span>
                {/if}
            {/if}
            <span class="option-text">
                {option}
            </span>
        </button>
    {/each}
</div>
</div>
<style>
    .icon-menu {
        width: 20px;
        height: 20px;
        margin: 0 -2px -2px 0;
        stroke: rgba(0, 0, 0, 0.4);
        cursor: pointer;
        visibility: hidden;
    }
    .visible .icon-menu {
        visibility: visible;
    }
    .option-text {
        line-height: 34px;
        white-space: nowrap;
    }
    .option-icon {
        display: block;
        width: 16px;
        height: 16px;
        color: rgba(0, 0, 0, 0.9);
        margin: 8px 4px 0px 0;
    }
    .main-dropdown button {
        border: none;
        background-color: transparent;
        cursor: pointer;
        text-align: left;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        width: 100%;
        color: rgba(0, 0, 0, 0.9);
        font-weight: 500;
        padding: 2px 10px;
        overflow: hidden;
        display: flex;
        align-items: left;
        vertical-align: middle;
        transition: 0.4s;
    }
    .main-dropdown button:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }
    .main-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 6px;
        width: fit-content;
        padding: 0;
        background-color: white;
        transition: opacity 0.2s;
        visibility: hidden;
        z-index: 10000002;
        opacity: 0;
        border-radius: var(--main-border-radius);
        border: var(--main-border);
        overflow: hidden;
    }
    .open .main-dropdown {
        visibility: visible;
        opacity: 1;
    }
    .main-button-cont {
        position: relative;
        display: inline-flex;
    }

    .btn {
        padding: 0;
        display: inline-flex;
        cursor: pointer;
        border: none;
        background-color: transparent;
        transition: .2s;
        overflow: hidden;
        font-family: 'Inter', sans-serif;
    }
</style>