<script lang="ts">
    import Button from "$lib/Button.svelte";
    let hover = false;
</script>
<a data-sveltekit-preload-data="hover" href="/system-editor
">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="main-tile {hover ? 'hover' : ''}"
        on:mouseenter={() => hover = true}
        on:mouseleave={() => hover = false}>
        <span class="bg-icon">
            <svg class="outline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.85" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <svg class="inside" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
        </span>
        <p>Create New System</p>
        <div class="btn-cont">
            <Button
            color="rgb(30, 30, 30)" textColor="rgba(255, 255, 255, 0.9)"
            icon='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>'>
                New
                <svg class="icon-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>          
            </Button>
        </div>
    </div>
</a>
<style>
    .bg-icon * {
        width: 212px;
        height: 212px;
        position: absolute;
        bottom: -40px;
        left: -60px;
    }
    .bg-icon .inside {
        color: white;
    }
    .hover .bg-icon .inside {
        color: var(--main-hover-color);
    }
    .bg-icon .outline {
        color: rgba(0, 0, 0, 0.06);
    }
    .icon-arrow {
        width: 18px;
        height: 18px;
        margin: 0 -2px -4.2px 0;
    }
    .main-tile {
        width: 175px;
        height: 228px;
        border-radius: var(--main-border-radius);
        background-color: white;
        cursor: pointer;
        margin: 0 0 15px 15px;
        position: relative;
        border: var(--main-border);
        overflow: hidden;
    }
    .main-tile.hover {
        background-color: var(--main-hover-color);
    }
    p {
        font-family: "Inter", sans-serif;
        font-size: 14px;
        opacity: 0.9;
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