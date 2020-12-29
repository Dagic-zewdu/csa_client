/**Accepts type of what to do and message return an object of speld  */
export const saveProcess=(type,message)=>{
   switch(type){
       case 'initial':
        return {error:'',success:'',process:message,
              disable:true,loading:true}   
        case 'error':
       return {error:message,success:'',process:'',
       disable:false,loading:false} 
       case 'success':
      return{error:'',success:message,process:'',
      disable:false,loading:false}
      default:
       return {error:'',success:'',process:'',disable:false,loading:false}   
      }
}
/**generates random id */
export const randomId=()=>Math.round(Math.random(0,100000000)*100000000)
export const Donothing=()=>{}
export const Round=num=>Math.round(num*100)/100