<script lang="ts">
    import { onMount } from "svelte";
    import type { ComponentType } from "$lib/types/types";
    import { threeRenderer } from "./stores/stores";
    import * as THREE from 'three';

    export let data: ComponentType = {name: "",elements: []};
    export let hoverable = true;
    export let highlightedElement: string | null = null;

    let el: HTMLCanvasElement;
    let context: CanvasRenderingContext2D | null;
    let isLoaded = false;

    // creating THREE.js scene
    const scene = new THREE.Scene();
    const ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
    scene.add( ambientLight );
    
    // function to add light scource to scene
    const addLight = (scene: THREE.Scene, x: number, y: number, z: number, shadows=false) => {
        const light = new THREE.DirectionalLight( 0xffffff, 1 );
        light.position.set( x, y, z );
        if (shadows) {
            light.castShadow = true;
            light.shadow.camera.near = 0.05;
            light.shadow.camera.far = 500;
            light.shadow.camera.left = -400;
            light.shadow.camera.right = 400;
            light.shadow.camera.top = 400;
            light.shadow.camera.bottom = -400;
            light.shadow.mapSize.width = 2048;
            light.shadow.mapSize.height = 2048;
            light.shadow.radius = 12;
        }
        scene.add( light );
    }
    addLight(scene, 0, 200, 0, true);
    addLight(scene, 100, 200, 200);
    addLight(scene, -100, -200, -100);


    // functions to create elements
    const createDisk = (name: string, z: number, y: number, x: number) => {
        const geometry = new THREE.CylinderGeometry( 17, 17, 6, 32 );
        const material = new THREE.MeshStandardMaterial({ color: 0x48e5c2, transparent: true });
        const disk = new THREE.Mesh(geometry, material);
        disk.castShadow = true;
        disk.rotateX(Math.PI*(90/180));
        disk.position.x = x;
        disk.position.y = y;
        disk.position.z = z-3;
        disk.name = name;
        scene.add(disk);
    }

    const createShaft = (name: string, z: number, y: number, x: number) => {
        const geometry = new THREE.CylinderGeometry( 4, 4, 20, 32 );
        const material = new THREE.MeshStandardMaterial({ color: 0x000000, transparent: true });
        const shaft = new THREE.Mesh(geometry, material);
        shaft.castShadow = true;
        shaft.rotateX(Math.PI*(90/180));
        shaft.position.x = x;
        shaft.position.y = y;
        shaft.position.z = z-10;
        shaft.name = name;
        scene.add(shaft);
    }

    const createGear = (name: string, z: number, y: number, x: number) => {
        const geometry = new THREE.CylinderGeometry( 18, 18, 7, 32 );
        const material = new THREE.MeshStandardMaterial({ color: 0x48e5c2, transparent: true });
        const gear = new THREE.Mesh(geometry, material);
        gear.castShadow = true;

        // add cogs
        const cogGeometry = new THREE.BoxGeometry(4, 8, 7);
        const addCog = (rotation: number) => {
            const cog = new THREE.Mesh(cogGeometry, material);
            cog.position.set(19 * Math.cos(rotation), 19 * Math.sin(rotation), 0);
            cog.rotateZ(rotation);
            gear.add(cog);
        };
        for (let i = 0; i < 8; i++) {
            addCog(i * Math.PI / 4);
        }

        geometry.rotateX(Math.PI*(90/180));
        gear.position.x = x;
        gear.position.y = y;
        gear.position.z = z-3.5;
        gear.name = name;
        scene.add(gear);
    }

    // keep track of dimensions of component
    let Zdimension = 0;
    let Ydimension = 0;

    // function to render scene and update canvas
    const render = () => {
        if (context && $threeRenderer) {
            context.canvas.width = el.clientWidth;
            context.canvas.height = el.clientHeight;
            let dpr = window.devicePixelRatio || 1;
            $threeRenderer.setSize(
                (context.canvas.width / dpr)*2,
                (context.canvas.height / dpr)*2,
                false);

            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            $threeRenderer.render(scene, camera);
            context.drawImage($threeRenderer.domElement, 0, 0, context.canvas.width, context.canvas.height);
            isLoaded = true;
        }
    }

    // rendering scene after mounting
    let camera: THREE.OrthographicCamera;
    let branchHeight = 34;
    onMount(() => {
        // create renderer if it doesn't exist
        if (!$threeRenderer) {
            const newRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            newRenderer.setPixelRatio(window.devicePixelRatio);
            newRenderer.shadowMap.enabled = true;
            threeRenderer.set(newRenderer);
        }

        // generate 3d model
        type Junction = {
            z: number,
            endY: number
        }
        let currentZ = 0;
        let currentY = 0;
        let currentX = 0;
        let branches = new Map<string, Junction>();
        data.elements.forEach(el => {
            if (el.type === "Disk") {
                createDisk(el.name, currentZ, currentY, currentX);
                currentZ -= 6;
            } else if (el.type === "ShaftDiscrete") {
                createShaft(el.name, currentZ, currentY, currentX);
                currentZ -= 20;
            } else if (el.type === "GearElement") {
                // update branches
                if (el.parent && branches.get(el.parent) && el.name !== el.parent) {
                    // add element to branches with shared value across all gears with the same parent
                    branches.set(el.name, branches.get(el.parent) as Junction);
                    currentY += branchHeight;
                    (branches.get(el.name) as Junction).endY = currentY;
                    currentZ = (branches.get(el.parent) as Junction).z;
                } else {
                    branches.set(el.name, {z: currentZ, endY: currentY});
                }

                if ((currentY%(branchHeight*2)) !== 0) {
                    currentX = branchHeight/1.5;
                } else {
                    currentX = 0;
                }
                createGear(el.name, currentZ, currentY, currentX);
                currentZ -= 7;
            }

            if (currentZ < Zdimension) {
                Zdimension = currentZ;
            }
            if (currentY > Ydimension) {
                Ydimension = currentY;
            }
        });
        // set camera size (larger components apper smaller)
        const maxDimension = Math.max(Ydimension, -Zdimension * 0.45);
        const cameraSize = 70 + Math.min(maxDimension, 116);
        camera = new THREE.OrthographicCamera(-cameraSize / 2, cameraSize / 2, cameraSize / 2, -cameraSize / 2, 0.1, 1000);

        // add shadow plane
        const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
        const planeMaterial = new THREE.ShadowMaterial({
            opacity: 0.15
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;
        plane.name = "shadowPlane";
        plane.rotation.x = - Math.PI / 2;
        plane.position.y = -21;
        plane.position.z = 0;

        scene.add(plane);

        resize();
        setCameraPosition();
        window.addEventListener('resize', resize);
        context = el.getContext('2d');
        
        render();
    });

    const resize = () => {
        if (!el) return;
        camera.updateProjectionMatrix();
    };

    // function to (re)set camera position
    const setCameraPosition = () => {
        const Xdepth =  Ydimension ? branchHeight/2 : 0
        camera.position.set(
            70 + Xdepth/2,
            85 + Ydimension/2,
            88 + Zdimension/2);
        // look at the middle of component
        camera.lookAt(
            Xdepth/2,
            Ydimension/2,
            Zdimension/2);
        
        render();
    }   

    // animation on hover
    const handleMouseMove = (event: MouseEvent) => {

        const width = el.clientWidth;
        const rect = el.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const Xdepth =  Ydimension ? branchHeight/2 : 0
        const currentCamZ =  (x / width) * (Zdimension-480)

        camera.position.set( 70 + Xdepth/2, 85 + Ydimension/2, 160 + currentCamZ );
        camera.lookAt( Xdepth/2, Ydimension/2, Zdimension/2 );

        render();
    }

    const highlightElement = (highlightedElement: string | null) => {
        if (highlightedElement) {
            scene.traverse((object) => {
                if (object instanceof THREE.Mesh &&
                    object.name &&
                    object.name !== highlightedElement &&
                    object.name !== "shadowPlane") {
                    object.material.opacity = 0.2;
                }
            });
            render();
        } else {
            scene.traverse((object) => {
                if (object instanceof THREE.Mesh &&
                    object.name !== "shadowPlane") {
                    object.material.opacity = 1;
                }
            });
            render();
    }
    }

    // highlight element
    $: highlightElement(highlightedElement);
</script>
<canvas bind:this={el}
    on:mousemove={hoverable ? handleMouseMove : undefined}
    on:mouseleave={hoverable ? setCameraPosition : undefined}
    class="{isLoaded ? 'loaded' : 'loading'}"
></canvas>
<style>
    canvas {
        width: 100%;
        height: 100%;
    }
    .loading {
        animation-name: placeHolderShimmer;
        animation-duration: 1s;
        animation-iteration-count: infinite;
    }
</style>