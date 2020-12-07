import React from 'react'

function ViewCalculatePlace(props) {
    const {type}=deduction.info
  return(
      type==='fe'?  //is field employee  
    <p className="text-center">
      place name : {deduction.info.name}
    </p>:
  type==='employee'?
  <div className=""></div>:
  type==='climate'?
  <div className=""></div>:
  <p></p>
  )
}

export default ViewCalculatePlace
