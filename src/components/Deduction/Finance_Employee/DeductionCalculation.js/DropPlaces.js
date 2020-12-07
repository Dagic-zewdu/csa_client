import React, { useContext } from 'react'
import { faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDrop } from 'react-dnd'
import { places } from './ItemTypes'
import { DeductionDnd } from '../../../contexts/contexts'

/**Drop initial places for official employee */
export const DropPlace=(props)=>{
    const {name,scale,type,region,Item}=props.info
    const {initialOfficial,removeInitialPlaces}=useContext(DeductionDnd)
    const [{isOver},dropRef]=useDrop({
        accept:places,
        drop:(item,monitor)=>initialOfficial(item.place._id,Item,item.scale),
        collect:monitor=>({isOver:monitor.isOver()})   
     })
  return (
        <div ref={dropRef} style={{background:isOver?'gray':''}}>
        <div className="float-right" onClick={()=>removeInitialPlaces(Item)}>
         <FontAwesomeIcon icon={faWindowClose} className='text-danger fa-1x'/>
     </div>
     <p className="font-weight-bold font-italic" >
         Name:{name}<br/>
         Region:{region}     <br/>
         Type:{type}  <br/>
         Scale:{scale} 
     </p>
    
        </div>
    )
}
export const DropSpendingPlace=(props)=>{
    const {name,scale,type,region,Item,_id}=props.info
    const {DropSpendingDays,RemoveSpendingDay}=useContext(DeductionDnd)
    const [{isOver},dropRef]=useDrop({
        accept:places,
        drop:(item,monitor)=>DropSpendingDays(_id,item.place._id,Item,item.scale),
        collect:monitor=>({isOver:monitor.isOver()})   
     })
  return (
        <div ref={dropRef} style={{background:isOver?'gray':''}}>
        <div className="float-right" onClick={()=>RemoveSpendingDay(_id,Item)}>
         <FontAwesomeIcon icon={faWindowClose} className='text-danger fa-1x'/>
     </div>
     <p className="font-weight-bold font-italic" >
         Name:{name}<br/>
         Region:{region}     <br/>
         Type:{type}  <br/>
         Scale:{scale} 
     </p>
    
        </div>
    )
}
/**Drop return places for official employee */
export const DropReturnPlace=(props)=>{
    const {name,scale,type,region,Item}=props.info
    const {returnOfficial,removeReturnPlace}=useContext(DeductionDnd)
    const [{isOver},dropRef]=useDrop({
        accept:places,
        drop:(item,monitor)=>returnOfficial(item.place._id,Item,item.scale),
        collect:monitor=>({isOver:monitor.isOver()})   
     })
  return (
        <div ref={dropRef} style={{background:isOver?'gray':''}}>
        <div className="float-right" onClick={()=>removeReturnPlace(Item)}>
         <FontAwesomeIcon icon={faWindowClose} className='text-danger fa-1x'/>
     </div>
     <p className="font-weight-bold font-italic" >
         Name:{name}<br/>
         Region:{region}     <br/>
         Type:{type}  <br/>
         Scale:{scale} 
     </p>
          </div>
    )
}