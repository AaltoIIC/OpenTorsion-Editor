<script lang="ts">
    export let page: string = 'system editor';
</script>
<div class="main-sidebar">
    <span class="logo-cont">
        <a class="main-logo-link" data-sveltekit-preload-data="hover" href="/">
            <img class="main-logo" src="../logo.svg" alt="OpenTorsion Editor Logo">
        </a>
        <span class="slash">/</span>
        <span class="page">{page}</span>
    </span>
    <slot></slot>
</div>
<style>
    .logo-cont {
        display: flex;
        width: 100%;
        align-items: center;
        text-decoration: none;
    }
    .slash {
        font-size: 38px;
        font-family: 'Roboto Mono' monospace;
        font-weight: 150;
        margin-left: -8px;
    }
    .page {
        font-size: 16px;
        font-family: 'Roboto Mono' monospace;
        margin-left: 8px;
    }
    .main-logo {
        width: 38px;
        height: auto;
        margin: 16px;
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
        border-right: var(--main-border);
    }
</style>