<script lang="ts">
    import Portal from "svelte-portal";
    import Button from "./Button.svelte";

    let opacity = 1;
    export let onClick: () => void;

    const handleClick = () => {
        opacity = 0;
        setTimeout(() => {
            onClick();
        }, 300);
    };

</script>
<Portal target="body">
    <div class="cookie-notice" style:opacity={opacity}>
        <button class="btn-close" on:click={handleClick}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>  
        </button>
        <div class="inner">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
            <p>We use cookies and similar technologies to save your progress in the app.</p>              
        </div>   
        <div class="btn-cont">
            <Button lightMode={true} onClick={handleClick}>Got it!</Button>
        </div>
    </div>
</Portal>
<style>
    .cookie-notice {
        position: fixed;
        bottom: 15px;
        left: 15px;
        width: 300px;
        height: fit-content;
        color: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        padding: 12px;
        font-size: 14px;
        transition: .3s;
        border-radius: var(--main-border-radius);
        background-color: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(33px);
        background-blend-mode: overlay;
    }
    .inner {
        display: flex;
        align-items: center;
    }
    .inner p {
        margin: 0 8px;
    }
    .inner svg {
        color: var(--main-color-dark);
        width: 36px;
        height: 36px;
    }
    .btn-close {
        background-color: transparent;
        border: none;
        cursor: pointer;
        position: absolute;
        top: 5px;
        right: 0px;
        color:rgba(0, 0, 0, 0.2);
    }
    .btn-close svg {
        width: 20px;
        height: 20px;
    }
    .btn-close:hover {
        color: rgba(0, 0, 0, 0.3);
    }
    .btn-cont {
        float: right;
        text-align: right;
        margin-right: 8px;
    }
</style>