<script lang="ts">
    import { writable } from 'svelte/store';
    import {
      SvelteFlow,
      Controls,
      Background,
      BackgroundVariant,
      useSvelteFlow,

      type NodeTypes,

      type Node


    } from '@xyflow/svelte';
    import '@xyflow/svelte/dist/style.css';
    import './system-editor.css'
    import ComponentNode from './ComponentNode.svelte';

    const nodeTypes: NodeTypes = {
      'component': ComponentNode
    } as {} as NodeTypes;

    const nodes = writable([]);

    const edges = writable([
    ]);

    const { screenToFlowPosition } = useSvelteFlow();
    const onDragOver = (event: DragEvent) => {
      event.preventDefault();

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
      }
    };

    const onDrop = (event: DragEvent) => {
      event.preventDefault();

      if (!event.dataTransfer) {
        return null;
      }

      const data = event.dataTransfer.getData('application/svelteflow');

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      });

      const newNode = {
        id: `${Math.random()}`,
        type: 'component',
        position,
        data: JSON.parse(data),
        origin: [0.5, 0.0]
      } satisfies Node;

      $nodes.push(newNode);
      $nodes = $nodes;
    };
</script>

<SvelteFlow
    nodeTypes={nodeTypes}
    {nodes}
    {edges}
    on:dragover={onDragOver} on:drop={onDrop}
    fitView
    on:nodeclick={(event) => console.log('on node click', event.detail.node)}
    defaultEdgeOptions={{
      animated: true,
      deletable: true,
    }}>
    <Controls />
    <Background variant={BackgroundVariant.Dots} />
</SvelteFlow>