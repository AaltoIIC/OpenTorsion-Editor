<script lang="ts">
    export let size = 24;
</script>
<div class="switch-outer" style="width: {size}px; height: {size/2}px;">
    <div class="switch-button">

    </div>
</div>
<style>
    .switch-outer {
        background-color: white;
        border: var(--main-border);
    }
    .switch-outer, .switch-button {
        border-radius: 50px;
    }
</style>