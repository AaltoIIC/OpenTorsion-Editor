<script lang="ts">
    import { onMount } from "svelte";
    import type { ComponentType } from "$lib/types/types";
    import * as THREE from 'three';
    import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

    export let data: ComponentType = {name: "",elements: []};
    let el: HTMLCanvasElement;

    const scene = new THREE.Scene();

    const light = new THREE.AmbientLight( 0xffffff, 1 );
    scene.add(light);
    
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.position.set( 20, 20, 20 );
    scene.add( directionalLight );

    let currentZ = 0;
    const createDisk = () => {
        const geometry = new THREE.CylinderGeometry( 20, 20, 6, 32 );
        const material = new THREE.MeshStandardMaterial({ color: 0x48e5c2 });
        const disk = new THREE.Mesh(geometry, material);
        disk.rotateX(Math.PI*(90/180));
        disk.position.z = currentZ;
        currentZ += 0;
        scene.add(disk);
    }

    const createShaft = () => {
        const geometry = new THREE.CylinderGeometry( 4, 4, 20, 32 );
        const material = new THREE.MeshStandardMaterial({ color: 0x48e5c2 });
        const shaft = new THREE.Mesh(geometry, material);
        shaft.rotateX(Math.PI*(90/180));
        shaft.position.z = currentZ;
        currentZ += 0;
        scene.add(shaft);
    }

    const createGear = () => {
        const geometry = new THREE.CylinderGeometry( 14, 14, 7, 32 );
        const material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
        const gear = new THREE.Mesh(geometry, material);
        gear.rotateX(Math.PI*(90/180));
        gear.position.z = currentZ;
        currentZ += 0;
        scene.add(gear);
    }
    data.elements.forEach(element => {
        if (element.type === "Disk") {
            createDisk();
        } else if (element.type === "ShaftDiscrete") {
            createShaft();
        } else if (element.type === "GearElement") {
            createGear();
        }
    });
    
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;

    onMount(() => {
        camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        
        renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el, alpha: true });
        
        resize();
        
        camera.position.z = 80;
        camera.position.x = 100;
        camera.rotateY(Math.PI*(45/180));

        renderer.render(scene, camera);
        window.addEventListener('resize', resize);
    });

    const resize = () => {
        const width = el.clientWidth;
        const height = el.clientHeight;
        renderer.setSize(width, height, false); // Set renderer size to canvas size
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };
</script>
<canvas bind:this={el}></canvas>
<style>
    canvas {
        width: 100%;
        height: 100%;
    }
</style>