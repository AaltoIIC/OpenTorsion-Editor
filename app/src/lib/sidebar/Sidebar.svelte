<div class="main-sidebar">
    <a href="/" class="logo-cont">
        <img class="main-logo" src="./../favicon.svg" alt="OpenTorsion Editor Logo">
        OpenTorsion Editor
    </a>
    <slot></slot>
</div>
<style>
    .main-logo {
        width: 36px;
        height: 36px;
        display: block;
        margin-right: 10px;
    }
    .logo-cont {
        display: flex;
        align-items: center;
        height: 68px;
        margin: 0 16px;
        text-decoration: none;
        font-weight: 550;
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