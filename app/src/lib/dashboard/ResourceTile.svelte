<script lang="ts">
    export let name: string;
    export let link: string;
    export let description: string;
</script>
<a href={link}>
    <div class="resource-tile">
        <h4>{name}</h4>
        <p>{description}</p>
    </div>
</a>
<style>
    .resource-tile {
        padding: 20px;
        border: var(--main-border);
        border-radius: var(--main-border-radius);
        margin: 0 0 15px 15px;
        height: 180px;
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