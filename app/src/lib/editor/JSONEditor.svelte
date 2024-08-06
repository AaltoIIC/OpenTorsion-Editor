<script lang="ts">
    import { onMount } from 'svelte';
    import Prism from 'prismjs';
    import 'prismjs/components/prism-json';
    import './prism-duotone-sea.css';

    export let text = '';
    export let onInput: (text: string) => void = () => {};
    let highlightedText = '';
    let pre: HTMLPreElement;
    let textarea: HTMLTextAreaElement;

    let nofLines = 0;
    $: nofLines = text.split("\n").length;

    const updateHighlighting = () => {
        highlightedText = Prism.highlight(text, Prism.languages.json, 'json');
    }

    // handle active line
    let activeLine = 0;
    const handleCursor = () => {
        setTimeout(() => {
            if (textarea.selectionStart === textarea.selectionEnd && textarea.selectionStart !== 0) {
                let lines = text.slice(0, textarea.selectionStart).split("\n")
                activeLine = lines[lines.length - 1] === ' ' ? lines.length : lines.length - 1;
            }
        }, 0);
    }

    let unIndented = false;
    const handleInput = (event: Event) => {
        let e = event as InputEvent;
        text = (e.target as HTMLTextAreaElement).value as string;

        // handle (un)indentation
        const closingChars: Record<string, string> = {
            '{': '}',
            '[': ']',
            '(': ')',
            '"': '"',
            "'": "'"
        }
        if(!unIndented && e.data && Object.keys(closingChars).includes(e.data)) {
            let initialCursorPos = textarea.selectionStart;
            text = text.slice(0, textarea.selectionStart - 1) + e.data + closingChars[e.data] + text.slice(textarea.selectionEnd, text.length);
            textarea.value = text;
            textarea.selectionStart = initialCursorPos;
            textarea.selectionEnd = initialCursorPos;
            unIndented = true;
            setTimeout(() => {
                unIndented = false;
            }, 300);
        } else if (unIndented && e.data && Object.values(closingChars).includes(e.data)) {
            unIndented = false;
            text = text.slice(0, textarea.selectionStart - 1) + text.slice(textarea.selectionEnd, text.length);
            textarea.value = text;
        }

        // handle tabs
        if (e.inputType && e.inputType === "insertLineBreak") {

            let lines = text.slice(0, textarea.selectionStart).split("\n");
            let lastLine = lines[lines.length - 2];
            let tabs = lastLine?.split("\t").findIndex((char) => char !== "");
            if (tabs === -1) {
                tabs = lastLine?.split("\t").length - 1;
            }
            let initialCursorPos = textarea.selectionStart;

            // if new line is between closing and opening characters
            if (Object.keys(closingChars).includes(text[textarea.selectionStart - 2]) &&
                Object.values(closingChars).includes(text[textarea.selectionStart])) {
                // modify text
                text = text.slice(0, textarea.selectionStart - 1) +
                    '\n' + '\t'.repeat(tabs + 1) +
                    '\n'  + '\t'.repeat(tabs) +
                    text.slice(textarea.selectionEnd, text.length);
                textarea.value = text;
                // move cursor
                textarea.selectionStart = initialCursorPos + tabs + 1;
                textarea.selectionEnd = initialCursorPos + tabs + 1;
            } else {
                // handle empty new line
                if(tabs === 0 && text[text.length-1] == "\n") {
                    text += " ";
                }

                // modify text
                text = text.slice(0, textarea.selectionStart - 1) +
                    '\n' + '\t'.repeat(tabs) +
                    text.slice(textarea.selectionEnd, text.length);
                textarea.value = text;
                // move cursor
                textarea.selectionStart = initialCursorPos + tabs;
                textarea.selectionEnd = initialCursorPos + tabs;
            }
        }

        updateHighlighting();
        handleScroll();
        onInput(text);
    }

    const handleTab = (e: KeyboardEvent) => {
        if(e.key === 'Tab') {
            e.preventDefault();
            let beforeTab = text.slice(0, textarea.selectionStart);
            let afterTab = text.slice(textarea.selectionEnd, text.length);
            let cursorPos = textarea.selectionEnd + 1;
            text = beforeTab + "\t" + afterTab;
            textarea.value = text;
            // move cursor
            textarea.selectionStart = cursorPos;
            textarea.selectionEnd = cursorPos;

            updateHighlighting();
            handleScroll();
        }
    }

    let scrollTop = 0;
    const handleScroll = () => {
        pre.scrollTop = textarea.scrollTop;
        pre.scrollLeft = textarea.scrollLeft;
        scrollTop = textarea.scrollTop;
    }


    onMount(() => {
        updateHighlighting();
    });
</script>
<div class="main-textarea-cont">
    <textarea id="editing"
        on:input={handleInput}
        on:keydown={(e) => {handleTab(e); handleCursor();}}
        on:click={handleCursor}
        on:focusout={() => {activeLine = -1;}}
        on:scroll={handleScroll}
        bind:this={textarea}
        spellcheck="false"></textarea>
<pre aria-hidden="true" bind:this={pre}><code>{@html highlightedText}</code></pre>
<div class="main-line-cont">
    <div class="line-cont-inner" style="transform: translateY({-scrollTop}px);">
        {#each Array.from({ length: nofLines }, (_, i) => i) as i}
            <div class="code-line {activeLine === i ? "active" : ""}">
                <div class="line-number">
                    {i + 1}
                </div>
            </div>
        {/each}
    </div>
</div>

</div>
<style>

    .line-number {
        height: 18px;
        width: 26px;
        background-color: rgba(0, 0, 0, 0.08);
        color: rgba(0, 0, 0, 0.5);
        font-size: 14px;
        text-align: right;
        padding: 0 4px;
        font-family: 'Roboto Mono', monospace;
    }
    .code-line {
        height: 18px;
        width: 100%;
    }
    .code-line.active {
        background-color: rgba(0, 0, 0, 0.06);
    }
    .main-line-cont {
        padding: 10px 10px 10px 10px;
        border: 0;
        overflow: hidden;
        width: calc(100% - 20px);
        height: calc(100% - 20px);
        position: absolute;
        top: 0;
        left: 0;
    }

    .main-textarea-cont {
        position: relative;
        width:100%;
        height: 100%;
        padding: 0;
        margin: 0;
        overflow: hidden;
        border: none;
        background-color: white;
        border: solid 1px rgb(215, 215, 215);
    }
    textarea {
        resize: none;
        z-index: 1;
        color: transparent;
        background: transparent;
        caret-color: black;
        outline: none;
    }
    textarea:focus {
        outline: initial;
    }
    ::selection {
        background: var(--main-color-tr-2);
        border-radius: 6px !important;
    }
    ::-moz-selection {
        background: var(--main-color-tr-2);
        border-radius: 6px !important;
    }
    pre {
        z-index: 0;
    }
    textarea, pre {
        padding: 10px 10px 10px 52px;
        border: 0;
        width: calc(100% - 62px);
        height: calc(100% - 20px);
        word-wrap: break-word;
        position: absolute;
        top: 0;
        left: 0;
        overflow: auto;
        white-space: pre;
        margin: 0;
        font-weight: 500;
    }
    textarea, pre, pre * {
        font-family: 'Roboto Mono', monospace !important;
        font-size: 14px;
        line-height: 18px;
        tab-size: 2;
    }

    ::-webkit-scrollbar {
        width: 8px;
    }
    ::-webkit-scrollbar-track {
        background: rgb(242, 242, 242);
        border: solid 1px rgb(229, 229, 229);
    }
    ::-webkit-scrollbar-thumb {
        background: rgb(217, 217, 217);
        cursor: pointer;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: rgb(204, 204, 204);
    }
</style>