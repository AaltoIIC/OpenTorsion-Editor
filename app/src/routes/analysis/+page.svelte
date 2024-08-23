<script lang="ts">
    import Sidebar from "$lib/sidebar/Sidebar.svelte";
    import { onMount } from "svelte";
    import { currentSystemJSON } from "$lib/stores/stores";

    let responseHTML: string = "";
    const plotStyles = `
        text {
            font-family: 'Roboto Mono', monospace !important;
        }
    `

    const callCampbell = () => {
        let url = "http://127.0.0.1:5000/campbell";
        let data = $currentSystemJSON;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.text())
            .then(data => {
                responseHTML = `${data}<style>${plotStyles}</style>`;
                console.log(data);
            });
    }

    onMount(() => {
        callCampbell();
    });

</script>
<Sidebar>
    <a href="/system-editor">Go back</a>
</Sidebar>
<main>
    <div class="main-response">
        <iframe title="Campbell Diagram"
                srcdoc={responseHTML}
                style="width: 900px; height: 600px; border: none;">  
        </iframe>
    </div>
</main>
<style>
    .main-response {
        width: 900px;
        height: 600px;
        position: absolute;
        left: 360px;
        top: 68px;
    }
</style>