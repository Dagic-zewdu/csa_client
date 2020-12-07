export const letterState={
    state:[],
    loading:true,
    error:false
}
 
export const lettersReducer =(state=letterState,action)=>{
 switch(action.type){
     case 'ADD_LETTERS':
     return {state:action.payload,loading:false,error:false}
     case 'LOADING_LETTERS':
   return {...state,loading:true}
   default:
       return {...state,loading:false,error:true}
 }   
}