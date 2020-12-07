export const climatePlaceState={
    state:[],
    loading:true,
    error:false
}
 
export const climatePlacesReducer =(state=climatePlaceState,action)=>{
 switch(action.type){
     case 'ADD_PLACES':
     return {state:action.payload,loading:false,error:false}
     case 'LOADING_PLACES':
   return {...state,loading:true}
   default:
       return {...state,loading:false,error:true}
 }   
}