import React from 'react'
import { SketchPicker } from "react-color";
import { useSnapshot } from 'valtio';
import state from '../store';
import { AnimatePresence, motion } from 'framer-motion';
import { fadeAnimation } from '../config/motion';


const ColorPicker = () => {

  const snap = useSnapshot(state)

  return (
    <AnimatePresence>
      <motion.div 
          className='absolute left-full ml-3'
          {...fadeAnimation}
      >
        <SketchPicker 
          color={snap.color}
          disableAlpha
          onChange={(color) => state.color = color.hex}
        />
      </motion.div>
    </AnimatePresence>
  )
}

export default ColorPicker