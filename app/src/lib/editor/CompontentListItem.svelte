<script>
    export let src;
    export let name;
    export let isUnique = true;
</script>
<div class="component-list-item">
    <img class="main-img" src={`./components/${src}`} alt={name} />
    <div class="component-info">
        <div>
            <h4>{name}</h4>
            <p>{isUnique ? "Custom component" : "Generic component"}</p>
        </div>
        <div>
            <button>Add
                <svg class="add-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>              
            </button>
        </div>
    </div>
</div>
<style>
    p {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
        margin: 0;
    }
    h4 {
        margin: 0;
    }
    .add-icon {
        width: 20px;
        height: 20px;
        margin: 0 0 -5px 0;
    }
    .component-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 10px;
    }
    .component-list-item {
        display: flex;
        border: solid 1px rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        width: calc(100% - 12px);
        margin: 5px;
        height: 100px;
        overflow: hidden;
    }
    .main-img {
        height: 100%;
        width: auto;
        background-color: rgba(0, 0, 0, 0.1);
    }
    button {
        color: rgba(255, 255, 255, 0.9);
        background-color: var(--main-color);
        padding: 8px;
        font-weight: 500;
        border: 1px solid rgba(255, 255, 255, 0.4);
        border-radius: 5px;
        cursor: pointer;
        transition: .2s;
    }
    button:hover {
        border: 1px solid rgba(255, 255, 255, 0.6);
    }
</style>
