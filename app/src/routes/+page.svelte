<script>
    import NewDDTTile from "$lib/dashboard/NewDDTTile.svelte";
</script>
<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
    <title>Co-Des Interface | Dashboard</title>
</svelte:head>
<img class="main-logo" src="./logo.svg" alt="Co-Des logo">
<div class="main-page-area">
    <h2>Your Digital Design Templates:</h2>
    <div>
        <NewDDTTile />
    </div>
</div>

<style>
    :global(:root) {
        --main-color: rgb(118, 208, 235);
        --main-color-tr: rgba(118, 208, 235, 0.04);
        --main-color-2tr: rgba(118, 208, 235, 0.16);
    }
    :global(body) {
        background: white;
    }
    :global(h1, h2, h3, h4, p, a, span) {
        font-family: 'Inter', sans-serif;
        color: rgba(0, 0, 0, 0.8);
    }
    .main-logo {
        width: 114px;
        height: auto;
        margin: 32px 40px;
        display: block;
    }
    .main-page-area {
        width: 1000px;
        margin: 0 auto;
    }
</style>
