<script lang="ts">
    export let data: any;
    export let height: number = data.height;
</script>
<div class="gearbox" style:height="{height*80}px">
</div>
<style>
    .gearbox {
        width: 22px;
        background-color: var(--main-color-tr-3);
        border: solid 2px var(--main-color-tr-3);
        border-radius: 2.4px;
        margin-left: -2px;
        padding: 0 0 2px 0;
        margin-top: 18px;
    }
</style>