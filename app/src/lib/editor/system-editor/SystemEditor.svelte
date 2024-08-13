<script lang="ts">
    import { writable } from 'svelte/store';
    import {
      SvelteFlow,
      Controls,
      Background,
      BackgroundVariant,
      useSvelteFlow,
      type NodeTypes,
      type EdgeTypes,
      type Node,
      type Edge,
    } from '@xyflow/svelte';
    import '@xyflow/svelte/dist/style.css';
    import './system-editor.css';
    import ComponentNode from './ComponentNode.svelte';
    import EmptySystemNode from './EmptySystemNode.svelte';
    import RemovableEdge from './RemovableEdge.svelte';
    import { currentSystemJSON, customComponents } from '$lib/stores';
    import type { ComponentType } from '$lib/types/types';
    import { basicComponents } from "$lib/editor/basicComponents";
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

      let newCompName = nameComponentInstance(JSON.parse(data).label, $currentSystemJSON.components)
      const newNode = {
        id: newCompName,
        type: 'component',
        position,
        data: JSON.parse(data),
        origin: [0.5, 0.5],
      } satisfies Node;

      // update nodes
      $nodes.push(newNode);
      $nodes = $nodes;

      // add new component to system JSON
      currentSystemJSON.update((system) => {
        if (basicComponents.map(comp => comp.name).includes(JSON.parse(data).label)) {
          let newComponent = {...basicComponents.find(comp => comp.name === JSON.parse(data).label)?.json}
          if (newComponent) {
            newComponent.name = newCompName;
            system.components.push(newComponent as {} as ComponentType);
          }
        } else {
          let newComponent = {...$customComponents.find(comp => comp.name === JSON.parse(data).label)}
          if (newComponent) {
            newComponent.name = newCompName;
            system.components.push(newComponent as {} as ComponentType);
          }
        }
        return system;
      });
    };

    // proximity connection logic

    // keeping track of nodes connected in line to avoid loops
    let paths: {source: string, target: string}[] = [];

    // update paths when edges change
    edges.subscribe((edges) => {
      let newPaths: {source: string, target: string}[] = [];
      edges.forEach((edge) => {
        if (edge.class === 'temp') {
          return;
        }
        const source = edge.source;
        const target = edge.target;
        const sourcePath = newPaths.find((path) => path.target === source);
        const targetPath = newPaths.find((path) => path.source === target);

        if (sourcePath && targetPath) {
          newPaths = newPaths.filter((path) => path !== sourcePath && path !== targetPath);
          newPaths.push({
            source: sourcePath.source,
            target: targetPath.target
          });
        } else if (sourcePath) {
          newPaths = newPaths.filter((path) => path !== sourcePath);
          newPaths.push({
            source: sourcePath.source,
            target
          });
        } else if (targetPath) {
          newPaths = newPaths.filter((path) => path !== targetPath);
          newPaths.push({
            source,
            target: targetPath.target
          });
        } else {
          newPaths.push({
            source,
            target
          });
        }
      });
      paths = newPaths;
    });

    // get closest edge to node (that it can connect to)
    function getClosestEdge(node: Node, nodes: Node[], edges: Edge[]) {
      const nodesByDistance = nodes.filter(n => n.id !== node.id).sort((a, b) => {
        const dxA = a.position.x - node.position.x;
        const dyA = a.position.y - node.position.y;
        const distanceA = Math.sqrt(dxA * dxA + dyA * dyA);

        const dxB = b.position.x - node.position.x;
        const dyB = b.position.y - node.position.y;
        const distanceB = Math.sqrt(dxB * dxB + dyB * dyB);

        return distanceA - distanceB;
      });

      // check if node already has source or target
      // and making sure nodes have maximum one source and one target
      let nodeHasSource = edges.find(e => e.target === node.id && e.class !== 'temp');
      let nodeHasTarget = edges.find(e => e.source === node.id && e.class !== 'temp');

      for (let n of nodesByDistance) {
        const nodeIsSource = n.position.x < node.position.x;
        if (nodeIsSource) {
          const edge = edges.find(e => e.source === n.id && e.class !== 'temp');

          if (!edge && !nodeHasSource &&
            !paths.find(p => p.source === node.id && p.target === n.id)) {
            return {
              id: `${n.id}-${node.id}`,
              source: n.id,
              target: node.id,
              class: 'temp'
            };
          }
        } else {
          const edge = edges.find(e => e.target === n.id && e.class !== 'temp');

          if (!edge && !nodeHasTarget &&
            !paths.find(p => p.source === n.id && p.target === node.id)) {
            return {
              id: `${node.id}-${n.id}`,
              source: node.id,
              target: n.id,
              class: 'temp'
            };
          }
        }
      }
      return null;
    }

    function onNodeDrag({ detail: { targetNode: node } }: CustomEvent<{ targetNode: Node | null }>) {
      if (!node) {
        return;
      }
      
      const closestEdge = getClosestEdge(node, $nodes, $edges);

      let edgeAlreadyExists = false;
      $edges.forEach((edge, i) => {
        if (edgeAlreadyExists) {
          return;
        }

        if (closestEdge) {
          // non-temporary edge already exists
          if (edge.source === closestEdge.source && edge.target === closestEdge.target) {
            edgeAlreadyExists = true;
            return;
          }

          if (edge.class !== 'temp') {
            return;
          }

          if (edge.source !== closestEdge.source || edge.target !== closestEdge.target) {
            $edges[i] = closestEdge; // replace the edge
            edgeAlreadyExists = true;
          }
        } else if (edge.class === 'temp') {
          $edges.splice(i, 1); // remove edge
        }
    });

    if (closestEdge && !edgeAlreadyExists) {
      $edges.push(closestEdge);
    }

      $edges = $edges;
    }

    function onNodeDragStop() {
      let newJson = { ...$currentSystemJSON};
      $edges.forEach((edge) => {
        if (edge.class === 'temp') {
          edge.class = '';
          newJson.structure.push([
              `${edge.source}.${newJson.components.find(comp => comp.name === edge.source)?.elements.at(-1)?.name}`,
              `${edge.target}.${newJson.components.find(comp => comp.name === edge.target)?.elements.at(0)?.name}`
            ]);
        }
      });

      // update edges
      $edges = $edges;

      // update JSON
      currentSystemJSON.set(newJson);
    }

    // add empty system node if there are no nodes
    nodes.subscribe(value => {
      if (value.length === 0) {
        nodes.set([{
          id: '1',
          type: 'empty',
          dragHandle: '.none',
          position: { x: 0, y: 150 },
          data: {},
          origin: [0.5, 0.5],
        }]);
      } else if (value.some(node => node.type === 'empty') && value.length > 1) {
        nodes.set(value.filter(node => node.type !== 'empty'));
      }
    });
</script>

<SvelteFlow
    nodeTypes={nodeTypes}
    edgeTypes={edgeTypes}
    {nodes}
    {edges}
    on:dragover={onDragOver} on:drop={onDrop}
    fitView
    on:nodedrag={onNodeDrag}
    on:nodedragstop={onNodeDragStop}
    defaultEdgeOptions={{
      animated: true,
      deletable: true,
    }}>
    <Controls />
    <Background variant={BackgroundVariant.Dots} />
</SvelteFlow>