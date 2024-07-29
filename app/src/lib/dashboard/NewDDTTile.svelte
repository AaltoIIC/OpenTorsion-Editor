<a data-sveltekit-preload-data="hover" href="/new">
    <div class="main-tile">
        <svg class="add-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>      
        <p>Create New DDT</p>
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
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-shadow: rgba(149, 157, 165, 0.15) 0px 8px 24px;
    }
    .main-tile:hover {
        border: 2px solid var(--main-color);
    }
    a {
        font-size: 14px;
        font-weight: 500;
        text-decoration: none;
    }
    .add-icon {
        width: 75px;
        height: 75px;
        color: var(--main-color);
        background-color: var(--main-color-2tr);
        border-radius: 50%;
    }
    p {
        font-family: "Inter", sans-serif;
    }
</style>