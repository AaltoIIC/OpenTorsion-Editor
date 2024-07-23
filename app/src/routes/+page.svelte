<script>
    import NewDDTTile from "$lib/dashboard/NewDDTTile.svelte";
    import ImportDdtTile from "$lib/dashboard/ImportDDTTile.svelte";
</script>
<svelte:head>
    <title>Dashboard | Co-Des Interface</title>
</svelte:head>
<img class="main-logo" src="./logo.svg" alt="Co-Des logo">
<div class="main-page-area">
    <h2>Your Digital Design Templates:</h2>
    <div class="ddt-cont">
        <NewDDTTile />
        <ImportDdtTile />
    </div>
</div>

<style>
    .main-logo {
        position: absolute;
        top: 0;
        left: 0;
        width: 114px;
        height: auto;
        margin: 12px 18px;
        display: block;
    }
    .main-page-area {
        width: 1000px;
        margin: 120px auto;
    }
    .ddt-cont {
        display: flex;
        justify-content: start;
    }
</style>
