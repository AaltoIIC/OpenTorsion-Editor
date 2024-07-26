<script lang="ts">
    import { writable } from 'svelte/store';
    import { currentJSON } from '../../stores';
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
            let data = {
              name: `Element ${$currentJSON.elements ? $currentJSON.elements.length + 1 : 1}`,
              type: "Disk",
              damping: 0,
              inertia: 8.35e+06
            }

            nodes.update(n => [...n, {
              id: `${nOfElements}`,
              type: 'disk',
              dragHandle: '.none',
              data: data,
              position: { x: currentPosition, y: 150 }
            }]);
            currentPosition += 21;

            // update JSON
            currentJSON.update(value => {
                return {
                    ...value,
                    elements: [
                        ...(value.elements ? value.elements : []),
                        data
                    ]
                }
            });

        } else if (type === "shaft") {
            let data ={
                            name: `Element ${$currentJSON.elements ? $currentJSON.elements.length + 1 : 1}`,
                            type: "ShaftDiscrete",
                            damping: 0,
                            stiffness: 4.49e+09
            }

            nodes.update(n => [...n, {
              id: `${nOfElements}`,
              type: 'shaft',
              dragHandle: '.none',
              data: data,
              position: { x: currentPosition, y: 150 }
            }]);
            currentPosition += 72;

            // update JSON
            currentJSON.update(value => {
                return {
                    ...value,
                    elements: [
                        ...(value.elements ? value.elements : []),
                        data
                    ]
                }
            });
        } else if (type === "gear") {
            let data = {
                            name: `Element ${$currentJSON.elements ? $currentJSON.elements.length + 1 : 1}`,
                            type: "Gear",
                            damping: 0
            }

            nodes.update(n => [...n, {
              id: `${nOfElements}`,
              type: 'gear',
              dragHandle: '.none',
              data: data,
              position: { x: currentPosition, y: 150 }
            }]);
            currentPosition += 21;

            // update JSON
            currentJSON.update(value => {
                return {
                    ...value,
                    elements: [
                        ...(value.elements ? value.elements : []),
                        data
                    ]
                }
            });
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