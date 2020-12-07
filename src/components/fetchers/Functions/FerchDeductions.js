import { addDeductions, fetchDeductions } from "../../../store/Actions/deductionActions"
/**fetch deductions and save to reducer context */
export  const fetchData_Deductions=async (dispatchDeductions)=>{
    try{
  let deductions=await fetchDeductions()
  dispatchDeductions(addDeductions(deductions))
    }  
    catch(err){
        console.log(err)
     dispatchDeductions({type:'ERROR'})
    }
  }