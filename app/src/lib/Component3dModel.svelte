<script lang="ts">
    import { onMount } from "svelte";
    import type { ComponentType } from "$lib/types/types";
    import * as THREE from 'three';

    export let data: ComponentType = {name: "",elements: []};
    export let hoverable = true;

    let el: HTMLCanvasElement;

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


    // functions to create elements
    const createDisk = (z: number, y: number, x: number) => {
        const geometry = new THREE.CylinderGeometry( 20, 20, 6, 32 );
        const material = new THREE.MeshStandardMaterial({ color: 0x48e5c2 });
        const disk = new THREE.Mesh(geometry, material);
        disk.castShadow = true;
        disk.rotateX(Math.PI*(90/180));
        disk.position.x = x;
        disk.position.y = y;
        disk.position.z = z+3;
        scene.add(disk);
    }

    const createShaft = (z: number, y: number, x: number) => {
        const geometry = new THREE.CylinderGeometry( 4, 4, 20, 32 );
        const material = new THREE.MeshStandardMaterial({ color: 0x000000 });
        const shaft = new THREE.Mesh(geometry, material);
        shaft.castShadow = true;
        shaft.rotateX(Math.PI*(90/180));
        shaft.position.x = x;
        shaft.position.y = y;
        shaft.position.z = z+10;
        scene.add(shaft);
    }

    const createGear = (z: number, y: number, x: number, rotateX: number = 0) => {
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
        gear.position.x = x;
        gear.position.y = y;
        gear.position.z = z+3.5;
        gear.rotation.z = rotateX;
        scene.add(gear);
    }

    // keep track of z position of last element
    let Zdimension = 0;
    let Ydepth = 0;
    // rendering scene after mounting
    let camera: THREE.OrthographicCamera;
    let renderer: THREE.WebGLRenderer;
    let branchHeight = 32;
    onMount(() => {
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
                createDisk(currentZ, currentY, currentX);
                currentZ += 6;
            } else if (el.type === "ShaftDiscrete") {
                createShaft(currentZ, currentY, currentX);
                currentZ += 20;
            } else if (el.type === "GearElement") {
                // update branches
                if (el.parent && branches.get(el.parent) && el.name !== el.parent) {
                    // add element to branches with shared value across all gears with the same parent
                    branches.set(el.name, branches.get(el.parent) as Junction);
                    currentY -= branchHeight;
                    (branches.get(el.name) as Junction).endY = currentY;
                    currentZ = (branches.get(el.parent) as Junction).z;
                } else {
                    branches.set(el.name, {z: currentZ, endY: currentY});
                }

                let rotateX =  0;
                if ((currentY%(branchHeight*2)) != 0) {
                    rotateX =  (Math.PI/180) * 22.5;
                    currentX = -22.6;
                } else {
                    currentX = 0;
                }
                createGear(currentZ, currentY, currentX, rotateX);
                currentZ += 7;
            }

            if (currentZ > Zdimension) {
                Zdimension = currentZ;
            }
            if (currentY < Ydepth) {
                Ydepth = currentY;
            }
        });

        const cameraSize = 70 + 35*(Ydepth / -branchHeight);
        camera = new THREE.OrthographicCamera(-cameraSize / 2, cameraSize / 2, cameraSize / 2, -cameraSize / 2, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);

        // add shadow plane
        const planeGeometry = new THREE.PlaneGeometry(200, 200);
        const planeMaterial = new THREE.ShadowMaterial({
            opacity: 0.15
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;
        plane.rotation.x = - Math.PI / 2;
        plane.position.y = Ydepth-21;
        plane.position.z = currentZ/2;

        scene.add(plane);
        renderer.shadowMap.enabled = true;

        resize();
        setCameraPosition();
        window.addEventListener('resize', resize);
    });

    const resize = () => {
        if (!el) return;

        const width = el.clientWidth;
        const height = el.clientHeight;
        renderer.setSize(width, height, false);
        camera.updateProjectionMatrix();
    };

    // function to (re)set camera position
    const setCameraPosition = () => {
        camera.position.set(
            70,
            85 + Ydepth/2,
            Math.min(88 + Zdimension/2, 138));
        camera.lookAt(
            0,
            Ydepth/2,
            Math.min(Zdimension/2, 50));
        renderer.render(scene, camera);
    }   

    // animation on hover
    const handleMouseMove = (event: MouseEvent) => {
        const width = el.clientWidth;
        const rect = el.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const currentCamZ = (x / width) * (Zdimension+320) * 2
        camera.position.set( 70, 85 + Ydepth/2, -160 + currentCamZ );
        camera.lookAt( 0, Ydepth/2, Zdimension/2 );

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
        mask-image: url(../edge-mask.png);
        mask-size: cover;
    }
</style>