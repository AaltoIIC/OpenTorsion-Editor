<script lang="ts">
    import { writable } from 'svelte/store';
    import {
      SvelteFlow,
      Controls,
      Background,
      BackgroundVariant,
      type NodeTypes,
      type EdgeTypes,
      type Node,
      type Edge,
      type Connection,
      ConnectionLineType,
    } from '@xyflow/svelte';
    import '@xyflow/svelte/dist/style.css';
    import './system-editor.css';
    import ComponentNode from './nodes/ComponentNode.svelte';
    import EmptySystemNode from './nodes/EmptySystemNode.svelte';
    import RemovableEdge from './RemovableEdge.svelte';
    import { currentSystemJSON } from '$lib/stores/stores';
    import type { ComponentType } from '$lib/types/types';
    import {
      nameComponentInstance,
      updateSystemEditor
     } from './systemHelpers';

    const nodeTypes: NodeTypes = {
      'component': ComponentNode,
      'empty': EmptySystemNode
    } as {} as NodeTypes;

    const edgeTypes: EdgeTypes = {
      'default': RemovableEdge
    } as {} as EdgeTypes;

    const nodes = writable<Node[]>([]);
    const edges = writable<Edge[]>([]);

    currentSystemJSON.subscribe(value => {
      updateSystemEditor(nodes, edges)
    })

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

      // get component data and give it a unique name
      const componentData = JSON.parse(event.dataTransfer.getData('application/svelteflow')) as ComponentType;
      componentData.name = nameComponentInstance(componentData.name, $currentSystemJSON.json.components);
      
      // add new component to system JSON
      currentSystemJSON.update((json) => {
        const newJson = { ...json };
        newJson.json.components.push(componentData);
        return newJson;
      });
    };

    // add empty system node if there are no nodes
    nodes.subscribe(value => {
      if (value.length === 0) {
        nodes.set([{
          id: '1',
          type: 'empty',
          draggable: false,
          position: { x: 0, y: 150 },
          data: {},
          origin: [0.5, 0.5],
        }]);
      } else if (value.some(node => node.type === 'empty') && value.length > 1) {
        nodes.set(value.filter(node => node.type !== 'empty'));
      }
    });

    // function to update the system JSON when a new connection is made
    const handleNewConnection = (newConnection: Connection) => {
      if (!newConnection.sourceHandle || !newConnection.targetHandle) return;
      currentSystemJSON.update(value => {
        const newJson = { ...value };
        // if connection from source/to target already exists, remove it
        newJson.json.structure = newJson.json.structure.filter(
          connection => connection[0] !== newConnection.sourceHandle && connection[1] !== newConnection.targetHandle
        );

        // add new connection to system JSON
        newJson.json.structure.push([
          newConnection.sourceHandle as string,
          newConnection.targetHandle as string
        ]);
        return newJson;
      });
    };
</script>

<SvelteFlow
    minZoom={0.3}
    maxZoom={1}
    nodeTypes={nodeTypes}
    edgeTypes={edgeTypes}
    {nodes}
    {edges}
    on:dragover={onDragOver} on:drop={onDrop}
    fitView
    connectionLineType={ConnectionLineType.SmoothStep}
    onconnect={handleNewConnection}
    defaultEdgeOptions={{
      animated: true,
      deletable: true,
    }}>
    <Controls />
    <Background variant={BackgroundVariant.Dots} gap={54} size={2} />
</SvelteFlow>