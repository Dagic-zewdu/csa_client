import { removeDuplicates } from "./removeRedudant"

export class climateClass {
    constructor(places){
        this.places=places
    }
    /**accepts place id and find by _id */
    findClimatePlace=id=>this.places.find(p=>p._id === id)
    /**accepts general place name and return array of places related to general places */
    findBy_GeneralName=gname=>this.places.filter(p=>p.general_name.toString().toLowerCase().includes(gname.toString().toLowerCase(),0))    
    /**accepts place name and returns related array of places  */
    findBy_Name=name=>this.places.filter(p=>p.name.toString().toLowerCase().includes(name.toString().toLowerCase(),0))  
   /**returns an object included in the index about information on climate Place
   * @param index- index string to find 
   */
  findSinglePlace=index=>index===''?undefined:this.findBy_Name(index).length?this.findBy_Name(index)[0]:undefined
    /**accepts general place name and returns array of places related to general places 
    * with level one place allowance
   */
   findGname_level_1=gname=>this.findBy_GeneralName(gname).filter(p=>p.level==='level_1')
   /**accepts general place name and returns array of places related to general places 
    * with level two place allowance
   */
  findGname_level_2=gname=>this.findBy_GeneralName(gname).filter(p=>p.level==='level_2')
  /**accepts general place name and returns array of places related to general places 
    * with level three place allowance
   */
  findGname_level_3=gname=>this.findBy_GeneralName(gname).filter(p=>p.level==='level_3')
  /**returns array of places resulted from searching index */ 
   searchPlace=index=>removeDuplicates
   ([...this.findBy_GeneralName(index),...this.findBy_Name(index)],'_id')
   /**it returns an object of searched climate allowance places */
   searchByName=name=>this.findBy_Name(name).find(p=> p.name.toString().toLowerCase() === name.toString().toLowerCase())
    /**return a string of climate place name
     * @param id=>climate place id
      */
   climateName=id=>this.findClimatePlace(id)?this.findClimatePlace(id).name:''
   /**return a string of climate place level
     * @param id=>climate place id
      */
   climateLevel=id=>this.findClimatePlace(id)?this.findClimatePlace(id).level:''
    /**return a string of climate place general name
     * @param id=>climate place id
      */
    climateGenralName=id=>this.findClimatePlace(id)?this.findClimatePlace(id).general_name:'' 
}