import React from 'react'
import {useDrag} from 'react-dnd'
const Card=props=> {
    const ItemTypes={CARD:'card'}
    const {id,name,dayallowance}=props.places
    const [{ isDragging,id:_id }, dragRef] = useDrag({
    item: { type: ItemTypes.CARD,id  },
    collect: monitor => ({
      isDragging:  !monitor.isDragging()
    })
  })
  
  console.log(_id)
    return (
             <div className="col-lg-3"   ref={dragRef} 
                 style={{opacity:isDragging?'1':'0.5'}}>
    <div className="card">
    <h4 className="text-center">
        Place Info
    </h4>
    <p className="text-center">
  id:{id} <br/>
  name:{name} <br/>
  day Allwoance: {dayallowance}
    </p>
    </div>
    </div>
    )
}

export default Card
