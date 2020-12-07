 export const empState={
     state:[],
     loading:true,
     error:false
 }
  
 export const employeeReducer =(state=empState,action)=>{
  switch(action.type){
      case 'ADD_EMPLOYEES':
      return {state:action.payload,loading:false,error:false}
      case 'LOADING_EMPLOYEES':
    return {...state,loading:true}
    default:
        return {...state,loading:false,error:true}
  }   
 }