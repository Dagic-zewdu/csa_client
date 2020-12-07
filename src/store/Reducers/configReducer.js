export const configState={
    state:[],
    loading:true,
    error:false
}
 
export const configReducer =(state=configState,action)=>{
 switch(action.type){
     case 'ADD_CONFIG':
     return {state:action.payload,loading:false,error:false}
     case 'LOADING_CONFIG':
   return {...state,loading:true}
   default:
       return {...state,loading:false,error:true}
 }   
}