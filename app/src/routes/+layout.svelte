<script>
    import Notification from "$lib/Notification.svelte";
    import CookieNotice from "$lib/CookieNotice.svelte";
    import { onMount } from "svelte";

    let showCookieNotice = false;

    onMount(() => {
        if (localStorage.getItem("cookieNotice") !== "true") {
            showCookieNotice = true;
        }
    });

    const closeNotice = () => {
        localStorage.setItem("cookieNotice", "true");
        showCookieNotice = false;
    };
</script>
<slot></slot>
<Notification />
{#if showCookieNotice}
    <CookieNotice onClick={closeNotice} />
{/if}