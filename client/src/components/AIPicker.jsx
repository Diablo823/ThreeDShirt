/* import React from 'react'
import CustomButton from './CustomButton'
import { AnimatePresence, motion } from 'framer-motion'
import { fadeAnimation } from '../config/motion'

const AIPicker = ({ prompt, setPrompt, generatingImg, handleSubmit}) => {
  return (
    <AnimatePresence>
      <motion.div 
          className='aipicker-container'
          {...fadeAnimation}
      >
        
        <p className='flex justify-center'>
            Coming soon...
        </p>
        
      </motion.div>
    </AnimatePresence>
  )
}

export default AIPicker
 */
import React from 'react'

import CustomButton from './CustomButton';

const AIPicker = ({ prompt, setPrompt, generatingImg, handleSubmit }) => {
  return (
    <div className="aipicker-container">
      <textarea 
        placeholder="Ask AI..."
        rows={5}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="aipicker-textarea"
      />
      <div className="flex flex-wrap gap-3">
        {generatingImg ? (
          <CustomButton 
            type="outline"
            title="Asking AI..."
            customStyles="text-xs"
          />
        ) : (
          <>
            <CustomButton 
              type="outline"
              title="AI Logo"
              handleClick={() => handleSubmit('logo')}
              customStyles="text-xs"
            />

            <CustomButton 
              type="filled"
              title="AI Full"
              handleClick={() => handleSubmit('full')}
              customStyles="text-xs"
            />
          </>
        )}
      </div>
    </div>
  )
}

export default AIPicker
