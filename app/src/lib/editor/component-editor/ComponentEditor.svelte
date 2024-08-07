<script lang="ts">
    import { writable } from 'svelte/store';
    import { currentComponentJSON } from '../../stores';
    import { renderNodes } from './componentHelpers';
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
    const { fitView } = useSvelteFlow();

    const nodeTypes = {
      'disk': DiskNode,
      'shaft': ShaftNode,
      'gear': GearNode,
      'empty': EmptyNode
    } as NodeTypes;   
  
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