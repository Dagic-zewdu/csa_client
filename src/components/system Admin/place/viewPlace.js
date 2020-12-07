import React from 'react'
import { faMap } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

 const ViewPlace=(props)=> {
    return (
        <div className="main-card mb-3 card text-center"> 
        <FontAwesomeIcon icon={faMap} className='fa-5x text-info float-left'/>
        <p className="font-weight-bold"> name : {props.places.name}</p>
        <p className="font-weight-bold">
            Region : {props.places.region} 
            </p>
     {
         props.places.superintendent_allowance===''||
         props.places.superintendent_allowance===null
         ?
         <div>
 
 <p className="font-weight-bold">
   Normal scale one allowance : {props.places.normal_scale_1} 
    </p>
    <p className="font-weight-bold">
   Normal scale two allowance : {props.places.normal_scale_2} 
    </p>
    <p className="font-weight-bold">
   Normal scale three allowance : {props.places.normal_scale_3} 
    </p>
 </div>:<div>
         <p className="font-weight-bold">
            superintendent allowance : {props.places.superintendent_allowance}
            </p>
            <p className="font-weight-bold">
            Higher officer allowance : {props.places.higher_officer_allowance}
            </p>
            <p className="font-weight-bold">
            state people representatives 1 allowance : {props.places.spr_members_1}
            </p>
            <p className="font-weight-bold">
            state people representatives 2 allowance : {props.places.spr_members_2}
            </p>
            <p className="font-weight-bold">
            other allowances: {props.places.other_allowances}
            </p>
         </div>
        
}       
    </div>
    )
}

export default ViewPlace
