import React, { useContext, useEffect } from 'react'
import { StoreContext } from '../contexts/contexts'
import { loadingFieldAllowance, fetchFieldAllowance, addFieldAllowance } from '../../store/Actions/FieldAllowanceActions'

  const FieldAllowanceFetcher=()=> {
      const {dispatchFieldEmplooyees}=useContext(StoreContext)
   useEffect(()=>{
       const employees=async ()=>{
        try{

            dispatchFieldEmplooyees(loadingFieldAllowance())
            const field=await fetchFieldAllowance()
            dispatchFieldEmplooyees(addFieldAllowance(field)) 
        }
        catch(err){
             dispatchFieldEmplooyees({type:'ERROR'})  
        }  
       }
       employees()
   },[dispatchFieldEmplooyees])   
    return (
        <p></p>
    )
}

export default FieldAllowanceFetcher
