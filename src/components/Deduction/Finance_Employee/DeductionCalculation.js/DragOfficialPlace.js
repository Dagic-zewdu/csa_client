import React from 'react'
import { useDrag } from 'react-dnd'
import {places} from './ItemTypes'

   const DragOfficialPlace=(props)=> {
 const {place,scale}=props.info
    /**drag places for officials */
  const [{isDragging},dragRef]=useDrag({
    item:{type:places,place,scale},
    collect: monitor => ({isDragging:monitor.isDragging()}) 
 })
 console.log(place,scale)
 return (
       <tr ref={dragRef} style={{opacity:isDragging?'0.3':'1'}}>
          <td>{place.name}</td>
          <td>{place.region}</td>
          <td>{place.type}</td>
          <td>{scale}</td>
      </tr>
    )
}

export default DragOfficialPlace
