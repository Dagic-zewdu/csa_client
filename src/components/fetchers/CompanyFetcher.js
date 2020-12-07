import React, { useEffect, useContext } from 'react'
import { StoreContext } from '../contexts/contexts'
import { loadingCompany, fetchCompany, addCompany } from '../../store/Actions/companyActions'

  const CompanyFetcher=()=> {
      const {dispatchCompany}=useContext(StoreContext)
    
      useEffect(()=>{
        const getCompany=async ()=>{
         dispatchCompany(loadingCompany())
            try{
          const company=await fetchCompany()
          dispatchCompany(addCompany(company))
         }   
         catch(err){
        dispatchCompany({type:'ERROR'})
         }
        }
   getCompany()
      },[dispatchCompany])
    return (
        <p></p>
    )
}

export default CompanyFetcher
