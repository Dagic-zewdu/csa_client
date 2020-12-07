import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { addClimatePlaces, fetchClimatePlaces,loadingClimatePlaces } from '../../store/Actions/climatePlacesActions'
import { StoreContext } from '../contexts/contexts'

  const ClimatePlacesFetcher=()=> {
    const {dispatchClimatePlaces}=useContext(StoreContext)
    useEffect(()=>{
     const fetch=async ()=>{
         try{
     dispatchClimatePlaces(loadingClimatePlaces())
     const places=await fetchClimatePlaces()
     dispatchClimatePlaces(addClimatePlaces(places))
       }
       catch(err){
   dispatchClimatePlaces({type:'ERROR'})
       }
    }
     fetch()
    },[dispatchClimatePlaces])
    return (
        <div>
            
        </div>
    )
}

export default ClimatePlacesFetcher
