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
        margin: 12px 18px;
        display: block;
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