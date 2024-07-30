<script lang="ts">
    export let src: string = "electric-motor.png";
    export let name: string;
    export let isUnique: boolean = true;
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
        width: 18px;
        height: 18px;
        margin: 0 0 -4px 0;
        stroke: rgba(255, 255, 255, 0.9);
        stroke-width: 2px;
        stroke-linejoin: round;
    }
    .component-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 8px;
    }
    .component-list-item {
        display: flex;
        border: solid 1px rgba(0, 0, 0, 0.1);
        width: calc(100% - 12px);
        margin: 5px;
        height: 100px;
        overflow: hidden;
        transition: .2s;
        -moz-user-select: -moz-none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: grab;
    }
    .component-list-item:active {
        cursor: grabbing;
    }
    .component-list-item:hover {
        border: solid 1px rgba(0, 0, 0, 0.4);
    }
    .main-img {
        height: 100%;
        width: auto;
        background-color: rgba(0, 0, 0, 0.1);
    }
    button {
        color: rgba(255, 255, 255, 0.9);
        background-color: rgb(30, 30, 30);
        cursor: pointer;
        transition: .2s;
        background-color: rgb(34, 34, 34);
        font-family: "Inter", sans-serif;
        font-weight: 550;
        font-size: 14px;
        border-radius: 100px;
        padding: 9px 12px 11px 12px;
        border: 1px solid rgba(255, 255, 255, 0.4);
    }
    button:hover {
        border: 1px solid rgba(255, 255, 255, 0.8);
    }
</style>
