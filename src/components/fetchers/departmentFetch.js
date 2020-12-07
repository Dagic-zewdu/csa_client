import React, { useEffect, useContext } from 'react'
import { StoreContext } from '../contexts/contexts'
import { loadingDepartment, fetchDepartment, addDepartment } from '../../store/Actions/departmentActions'

  const DepartmentFetch=()=> {
      const {dispatchDepartment}=useContext(StoreContext)
    const getDepartment=async ()=>{
        dispatchDepartment(loadingDepartment())
     try{
      const departments=await fetchDepartment()
      dispatchDepartment(addDepartment(departments))
     }   
     catch(err){
    dispatchDepartment({type:'ERROR'})
     }
    }
      useEffect(()=>{
   getDepartment()
      },[dispatchDepartment])
    return (
        <div>
            
        </div>
    )
}

export default DepartmentFetch
