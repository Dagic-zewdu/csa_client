import { faObjectGroup, faPlus, faUser, faUserAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact'
import React, { useContext,useState } from 'react'
import { UsersClass } from '../../controllers/Users'
import { LetterContext, StoreContext } from '../contexts/contexts'

const Approval=()=> {
    const {values,setValues}=useContext(LetterContext)
    const {employees,users}=useContext(StoreContext)
     const {state:Employees,loading:empLoading,error:empError}=employees
     const {state:Users,loading:usersLoading,error:usersError}=users
     const user=new UsersClass(Users,Employees)
     const {type}=values
    const [state,setState]=useState({
      employees:[] 
    })
    console.log(state.employees)
     const handleSearch=index=>setState({...state,employees:index!==''?user.searchEmployee(index):[]})
 return (
       <div className="container">
           <div className="row">
               <div className="col-lg-4"></div>
              <div className="col-lg-5">
              <div className="search-wrapper active">
                        <div className="input-holder">
  <input type="text" className="search-input" 
  placeholder="Search employee name"
  onChange={e=>handleSearch(e.target.value)}
  />
<button className="search-icon">
                                <span></span>
                                </button>
                        </div>
    </div> 
                  </div>
                  <div className="col-lg-3"></div>
                  <div className="col-lg-12 mt-2">
                <MDBTable>
                    <MDBTableHead>
                    <tr>
                   <th>
            # Emp_id           
                       </th>   
                    <th>
               <FontAwesomeIcon icon={faUser} className='mx-2'/>
               Employee name        
                        </th>
                     <th>
               <FontAwesomeIcon icon={faObjectGroup}  className='mx-2'/>
               Department         
                         </th> 
                      <th>
              <FontAwesomeIcon icon={faUserAlt} className='mx-2'/>
              User role            
                          </th> 
                      <th>
                <FontAwesomeIcon icon={faPlus} className='mx-2' />
                Select          
                          </th>             
                        </tr>    
                    </MDBTableHead>
        <MDBTableBody>
            {
         state.employees.length?
         state.employees.map(e=>{
           return(
            <tr key={e._id}>
           <td className='text-center font-weight-bold'>
            {e.emp_id}
           </td>
           <td>
            {user.Name(e.emp_id)}
           </td>
           <td>
             {e.department}
           </td>
           <td>
             {e.type}
           </td>
           <td>
             <button className="btn btn-info">
               <FontAwesomeIcon icon={faPlus} className='mx-2'/>
               select
             </button>
           </td>
           </tr>
           )
         })
         :
         <tr>
<td colSpan={5} className='text-center text-danger font-weight-bold'>No Employees found</td>
           </tr>     
            }
        </MDBTableBody>
                    </MDBTable>      
                  </div>
                <div className="col-lg-12"></div>
           </div>
       </div>
    )
}

export default Approval
