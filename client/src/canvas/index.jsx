import { Canvas } from '@react-three/fiber';
import { Environment, Center, OrbitControls } from "@react-three/drei";
import Backdrop from './Backdrop';
import Shirt from './Shirt';
import CameraRig from './CameraRig';

const CanvasModel = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 2.5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
      className='w-full max-w-full h-full transition-all ease-in'
    >
      <ambientLight intensity={0.5} />
      <Environment preset='city' />

      <Center>
        <Shirt />
      </Center>

      <OrbitControls 
        enablePan={false}
        enableZoom={false}
        minDistance={1.5}
        maxDistance={4}
        rotateSpeed={1}
        target={[0, 0, 0]}
      />
    </Canvas>
  )
}

export default CanvasModel