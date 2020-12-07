export class PlaceClass{
    constructor(places){
        this.places=places
    }
    /** it returns array of places for official employees*/
      officialPlaces=()=>{
        let official=this.places.filter(f=>{
return f.normal_scale_1 === null && f.normal_scale_2 ===null && f.normal_scale_3=== null    
        })
      return official    
      }
      /**returns array of places for employee */
     employeePlaces=()=>{
let employee=this.places.filter(p=>{
  return (p.superintendent_allowance===null &&p.higher_officer_allowance ===null
   && p.spr_members_1===null && p.spr_members_2===null)
     })
   return employee  
     } 
    /**accepts place _id and returns place object 
     * @param id=>refers to place _id
     */
    findPlace=(id)=>this.places.find(p=>p._id === id)
    
    /**accepts place _id and returns place name return empty string if place
     * has no name
     * @param id=>refers to place id
     */
    placeName=id=>this.findPlace(id)?this.findPlace(id).name:''
    /**accepts place _id and returns place type
     * @param id=>refers to place id
     */
    placeType=id=>this.findPlace(id)?this.findPlace(id).type:''    
    /**returns a string of place region name
     * @param id=>refers to place id
     */
    placeRegion=id=>this.findPlace(id)?this.findPlace(id).region:''
  /**accepts place name and employee type (official or employee) returns place array 
     * @param type-represents employee type ('official' || employee)
     * @param name-name to search
   */
   findByName=(name,type)=>{
      const index=name.toLowerCase()
      if(name===''){
        return undefined
      }
      else{
    if(type==='official'){
   let Name=this.officialPlaces().find(p=>{
       let l=p.name.toLowerCase()
  return  l.includes(index,0)      
   })  
   return Name   
    }
  else if(type==='employee'){
   
  let Name=this.employeePlaces().find(p=>{
    let l=p.name.toLowerCase()
    return  l.includes(index,0)
  })
  return Name       
  }
   }
  }
  /**returns object of places found from the parameters. it filters from
   * employee place allowance 
   * @param region-respresents region name
   * @param type-represnts place type
   */
  findByRegionAndType=(region,type)=>{
    let place=this.employeePlaces().find(f=>{
        return f.region === region && f.type === type
    })
    return place  
  }
  /**accepts name of the place and returns an array of place found
   * from officila allowance
   */
  searchPlaceOfficial=name=>{
    const index=name.toLowerCase()
    let Name=this.officialPlaces().filter(f=>{
        let l=f.name.toLowerCase()
        return  l.includes(index,0) 
    })
    return Name
  }  
  /**accepts place and returns allowance place of employee as anobject  */
    findEmployeePlace=(id)=>{
     let place=this.employeePlaces().find(f=>{
         return f._id === id
     })
     return place
    }
    /**accepts place and returns allowance place of official as anobject  */
    findOfficialPlace=(id)=>{
        let place=this.employeePlaces().find(f=>{
            return f._id === id
        })
        return place
       }
  /** return whether the place has climate allowance or not
   * @param id=>refers to palce _id
   */
  hasClimateAllowance=(id)=>{
     let climate=this.findPlace(id)?
     this.findPlace(id).climate_allowances==='none'||
     this.findPlace(id).climate_allowances==='null'?
     false:true:false
     return climate
  }
  /**accepts palce _id returns climate allowance level  return none if the place has no climate allowance
  */
  climatePlace=(id)=>{
    return this.hasClimateAllowance(id)?this.findPlace(id).climate_allowances:'none' 
  }
  
}