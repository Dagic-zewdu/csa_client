import { faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useContext } from 'react'
import { useDrop } from 'react-dnd'
import { DeductionDnd } from '../../../contexts/contexts'
import {fieldEmployee} from './ItemTypes'
/**drop place for project allowance employees */
export const FieldBreakfastInitial=(props)=> {
    const {place,scale}=props.info
    const {intialPlaceField,removeInitialPlaces}=useContext(DeductionDnd)
   const [{isOver},dropRef]=useDrop({
      accept:fieldEmployee,
      drop:(item,monitor)=>intialPlaceField(item.place.place,'breakfast',item.place.scale),
      collect:monitor=>({isOver:monitor.isOver()})   
   })
 
    return (
        <td style={{background:isOver?'gray':''}} ref={dropRef}>
        <div className="float-right" onClick={()=>removeInitialPlaces('breakfast')}>
         <FontAwesomeIcon icon={faWindowClose} className='text-danger fa-1x'/>
     </div>
     <p className="font-weight-bold font-italic" >
         scale={scale}<br/>
         place {place} Addis Ababa
     </p>
    
        </td>
    )
}
/**drop lunch initial place for project allowance employees */
export const FieldLunchInitial=(props)=> {
    const {place,scale}=props.info
    const {intialPlaceField,removeInitialPlaces}=useContext(DeductionDnd)
   const [{isOver},dropRef]=useDrop({
      accept:fieldEmployee,
      drop:(item,monitor)=>intialPlaceField(item.place.place,'lunch',item.place.scale),
      collect:monitor=>({isOver:monitor.isOver()})   
   })
 
    return (
        <td style={{background:isOver?'gray':''}} ref={dropRef}>
        <div className="float-right" onClick={()=>removeInitialPlaces('lunch')}>
         <FontAwesomeIcon icon={faWindowClose} className='text-danger fa-1x'/>
     </div>
     <p className="font-weight-bold font-italic" >
         scale={scale}<br/>
         place {place} Addis Ababa
     </p>
     
        </td>
    )
}
/**drop dinner initial place for project allowance employees */
export const FieldDinnerInitial=(props)=> {
    const {place,scale}=props.info
    const {intialPlaceField,removeInitialPlaces}=useContext(DeductionDnd)
   const [{isOver},dropRef]=useDrop({
      accept:fieldEmployee,
      drop:(item,monitor)=>intialPlaceField(item.place.place,'dinner',item.place.scale),
      collect:monitor=>({isOver:monitor.isOver()})   
   })
 
    return (
        <td style={{background:isOver?'gray':''}} ref={dropRef}>
        <div className="float-right" onClick={()=>removeInitialPlaces('dinner')}>
         <FontAwesomeIcon icon={faWindowClose} className='text-danger fa-1x'/>
     </div>
     <p className="font-weight-bold font-italic" >
         scale={scale}<br/>
         place {place} Addis Ababa
     </p>
    
        </td>
    )
}
/**drop dinner initial place for project allowance employees */
export const FieldBedInitial=(props)=> {
    const {place,scale}=props.info
    const {intialPlaceField,removeInitialPlaces}=useContext(DeductionDnd)
   const [{isOver},dropRef]=useDrop({
      accept:fieldEmployee,
      drop:(item,monitor)=>intialPlaceField(item.place.place,'bed',item.place.scale),
      collect:monitor=>({isOver:monitor.isOver()})   
   })
 
    return (
        <td style={{background:isOver?'gray':''}} ref={dropRef}>
        <div className="float-right" onClick={()=>removeInitialPlaces('bed')}>
         <FontAwesomeIcon icon={faWindowClose} className='text-danger fa-1x'/>
     </div>
     <p className="font-weight-bold font-italic" >
         scale={scale}<br/>
         place {place} Addis Ababa
     </p>
   
        </td>
    )
}
export const DropFieldSpending=(props)=>{
    const {_id,item:Item,place,scale}=props.info
    const {addFieldSpending,RemoveSpendingDay}=useContext(DeductionDnd)
    const [{isOver},dropRef]=useDrop({
        accept:fieldEmployee,
        drop:(item,monitor)=>addFieldSpending(_id,item.place.place,Item,item.place.scale),
        collect:monitor=>({isOver:monitor.isOver()})   
     })
     return(
 <td style={{background:isOver?'gray':''}} ref={dropRef}>
        <div className="float-right" onClick={()=>RemoveSpendingDay(_id,Item)}>
         <FontAwesomeIcon icon={faWindowClose} className='text-danger fa-1x'/>
     </div>
     <p className="font-weight-bold font-italic" >
         scale={scale}<br/>
         place {place} Addis Ababa
     </p>
   
        </td>         
     )
}
/**drop return place for project allowance employees */
export const ReturnPlaceField=(props)=> {
    const {place,scale,Item}=props.info
    const {returnProject,removeReturnPlaces}=useContext(DeductionDnd)
   const [{isOver},dropRef]=useDrop({
      accept:fieldEmployee,
      drop:(item,monitor)=>returnProject(item.place.place,Item,item.place.scale),
      collect:monitor=>({isOver:monitor.isOver()})   
   })
 
    return (
        <td style={{background:isOver?'gray':''}} ref={dropRef}>
        <div className="float-right" onClick={()=>removeReturnPlaces(Item)}>
         <FontAwesomeIcon icon={faWindowClose} className='text-danger fa-1x'/>
     </div>
     <p className="font-weight-bold font-italic" >
         scale={scale}<br/>
         place {place} Addis Ababa
     </p>
   
        </td>
    )
}