<script lang="ts">
    import { onMount } from "svelte";
    import Portal from "svelte-portal";
    import Button from "./Button.svelte";

    let dialogbox: HTMLDivElement;
    let cover: HTMLDivElement;
    let isOpen = false;
    let dialogText = "";
    let confirmText = "";
    let denyText = "";  
    let resolvePromise: (value: boolean) => void;

    export const openDialog = (dialog: string, confirm: string, deny: string): Promise<boolean> => {
        dialogText = dialog;
        confirmText = confirm;
        denyText = deny;
        isOpen = true;
        return new Promise((resolve) => {
            resolvePromise = resolve;
        });
    }

    const handleConfirm = () => {
        isOpen = false;
        resolvePromise(true);
    };

    const handleDeny = () => {
        isOpen = false;
        resolvePromise(false);
    };

    onMount(() => {
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                handleDeny();
            }
        });
    });

    let opacityTimeout: any;
    $: if (isOpen) {
        if (dialogbox && cover) {
            clearTimeout(opacityTimeout);
            opacityTimeout = setTimeout(() => {
                dialogbox.style.opacity = "1";
                cover.style.opacity = "1";
            }, 10);
        }
    } else {
        if (dialogbox && cover) {
            clearTimeout(opacityTimeout);
            dialogbox.style.opacity = "0";
            cover.style.opacity = "0";
        }
    }
</script>
<Portal target="body">
    {#if isOpen}
        <div class="main-dialogbox" bind:this={dialogbox}>
            <button class="btn-close" on:click={handleDeny}>
                <svg class="icon-close" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg> 
            </button>             
            <p>{dialogText}</p>
            <div class="btn-cont">
                <Button 
                    lightMode={true}
                    onClick={handleConfirm}>
                    <svg class="option-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>                                        
                    {confirmText}
                </Button>
                <Button 
                    lightMode={true}    
                    onClick={handleDeny}>
                    <svg class="option-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>                      
                    {denyText}
                </Button>
            </div>
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div bind:this={cover} class="viewport-cover" on:click={handleDeny}>
        </div>
    {/if}
</Portal>
<style>
    .btn-close {
        margin: 0;
        padding: 0;
        background-color: transparent;
        border: none;
        position: absolute;
        top: 10px;
        right: 10px;
    }
    .icon-close {
        width: 14px;
        height: 14px;
        color: rgba(0, 0, 0, 0.2);
        cursor: pointer;
    }
    .option-icon {
        width: 18px;
        height: 18px;
        margin: 0 0 -4px 0;
        stroke: rgba(255, 255, 255, 0.9);
        stroke-width: 2px;
        stroke-linejoin: round;
        margin-top: -2px;
    }
    .btn-cont {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 16px;
    }
    .main-dialogbox {
        position: fixed;
        top: 100px;
        left: 50vw;
        transform: translateX(-50%);
        width: fit-content;
        max-width: 400px;
        height: fit-content;
        background-color: white;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        border: solid 1px var(--main-color);
        text-align: center;
        z-index: 10000000000;
        padding: 20px 30px 12px 30px;
        transition: .3s;
        opacity: 0;
    }
    .main-dialogbox p {
        font-size: 14px;
        font-weight: 550;
        margin: 0;
    }
    .viewport-cover {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.1);
        z-index: 1000000000;
        transition: .3s;
        opacity: 0;
    }
</style>