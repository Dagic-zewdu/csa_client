import React, { useContext,useEffect } from 'react'
import { StoreContext } from '../contexts/contexts'
import { loadingPlaces, fetchPlaces, addPlaces } from '../../store/Actions/placeActions'

const PlaceFetchers=()=> {
    const {dispatchPlaces}=useContext(StoreContext)
    
    useEffect(()=>{
        const getPlaces=async ()=>{
            try{
            dispatchPlaces(loadingPlaces())
            const places=await fetchPlaces()
            dispatchPlaces(addPlaces(places))
        }
        catch(err){
            dispatchPlaces({type:'ERROR'})
        }
        }
        getPlaces()
    },[dispatchPlaces])
    return (
        <p></p>
    )
}

export default PlaceFetchers
