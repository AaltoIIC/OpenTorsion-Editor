<script lang="ts">
    import { onMount } from 'svelte';
    export let icon: string = '';
    export let isActive: boolean = true;
    export let lightMode: boolean = false;
    export let options: string[] = [];
    export let optionIcons: string[] = [];
    export let onClick: (option: string) => void = () => {};

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
<div class="main-button-cont {isDropdownOpen ? "open" : ""}"
    on:mouseenter={() => {onHover = true}}
    on:mouseleave={() => {onHover = false}}>
<button
    class="btn"
    style={`${isActive ? '' : 'pointer-events: none !important; background-color: var(--main-color-dark-2); opacity: 0.7;'}`}
    on:click={() => {isDropdownOpen = !isDropdownOpen}}>
    {#if icon}
        <span class="main-icon">
                {@html icon} 
        </span>             
    {/if}
    <span class="main-text" style="{icon ? '' : 'padding-left: 14px !important;'}">
        <slot></slot>
        <svg class="icon-dropdown" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
    </span>
</button>
<div class="main-dropdown">
    {#each options as option, index}
        <button on:click={() => {onClick(option); isDropdownOpen = false;}}>
            {#if optionIcons.length > index}
                <span class="option-icon">
                    {@html optionIcons[index]}
                </span>
            {/if}
            <span class="option-text">
                {option}
            </span>
        </button>
    {/each}
</div>
</div>
<style>
    .option-text {
        line-height: 34px;
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
        left: 0;
        margin-top: 6px;
        width: 162px;
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
    .icon-dropdown {
        width: 15px;
        height: 15px;
        margin: 0 0 -3px 0;
        fill: none;
        stroke: rgba(255, 255, 255, 0.9);
        stroke-width: 2.4px;
        stroke-linejoin: round;
    }
    .open .icon-dropdown {
        transform: rotate(180deg);
    }

    .btn {
        padding: 0;
        display: inline-flex;
        color: rgba(255, 255, 255, 0.9);
        background-color: var(--main-color);
        border: none;
        border-radius: 50px;
        cursor: pointer;
        transition: .2s;
        overflow: hidden;
        font-family: 'Inter', sans-serif;
    }
    .btn:hover {
        filter: brightness(1.05);
    }
    .main-text {
        color: rgba(255, 255, 255, 0.9);
        padding: 8.5px 14px 9px 12px;
        font-weight: 500;
    }
    .main-icon {
        width: 18px;
        height: 18px;
        color: rgba(255, 255, 255, 0.9);
        padding: 8px 6px 13px 8px;
        border-right: solid 2px rgba(0, 0, 0, 0.04);
        margin: 0 -2px -5px 0;
    }
</style>