<script>
    import Header from '$lib/Header.svelte';
</script>
<svelte:head>
    <title>Mobile | OpenTorsion Editor</title>
    <meta name="robots" content="noindex">
</svelte:head> 
<Header />
<div class="main-page">
    <img class="illustration" src="./../error.png" alt="Error illustration">
    <div class="error-desc">
        <h4>Use the Editor on Desktop</h4>
        <p>OpenTorsion Editor is not available on mobile devices. Please use a desktop or laptop to access the editor.</p>
    </div>
</div>
<footer>
    <p>OpenTorsion Editor</p>
    <p>2024, Aalto IIC</p>
</footer>
<style>
    .illustration {
        width: 300px;
        height: fit-content;
    }
    .error-desc {
        padding: 0 20px 20px 20px;
    }
    .error-desc h4 {
        font-size: 22px;
        font-weight: 550;
        color: var(--main-dark-color);
        line-height: 1;
        margin: 0;
    }
    .error-desc p {
        margin: 8px 0;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.7);
    }
    .main-page {
        position: absolute;
        width: calc(100vw - 40px);
        max-width: 400px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: var(--main-border);
        border-radius: var(--main-border-radius);
        text-align: center;
    }
    footer {
        height: 68px;
        width: 100%;
        background-color: var(--main-dark-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        box-sizing: border-box;
        position: fixed;
        bottom: 0;
        left: 0;
    }
    footer p {
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
    }
</style>