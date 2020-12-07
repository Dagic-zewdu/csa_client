import React, { useContext, useEffect } from 'react'
import { StoreContext } from '../contexts/contexts'
import { loadingLetters, fetchLetters, addLetters } from '../../store/Actions/letterActions'

  const LettersFetcher=()=> {
      const {dispatchLetters}=useContext(StoreContext)
useEffect(()=>{
   const fecth=async ()=>{
       try{
      dispatchLetters(loadingLetters())
      const letters=await fetchLetters()
      dispatchLetters(addLetters(letters))
       }
       catch(err){
    dispatchLetters({type:'ERROR'})
       }
   }
   fecth()
},[dispatchLetters])

    return (
        <p></p>
    )
}

export default LettersFetcher
