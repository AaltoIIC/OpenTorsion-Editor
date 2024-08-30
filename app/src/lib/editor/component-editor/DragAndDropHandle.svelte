<script lang="ts">
    import { currentComponentJSON } from "$lib/stores/stores";
    import { onMount, onDestroy } from "svelte";
    import { defaultElement } from "./componentHelpers";

    export let elementName: string;

    let leftActive = false;
    let rightActive = true;
    $: if ($currentComponentJSON.json.elements && $currentComponentJSON.json.elements.length > 0) {
        leftActive = $currentComponentJSON.json.elements[0].name === elementName;
    }

    let hoverLeft = false;
    let hoverRight = false;
    let isDragging = false;

    let cancelHover: any;
    const handleDragOver = (event: DragEvent, side: string) => {
        event.preventDefault();
        event.stopPropagation();

        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = 'move';
        }

        clearTimeout(cancelHover);
        
        if (side === 'left') {
            hoverLeft = true;
        } else {
            hoverRight = true;
        }

        cancelHover = setTimeout(() => {
            hoverLeft = false;
            hoverRight = false;
        }, 200);
    }

    const handleDrop = (event: DragEvent, side: string) => {

      event.preventDefault();
      event.stopPropagation();
      if (!event.dataTransfer) {
        return null;
      }

      let dataStr = event.dataTransfer.getData('application/svelteflow');
      let data: {event: string, element: string};
      try {
        data = JSON.parse(dataStr) as {event: string, element: string};
      } catch (e) {
        return null;
      }

      // add new element to the component to the left or right of the current element
      currentComponentJSON.update(value => {
        let newElem;
        let newElements = value.json.elements;

        if (data.event === 'addNew') {
            newElem = defaultElement((value.json.elements ? value.json.elements : []), data.element);
        } else if (data.event === 'addExisting') {
            newElem = newElements.find((element) => element.name === data.element);
            newElements = newElements.filter((element) => element.name !== data.element);
        }

        let elementIndex = newElements.findIndex((element) => element.name === elementName);
        if (side === 'right') {
            elementIndex = elementIndex + 1;
        }

        if (!newElem) {
            console.error('Element not found');
            return value;
        }

        newElements.splice(elementIndex, 0, newElem)
        return {
            ...value,
            json: {
                ...value.json,
                elements: newElements
            }
        }
      });
    };


    let cancelDrag: any;
    const handleDrag = () => {
        clearTimeout(cancelDrag);
        isDragging = true;
        cancelDrag = setTimeout(() => {
            isDragging = false;
        }, 100);
    }

    onMount(() => {
        // make drag handle visible when dragging
        document.addEventListener('drag', handleDrag);
    });
    onDestroy(() => {
        // clean up event listeners
        document.removeEventListener('drag', handleDrag);
    });
</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if leftActive}
    <div class="add-handle left {hoverLeft ? 'hover' : ''} {isDragging ? 'dragging' : ''}"
        on:dragover={(e) => handleDragOver(e, 'left')}
        on:drop={e => handleDrop(e, 'left')}
        >
        <svg class="icon-add" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    </div>
{/if}
{#if rightActive}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="add-handle right {hoverRight ? 'hover' : ''} {isDragging ? 'dragging' : ''}"
        on:dragover={(e) => handleDragOver(e, 'right')}
        on:drop={e => handleDrop(e, 'right')}>
        <svg class="icon-add" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    </div>
{/if}
<style>
    .icon-add {
        width: 8px;
        height: 8px;
        fill: none;
        stroke: rgba(255, 255, 255, 0.9);
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
        transform: translate(28%, -65%);
        margin: 0;
        padding: 0;
    }
    .add-handle {
        position: absolute;
        top: calc(50% - 2px);
        width: 12px;
        height: 12px;
        border-radius: 18px;
        background-color: rgb(30, 30, 30);
        border: solid 1px rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(4px);
        z-index: 1000;
        box-shadow: rgba(149, 157, 165, 0.6) 0px 1.6px 4.8px;
        transition: .3s;
        visibility: hidden;
        opacity: 0;
    }
    .add-handle.dragging {
        visibility: visible;
        opacity: 0.8;
    }
    .add-handle.hover {
       transform: scale(1.3);
       opacity: 1;
    }
    .add-handle.left {
        left: -6px;
    }
    .add-handle.right {
        right: -6px;
    }
</style>