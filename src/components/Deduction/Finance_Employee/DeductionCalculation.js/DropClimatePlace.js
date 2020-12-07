import { faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext } from 'react'
import { useDrop } from "react-dnd"
import { DeductionDnd } from '../../../contexts/contexts'
import { climatePlaces } from "./ItemTypes"

export const BreakfastInitialClimate=(props)=>{
   const {name,level,level_percent}=props.info
  const {BreakfastClimatePlace,RemoveClimatePlace}=useContext(DeductionDnd)
  const [{isOver},dropRef]=useDrop({
        accept:climatePlaces,
        drop:(item,monitor)=>BreakfastClimatePlace(item.place._id,'breakfast'),
        collect:monitor=>({isOver:monitor.isOver()})
    })
    return(
<td ref={dropRef} style={{background:isOver?'gray':''}}>
    <div className="float-right" onClick={()=>RemoveClimatePlace('breakfast')}>
    <FontAwesomeIcon icon={faWindowClose} className='text-danger fa-1x'/>
    </div>
    name:{name} <br/>
   level:{level} <br/>
    {level_percent} % of the day allowance 
</td>
    )
}
export const LunchInitialClimate=(props)=>{
    const {name,level,level_percent}=props.info
   const {BreakfastClimatePlace,RemoveClimatePlace}=useContext(DeductionDnd)
   const [{isOver},dropRef]=useDrop({
         accept:climatePlaces,
         drop:(item,monitor)=>BreakfastClimatePlace(item.place._id,'lunch'),
         collect:monitor=>({isOver:monitor.isOver()})
     })
     return(
 <td ref={dropRef} style={{background:isOver?'gray':''}}>
 <div className="float-right" onClick={()=>RemoveClimatePlace('lunch')}>
    <FontAwesomeIcon icon={faWindowClose} className='text-danger fa-1x'/>
    </div>
     name:{name} <br/>
    level:{level} <br/>
     {level_percent} % of the day allowance 
 </td>
     )
 }
 /**dinner place for */
 export const DinnerInitialClimate=(props)=>{
    const {name,level,level_percent}=props.info
   const {BreakfastClimatePlace,RemoveClimatePlace}=useContext(DeductionDnd)
   const [{isOver},dropRef]=useDrop({
         accept:climatePlaces,
         drop:(item,monitor)=>BreakfastClimatePlace(item.place._id,'dinner'),
         collect:monitor=>({isOver:monitor.isOver()})
     })
     return(
 <td ref={dropRef} style={{background:isOver?'gray':''}}>
 <div className="float-right" onClick={()=>RemoveClimatePlace('dinner')}>
    <FontAwesomeIcon icon={faWindowClose} className='text-danger fa-1x'/>
    </div>
     name:{name} <br/>
    level:{level} <br/>
     {level_percent} % of the day allowance 
 </td>
     )
 }
 export const BedInitialClimate=(props)=>{
    const {name,level,level_percent}=props.info
   const {BreakfastClimatePlace,RemoveClimatePlace}=useContext(DeductionDnd)
   const [{isOver},dropRef]=useDrop({
         accept:climatePlaces,
         drop:(item,monitor)=>BreakfastClimatePlace(item.place._id,'bed'),
         collect:monitor=>({isOver:monitor.isOver()})
     })
     return(
 <td ref={dropRef} style={{background:isOver?'gray':''}}>
 <div className="float-right" onClick={()=>RemoveClimatePlace('bed')}>
    <FontAwesomeIcon icon={faWindowClose} className='text-danger fa-1x'/>
    </div>
     name:{name} <br/>
    level:{level} <br/>
     {level_percent} % of the day allowance 
 </td>
     )
 }
 export const DropSpendingClimate=(props)=>{
    const {name,level,level_percent,item:Item,general_name,_id}=props.info
    const {addSpendingClimate,RemoveClimateSpending}=useContext(DeductionDnd)
    const [{isOver},dropRef]=useDrop({
          accept:climatePlaces,
          drop:(item,monitor)=>addSpendingClimate(_id,item.place._id,Item),
          collect:monitor=>({isOver:monitor.isOver()})
      })
      return(
  <td ref={dropRef} style={{background:isOver?'gray':''}}>
  <div className="float-right" onClick={()=>RemoveClimateSpending(_id,Item)}>
     <FontAwesomeIcon icon={faWindowClose} className='text-danger fa-1x'/>
     </div>
     general name:{general_name} <br/>
      name:{name} <br/>
     level:{level} <br/>
      {level_percent} % of the day allowance 
  </td>
      )
 }
 export const ReturnClimate=(props)=>{
    const {name,level,level_percent,Item}=props.info
   const {returnClimatePlace,removeReturnClimate}=useContext(DeductionDnd)
   const [{isOver},dropRef]=useDrop({
         accept:climatePlaces,
         drop:(item,monitor)=>returnClimatePlace(item.place._id,Item),
         collect:monitor=>({isOver:monitor.isOver()})
     })
     return(
 <td ref={dropRef} style={{background:isOver?'gray':''}}>
     <div className="float-right" onClick={()=>removeReturnClimate(Item)}>
     <FontAwesomeIcon icon={faWindowClose} className='text-danger fa-1x'/>
     </div>
     name:{name} <br/>
    level:{level} <br/>
     {level_percent} % of the day allowance 
 </td>
     )
 }