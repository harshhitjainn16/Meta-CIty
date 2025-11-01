import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid, Float, Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface BuildingProps {
  position: [number, number, number];
  type: number;
  onClick?: () => void;
  buildingName?: string;
}

function ModernBuilding({ position, type, onClick, buildingName }: BuildingProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const rotationRef = useRef(0);

  useFrame((state) => {
    if (meshRef.current) {
      rotationRef.current += 0.005;
      if (hovered) {
        meshRef.current.rotation.y = rotationRef.current;
        meshRef.current.scale.lerp(new THREE.Vector3(1.15, 1.15, 1.15), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  const colors = ['#4CAF50', '#2196F3', '#FF9800', '#8BC34A', '#FFC107', '#F44336', '#9C27B0', '#00BCD4'];
  const heights = [3.5, 5, 4, 2, 3, 4.5, 3.5, 2.5];
  const widths = [1.2, 1.4, 1.5, 1.8, 1.6, 1.3, 1.4, 1.7];
  const depth = 1.2;

  // Create varied building shapes
  const getBuildingShape = () => {
    const shapeType = type % 4;
    
    if (shapeType === 0) {
      // Modern skyscraper with setbacks
      return (
        <group>
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[widths[type], heights[type], depth]} />
            <meshStandardMaterial 
              color={colors[type]} 
              emissive={colors[type]}
              emissiveIntensity={hovered ? 1 : 0.5}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          {/* Top accent */}
          <mesh position={[0, heights[type] / 2 + 0.3, 0]} castShadow>
            <boxGeometry args={[widths[type] * 0.7, 0.3, depth * 0.7]} />
            <meshStandardMaterial 
              color={colors[type]} 
              emissive={colors[type]}
              emissiveIntensity={1}
            />
          </mesh>
          {/* Windows effect */}
          {Array.from({ length: Math.floor(heights[type]) }).map((_, i) => (
            <mesh key={i} position={[0, -heights[type] / 2 + i * 0.8 + 0.4, depth / 2 + 0.01]} castShadow>
              <boxGeometry args={[widths[type] * 0.8, 0.1, 0.05]} />
              <meshStandardMaterial 
                color="#00d4ff" 
                emissive="#00d4ff"
                emissiveIntensity={Math.random() * 0.5 + 0.3}
              />
            </mesh>
          ))}
        </group>
      );
    } else if (shapeType === 1) {
      // Cylindrical tower
      return (
        <group>
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[widths[type] / 2, widths[type] / 2, heights[type], 8]} />
            <meshStandardMaterial 
              color={colors[type]} 
              emissive={colors[type]}
              emissiveIntensity={hovered ? 1 : 0.5}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </group>
      );
    } else if (shapeType === 2) {
      // Stepped pyramid
      return (
        <group>
          {[0, 0.5, 1].map((offset, i) => (
            <mesh key={i} position={[0, offset * heights[type] / 3 - heights[type] / 3, 0]} castShadow>
              <boxGeometry args={[widths[type] - i * 0.3, heights[type] / 3, depth - i * 0.2]} />
              <meshStandardMaterial 
                color={colors[type]} 
                emissive={colors[type]}
                emissiveIntensity={hovered ? 1 : 0.5}
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
          ))}
        </group>
      );
    } else {
      // Modern glass building
      return (
        <group>
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[widths[type], heights[type], depth]} />
            <meshStandardMaterial 
              color={colors[type]} 
              emissive={colors[type]}
              emissiveIntensity={hovered ? 0.8 : 0.4}
              metalness={0.95}
              roughness={0.05}
              transparent
              opacity={0.85}
            />
          </mesh>
          {/* Interior glow */}
          <mesh position={[0, 0, -depth / 4]}>
            <boxGeometry args={[widths[type] * 0.9, heights[type] * 0.9, 0.1]} />
            <meshStandardMaterial 
              color="#ffffff" 
              emissive="#ffffff"
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
      );
    }
  };

  return (
    <Float speed={hovered ? 2 : 0.5} rotationIntensity={hovered ? 0.5 : 0.1} floatIntensity={hovered ? 0.3 : 0.1}>
      <group
        ref={meshRef}
        position={position}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {getBuildingShape()}
        {/* Energy glow effect when hovered */}
        {hovered && (
          <mesh position={[0, heights[type] / 2 + 1, 0]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial 
              color={colors[type]} 
              emissive={colors[type]}
              emissiveIntensity={2}
              transparent
              opacity={0.6}
            />
          </mesh>
        )}
      </group>
    </Float>
  );
}

function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[40, 40, 40, 40]} />
      <meshStandardMaterial 
        color="#0a0a0a" 
        emissive="#00d4ff"
        emissiveIntensity={0.05}
        metalness={0.3}
        roughness={0.8}
      />
    </mesh>
  );
}

function FloatingParticles() {
  const particles = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (particles.current) {
      particles.current.rotation.y = state.clock.elapsedTime * 0.05;
      particles.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  const count = 200;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 40;
  }

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#00d4ff" transparent opacity={0.6} />
    </points>
  );
}

function EnergyOrbs() {
  const orbs = Array.from({ length: 8 }).map((_, i) => ({
    position: [
      Math.cos((i / 8) * Math.PI * 2) * 15,
      2 + Math.sin(i) * 2,
      Math.sin((i / 8) * Math.PI * 2) * 15,
    ] as [number, number, number],
    color: ['#00d4ff', '#b537ff', '#39ff14', '#ff006e'][i % 4],
  }));

  return (
    <>
      {orbs.map((orb, i) => (
        <FloatingOrb key={i} position={orb.position} color={orb.color} />
      ))}
    </>
  );
}

function FloatingOrb({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={1.5}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

function CityGrid() {
  const buildingNames = ['Residential', 'Commercial', 'Industrial', 'Park', 'Solar Farm', 'Hospital', 'School', 'Recycling'];
  const buildings: Array<{ position: [number, number, number]; type: number; name: string }> = [];
  
  // Organized grid layout with clusters
  const gridSize = 5;
  const spacing = 3.5;
  
  for (let x = 0; x < gridSize; x++) {
    for (let z = 0; z < gridSize; z++) {
      if (Math.random() > 0.3) { // 70% chance of building
        const type = Math.floor(Math.random() * 8);
        const height = [3.5, 5, 4, 2, 3, 4.5, 3.5, 2.5][type];
        buildings.push({
          position: [
            (x - gridSize / 2) * spacing + (Math.random() - 0.5) * 0.8,
            height / 2,
            (z - gridSize / 2) * spacing + (Math.random() - 0.5) * 0.8,
          ],
          type,
          name: buildingNames[type],
        });
      }
    }
  }

  return (
    <>
      <GroundPlane />
      {buildings.map((building, index) => (
        <ModernBuilding
          key={index}
          position={building.position}
          type={building.type}
          buildingName={building.name}
          onClick={() => console.log(`Building ${index}: ${building.name}`)}
        />
      ))}
    </>
  );
}

function AnimatedSky() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[80, 32, 32]} />
        <meshBasicMaterial color="#000000" side={THREE.BackSide} />
      </mesh>
    </>
  );
}

export default function CityScene() {
  return (
    <div className="w-full h-full bg-pure-black relative">
      <Canvas shadows gl={{ antialias: true, alpha: false }} dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[18, 12, 18]} fov={50} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={8}
          maxDistance={60}
          maxPolarAngle={Math.PI / 2}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />
        
        {/* Enhanced Lighting System */}
        <ambientLight intensity={0.2} />
        
        {/* Main city lights */}
        <pointLight 
          position={[15, 20, 15]} 
          intensity={2} 
          castShadow 
          color="#00d4ff" 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight 
          position={[-15, 18, -15]} 
          intensity={1.5} 
          castShadow 
          color="#b537ff"
        />
        <pointLight 
          position={[0, 25, 0]} 
          intensity={1} 
          color="#39ff14"
        />
        
        {/* Spotlights for dramatic effect */}
        <spotLight 
          position={[10, 30, 10]} 
          angle={0.4} 
          penumbra={0.5} 
          intensity={2} 
          castShadow 
          color="#00d4ff"
        />
        <spotLight 
          position={[-10, 30, -10]} 
          angle={0.4} 
          penumbra={0.5} 
          intensity={1.5} 
          castShadow 
          color="#b537ff"
        />
        
        {/* Directional light from above */}
        <directionalLight 
          position={[0, 40, 0]} 
          intensity={0.5} 
          castShadow
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        
        {/* Scene elements */}
        <AnimatedSky />
        <CityGrid />
        <FloatingParticles />
        <EnergyOrbs />
        
        {/* Enhanced grid with better visibility */}
        <Grid 
          args={[40, 40]} 
          cellSize={1} 
          cellThickness={0.5} 
          cellColor="#00d4ff30" 
          sectionSize={5} 
          sectionThickness={1} 
          sectionColor="#00d4ff60" 
          fadeDistance={60} 
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={false}
        />
        
        {/* Sparkle effects */}
        <Sparkles count={100} scale={30} size={3} speed={0.4} color="#00d4ff" />
        
        <fog attach="fog" args={['#000000', 30, 80]} />
        <Environment preset="night" />
      </Canvas>
      
      {/* Enhanced UI Overlay */}
      <div className="absolute top-4 left-4 bg-near-black/90 backdrop-blur-xl p-5 rounded-xl border border-white/20 shadow-lg shadow-white/5">
        <h3 className="text-sm font-orbitron font-bold text-white mb-3 uppercase tracking-wider">City View</h3>
        <p className="text-xs text-text-muted mb-3">Explore the 3D cityscape</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <span className="text-text-secondary">Drag to rotate</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <span className="text-text-secondary">Scroll to zoom</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <span className="text-text-secondary">Hover buildings for info</span>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4 bg-near-black/90 backdrop-blur-xl p-4 rounded-xl border border-white/20">
        <p className="text-xs font-orbitron text-white mb-2">🏙️ MetaCity</p>
        <p className="text-xs text-text-muted">Active Buildings: 247</p>
        <p className="text-xs text-text-muted">Energy Efficiency: 87%</p>
      </div>
    </div>
  );
}
