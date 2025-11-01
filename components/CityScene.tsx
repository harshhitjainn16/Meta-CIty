import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid } from '@react-three/drei';
import * as THREE from 'three';

function Building({ position, type, onClick }: { position: [number, number, number]; type: number; onClick?: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const colors = ['#4CAF50', '#2196F3', '#FF9800', '#8BC34A', '#FFC107', '#F44336', '#9C27B0', '#00BCD4'];
  const heights = [2, 3, 2.5, 1, 1.5, 2.5, 2, 1.5];

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[0.8, heights[type] || 2, 0.8]} />
      <meshStandardMaterial 
        color={colors[type] || '#2196F3'} 
        emissive={colors[type] || '#2196F3'}
        emissiveIntensity={hovered ? 0.5 : 0.2}
        metalness={0.7}
        roughness={0.3}
      />
    </mesh>
  );
}

function CityGrid() {
  const buildings: Array<{ position: [number, number, number]; type: number }> = [];
  
  // Generate sample buildings
  for (let i = 0; i < 20; i++) {
    const x = (Math.random() - 0.5) * 20;
    const z = (Math.random() - 0.5) * 20;
    const type = Math.floor(Math.random() * 8);
    const height = [2, 3, 2.5, 1, 1.5, 2.5, 2, 1.5][type] || 2;
    buildings.push({ position: [x, height / 2, z], type });
  }

  return (
    <>
      {buildings.map((building, index) => (
        <Building
          key={index}
          position={building.position}
          type={building.type}
          onClick={() => console.log(`Building ${index} clicked`)}
        />
      ))}
    </>
  );
}

function AnimatedSky() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[50, 32, 32]} />
      <meshBasicMaterial color="#0a0e27" side={THREE.BackSide} />
    </mesh>
  );
}

export default function CityScene() {
  return (
    <div className="w-full h-full bg-gradient-dark">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[15, 15, 15]} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
        />
        
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#00d4ff" />
        <spotLight 
          position={[0, 20, 0]} 
          angle={0.6} 
          penumbra={1} 
          intensity={1} 
          castShadow 
          color="#b537ff"
        />
        
        <AnimatedSky />
        <CityGrid />
        
        <Grid 
          args={[30, 30]} 
          cellSize={1} 
          cellThickness={0.5} 
          cellColor="#00d4ff" 
          sectionSize={5} 
          sectionThickness={1} 
          sectionColor="#b537ff" 
          fadeDistance={50} 
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={false}
        />
        
        <Environment preset="night" />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 bg-dark-card/80 backdrop-blur-md p-4 rounded-lg border border-cyber-blue/30">
        <p className="text-xs text-gray-400 mb-2">🖱️ Controls</p>
        <p className="text-xs text-white">• Drag to rotate</p>
        <p className="text-xs text-white">• Scroll to zoom</p>
        <p className="text-xs text-white">• Click buildings for info</p>
      </div>
    </div>
  );
}
