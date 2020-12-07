export const companyState={
    state:[],
    loading:true,
    error:false
}
 
export const CompanyReducer =(state=companyState,action)=>{
 switch(action.type){
     case 'ADD_COMPANY':
     return {state:action.payload,loading:false,error:false}
     case 'LOADING_COMPANY':
   return {...state,loading:true}
   default:
       return {...state,loading:false,error:true}
 }   
}