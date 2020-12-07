export const allowanceState={
    state:[],
    loading:true,
    error:false
}
 
export const allowanceReducer =(state=allowanceState,action)=>{
 switch(action.type){
     case 'ADD_ALLOWANCES':
     return {state:action.payload,loading:false,error:false}
     case 'LOADING_ALLOWANCES':
   return {...state,loading:true}
   default:
       return {...state,loading:false,error:true}
 }   
}