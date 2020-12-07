export const fieldAllowanceState={
    state:[],
    loading:true,
    error:false
}
 
export const fieldAllowanceReducer =(state=fieldAllowanceState,action)=>{
 switch(action.type){
     case 'ADD_FIELDALLOWANCE':
     return {state:action.payload,loading:false,error:false}
     case 'LOADING_FIELDALLOWANCE':
   return {...state,loading:true}
   default:
       return {...state,loading:false,error:true}
 }   
}