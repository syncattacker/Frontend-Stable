import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleField = ({ count = 5000 }) => {
    const points = useRef();

    const particles = useMemo(() => {
        const temp = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 40;
            const y = (Math.random() - 0.5) * 20;
            const z = (Math.random() - 0.5) * 40;
            temp.set([x, y, z], i * 3);
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        points.current.rotation.y = time * 0.05;
        points.current.rotation.x = Math.sin(time * 0.1) * 0.05;
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.length / 3}
                    array={particles}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.08}
                color="#8251EE"
                transparent
                opacity={0.6}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

const PerspectiveGrid = () => {
    return (
        <gridHelper
            args={[100, 50, '#8251EE', '#2A2A2A']}
            position={[0, -10, 0]}
            rotation={[Math.PI / 10, 0, 0]}
        />
    );
};

const CyberBackground = () => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: '#050505' }}>
            <Canvas camera={{ position: [0, 5, 20], fov: 60 }}>
                <fog attach="fog" args={['#050505', 10, 50]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#8251EE" />
                <ParticleField />
                <PerspectiveGrid />
            </Canvas>
        </div>
    );
};

export default CyberBackground;
