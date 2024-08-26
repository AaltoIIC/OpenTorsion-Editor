<div class="main-sidebar">
    <a class="main-logo-link" data-sveltekit-preload-data="hover" href="/">
        <img class="main-logo" src="../logo.svg" alt="Co-Des logo">
    </a>
    <slot></slot>
</div>
<style>
    .main-logo-link {
        display: block;
        width: fit-content;
    }
    .main-logo {
        width: 114px;
        height: auto;
        margin: 24px 18px;
        display: block;
        z-index: 11;
        position: relative;
    }
    .main-sidebar {
        position: absolute;
        top: 0;
        left: 0;
        height: 100vh;
        width: 360px;
        border-right: solid 2px rgb(229, 229, 229);
    }
</style>