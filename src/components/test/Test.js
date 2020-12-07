import React from 'react'
import { DndProvider } from 'react-dnd'
import { randomId } from '../../controllers/saveProcess'
import Card from './Card'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Drop from './Drop'
export const Dropthings=React.createContext()
const Test=() =>{
    const places=[
        {id:randomId(),name:'Adama',region:'oromia',type:'state_city',dayallowance:365},
        {id:randomId(),name:'Bahirdar',region:'Amhara',type:'state_city',dayallowance:400},
        {id:randomId(),name:'Adama',region:'oromia',type:'state_city',dayallowance:654}
    ]
  
    const list=places.map(d=>{
        return (
            <Card places={d} key={d.id} />
        )
    } )
    
    return(
        <DndProvider backend={HTML5Backend}>
        <div className="container">
            <div className="row">
                {list}
                <Drop places={places} />
            </div>
        </div>
        </DndProvider>
    )
    
}

export default Test
