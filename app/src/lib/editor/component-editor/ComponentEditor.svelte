<script lang="ts">
    import { writable } from 'svelte/store';
    import { currentComponentJSON } from '../../stores';
    import { renderNodes, defaultElement } from './componentHelpers';
    import {
      SvelteFlow,
      Controls,
      Background,
      BackgroundVariant,
      useSvelteFlow,

      type NodeTypes

    } from '@xyflow/svelte';
    import '@xyflow/svelte/dist/style.css';

    import EmptyNode from './EmptyNode.svelte';
    import DiskNode from './DiskNode.svelte';
    import ShaftNode from './ShaftNode.svelte';
    import GearNode from './GearNode.svelte';
    import GearboxNode from './GearboxNode.svelte';
    const { fitView } = useSvelteFlow();

    const nodeTypes = {
      'disk': DiskNode,
      'shaft': ShaftNode,
      'gear': GearNode,
      'gearbox': GearboxNode,
      'empty': EmptyNode
    } as {} as NodeTypes;   
  
    const nodes = writable([
      {
        id: '1',
        type: 'empty',
        dragHandle: '.none',
        data: { label: 'Node' },
        position: { x: 0, y: 150 }
      }
    ]);

    const edges = writable([]);

    currentComponentJSON.subscribe(value => {
      if (!value.elements) {
        alert('Malformed JSON');
      } else {
        nodes.set(renderNodes(value.elements));
        setTimeout(() => {
            fitView();
        }, 0);
      }
    });

    // drag and drop logic
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

      const dataStr = event.dataTransfer.getData('application/svelteflow');
      let data;
      try {
        data = JSON.parse(dataStr) as {event: string, element: string};
      } catch (e) {
        return null;
      }
      if (data.event === 'addNew') {
        currentComponentJSON.update(value => {
          return {
              ...value,
              elements: [...value.elements, defaultElement((value.elements ? value.elements : []), data.element)]
          }
      });
      }
    };

//on:dragover={onDragOver} on:drop={onDrop} 
</script>
<SvelteFlow
  nodes={nodes}
  edges={edges}
  nodeTypes={nodeTypes} 
  fitView
>
  <Controls />
  <Background variant={BackgroundVariant.Dots} />
</SvelteFlow>