<script lang="ts">
    import { notification } from '$lib/stores'

    let isShown = false;
    let currentText = '';
    let currentType = '';

    notification.subscribe(value => {
        if (value) {
            isShown = false;
            currentText = value.message;
            currentType = value.type;

            setTimeout(() => {
                isShown = true;
            }, 1);

            setTimeout(() => {
                isShown = false;
            }, value.duration);
            setTimeout(() => {
                currentText = '';
                currentType = '';
                notification.set(null);
            }, value.duration + 300);
        } else {
            isShown = false;
            setTimeout(() => {
                currentText = '';
                currentType = '';
            }, 300);
        }
    });

    const closeNotification = () => {
        notification.set(null);
    }
</script>
{#if currentText && currentType}
    <div class="main-notification-cont is-{currentType} {isShown ? "active" : "inactive"}">
            <div class="icon-cont">
                {#if currentType === "success"}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
                    </svg>
                {:else if currentType === "error"}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                {/if}
            </div>
            <div class="notification-inner">
                <p>{currentText}</p>
            </div>
            <div class="close-cont">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <svg
                    on:click={closeNotification}
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>              
            </div>
    </div>
{/if}

<style>
    .icon-cont {
        width: 20px;
        height: 20px;
        padding: 12.5px;
        color: rgba(255, 255, 255, 0.9);
        background-color: var(--main-color-dark);
        margin-right: 10px;
        transition: .3s;
    }
    .is-error .icon-cont {
        background-color: var(--main-error-color-dark);
    }
    .close-cont svg {
        width: 15px;
        height: 15px;
        padding: 4px 12px 0 12px;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.25);
    }
    .main-notification-cont {
        position: fixed;
        top: 68px;
        right: 0;
        margin: 15px;
        z-index: 10000000;
        background-color: var(--main-color);
        display: flex;
        align-items: center;
        vertical-align: middle;
        border: solid 1px rgba(0, 0, 0, 0.1);
        transition: .3s;
    }
    .main-notification-cont.is-error {
        background-color: var(--main-error-color);
    }
    .main-notification-cont.active {
        opacity: 1;
    }
    .main-notification-cont.inactive {
        opacity: 0;
    }
    p {
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
    }
</style>