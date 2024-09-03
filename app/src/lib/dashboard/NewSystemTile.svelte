<a data-sveltekit-preload-data="hover" href="/system-editor
">
    <div class="main-tile">
        <svg class="add-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>      
        <p>Create New System</p>
    </div>
</a>
<style>
    .main-tile {
        width: 175px;
        height: 250px;
        border-radius: var(--main-border-radius);
        background-color: white;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0 0 15px 15px;
        box-sizing: border-box;
    }
    .main-tile:hover {
        background-color: var(--main-hover-color);
    }
    a {
        font-size: 14px;
        font-weight: 500;
        text-decoration: none;
    }
    .add-icon {
        width: 52px;
        height: 52px;
        color: var(--main-color);
    }
    p {
        font-family: "Inter", sans-serif;
    }
</style>