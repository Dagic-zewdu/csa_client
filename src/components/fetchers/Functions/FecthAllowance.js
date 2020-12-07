import { fetchAllowances, addAllowances, loadingAllowances } from "../../../store/Actions/allowanceActions"

export  const fetchData_Allowance=async (dispatchAllowances)=>{
    try{
      
  let allowances=await fetchAllowances()
  dispatchAllowances(addAllowances(allowances))
    }  
    catch(err){
        console.log(err)
     dispatchAllowances({type:'ERROR'})
    }
  }