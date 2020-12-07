import React from 'react'
import { useDrag } from 'react-dnd'
import {places} from './ItemTypes'

  const DragEmployeePlace=(props)=> {
const {place_id,region,type,scale}=props.info
 const [{isDragging},dragRef]=useDrag({
    item:{type:places,place:props.info,scale},
    collect: monitor=>({isDragging:monitor.isDragging()}) 
 })
 
    return (
    <div className="text-center" ref={dragRef} style={{opacity:isDragging?0.5:1}}>
    <p className="font-weight-bold">
        Region:{region} <br/>
        type:{type}   <br/>
        scale:{scale}
    </p>
        </div>
    )
}

export default DragEmployeePlace
