import { useRef, useState, useEffect, useMemo } from "react";
import CityExportModal from "@/components/ui/CityExportModal";
import StreamOverlay from "@/components/StreamOverlay";
import { useStreaming } from "@/contexts/StreamingContext";
import { createScreenshotFunctions } from "@/utils/screenshot";
import { useThree } from "@react-three/fiber";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Grid,
  Float,
  Sparkles,
  Stars,
} from "@react-three/drei";
import * as THREE from "three";

interface BuildingProps {
  position: [number, number, number];
  type: number;
  onClick?: () => void;
  buildingName?: string;
  onHover?: (hovered: boolean) => void;
}

function ModernBuilding({
  position,
  type,
  onClick,
  buildingName,
  onHover,
}: BuildingProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Removed useFrame animation to prevent any building movement

  const handlePointerOver = () => {
    console.log("Building hovered:", buildingName);
    setHovered(true);
    onHover?.(true);
  };

  const handlePointerOut = () => {
    console.log("Building unhovered:", buildingName);
    setHovered(false);
    onHover?.(false);
  };

  const colors = [
    "#4CAF50",
    "#2196F3",
    "#FF9800",
    "#8BC34A",
    "#FFC107",
    "#F44336",
    "#9C27B0",
    "#00BCD4",
  ];
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
            <mesh
              key={i}
              position={[
                0,
                -heights[type] / 2 + i * 0.8 + 0.4,
                depth / 2 + 0.01,
              ]}
              castShadow
            >
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
            <cylinderGeometry
              args={[widths[type] / 2, widths[type] / 2, heights[type], 8]}
            />
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
            <mesh
              key={i}
              position={[
                0,
                (offset * heights[type]) / 3 - heights[type] / 3,
                0,
              ]}
              castShadow
            >
              <boxGeometry
                args={[
                  widths[type] - i * 0.3,
                  heights[type] / 3,
                  depth - i * 0.2,
                ]}
              />
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
            <boxGeometry
              args={[widths[type] * 0.9, heights[type] * 0.9, 0.1]}
            />
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
    <group
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        handlePointerOver();
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        handlePointerOut();
      }}
    >
      {getBuildingShape()}
      {/* Energy glow effect when hovered */}
      {hovered && (
        <mesh position={[0, heights[type] / 2 + 1, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color={colors[type]}
            emissive={colors[type]}
            emissiveIntensity={1.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
}

function GroundPlane() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 0]}
      receiveShadow
    >
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
    color: ["#00d4ff", "#b537ff", "#39ff14", "#ff006e"][i % 4],
  }));

  return (
    <>
      {orbs.map((orb, i) => (
        <FloatingOrb key={i} position={orb.position} color={orb.color} />
      ))}
    </>
  );
}

function FloatingOrb({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5;
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

function CityGrid({
  onBuildingHover,
}: {
  onBuildingHover: (
    building: {
      name: string;
      position: [number, number, number];
      type: number;
    } | null
  ) => void;
}) {
  const buildingNames = [
    "Residential",
    "Commercial",
    "Industrial",
    "Park",
    "Solar Farm",
    "Hospital",
    "School",
    "Recycling",
  ];
  const buildings: Array<{
    position: [number, number, number];
    type: number;
    name: string;
  }> = [];

  // Fixed buildings array to ensure consistency
  const fixedBuildings = [
    { x: 0, z: 0, type: 0 }, // Residential
    { x: 1, z: 0, type: 1 }, // Commercial
    { x: -1, z: 0, type: 2 }, // Industrial
    { x: 0, z: 1, type: 3 }, // Park
    { x: 0, z: -1, type: 4 }, // Solar Farm
    { x: 1, z: 1, type: 5 }, // Hospital
    { x: -1, z: 1, type: 6 }, // School
    { x: 1, z: -1, type: 7 }, // Recycling
  ];

  fixedBuildings.forEach(({ x, z, type }) => {
    const height = [3.5, 5, 4, 2, 3, 4.5, 3.5, 2.5][type];
    buildings.push({
      position: [x * 3.5, height / 2, z * 3.5],
      type,
      name: buildingNames[type],
    });
  });

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
          onHover={(hovered) => {
            if (hovered) {
              onBuildingHover(building);
            } else {
              onBuildingHover(null);
            }
          }}
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
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[80, 32, 32]} />
        <meshBasicMaterial color="#000000" side={THREE.BackSide} />
      </mesh>
    </>
  );
}

// Component to get renderer from inside Canvas and pass screenshot functions up
function ScreenshotProvider({
  onScreenshotFunctions,
}: {
  onScreenshotFunctions: (
    functions: ReturnType<typeof createScreenshotFunctions>
  ) => void;
}) {
  const { gl: renderer } = useThree();

  const screenshotFunctions = useMemo(() => {
    return createScreenshotFunctions(renderer);
  }, [renderer]);

  useEffect(() => {
    onScreenshotFunctions(screenshotFunctions);
  }, [screenshotFunctions, onScreenshotFunctions]);

  return null;
}

export default function CityScene() {
  const [hoveredBuilding, setHoveredBuilding] = useState<{
    name: string;
    position: [number, number, number];
    type: number;
  } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [showStreamOverlay, setShowStreamOverlay] = useState(false);
  const [screenshotFunctions, setScreenshotFunctions] = useState<ReturnType<
    typeof createScreenshotFunctions
  > | null>(null);
  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

  // Get streaming context
  const { isStreaming, isAuthenticated } = useStreaming();

  // Mock city stats - in a real app, these would come from your smart contracts
  const cityStats = {
    buildings: 8,
    sustainability: 78,
    level: 5,
    rewards: 12500,
  };

  // Default camera position
  const defaultPosition = { x: 18, y: 12, z: 18 };
  const defaultTarget = { x: 0, y: 0, z: 0 };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (hoveredBuilding) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setTooltipPosition({ x, y });
    }
  };

  // Camera control functions
  const resetCamera = () => {
    if (controlsRef.current && cameraRef.current) {
      controlsRef.current.reset();
      cameraRef.current.position.set(
        defaultPosition.x,
        defaultPosition.y,
        defaultPosition.z
      );
      controlsRef.current.target.set(
        defaultTarget.x,
        defaultTarget.y,
        defaultTarget.z
      );
      controlsRef.current.update();
    }
  };

  const fitToView = () => {
    if (controlsRef.current && cameraRef.current) {
      // Zoom out to show entire city
      cameraRef.current.position.set(25, 20, 25);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const zoomIn = () => {
    if (controlsRef.current && cameraRef.current) {
      const camera = cameraRef.current;
      const controls = controlsRef.current;

      // Calculate direction from target to camera
      const direction = camera.position
        .clone()
        .sub(controls.target)
        .normalize();
      const currentDistance = camera.position.distanceTo(controls.target);

      if (currentDistance > 8) {
        const newDistance = Math.max(currentDistance * 0.8, 8);
        camera.position
          .copy(controls.target)
          .add(direction.multiplyScalar(newDistance));
        controls.update();
      }
    }
  };

  const zoomOut = () => {
    if (controlsRef.current && cameraRef.current) {
      const camera = cameraRef.current;
      const controls = controlsRef.current;

      // Calculate direction from target to camera
      const direction = camera.position
        .clone()
        .sub(controls.target)
        .normalize();
      const currentDistance = camera.position.distanceTo(controls.target);

      if (currentDistance < 60) {
        const newDistance = Math.min(currentDistance * 1.25, 60);
        camera.position
          .copy(controls.target)
          .add(direction.multiplyScalar(newDistance));
        controls.update();
      }
    }
  };

  const toggleViewCube = () => {
    if (controlsRef.current && cameraRef.current) {
      // Cycle through different preset views
      const views = [
        { pos: [18, 12, 18], name: "Default" },
        { pos: [0, 25, 0], name: "Top" },
        { pos: [25, 5, 0], name: "Side" },
        { pos: [0, 5, 25], name: "Front" },
        { pos: [-25, 5, 0], name: "Left" },
        { pos: [0, 5, -25], name: "Back" },
      ];

      const currentView = Math.floor(Math.random() * views.length);
      const view = views[currentView];

      cameraRef.current.position.set(view.pos[0], view.pos[1], view.pos[2]);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();

      console.log(`Switched to ${view.name} view`);
    }
  };

  // Event listeners for camera controls
  useEffect(() => {
    const handleResetCamera = () => resetCamera();
    const handleFitToView = () => fitToView();
    const handleZoomIn = () => zoomIn();
    const handleZoomOut = () => zoomOut();
    const handleToggleViewCube = () => toggleViewCube();

    window.addEventListener("resetCamera", handleResetCamera);
    window.addEventListener("fitToView", handleFitToView);
    window.addEventListener("zoomIn", handleZoomIn);
    window.addEventListener("zoomOut", handleZoomOut);
    window.addEventListener("toggleViewCube", handleToggleViewCube);

    return () => {
      window.removeEventListener("resetCamera", handleResetCamera);
      window.removeEventListener("fitToView", handleFitToView);
      window.removeEventListener("zoomIn", handleZoomIn);
      window.removeEventListener("zoomOut", handleZoomOut);
      window.removeEventListener("toggleViewCube", handleToggleViewCube);
    };
  }, []);

  return (
    <div
      className="w-full h-full bg-pure-black relative"
      onMouseMove={handleMouseMove}
    >
      <Canvas shadows gl={{ antialias: true, alpha: false }} dpr={[1, 2]}>
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          position={[18, 12, 18]}
          fov={50}
        />
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={8}
          maxDistance={60}
          maxPolarAngle={Math.PI / 2}
          autoRotate={false}
          autoRotateSpeed={0.5}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.5}
          panSpeed={0.5}
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
        <pointLight position={[0, 25, 0]} intensity={1} color="#39ff14" />

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
        <CityGrid
          onBuildingHover={(building) => {
            console.log("Hover changed:", building);
            setHoveredBuilding(building);
          }}
        />
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

        <fog attach="fog" args={["#000000", 30, 80]} />
        <Environment preset="night" />

        <ScreenshotProvider onScreenshotFunctions={setScreenshotFunctions} />
      </Canvas>

      {/* Enhanced UI Overlay */}
      <div className="absolute top-4 left-4 bg-near-black/90 backdrop-blur-xl p-5 rounded-xl border border-white/20 shadow-lg shadow-white/5">
        <h3 className="text-sm font-orbitron font-bold text-white mb-3 uppercase tracking-wider">
          City View
        </h3>
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
            <span className="text-text-secondary">
              Hover buildings for info
            </span>
          </div>
        </div>
      </div>

      {/* 3D Navigation Controls Panel */}
      <div className="absolute top-4 right-4 bg-near-black/95 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg shadow-white/5">
        <div className="flex flex-col gap-1 p-2">
          {/* Home View Button */}
          <button
            className="w-10 h-10 bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 hover:from-cyber-blue/40 hover:to-cyber-purple/40 border border-cyber-blue/30 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 group"
            title="Home View"
            onClick={() => {
              // Reset camera to default position
              const event = new CustomEvent("resetCamera");
              window.dispatchEvent(event);
            }}
          >
            <div className="text-cyber-blue group-hover:text-white transition-colors">
              🏠
            </div>
          </button>

          {/* Fit to View Button */}
          <button
            className="w-10 h-10 bg-gradient-to-br from-neon-green/20 to-cyber-blue/20 hover:from-neon-green/40 hover:to-cyber-blue/40 border border-neon-green/30 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 group"
            title="Fit to View"
            onClick={() => {
              const event = new CustomEvent("fitToView");
              window.dispatchEvent(event);
            }}
          >
            <div className="text-neon-green group-hover:text-white transition-colors text-sm">
              ⬧
            </div>
          </button>

          {/* Zoom In Button */}
          <button
            className="w-10 h-10 bg-gradient-to-br from-cyber-purple/20 to-cyber-pink/20 hover:from-cyber-purple/40 hover:to-cyber-pink/40 border border-cyber-purple/30 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 group"
            title="Zoom In"
            onClick={() => {
              const event = new CustomEvent("zoomIn");
              window.dispatchEvent(event);
            }}
          >
            <div className="text-cyber-purple group-hover:text-white transition-colors font-bold text-lg">
              +
            </div>
          </button>

          {/* Zoom Out Button */}
          <button
            className="w-10 h-10 bg-gradient-to-br from-cyber-pink/20 to-yellow-500/20 hover:from-cyber-pink/40 hover:to-yellow-500/40 border border-cyber-pink/30 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 group"
            title="Zoom Out"
            onClick={() => {
              const event = new CustomEvent("zoomOut");
              window.dispatchEvent(event);
            }}
          >
            <div className="text-cyber-pink group-hover:text-white transition-colors font-bold text-lg">
              −
            </div>
          </button>

          {/* 3D View Cube */}
          <button
            className="w-10 h-10 bg-gradient-to-br from-white/10 to-gray-500/20 hover:from-white/20 hover:to-gray-500/40 border border-white/20 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 group"
            title="View Controls"
            onClick={() => {
              const event = new CustomEvent("toggleViewCube");
              window.dispatchEvent(event);
            }}
          >
            <div className="text-white group-hover:text-cyber-blue transition-colors">
              🎲
            </div>
          </button>

          {/* Export Screenshot Button */}
          <button
            className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 hover:from-purple-500/40 hover:to-pink-500/40 border border-purple-400/30 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 group"
            title="Export City Screenshot"
            onClick={() => setIsExportModalOpen(true)}
          >
            <div className="text-purple-400 group-hover:text-white transition-colors">
              📸
            </div>
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 bg-near-black/90 backdrop-blur-xl p-4 rounded-xl border border-white/20">
        <p className="text-xs font-orbitron text-white mb-2">🏙️ MetaCity</p>
        <p className="text-xs text-text-muted">Active Buildings: 247</p>
        <p className="text-xs text-text-muted">Energy Efficiency: 87%</p>
      </div>

      {/* Building Hover Tooltip */}
      {hoveredBuilding && (
        <div
          className="absolute pointer-events-none z-50 bg-gradient-to-br from-black/90 to-gray-900/90 backdrop-blur-sm text-white p-4 rounded-xl border border-cyber-blue/30 shadow-2xl shadow-cyber-blue/20 min-w-[280px]"
          style={{
            left: tooltipPosition.x + 25,
            top: tooltipPosition.y + 15,
          }}
        >
          {/* Building Header */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-cyber-blue rounded-full animate-pulse"></div>
            <div className="font-bold text-cyber-blue text-lg">
              {hoveredBuilding.name}
            </div>
          </div>

          {/* Building Stats */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-300">Level:</span>
                <span className="text-neon-green font-semibold">
                  {Math.floor(Math.random() * 5) + 1}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Type:</span>
                <span className="text-cyber-purple font-semibold">
                  {hoveredBuilding.type === 0
                    ? "Residential"
                    : hoveredBuilding.type === 1
                    ? "Commercial"
                    : hoveredBuilding.type === 2
                    ? "Industrial"
                    : "Mixed"}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-300">Sustainability:</span>
                <span className="text-neon-green font-semibold">
                  {Math.floor(Math.random() * 100)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Economic Value:</span>
                <span className="text-yellow-400 font-semibold">
                  {Math.floor(Math.random() * 1000) + 500} MTC
                </span>
              </div>
            </div>
          </div>

          {/* Daily Rewards */}
          <div className="mt-3 pt-2 border-t border-gray-700/50">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Daily Rewards:</span>
              <div className="flex items-center gap-1">
                <span className="text-neon-green font-bold">
                  {Math.floor(Math.random() * 50) + 10}
                </span>
                <span className="text-xs text-gray-400">MTC/day</span>
              </div>
            </div>
          </div>

          {/* Position Info */}
          <div className="mt-2 text-xs text-gray-500">
            Position: [{hoveredBuilding.position[0].toFixed(1)},{" "}
            {hoveredBuilding.position[1].toFixed(1)},{" "}
            {hoveredBuilding.position[2].toFixed(1)}]
          </div>
        </div>
      )}

      {/* Export Modal */}
      {screenshotFunctions && (
        <CityExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          cityStats={cityStats}
          screenshotFunctions={screenshotFunctions}
        />
      )}

      {/* Stream Overlay */}
      {isAuthenticated && isStreaming && (
        <StreamOverlay position="top-right" compact={!showStreamOverlay} />
      )}
    </div>
  );
}
