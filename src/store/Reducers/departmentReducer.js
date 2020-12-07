export const depState={
    state:[],
    loading:true,
    error:false
}
 
export const departmentReducer =(state=depState,action)=>{
 switch(action.type){
     case 'ADD_DEPARTMENT':
     return {state:action.payload,loading:false,error:false}
     case 'LOADING_DEPARTMENT':
   return {...state,loading:true}
   default:
       return {...state,loading:false,error:true}
 }   
}