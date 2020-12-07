import {removeDuplicates} from './removeRedudant'
export const searchEmployee = (data,Index)=>{
    /**
     * searching - name,id,department,user_type
     */
    /**searching name */
    const INDEX=Index.toLowerCase()
   const index=INDEX.toLowerCase()
    const first_name=data.filter(n=>{
        let NAME=n.first_name.toString()
      let Name=NAME.toLowerCase()
      return Name.includes(index,0)
    })
    const middle_name=data.filter(n=>{
        let NAME=n.middle_name.toString()
      let Name=NAME.toLowerCase()
      return Name.includes(index,0)
    })
    const last_name=data.filter(n=>{
        let NAME=n.last_name.toString()
      let Name=NAME.toLowerCase()
      return Name.includes(index,0)
    })
    const name=[...first_name,...middle_name,...last_name]
    /**searching id */
         const id=data.filter(i=>{
        let ID=i.emp_id.toString()
      let Id=ID.toLowerCase()
      return Id.includes(index,0)
    })
    /**searching department */
    const department=data.filter(d=>{
        let DEPARTMENT=d.department.toString()
      let Department=DEPARTMENT.toLowerCase()
      return Department.includes(index,0)
    })
    /**searching user type */
    const type=data.filter(t=>{
        let TYPE=t.type.toString()
      let Type=TYPE.toLowerCase()
      return Type.includes(index,0)
    })
    /**combine all results */
    const results=[...name,...id,...department,...type]
    /**remove redudant data */
   const finalresult=removeDuplicates(results,'_id')
   //returning final 
   return finalresult
}
export const searchDepartment=(data,Index)=>{
   const IN=Index.toString()
   const index=IN.toLowerCase()
   const name=data.filter(d=>{
     const s=d.name.toString()
     const l=s.toLowerCase()
     return l.includes(index)
   })
   const office=data.filter(d=>{
    const s=d.office_number.toString()
    const l=s.toLowerCase()
    return l.includes(index)
  })
  const phone=data.filter(d=>{
    const s=d.phone.toString()
    const l=s.toLowerCase()
    return l.includes(index)
  })
  const results=[...name,...office,...phone]
  const final=removeDuplicates(results,'_id')
  return final
}
export const searchPlaces=(data,Index)=>{
  const IN=Index.toString()
  const index=IN.toLowerCase()
  const name=data.filter(d=>{
    const s=d.name.toString()
    const l=s.toLowerCase()
    return l.includes(index)
  })
  const region=data.filter(d=>{
   const s=d.region.toString()
   const l=s.toLowerCase()
   return l.includes(index)
 })
 const type=data.filter(d=>{
   const s=d.type.toString()
   const l=s.toLowerCase()
   return l.includes(index)
 })
 const results=[...name,...region,...type]
 const final=removeDuplicates(results,'_id')
 return final
}
export const searchUsers=(data,Index)=>{
  const IN=Index.toString()
  const index=IN.toLowerCase()
  const name=data.filter(d=>{
    const s=d.emp_id.toString()
    const l=s.toLowerCase()
    return l.includes(index)
  })
  const username=data.filter(d=>{
   const s=d.username.toString()
   const l=s.toLowerCase()
   return l.includes(index)
 })
 const type=data.filter(d=>{
   const s=d.user_type.toString()
   const l=s.toLowerCase()
   return l.includes(index)
 })
 const access=index==='activated'?
 data.filter(d=>{
    return d.access==='activated'
}):
 data.filter(d=>{
  const s=d.access.toString()
  const l=s.toLowerCase()
  return l.includes(index)
})
 const results=[...name,...username,...type,...access]
 const final=removeDuplicates(results,'_id')
 return final
}
export const searchFieldEmployee = (data,Index)=>{
  
  const INDEX=Index.toLowerCase()
 const index=INDEX.toLowerCase()
  /**searching id */
       const id=data.filter(i=>{
      let ID=i.emp_id.toString()
    let Id=ID.toLowerCase()
    return Id.includes(index,0)
  })
  /**searching position */
  const position=data.filter(d=>{
      let P=d.position.toString()
    let Department=P.toLowerCase()
    return Department.includes(index,0)
  })
  
  /**combine all results */
  const results=[...id,...position]
  /**remove redudant data */
 const finalresult=removeDuplicates(results,'_id')
 //returning final 
 return finalresult
}
