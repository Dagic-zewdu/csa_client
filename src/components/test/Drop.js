import React from 'react'
import { useState } from 'react'
import { useDrop } from 'react-dnd'

  const Drop=(props)=> {
const {id}=props
const [{isOver},drop]=useDrop({
    accept: 'card',
    drop: (item,monitor)=> addPlace(item.id),
    collect:monitor=>({
        isOver : monitor.isOver()
    })
})
const {places}=props
const [state,setState]=useState({
    places:[]
})
  const addPlace=id=>setState({...state,places:[...state.places,places.find(p=>p.id===id)]})
return (
  <div className="col-lg-12" ref={drop} style={{background:isOver?'gray':'green',height:'200px'}}>
      <div className="row">
          {
              state.places.map(p=>{
                  return(
          <div className="col-lg-12 card">
              name:{p.name} <br/>
              region:{p.region} <br/>
              dayAllowance :{p.dayallowance} <br/>

              </div>            
                  )
              })
          }
      </div>
  </div>   
    )
}

export default Drop
