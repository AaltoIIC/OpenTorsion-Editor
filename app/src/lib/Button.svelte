<script lang="ts">
    export let icon: string = '';
    export let isActive: boolean = true;
    export let lightMode: boolean = false;
    export let onClick: () => void = () => {};
</script>

<button
    on:click={onClick}
    class="btn"
    style={`${lightMode ? 'border: solid 1px rgba(0, 0, 0, 0.06) !important;' : ''} ${isActive ? '' : 'pointer-events: none !important; background-color: var(--main-color-dark-2); opacity: 0.7;'}`}>
    {#if icon}
        <span class="main-icon">
                {@html icon} 
        </span>             
    {/if}   
    <span class="main-text" style="{icon ? '' : 'padding-left: 14px !important;'}">
        <slot></slot>
    </span>
</button>
<style>
    .btn {
        padding: 0;
        display: inline-flex;
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
        border-right: solid 1px rgba(0, 0, 0, 0.1);
        margin: 0 -2px -5px 0;
    }
    button {
        color: rgba(255, 255, 255, 0.9);
        background-color: var(--main-color);
        padding: 10px 12px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 50px;
        cursor: pointer;
        transition: .2s;
        overflow: hidden;
    }
    button:hover {
        border: 1px solid rgba(255, 255, 255, 0.5);
    }
</style>