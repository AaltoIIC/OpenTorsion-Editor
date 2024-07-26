<script lang="ts">
    export let isEditing: boolean;
    export let paramName: string;
    export let paramValue: string | number | undefined;
    let isUndef = typeof paramValue === 'undefined';
    let onHover = false;

    const makeDef = () => {
        if (isUndef) {
            paramValue = 0;
            isUndef = false;
        }
    }

    // helper function to convert large numbers to engineering notation
    const toEngineeringNotation = (num: number)=> {
        if (num <= 10000000) {
            return num.toString();
        }

        const exponent = Math.floor(Math.log10(num) / 3) * 3;
        const mantissa = num / Math.pow(10, exponent);

        return `${mantissa}e${exponent}`
    };
</script>
<p class="{isUndef ? 'undef-cont' : 'def-cont'} {isEditing ? "active" : ""} {onHover ? "hover" : ""}"
    on:mouseenter={() => {onHover = true}}
    on:mouseleave={() => {onHover = false}}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <span class="param-name"
        on:click={makeDef}>
        <svg class="icon-add" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        {paramName}<span class="param-colon">:</span>
    </span>
    <span class="param-val-outer">
        <span
            class="param-val" 
            contenteditable="{paramName != "type"}">
                {typeof paramValue === 'number' ? toEngineeringNotation(paramValue) : paramValue}
        </span>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <svg
            on:click={() => {paramValue = undefined; isUndef = true}}
            class="icon-close {isEditing && !(['type', 'damping'].includes(paramName)) ? 'active' : ''}"
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
    </span>
</p>
<style>
    .def-cont .param-val {
        position: relative;
        bottom: -4px;
    }
    .def-cont .param-name {
        padding: 4px;
    }
    .def-cont {
        padding: 2px 2px 2px 10px;
        margin: 0;
    }
    .def-cont:hover {
        background-color: rgba(0, 0, 0, 0.04);
        border-radius: 5px;
    }
    .undef-cont .param-val-outer, .undef-cont .param-colon {
        display: none;
    }
    .icon-add {
        display: none;
    }
    .undef-cont .icon-add {
        display: initial;
        width: 15px;
        height: 15px;
        margin: 0 0 -3px 0;
    }
    .undef-cont .param-name {
        color: rgba(0, 0, 0, 0.5);
        font-size: 12px;
        padding: 0px;
        cursor: pointer;
    }
    .undef-cont {
        display: none !important;
        order: 999;
    }
    .undef-cont.active {
        display: flex !important;
        justify-content: space-between;
    }
    .undef-cont .param-name:hover {
        color: rgba(0, 0, 0, 0.9);
    }
    .param-val {
        padding: 2px;
        border-radius: 5px;
        border: solid 2px rgba(0, 0, 0, 0);
        font-weight: 600;
        font-family: "Roboto Mono", monospace;
    }
    .param-val[contenteditable="true"] {
        border: solid 2px rgba(0, 0, 0, 0.1);
        background-color: white;
        font-weight: 400;
    }
    .param-name {
        padding: 2px;
        font-family: "Roboto Mono", monospace;
    }
    .icon-close {
        width: 15px;
        height: 15px;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.4);
        margin-bottom: -6px;
        margin-left: -2px;
        opacity: 0;
        pointer-events: none;
    }
    .icon-close:hover {
        color: rgb(214, 81, 81);
    }
    .hover .icon-close.active {
        opacity: 1;
        pointer-events: all;
    }
    p {
        margin: 6px;
        display: flex;
        justify-content: space-between;
        font-family: "Roboto Mono", monospace;
    }
</style>