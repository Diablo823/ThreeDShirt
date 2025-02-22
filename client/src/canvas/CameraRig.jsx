import React, { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { easing } from 'maath'
import { useSnapshot } from 'valtio'
import state from '../store'

const CameraRig = ({ children }) => {
  const group = useRef()
  const snap = useSnapshot(state)
  const { gl } = useThree()

  // Drag rotation refs
  const isDragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const targetRotation = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = gl.domElement

    const handleMouseDown = (e) => {
      isDragging.current = true
      lastPos.current = { x: e.clientX, y: e.clientY }
      targetRotation.current = {
        x: group.current.rotation.x,
        y: group.current.rotation.y
      }
    }

    const handleMouseMove = (e) => {
      if (!isDragging.current) return
      
      const deltaX = e.clientX - lastPos.current.x
      const deltaY = e.clientY - lastPos.current.y
      
      targetRotation.current.y += deltaX * 0.005
      targetRotation.current.x += deltaY * 0.005
      
      lastPos.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseUp = () => {
      isDragging.current = false
    }

    // Touch handlers
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging.current = true
        const touch = e.touches[0]
        lastPos.current = { x: touch.clientX, y: touch.clientY }
        targetRotation.current = {
          x: group.current.rotation.x,
          y: group.current.rotation.y
        }
      }
    }

    const handleTouchMove = (e) => {
      if (!isDragging.current || e.touches.length !== 1) return
      e.preventDefault()
      
      const touch = e.touches[0]
      const deltaX = touch.clientX - lastPos.current.x
      const deltaY = touch.clientY - lastPos.current.y
      
      targetRotation.current.y += deltaX * 0.005
      targetRotation.current.x += deltaY * 0.005
      
      lastPos.current = { x: touch.clientX, y: touch.clientY }
    }

    const handleTouchEnd = () => {
      isDragging.current = false
    }

    // Add event listeners
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('touchstart', handleTouchStart)
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd)

    return () => {
      // Cleanup
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
  }, [gl])

  useFrame((state, delta) => {
    const isBreakpoint = window.innerWidth <= 1260
    const isMobile = window.innerWidth <= 600

    // Initial camera position setup (existing code)
    let targetPosition = [-0.4, 0, 2]
    if (snap.intro) {
      if (isBreakpoint) targetPosition = [0, 0, 2]
      if (isMobile) targetPosition = [0, 0.2, 2.5]
    } else {
      if (isMobile) targetPosition = [0, 0, 2.3]
      else targetPosition = [0, 0, 2]
    }

    easing.damp3(state.camera.position, targetPosition, 0.25, delta)

    // Handle rotation
    if (isDragging.current) {
      // Apply dragged rotation
      easing.dampE(
        group.current.rotation,
        [targetRotation.current.x, targetRotation.current.y, 0],
        0.25,
        delta
      )
    } else {
      // Original hover effect
      easing.dampE(
        group.current.rotation,
        [state.pointer.y / 10, -state.pointer.x / 5, 0],
        0.25,
        delta
      )
      // Sync target rotation with current rotation
      targetRotation.current.x = group.current.rotation.x
      targetRotation.current.y = group.current.rotation.y
    }
  })

  return <group ref={group}>{children}</group>
}

export default CameraRig