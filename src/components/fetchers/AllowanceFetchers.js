import React, { useEffect, useContext } from 'react'
import { StoreContext } from '../contexts/contexts'
import { loadingAllowances, fetchAllowances, addAllowances } from '../../store/Actions/allowanceActions'

  const AllowanceFetchers=()=> {
      const {dispatchAllowances}=useContext(StoreContext)
    
      useEffect(()=>{
        const getAllowances=async ()=>{
         dispatchAllowances(loadingAllowances())
            try{
          const allowances=await fetchAllowances()
          dispatchAllowances(addAllowances(allowances))
         }   
         catch(err){
        dispatchAllowances({type:'ERROR'})
         }
        }
   getAllowances()
      },[dispatchAllowances])
    return (
        <p></p>
    )
}

export default AllowanceFetchers
