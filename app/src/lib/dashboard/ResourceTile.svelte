<script lang="ts">
    export let name: string;
    export let link: string;
    export let description: string;
    export let icon: string;
</script>
<a href={link}>
    <div class="resource-tile">
        <h4>{name}</h4>
        <p>{description}</p>
        <span class="icon">
            {@html icon}
        </span>
    </div>
</a>
<style>
    .icon {
        position: absolute;
        bottom: -45px;
        left: -35px;
        width: 128px;
        height: 128px;
        color: var(--main-color);
    }
    .resource-tile {
        padding: 20px;
        border: var(--main-border);
        border-radius: var(--main-border-radius);
        margin: 0 0 15px 15px;
        overflow: hidden;
        height: 180px;
        position: relative;
        background: linear-gradient(rgba(0,0,0,0) 60%, var(--main-color-tr-2) 100%);
    }
    .resource-tile:hover {
        background-color: var(--main-hover-color);
    }
    p {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
    }
    h4, p {
        margin: 4px;
    }
    a {
        text-decoration: none;
        flex-basis: 0;
        flex-grow: 1;
    }
</style>