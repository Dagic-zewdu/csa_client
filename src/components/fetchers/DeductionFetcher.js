import React, { useContext ,useEffect} from 'react'
import { loadingDeductions } from '../../store/Actions/deductionActions'
import { StoreContext } from '../contexts/contexts'
import { fetchData_Deductions } from './Functions/FerchDeductions'

const DeductionFetcher=()=> {
    const {dispatchDeductions}=useContext(StoreContext)
    
    useEffect(()=>{
         dispatchDeductions(loadingDeductions())
        fetchData_Deductions(dispatchDeductions)
        },[])
    return (
        <div>
            
        </div>
    )
}

export default DeductionFetcher
