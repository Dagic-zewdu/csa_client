import { faBarcode, faEye, faInfo, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact'
import React, { useContext, useState } from 'react'
import { useEffect } from 'react'
import { AllowanceClass } from '../../../controllers/Allowance'
import { StoreContext } from '../../contexts/contexts'
import { fetchData_Allowance } from '../../fetchers/Functions/FecthAllowance'
import ModalAllowance from '../../layout/ModalAllowance'

const AllCompleted=()=> {
    const [state,setState]=useState({
        completed: [],
        found:false
    })    
const { allowances,employees,users,dispatchAllowances}=useContext(StoreContext)
const {state:Allowances}=allowances
const {state:Employees}=employees
const {state:Users}=users
const Allowance=new AllowanceClass(Allowances,Employees,Users)

   const completed=Allowance.allCompleted()
   const fetch=()=>fetchData_Allowance(dispatchAllowances)
   useEffect(()=>{
    setState({completed})
   },[])
   const handleSearch=(Index)=>{
  const Completed=Index===''?completed:Allowance.searchAllCompleted(Index)
  const found=Index===''?false:true
  setState({...state,found,completed:Completed})
   }
   const listAllowance=state.completed.length?
  state.completed.map(c=>{
     return(
         <tr>
          <td>{c.id}</td>
          <td>{Allowance.Name(c.creater)}</td>
          <td>
            <p className="text-center font-italic">
          Objective-{c.objective}     
            </p>
            <p className="text-center font-italic">
        Letter id-{c.letter_id}     
            </p>
            
          </td>
          <td>
     <ModalAllowance type='view_details' allowance={c} fetch={fetch}
       Manager_seen={false} />
       <ModalAllowance type='see_calculations' allowance={c}
        tl={false} director={false} fetch={fetch} />      
              </td>   
         </tr>
     ) 
  })
   :
   <tr>
       <td colSpan={5}>
  <p className="text-danger text-center font-weight-bold">
      No allowances completed yet 
      </p>           
       </td>
   </tr>
   return (
        <div className="container">
            <div className="row">
            <div className="col-lg-3 my-auto">
       </div>
            <div className="col-lg-5 my-auto">
            <div className="search-wrapper active">
                        <div className="input-holder">
  <input type="text" className="search-input" 
  placeholder="Type id,letter id,destination,program name"
  onChange={e=>handleSearch(e.target.value)}
  />
<button className="search-icon">
                                <span></span>
                                </button>
                        </div>
    </div> 

            </div>
            <div className="col-lg-4 my-auto">
            <div className="card mb-3 widget-content bg-grow-early">
                <div className="widget-content-wrapper text-white">
                    <div className="widget-content-left">
                        <div className="widget-heading">Allowance</div>
                        <div className="widget-subheading">Totall completed</div>
                    </div>
                    <div className="widget-content-right">
                        <div className="widget-numbers text-white"><span>
                            {completed.length}
                            </span></div>
                    </div>
                </div>
            </div> 
               </div>       
               <div className="container mt-3 main-card mb-3 card min-height">
            <div className="row">
         <div className="col-lg-12">  
             {
                 state.found?
                 <h5 className='text-center'>
   Allowance found -{state.completed.length}
                </h5>
         :
         <p></p>   
             }
         <MDBTable hover bordered striped>
         <MDBTableHead>
                          <tr>
                          <th>
             <FontAwesomeIcon icon={faBarcode} className='mx-2'/>                            
                Allowance id                                
                              </th>   
                              <th>
             <FontAwesomeIcon icon={faUser} className='mx-2'/>                            
                Employee name                               
                              </th>

                              <th>
          <FontAwesomeIcon icon={faInfo} className='mx-2' />                        
                Allowance info
                </th>
               
                <th>
          <FontAwesomeIcon icon={faEye} className='mx-2' />                        
                View
                </th>  
                 </tr>
                      </MDBTableHead>
                    <MDBTableBody>
                         {listAllowance}
                      </MDBTableBody>
                  </MDBTable> 
             </div>         
            </div>
        </div>

            </div>
        </div>
    )
}

export default AllCompleted
