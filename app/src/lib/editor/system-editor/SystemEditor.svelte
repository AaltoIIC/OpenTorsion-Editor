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
      useSvelteFlow
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
      updateSystemEditor,
      isStructureTree,
     } from './systemHelpers';
    import { findElement } from '$lib/utils';

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

    const { screenToFlowPosition } = useSvelteFlow();
    const onDrop = (event: DragEvent) => {
      event.preventDefault();

      if (!event.dataTransfer) {
        return null;
      }

      // get component data and give it a unique name
      let componentData: ComponentType;
      try {
        componentData = JSON.parse(event.dataTransfer.getData('application/svelteflow')) as ComponentType;
      } catch (error) {
        console.error('Error parsing component data', error);
        return;
      }

      componentData.name = nameComponentInstance(componentData.name, $currentSystemJSON.json.components);
      
      // add new component to system JSON
      currentSystemJSON.update((json) => {
        const newJson = { ...json };
        newJson.json.components.push(componentData);
        return newJson;
      });

      // modify the position of the new node
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      });
      position.y -= 100;
      position.x += 100;

      nodes.update(value => {
        const compNode = value.find(node => node.id = `group.${componentData.name}`);
        if (compNode) {
          compNode.position = position;
        }
        return value;
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

    // function to check if a connection is valid
    const checkConnectionConstraints = (connection: Connection | Edge) => {
      if (!connection.sourceHandle || !connection.targetHandle) return false;

      const shafts: any[] = ['ShaftDiscrete', 'ShaftContinuous'];
      const sourceType = findElement(connection.sourceHandle)?.type;
      const targetType = findElement(connection.targetHandle)?.type;
      let isValid = true;
      
      // if source is a shaft, target must be disk or gear
      if (shafts.includes(sourceType) &&
          !(targetType === 'Disk' || targetType === 'GearElement')) {
        isValid = false;
      }

      // if source is a disk, target must be shaft or disk
      if (sourceType === 'Disk' &&
          !(shafts.includes(targetType) || targetType === 'Disk')) {
        isValid = false;
      }

      // if source is a gear, target must be shaft
      if (sourceType === 'GearElement' &&
          !shafts.includes(targetType)) {
        isValid = false;
      }

      // don't allow loops
      if (!isStructureTree([...$currentSystemJSON.json.structure, [connection.sourceHandle, connection.targetHandle]])) {
        isValid = false;
      }

      return isValid;
    };
</script>

<SvelteFlow
    minZoom={0.3}
    maxZoom={1}
    nodeTypes={nodeTypes}
    edgeTypes={edgeTypes}
    {nodes}
    {edges}
    on:dragover={onDragOver}
    on:drop={onDrop}
    fitView
    connectionLineType={ConnectionLineType.SmoothStep}
    isValidConnection={checkConnectionConstraints}
    onconnect={handleNewConnection}
    deleteKey={null}
    defaultEdgeOptions={{
      animated: true,
      deletable: true,
    }}>
    <Controls />
    <Background variant={BackgroundVariant.Dots} gap={54} size={2} />
</SvelteFlow>