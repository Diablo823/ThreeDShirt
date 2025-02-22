import React from 'react'
import CustomButton from './CustomButton'
import { AnimatePresence, motion } from 'framer-motion'
import { fadeAnimation } from '../config/motion'

const FilePicker = ({ file, setFile, readFile }) => {
  return (
    <AnimatePresence>
      <motion.div 
          className='filepicker-container'
          {...fadeAnimation}
      >

        <div className='flex-1 flex flex-col'>
          <input
            id='file-upload' 
            type="file" 
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
          />

          <label htmlFor="file-upload" className='filepicker-label'>
            Upload File
          </label>

          <p className='mt-2 text-gray-900 text-xs truncate'>
            {file === '' ? 'No File Selected' : file.name}
          </p>
        </div>  

        <div className='mt-4 flex flex-wrap gap-3'>

          <CustomButton 
            type='outline'
            title='logo'
            handleClick={() => readFile('logo')}
            customStyles='text-xs'
          />

          <CustomButton 
            type='filled'
            title='full'
            handleClick={() => readFile('full')}
            customStyles='text-xs'
          />

        </div>   
      </motion.div>
    </AnimatePresence>
  )
}

export default FilePicker