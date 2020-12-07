import React from 'react'
import { useDrag } from 'react-dnd'
import {fieldEmployee} from './ItemTypes'
const DragFieldPlace=(props)=> {
    const {info:place}=props
    /**drag field allowance place scale */
    const [{IsDragging},feDragref]=useDrag({
       item:{type:fieldEmployee,place},
       collect:monitor=>({isDragging:monitor.isDragging()})  
    })
    
    return (
<div ref={feDragref} style={{opacity:IsDragging?0.3:1}}>
<h4 className="text-center font-weight-bold">
Allowance scale: {place.scale}
</h4>
    </div>
    )
}

export default DragFieldPlace
