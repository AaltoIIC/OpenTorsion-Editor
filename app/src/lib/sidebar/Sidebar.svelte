<script>
    import { version } from '$app/environment'
    import { base } from '$app/paths';
    import DropdownMenu from '$lib/DropdownMenu.svelte';
</script>
<div class="main-sidebar">
    <div class="upper-cont">
        <a href="/" class="logo-cont">
            <img class="main-logo" src="{base}/icon.svg" alt="OpenTorsion Editor Logo">
            OpenTorsion Editor <sub>{version}</sub>
        </a>
        <DropdownMenu
            options={["Digital Twins", "Dark Mode"]}
            toggles={true}
        />
    </div>
    <slot></slot>
    <div class="lower-menu">
        <a href="https://github.com/AaltoIIC/OpenTorsion-Editor/issues" target="_blank">
            <svg class="icon-report" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>Report issue
        </a>
    </div>
</div>
<style>
    .upper-cont {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 68px;
        padding: 0 16px;
    }
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
        text-decoration: none;
        font-weight: 550;
    }
    .logo-cont sub {
        font-size: 10px;
        position: relative;
        top: -3.5px;
        left: 3px;
        color: rgba(0, 0, 0, 0.6);
    }
    .main-sidebar {
        position: absolute;
        top: 0;
        left: 0;
        height: 100vh;
        width: 360px;
        border-right: var(--main-border);
    }
    .lower-menu {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 34px;
        border-top: var(--main-border);
        background: white;
        display: flex;
        justify-content: left;
        align-items: center;
        padding: 0 4px;
        box-sizing: border-box;
    }
    .lower-menu a {
        font-weight: 550;
        font-size: 14px;
        text-decoration: none;
    }
    .icon-report {
        width: 16px;
        height: 16px;
        margin-bottom: -2.5px;
        margin-right: 3px;
    }
</style>