<script>
	import { page } from '$app/stores';
    import Header from '$lib/Header.svelte';
    import Button from '$lib/Button.svelte';
    import { goto } from '$app/navigation';
</script>
<svelte:head>
    <title>Error | Co-Des Interface</title>
</svelte:head>
<Header />
<div class="main-page">
    <img class="illustration" src="./../error.png" alt="Error illustration">
    <div class="error-desc">
        <h1>{$page.status}</h1>
        <h4>{$page.error?.message}</h4>
        <Button
            color="rgb(30, 30, 30)"
            icon='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>'
            onClick={() => {goto('/')}}>
            Go to front page
        </Button>
    </div>
</div>
<style>
    .illustration {
        width: 300px;
        height: fit-content;
    }
    .error-desc {
        margin-left: 32px;
        padding: 40px 0 40px 42px;
        border-left: 2px solid var(--main-dark-color);
        width: max-content;
        text-align: center;
    }
    .error-desc h1 {
        font-size: 68px;
        font-weight: 700;
        color: var(--main-dark-color);
        line-height: 1;
        margin: 0;
    }
    .error-desc h4 {
        font-size: 22px;
        font-weight: 400;
        color: var(--main-dark-color);
        line-height: 1;
        margin: 0 0 12px 0;
    }
    .main-page {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--main-grey-color);
    }
</style>