import React, { useEffect, useContext } from 'react'
import { StoreContext } from '../contexts/contexts'
import { loadingConfig, fetchConfig, addConfig } from '../../store/Actions/configActions'

  const ConfigFetch=()=> {
      const {dispatchConfig}=useContext(StoreContext)
    
      useEffect(()=>{
        const getConfig=async ()=>{
         dispatchConfig(loadingConfig())
            try{
          const config=await fetchConfig()
          dispatchConfig(addConfig(config))
         }   
         catch(err){
        dispatchConfig({type:'ERROR'})
         }
        }
   getConfig()
      },[dispatchConfig])
    return (
        <p></p>
    )
}

export default ConfigFetch
