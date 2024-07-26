<a data-sveltekit-preload-data="hover" href="/new">
    <div class="main-tile">
        <svg class="import-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
        </svg>
              
        <p>Import DDT</p>
    </div>
</a>
<style>
    .main-tile {
        width: 175px;
        height: 250px;
        border: 2px solid rgba(0, 0, 0, 0.1);
        background-color: var(--main-color-tr);
        transition: .2s;
        cursor: pointer;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-shadow: rgba(149, 157, 165, 0.15) 0px 8px 24px;
        margin: 0 0 15px 15px;
    }
    .main-tile:hover {
        border: 2px solid var(--main-color);
    }
    a {
        font-size: 14px;
        font-weight: 500;
        text-decoration: none;
    }
    .import-icon {
        width: 45px;
        height: 45px;
        padding: 15px;
        color: var(--main-color);
        background-color: var(--main-color-2tr);
        border-radius: 50%;
    }
    p {
        font-family: "Roboto Mono", monospace;
    }
</style>