import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useSnapshot } from "valtio";
import config from '../config/config';
import { download } from '../assets'
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from "../components";
import state from '../store';


const Customizer = () => {

  const snap = useSnapshot(state);

  const [file, setFile] = useState('');
  const [prompt, setPrompt] = useState('');

  const [generatingImg, setGeneratingImg] = useState(false);
  
  //const [activeEditorTab, setActiveEditorTab ] = useState("");
  
  const [activeFilterTab,  setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false
  });

  const [activeEditorTab, setActiveEditorTab ] = useState(null);

  const handleTabClick = (tabName) => {
    setActiveEditorTab((prevTab) => (prevTab === tabName ? null : tabName));
  }; 

  const generateTabContent = () => {
    switch (activeEditorTab) {
      case 'colorpicker':
        return <ColorPicker />
      case 'filepicker':
        return <FilePicker 
                  file={file}
                  setFile={setFile}
                  readFile={readFile}
               />
      case 'aipicker':
        return <AIPicker 
                  prompt={prompt}
                  setPrompt={setPrompt}
                  generatingImg={generatingImg}
                  handleSubmit={handleSubmit}
               />
      default:
        return null;
    }
  }


   const handleSubmit = async (type) => {
    if (!prompt) return alert('Please entar a prompt');

    try {
      setGeneratingImg(true);

      const response = await fetch('https://threedshirtai-uuqd.onrender.com/api/v1/stability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
        })

      })

      const data = await response.json();

      if (!data.photo) {
        throw new Error('No image data received');
    }

      handleDecals(type, `data:image/png;base64,${data.photo}`)

    } catch (error) {
      alert(error);
    } finally {
      setGeneratingImg(false);
      setActiveEditorTab('');
    }
   }

  


  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];

    state[decalType.stateProperty] = result;

    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab)
    }

  }

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case 'logoShirt':
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case 'stylishShirt':
        state.isFullTexture = !activeFilterTab[tabName];
        break;
    
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName]
      }
    })
  }

  const readFile = (type) => {
    reader(file)
      .then((result) => {
        handleDecals(type, result);
        setActiveEditorTab('');
      })
  }

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key='custom'
            className='absolute top-0 left-0 z-10'
            {...slideAnimation('left')}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab 
                    key={tab.name}
                    tab={tab}
                    //new
                    isActive={activeEditorTab === tab.name}
                    //handleClick={() => {setActiveEditorTab(tab.name)}}
                    handleClick={() => handleTabClick(tab.name)}
                  />
                ))}
                
                {generateTabContent()}

              </div>
            </div>
          </motion.div> 

          <motion.div 
            className='absolute z-10 top-5 right-5'
            {...fadeAnimation}
          >
            <CustomButton 
              type='filled'
              title='Go Back'
              handleClick={() => state.intro = true}
              customStyles='w-fit px-4 py-2.5 font-bold text-sm'
            />
          </motion.div> 

          <motion.div
            className='filtertabs-container'
            {...slideAnimation('up')}
          >
              {FilterTabs.map((tab) => (
                  <Tab 
                    key={tab.name}
                    tab={tab}
                    isFilterTab
                    isActiveTab={activeFilterTab[tab.name]}
                    handleClick={() => handleActiveFilterTab(tab.name)}
                  />
              ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Customizer





