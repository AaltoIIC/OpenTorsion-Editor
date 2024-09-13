<script lang="ts">
    import { onMount } from 'svelte';

    let html2pdf: any;
    let cont: HTMLDivElement;
    export const downloadPdf = (plots: string[]) => {
        if (html2pdf && cont) {
            const opt = {
                margin:       1,
                filename:     'myfile.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { width: 1000, height: cont.offsetHeight, scale: 2 },
                jsPDF:        {  }
            };
            html2pdf().set(opt).from(cont).save();
        }
    }

    onMount(async () => {
        if (typeof window !== 'undefined') {
            html2pdf = (await import('html2pdf.js')).default;
        }
    })
</script>
<div class="main-pdf-cont" bind:this={cont}>
    <img class="main-logo" src="../logo.svg" alt="logo">
    <div class="main-header box">
        <div class="main-text">
            <h1>Analysis Results</h1>
            <h2>Analysis date</h2>
        </div>
        <div class="info-cont box">
            <canvas id="illustration" width="220px" height="220px"></canvas>
            <div class="info-text">
                <h4>System name</h4>
                <p>Created date</p>
                <p>Nof elements</p>
                <p>Nof components</p>
            </div>
        </div>
    </div>

    <div style="background: white; border-radius: var(--main-border-radius); width: 648px; height: 500px; overflow: hidden; margin: 26px auto; padding: 22px 0 42px 42px; position: relative;">
        <p style="position: absolute; top: 8px; left: 50%; font-size: 16px; font-weight: 550; color: rgba(0, 0, 0, 0.9); transform: translateX(-50%);">
            Plot name
        </p>
    </div>
    <footer>
        <p>Co-Des interface</p>
        <p>2024, Aalto IIC</p>
    </footer>
</div>
<style>
    footer {
        display: flex;
        width: 100%;
        height: 68px;
        padding: 0 1.5em;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: var(--main-dark-color);
    }
    footer p {
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
    }
    .main-logo {
        width: 140px;
        height: auto;
        margin: 1.5em;
    }
    .main-pdf-cont {
        width: 1000px;
        height: fit-content;
        padding: 0.5em 0;
        background-color: var(--main-grey-color);
    }
    .info-cont {
        display: flex;
        justify-content: center;
        padding: 1em;
        gap: 1em;
        width: fit-content;
        text-align: left;
        border: solid 3px var(--main-grey-color);
    }
    .info-text {
        width: 220px;
    }
    .info-text p {
        margin: 0;
        font-size: 14px;
    }
    .info-text h4 {
        font-size: 16px;
        margin-top: 0.5em;
    }
    .box {
        background-color: white;
        border-radius: var(--main-border-radius);
        width: fit-content;
    }
    .main-text {
        width: fit-content;
        padding: 1em;
    }
    .main-text h1, .main-text h2 {
        margin: 0.25em;
    }
    .main-header {
        width: calc(100% - 8em);
        padding: 2em;
        margin: 1em 4em;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
    }
</style>