<script lang="ts">
    import { onMount } from "svelte";
    import type { ComponentType } from "$lib/types/types";
    import * as THREE from 'three';

    export let data: ComponentType = {name: "",elements: []};
    export let hoverable = true;
    let el: HTMLCanvasElement;

    const scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
    scene.add( ambientLight );
    
    const addLight = (scene: THREE.Scene, x: number, y: number, z: number, shadows=false) => {
        const light = new THREE.DirectionalLight( 0xffffff, 1 );
        light.position.set( x, y, z );
        if (shadows) {
            light.castShadow = true;
            light.shadow.camera.near = 0.05;
            light.shadow.camera.far = 500;
            light.shadow.camera.left = -200;
            light.shadow.camera.right = 200;
            light.shadow.camera.top = 200;
            light.shadow.camera.bottom = -200;
            light.shadow.mapSize.width = 512;
            light.shadow.mapSize.height = 512;
            light.shadow.radius = 6;
        }
        scene.add( light );
    }
    addLight(scene, 0, 200, 0, true);
    addLight(scene, 100, 200, 200);
    addLight(scene, -100, -200, -100);

    let currentZ = 0;
    const createDisk = () => {
        currentZ += 3;
        const geometry = new THREE.CylinderGeometry( 20, 20, 6, 32 );
        const material = new THREE.MeshStandardMaterial({ color: 0x48e5c2 });
        const disk = new THREE.Mesh(geometry, material);
        disk.castShadow = true;
        disk.rotateX(Math.PI*(90/180));
        disk.position.z = currentZ;
        // add half of real width to currentZ
        currentZ += 3;
        scene.add(disk);
    }

    const createShaft = () => {
        currentZ += 10;
        const geometry = new THREE.CylinderGeometry( 4, 4, 20, 32 );
        const material = new THREE.MeshStandardMaterial({ color: 0x000000 });
        const shaft = new THREE.Mesh(geometry, material);
        shaft.castShadow = true;
        shaft.rotateX(Math.PI*(90/180));
        shaft.position.z = currentZ;
        currentZ += 10;
        scene.add(shaft);
    }

    const createGear = () => {
        currentZ += 3.5;
        const geometry = new THREE.CylinderGeometry( 14, 14, 7, 32 );
        const material = new THREE.MeshStandardMaterial({ color: 0x48e5c2 });
        const gear = new THREE.Mesh(geometry, material);
        gear.castShadow = true;

        // add cogs
        const cogGeometry = new THREE.BoxGeometry(7, 7, 7);
        const addCog = (rotation: number) => {
            const cog = new THREE.Mesh(cogGeometry, material);
            cog.position.set(14 * Math.cos(rotation), 14 * Math.sin(rotation), 0);
            cog.rotateZ(rotation);
            gear.add(cog);
        };
        for (let i = 0; i < 8; i++) {
            addCog(i * Math.PI / 4);
        }

        geometry.rotateX(Math.PI*(90/180));
        gear.position.z = currentZ;

        currentZ += 3.5;
        scene.add(gear);
    }
    
    let camera: THREE.OrthographicCamera;
    let renderer: THREE.WebGLRenderer;

    onMount(() => {
        //camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        camera = new THREE.OrthographicCamera(-50, 50, 50, -50, 0.1, 1000);

        renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);

        // generate 3d model 
        data.elements.forEach(element => {
            if (element.type === "Disk") {
                createDisk();
            } else if (element.type === "ShaftDiscrete") {
                createShaft();
            } else if (element.type === "GearElement") {
                createGear();
            }
        });


        const planeGeometry = new THREE.PlaneGeometry(200, 200);
        const planeMaterial = new THREE.ShadowMaterial({
            opacity: 0.15
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;
        plane.rotation.x = - Math.PI / 2;
        plane.position.y = -21;
        plane.position.z = currentZ/2;

        scene.add(plane);

        // Ensure the renderer is set up to handle shadows
        renderer.shadowMap.enabled = true;

        const animate = () => {

            requestAnimationFrame( animate );

            renderer.render( scene, camera );

        }
        animate();
        resize();
        setCameraPosition();
        window.addEventListener('resize', resize);
    });

    const resize = () => {
        if (!el) return;

        const width = el.clientWidth;
        const height = el.clientHeight;
        renderer.setSize(width, height, false); // Set renderer size to canvas size
        camera.updateProjectionMatrix();
    };


    const setCameraPosition = () => {
        camera.position.set( 70, 85, 88 + currentZ/2 );
        camera.lookAt( 0, 0, currentZ/2 );
        renderer.render(scene, camera);
    }   

    const handleMouseMove = (event: MouseEvent) => {
        const width = el.clientWidth;
        const rect = el.getBoundingClientRect();
        const x = event.clientX - rect.left;

        const grad = (x / width)
        const changeInDirection = 0.2
        const currentCamZ = grad * (currentZ+320) * 2
        const currentCamY = 0

        camera.position.set( 70, 85 + currentCamY, -160 + currentCamZ );
        camera.lookAt( 0, 0, currentZ/2 );

        renderer.render(scene, camera);
    }
</script>
<canvas bind:this={el}
    on:mousemove={hoverable ? handleMouseMove : undefined}
    on:mouseleave={hoverable ? setCameraPosition : undefined}
></canvas>
<style>
    canvas {
        width: 100%;
        height: 100%;
        mask-image: url(./edge-mask.png);
        mask-size: cover;
    }
</style>