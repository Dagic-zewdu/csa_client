export const departmentChecker=(data,index)=>{
    //name must be unique for department 
    const isCreated=data.filter(d=>{
        //converting index to string to comapre
        let i=index.toString()
        //converting index to lowercase to comapre
        let n=i.toLowerCase()
        //converting departments name to string to comapre
        let D=d.name.toString()
        //converting departments name to lowercase to comapre with index
        let de=D.toLowerCase()
        return de===n
    })
  let found= isCreated.length>0? true:false
    return found    
}
export const employeeChecker=(data,index)=>{
      //name must be unique for department 
      const isCreated=data.filter(d=>{
        //converting index to string to comapre
        let i=index.toString()
        //converting index to lowercase to comapre
        let n=i.toLowerCase()
        //converting employee id to string to comapre
        let D=d.emp_id.toString()
        //onverting employee id to lowercase to comapre with index
        let de=D.toLowerCase()
        return de===n
    })
  let found= isCreated.length>0? true:false
    return found
}
