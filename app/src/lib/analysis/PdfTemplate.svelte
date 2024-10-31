<script lang="ts">
    import { onMount } from 'svelte';
    import type { SystemType } from '$lib/types/types';
    import System3dModel from '$lib/System3dModel.svelte';
    import { formatDate, trimText } from '$lib/utils';
    import { base } from '$app/paths';

    type Plot = {
        name: string;
        html: string;
        iframe?: HTMLIFrameElement;
    };
    export let plots: Plot[] | undefined;
    export let data: SystemType;

    export let ready: boolean = false;
    let onloadCheck = setInterval(() => {
        if (plots && plots?.every(plot => plot.iframe?.contentDocument?.querySelector('.mpld3-figure'))) {
            clearInterval(onloadCheck);
            ready = true;
        }
    }, 200);
    

    let html2pdf: any;
    let cont: HTMLDivElement;
    export const downloadPdf = async () => {
        if (html2pdf && cont) {
            const safeName = trimText(data.name.replace(/[^a-zA-Z0-9-_()]/g, '-'), 16);
            const opt = {
                margin:       0,
                filename:     `${safeName}-Analysis.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { width: 1000, height: cont.offsetHeight, scale: 2 },
                jsPDF:        { format: [200, cont.offsetHeight/5] }
            };
            await html2pdf().set(opt).from(cont).save();
        }
    }

    onMount(async () => {
        if (typeof window !== 'undefined') {
            html2pdf = (await import('html2pdf.js')).default;
        }
    })
</script>
<div class="template-cont">
    <div class="main-pdf-cont" bind:this={cont}>
        <span class="logo-cont">
            <img class="main-logo" src="{base}/icon.svg" alt="logo">
            OpenTorsion Editor
        </span>
        <div class="main-header box">
            <div class="main-text">
                <h1>Analysis Results</h1>
                <h2>{formatDate(new Date().toISOString())}</h2>
            </div>
            <div class="info-cont box">
                <System3dModel data={data} size={220} />
                <div class="info-text">
                    <h4>{trimText(data.name, 20)}</h4>
                    <p>{formatDate(data.date)}</p>
                    <p>{data.components.reduce(
                        (prevSum, currentComp) => (prevSum + currentComp.elements.length),
                        0)}
                        elements
                    </p>
                    <p>
                        {data.components.length} {data.components.length > 1 ? 'components' : 'component'}
                    </p>
                </div>
            </div>
        </div>
        {#if ready && plots}
            {#each plots as {name, iframe}}
            <div style={`background: white;
                        border-radius: 0.5em;
                        width: 648px;
                        height: 500px;
                        overflow: hidden;
                        margin: 26px auto;
                        padding: 22px 0 42px 42px;
                        position: relative;
                        border: solid 2px rgb(240, 240, 240);`}>
                <p style="position: absolute; top: 8px; left: 50%; font-size: 16px; font-weight: 550; color: rgba(0, 0, 0, 0.9); transform: translateX(-50%);">
                    {name}
                </p>
                {@html iframe?.contentDocument?.querySelector('.mpld3-figure')?.outerHTML}
            </div>
            {/each}
        {/if}
        <footer>
            <p>OpenTorsion Editor</p>
            <p>2024, Aalto IIC</p>
        </footer>
    </div>
</div>
<style>
    .template-cont {
        z-index: -10;
        position: absolute;
        top: 0px;
        left: -4000px;
    }
    footer {
        display: flex;
        width: 100%;
        height: 68px;
        padding: 0 1.5em;
        box-sizing: border-box;
        justify-content: space-between;
        align-items: center;
        background-color: rgb(30, 30, 30);
    }
    footer p {
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
    }
    .main-logo {
        width: 52px;
        height: auto;
        margin-right: 10px;
    }
    .logo-cont {
        padding: 1.5em 0 0.5em 1.5em;
        display: flex;
        align-items: center;
        font-size: 22px;
        font-weight: 550;
        color: rgb(30, 30, 30);
    }
    .main-pdf-cont {
        width: 1000px;
        height: fit-content;
        padding: 0;
        background-color: rgb(250, 250, 250);
    }
    .info-cont {
        display: flex;
        justify-content: center;
        padding: 1em;
        gap: 1em;
        width: fit-content;
        text-align: left;
        border: solid 1px rgb(235, 235, 235);
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
        margin: 0.5em 0;
    }
    .box {
        background-color: white;
        border-radius: 0.5em;
        width: fit-content;
        border: solid 2px rgb(240, 240, 240);
    }
    .main-text {
        width: fit-content;
        padding: 1em;
    }
    .main-text h1, .main-text h2 {
        margin: 0.15em 0;
    }
    .main-text h2 {
        font-size: 18px;
    }
    .main-header {
        width: calc(100% - 8em);
        padding: 2em;
        margin: 1em 4em;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
    }
    h1, h2, h4, p {
        font-family: 'Inter', sans-serif;
        color: rgba(0, 0, 0, 0.8);
    }
</style>