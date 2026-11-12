import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { AircraftConfiguration } from '../../types/aerospace';

interface Viewport3DProps {
  aircraft: AircraftConfiguration;
  onSelectComponent?: (instanceId: string) => void;
}

export const Viewport3D: React.FC<Viewport3DProps> = ({ aircraft, onSelectComponent }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Slate dark blueprint background

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(15, 8, 20);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(20, 40, 20);
    scene.add(dirLight);

    // Grid & Axes
    const gridHelper = new THREE.GridHelper(30, 30, 0x38bdf8, 0x334155);
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Aircraft Group
    const aircraftGroup = new THREE.Group();
    scene.add(aircraftGroup);

    // Procedural representation of components based on domain model
    aircraft.components.forEach((comp, idx) => {
      let geometry: THREE.BufferGeometry;
      let material = new THREE.MeshStandardMaterial({
        color: comp.category === 'wings' ? 0x0284c7 : comp.category === 'engines' ? 0xe11d48 : 0x64748b,
        roughness: 0.4,
        metalness: 0.6
      });

      if (comp.category === 'fuselage') {
        geometry = new THREE.CylinderGeometry(0.9, 0.9, 12, 16);
        geometry.rotateZ(Math.PI / 2);
      } else if (comp.category === 'wings') {
        geometry = new THREE.BoxGeometry(2.5, 0.15, 10);
      } else if (comp.category === 'engines') {
        geometry = new THREE.CylinderGeometry(0.6, 0.6, 3, 16);
        geometry.rotateZ(Math.PI / 2);
      } else if (comp.category === 'landing-gear') {
        geometry = new THREE.CylinderGeometry(0.15, 0.15, 2, 8);
      } else {
        geometry = new THREE.BoxGeometry(1.5, 0.8, 2);
      }

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(comp.position.x || (idx - 2) * 2, comp.position.y || 0, comp.position.z || 0);
      mesh.userData = { instanceId: comp.instanceId, name: comp.name };
      aircraftGroup.add(mesh);
    });

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      // Gentle rotation for inspection view if desired, or static
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [aircraft]);

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '420px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #334155' }}
    />
  );
};
