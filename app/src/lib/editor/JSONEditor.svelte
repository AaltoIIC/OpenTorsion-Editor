<script lang="ts">
    import { onMount } from 'svelte';
    import Prism from 'prismjs';
    import 'prismjs/components/prism-json';
    import './prism-duotone-sea.css';

    export let textContent = '';

    export let onInput: (text: string) => void = () => {};
    let highlightedText = '';
    let pre: HTMLPreElement;
    let textarea: HTMLTextAreaElement;
    let text = '';
    let isUserInput = false;

    // jump to line in editor
    export const jumpToLine = (lineNo: number) => {
        let lineDiv = document.querySelector(`.line-${lineNo}`);
        if (!lineDiv || !textarea) return;

        let lineFromTextareaTop = (lineDiv.getBoundingClientRect().top
                        - textarea.getBoundingClientRect().top
                        + scrollTop
                        -20)

        let topPos = Math.min(lineFromTextareaTop, textarea.scrollHeight - textarea.clientHeight);

        // if textarea is not scrollable, do not scroll
        const isTextareaScrollable = textarea.scrollHeight > textarea.clientHeight;
        if (isTextareaScrollable) {
            scrollTop = topPos;
            textarea.scrollTop = topPos;
        }
    }

    // export function to highlight lines in editor
    let highlightedLines: {start: number, end: number} = {start: -1, end: -1};
    export const highlightLines = (start: number, end: number) => {
        if (start >= 0) {
            jumpToLine(start);
        };

        highlightedLines = {start, end};
    }


    let nofLines = 0;
    $: nofLines = text.split("\n").length;

    const updateHighlighting = () => {
        highlightedText = Prism.highlight(text, Prism.languages.json, 'json');
    }

    // handle active line
    let activeLine = -1;
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
        isUserInput = true;
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
            let initialCursorPos = textarea.selectionStart;
            text = text.slice(0, textarea.selectionStart - 1) + text.slice(textarea.selectionEnd, text.length);
            textarea.value = text;
            textarea.selectionStart = initialCursorPos;
            textarea.selectionEnd = textarea.selectionStart;
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
        isUserInput = false;
        textContent = text;
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
            textContent = text;
        }
    }

    let scrollTop = 0;
    const handleScroll = () => {
        if (!textarea) return;
        pre.scrollTop = textarea.scrollTop;
        pre.scrollLeft = textarea.scrollLeft;
        scrollTop = textarea.scrollTop;
    }

    const changeSpacesToTabs = (txt: string) => {
        txt = txt.replace(/    /g, "\t").replace(/  /g, "\t");
        return txt;
    }

    $: if (textContent !== text && textarea) {
        textContent = changeSpacesToTabs(textContent);
        text = textContent;
        textarea.value = text;
        updateHighlighting();
    }

    onMount(() => {
        textContent = changeSpacesToTabs(textContent);
        text = textContent;
        textarea.value = text;
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
            <div class="code-line {activeLine === i ? "active" : ""} line-{i}">
                <div class="line-number {i+1 >= highlightedLines.start && i+1 < highlightedLines.end ? "highlighted" : ""}">
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
        background-color: rgb(235, 235, 235);
        color: rgba(0, 0, 0, 0.5);
        font-size: 14px;
        text-align: right;
        padding: 0 4px;
        font-family: 'Roboto Mono', monospace;
    }
    .line-number.highlighted {
        background-color: var(--main-color-dark);
        color: rgba(255, 255, 255, 0.9);
        opacity: 0.8;
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
        padding: 0 10px 0 52px;
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
        padding: 10px 0 0 0;
        border: 0;
        width: calc(100% - 116px);
        height: calc(100% - 18px);
        word-wrap: break-word;
        position: absolute;
        top: 0px;
        left: 52px;
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
        height: 8px;
    }
    ::-webkit-scrollbar-track {
        background: transparent;
    }
    ::-webkit-scrollbar-thumb {
        background: rgb(217, 217, 217);
        border: solid 1px rgb(205, 205, 205);
        cursor: pointer;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: rgb(204, 204, 204);
    }
</style>