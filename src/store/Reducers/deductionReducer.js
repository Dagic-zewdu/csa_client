export const deductionState={
    state:[],
    loading:true,
    error:false
}
 
export const deductionReducer =(state=deductionState,action)=>{
 switch(action.type){
     case 'ADD_DEDUCTIONS':
     return {state:action.payload,loading:false,error:false}
     case 'LOADING_DEDUCTIONS':
   return {...state,loading:true}
   default:
       return {...state,loading:false,error:true}
 }   
}