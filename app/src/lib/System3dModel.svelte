<script lang="ts">
    import { onMount } from "svelte";
    import type {
        SystemType,
        ComponentType, 
        ElementType
    } from "$lib/types/types";
    import { threeRenderer } from "./stores/stores";
    import * as THREE from 'three';

    export let data: SystemType;
    export let size = 200;

    let el: HTMLCanvasElement;
    let context: CanvasRenderingContext2D | null = null;
    let isLoaded = false;

    // creating THREE.js scene
    const scene = new THREE.Scene();
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add( ambientLight );

    const createConnectionLine = (from: THREE.Vector3, to: THREE.Vector3) => {
        const midpoint = new THREE.Vector3()
            .addVectors(from, to)
            .multiplyScalar(0.5);
        const direction = new THREE.Vector3().subVectors(from, to);
        direction.z = 0;
        const distance = direction.length();

        // create mesh
        const width = 32;
        const depth = 1;
        const length = distance;
        const boxGeometry = new THREE.BoxGeometry(width, length, depth);

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('../connection-texture.svg', () => {
            render();
        });
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, length / width * 1.6);
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });

        const angle = Math.atan2(direction.y, direction.x);
        const lineMesh = new THREE.Mesh(boxGeometry, material);
        lineMesh.rotation.z = angle + Math.PI / 2;
        lineMesh.position.copy(midpoint);
        scene.add(lineMesh);
    }


    // functions to create elements
    const createDisk = (name: string, x: number, y: number, z: number) => {
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

    const createShaft = (name: string, x: number, y: number, z: number) => {
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

    const createGear = (name: string, x: number, y: number, z: number) => {
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

    // function to render scene and update canvas
    export const render = () => {
        if (context && $threeRenderer) {
            context.canvas.width = size;
            context.canvas.height = size;
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
    // keep track of dimensions of component
        let Zdimension = 0,
        Ydimension = 0,
        Xdimesion = 0;
    onMount(() => {
        // create renderer if it doesn't exist
        if (!$threeRenderer) {
            const newRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            newRenderer.setPixelRatio(window.devicePixelRatio);
            newRenderer.shadowMap.enabled = true;
            threeRenderer.set(newRenderer);
        }

        // generate 3d model
        const elements: ElementType[][] = [];

        const addPart = (elemsList: ElementType[], component: ComponentType) => {
            const connectedComponents: Record<string, string> = {};
            data.structure
                .filter(connection => connection[0].split('.')[0] === component.name)
                .forEach(connection => {
                    connectedComponents[connection[0].split('.')[1]] = connection[1].split('.')[0]
                });

            component.elements.forEach(el => {
                // create copy of element and change name to include its component
                const newElement: ElementType = {
                    ...el,
                    name: `${component.name}.${el.name}`
                }
                if (newElement.type === "GearElement" &&
                    el.type === "GearElement" &&
                    el.parent) {
                    newElement.parent = `${component.name}.${el.parent}`;
                }

                elemsList.push(newElement);

                if (connectedComponents[el.name]) {
                    // check if there are any components connected to this element
                    let connectedComponent = data.components
                        .find(component => component.name === connectedComponents[el.name]);
                    if (connectedComponent) addPart(elemsList, connectedComponent)
                }

            });
        }

        const connectionStarts = data.structure.map(connection => connection[0].split('.')[0]),
        connectionEnds = data.structure.map(connection => connection[1].split('.')[0]),
        startingComponents = data.components
            .filter(component => ( connectionStarts.includes(component.name) &&
            !connectionEnds.includes(component.name)));
        
        if (startingComponents.length > 0) {
            startingComponents.forEach(component => {
                let newPart: ElementType[] = []
                addPart(newPart, component);
                elements.push(newPart);
            });
        } else {
            data.components.forEach(component => {
                let newPart: ElementType[] = []
                addPart(newPart, component);
                elements.push(newPart);
            });
        }



        let currentX = 0;
        elements.forEach(part => {
            type Junction = {
                z: number,
                endY: number
            }
            let currentZ = 0;
            let currentY = 0;
            let Xaddition = 0;
            let branches = new Map<string, Junction>();
            let gearPositions = new Map<string, THREE.Vector3>();
            part.forEach(el => {
                if (el.type === "Disk") {
                    createDisk(el.name, currentX + Xaddition, currentY, currentZ);
                    currentZ -= 6;
                } else if (el.type === "ShaftDiscrete") {
                    createShaft(el.name, currentX + Xaddition, currentY, currentZ);
                    currentZ -= 20;
                } else if (el.type === "GearElement") {
                    // update branches
                    if (el.parent && branches.get(el.parent) && el.name !== el.parent) {
                        // add element to branches with shared value across all gears with the same parent
                        branches.set(el.name, branches.get(el.parent) as Junction);
                        currentY += branchHeight;
                        (branches.get(el.name) as Junction).endY = currentY;
                        currentZ = (branches.get(el.parent) as Junction).z;

                        // calculate Xaddition
                        if ((currentY%(branchHeight*2)) !== 0) {
                            Xaddition = branchHeight/1.5;
                        } else {
                            Xaddition = 0;
                        }

                        // add connection line
                        createConnectionLine(
                            gearPositions.get(el.parent) as THREE.Vector3,
                            new THREE.Vector3(currentX + Xaddition, currentY, currentZ-3.5));

                    } else {
                        branches.set(el.name, {z: currentZ, endY: currentY});
                    }
                    createGear(el.name, currentX + Xaddition, currentY, currentZ);
                    gearPositions.set(el.name, new THREE.Vector3(currentX + Xaddition, currentY, currentZ-3.5));
                    currentZ -= 7;
                }

                if (currentZ < Zdimension) {
                    Zdimension = currentZ;
                }
                if (currentY > Ydimension) {
                    Ydimension = currentY;
                }
                if (currentX + Xaddition > Xdimesion) {
                    Xdimesion = currentX + Xaddition;
                }
            });

            currentX += 80;
        });

        // add light to scene
        addLight(scene, 0, 200, 0, true);
        addLight(scene, 100, 200, 200);
        addLight(scene, -100, -200, -100);

        // set camera size (larger components apper smaller)
        const maxDimension = Math.max(Ydimension * 1.2, -Zdimension * 0.65, Xdimesion * 0.9);
        const cameraSize = 70 + maxDimension;
        camera = new THREE.OrthographicCamera(
            -cameraSize / 2,
            cameraSize / 2,
            cameraSize / 2,
            -cameraSize / 2,
            0.1,
            10000
        );

        // add shadow plane
        const planeGeometry = new THREE.PlaneGeometry(2000, -Zdimension + 12);
        const planeMaterial = new THREE.ShadowMaterial({
            opacity: 0.15
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;
        plane.name = "shadowPlane";
        plane.rotation.x = - Math.PI / 2;
        
        plane.position.y = -21;
        plane.position.z = Zdimension/2;

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

    // function to add light scource to scene
    // to be called after model is added to scene
    const addLight = (scene: THREE.Scene, x: number, y: number, z: number, shadows=false) => {
        const light = new THREE.DirectionalLight( 0xffffff, 1 );
        light.position.set( x, y, z );
        const maxDim = Math.max(Ydimension, -Zdimension, Xdimesion+10);
        let shadowBlur = 12;
        if (shadows) {
            light.castShadow = true;
            light.shadow.camera.near = 0.05;
            light.shadow.camera.far = 500;
            light.shadow.camera.left = -maxDim - shadowBlur;
            light.shadow.camera.right = maxDim + shadowBlur;
            light.shadow.camera.top = maxDim + shadowBlur;
            light.shadow.camera.bottom = -maxDim - shadowBlur;
            light.shadow.mapSize.width = (maxDim+shadowBlur)*5;
            light.shadow.mapSize.height = (maxDim+shadowBlur)*5;
            light.shadow.radius = shadowBlur;
        }
        scene.add( light );
    }


    // function to (re)set camera position
    const setCameraPosition = () => {
        const maxDim = Math.max(Ydimension, -Zdimension, Xdimesion);
        camera.position.set(
            7*maxDim + Xdimesion/2,
            8.5*maxDim + Ydimension/2,
            8.8*maxDim + Zdimension/2);
        // look at the middle of component
        camera.lookAt(
            Xdimesion/2,
            0,
            Zdimension/2);
        
        render();
    }   
</script>
<canvas bind:this={el}
    width={size}
    height={size}
    class="{isLoaded ? 'loaded' : 'loading'}"
></canvas>
<style>
    .loading {
        animation-name: placeHolderShimmer;
        animation-duration: 1s;
        animation-iteration-count: infinite;
    }
</style>