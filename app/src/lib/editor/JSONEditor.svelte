<script lang="ts">
    import Prism from 'prismjs';

    export let text = '{"test": "hello"}';

</script>
<div class="main-textarea">
    {@html Prism.highlight(text, Prism.languages['json'])}
</div>
<style>
    .main-textarea {
        width: 100%;
        height: 100%;
        resize: none;
        font-family: 'Roboto Mono', monospace;
        font-size: 14px;
        font-weight: 500;
        padding: 8px;
        border: none;
        background-color: white;
    }
</style>