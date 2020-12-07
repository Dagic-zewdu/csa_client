import React, { useContext,useEffect } from 'react'
import { StoreContext } from '../contexts/contexts'
import { loadingEmployees, fetchEmployees, addEmployees } from '../../store/Actions/employeeAction'

const EmployeeFetcher=()=> {
    const {dispatchEmployees}=useContext(StoreContext)
    
    useEffect(()=>{
      const getEmployees=async ()=>{
        try{
          dispatchEmployees(loadingEmployees())
        const employees=await fetchEmployees()
        dispatchEmployees(addEmployees(employees))
    }
    catch(err){
        dispatchEmployees({type:'ERROR'})
    }
    }
  getEmployees()
    },[dispatchEmployees])
    return (
        <p></p>
    )
}

export default EmployeeFetcher
