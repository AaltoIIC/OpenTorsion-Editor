<script lang="ts">
    export let name: string;
    export let onClick: (name: string) => void = (name: string) => {};

    let onHover: boolean = false;
</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="prev-elem {onHover ? 'hover' : ''}"
    on:mouseenter={() => {onHover = true}}
    on:mouseleave={() => {onHover = false}}
    on:click={() => {onClick(name)}}>
    <span>{name.slice(0, 12)}</span>
    <svg class="icon-copy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6" />
    </svg>
</div>
<style>
    .icon-copy {
        width: 16px;
        height: 16px;
        color: rgba(0, 0, 0, 0.3);
        transform: translateY(2px);
        float: right;
        display: none;
    }
    .hover .icon-copy {
        display: block;
    }
    .prev-elem span {
        font-family: "Roboto Mono", monospace;
    }
    .prev-elem {
        padding: 6px 16px;
        cursor: pointer;
    }
    .prev-elem:nth-of-type(2n - 1) {
        background-color: rgba(0, 0, 0, 0.04);
    }
    .prev-elem:hover {
        background-color: rgba(0, 0, 0, 0.06);
    }
</style>