<script lang="ts">
    import {
      getSmoothStepPath,
      BaseEdge,
      type EdgeProps,
      EdgeLabelRenderer
    } from '@xyflow/svelte';
    import { currentSystemJSON } from '$lib/stores/stores';
    import _ from 'lodash';
  
    type $$Props = EdgeProps;
    $$restProps
  
    export let sourceX: $$Props['sourceX'];
    export let sourceY: $$Props['sourceY'];
    export let sourcePosition: $$Props['sourcePosition'];
    export let targetX: $$Props['targetX'];
    export let targetY: $$Props['targetY'];
    export let targetPosition: $$Props['targetPosition'];
    export let markerEnd: $$Props['markerEnd'] = undefined;
    export let style: $$Props['style'] = undefined;
    export let sourceHandleId: $$Props['sourceHandleId'] = null;
    export let targetHandleId: $$Props['targetHandleId'] = null;
  
    $: [edgePath, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition
    });
  
    const onEdgeClick = () => {
      currentSystemJSON.update((json) => {
        const newJson = { ...json };
        newJson.json.structure = newJson.json.structure.filter(
          (connection) => connection[0] !== sourceHandleId && connection[1] !== targetHandleId
        );
        return newJson;
      });
    }

    let hover = false;
  </script>
  <BaseEdge path={edgePath} {markerEnd} {style} />
  <EdgeLabelRenderer>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <div class="hover-helper nodrag nopan"
        style:transform="translate(-50%, -50%) translate({labelX}px,{labelY}px)"
        style:width="{Math.abs(sourceX - targetX)}px"
        style:height="{Math.abs(sourceY - targetY)}px"
        on:mouseenter={() => {hover = true}}
        on:mouseleave={() => {hover = false}}>
    </div>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <div
      class="edgeButtonContainer nodrag nopan"
      style:transform="translate(-50%, -50%) translate({labelX}px,{labelY}px)"
      on:mouseenter={() => {hover = true}}
      on:mouseleave={() => {hover = false}}
    >
      <button class="edgeButton {hover ? "hover" : ""}" on:click={onEdgeClick}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>               
      </button>
    </div>
  </EdgeLabelRenderer>
  <style>
    .hover-helper {
        pointer-events: all;
        padding: 32px;
        position: absolute;
    }

    .edgeButtonContainer {
      position: absolute;
      top: 2px;
      pointer-events: all;
    }
  
    .edgeButton {
      width: 40px;
      height: 40px;
      border: 2px solid rgba(255, 255, 255, 0.4);
      background-color: rgb(30, 30, 30);
      color: rgba(255, 255, 255, 0.9);
      cursor: pointer;
      border-radius: 50%;
      line-height: 1;
      position: relative;
      transition: .2s;
      opacity: 0;
    }
    .edgeButton.hover {
        opacity: 1;
        border: 2px solid rgba(255, 255, 255, 0.8);
    }

    .edgeButton svg {
        width: 22px;
        height: 22px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        stroke-width: 2px;
        stroke-linejoin: round;
        color: rgba(255, 255, 255, 0.9);
    }
  </style>