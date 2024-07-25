<script lang="ts">
    import { writable } from 'svelte/store';
    import {
      SvelteFlow,
      Controls,
      Background,
      BackgroundVariant,
      useSvelteFlow
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
    };

    // keep track of json code
    export let componentJSON: {name: string, nodes: any[]};

    // add element
    let nOfElements = 0;
    let currentPosition = 0;
    export const addElement = (type: String) => {
        if (nOfElements === 0) {
            nodes.update(n => []);
            nOfElements++;
        }
        nOfElements++;
        if (type === "disk") {
            nodes.update(n => [...n, {
              id: `${nOfElements}`,
              type: 'disk',
              dragHandle: '.none',
              data: { label: 'Node' },
              position: { x: currentPosition, y: 150 }
            }]);
            currentPosition += 111;

            // update JSON
            componentJSON.nodes.push({
                        name: "Element1",
                        type: "Disk",
                        damping: 0,
                        inertia: 8.35e+06
             });
        } else if (type === "shaft") {
            nodes.update(n => [...n, {
              id: `${nOfElements}`,
              type: 'shaft',
              dragHandle: '.none',
              data: { label: 'Node' },
              position: { x: currentPosition, y: 150 }
            }]);
            currentPosition += 358;
        } else if (type === "gear") {
            nodes.update(n => [...n, {
              id: `${nOfElements}`,
              type: 'gear',
              dragHandle: '.none',
              data: { label: 'Node' },
              position: { x: currentPosition, y: 150 }
            }]);
            currentPosition += 111;
        }

        setTimeout(() => {
            fitView();
        }, 0);
    }
   
  
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