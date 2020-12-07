import React from 'react'
import { useDrag } from 'react-dnd'
import { climatePlaces } from './ItemTypes'

   const DragClimatePlace=(props)=> {
  const {general_name,name,level}=props.place
  const [{isDragging},dragRef]=useDrag({
      item: {type:climatePlaces,place:props.place},
      collect: monitor=>({isDragging:monitor.isDragging()})  
  })
  return (
         <tr ref={dragRef} style={{opacity:isDragging?0.5:1}}>
       <td>{general_name}</td>
       <td>{name}</td>
         <td>{level}</td>
      </tr>
    )
}

export default DragClimatePlace
