<script>
	import { page } from '$app/stores';
    import Header from '$lib/Header.svelte';

    console.log($page.error)

</script>
<svelte:head>
    <title>Error | Co-Des Interface</title>
</svelte:head>
<Header />
<div class="main-page">
    <h1>{$page.status}</h1>
    <h4>{$page.error?.message}</h4>
</div>
<style>
    .main-page {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: var(--main-grey-color);
    }  
</style>