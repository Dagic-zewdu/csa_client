import React, { useState, useContext } from 'react'
import ModalUser from '../../layout/ModalUser'
import {LayoutContext, StoreContext} from '../../contexts/contexts'
import AdminNavbar from '../../layout/Navbar/AdminNavbar'
import AdminSideNav from '../../layout/SideNav/AdminSideNav'
import {MDBTable,MDBTableBody,MDBTableHead} from 'mdbreact'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faBarcode, faUser, faObjectGroup, faBriefcase, faPenFancy, faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import { DotLoading } from '../../layout/Loading'
import { loadingEmployees, fetchEmployees, addEmployees } from '../../../store/Actions/employeeAction'
import {searchEmployee} from '../../../controllers/search'
import { useEffect } from 'react'
const Employee=()=> {
    const [state,setState]=useState({
        collapse : '', 
         Employees:[],
         found:false
})
/**getting state and action from useContext(StoreContext) */
const {employees,dispatchEmployees}=useContext(StoreContext)
 const {state:Employees,loading,error}=employees
 /**updating data after edit and delete */
 const fetch=async ()=>{
     
         /**pupulating with new data */
    try{
         dispatchEmployees(loadingEmployees())
    const newEmployees=await fetchEmployees()
    /**updating redux store */
    dispatchEmployees(addEmployees(newEmployees))}
    catch(err){
        dispatchEmployees({type:'ERROR'})
    }
 }
 useEffect(()=>{
    setState({...state,Employees})
 },[loading])

 /**list employees with table */
 const listEmployee=loading?
 (
 <tr>
     <td  className='row text-center' colSpan='5'><DotLoading/></td>
     </tr>
     ):
     error?
  <tr>
         <td className='text-danger text-danger' colSpan='5'>
             Loading Employee failed  because server is not active
             contact system admin to activate it
             </td> 
      </tr>:
     state.Employees.length?
(state.Employees.map(r=>{
   return(
       <tr key={r._id}>
<td>{r.emp_id}</td>
<td>{r.first_name+' '+r.middle_name+' '+r.last_name}</td>
<td>{r.department}</td>
<td>{r.type}</td>
<td className='row'>
    <ModalUser type='view_employees' employee={r} />
    <p className="text-danger mx-2">|</p> 
    <ModalUser type='edit_employees' employee={r} fetch={fetch} />
    <p className="text-danger mx-2">|</p>
    <ModalUser type='delete_employees' employee={r} fetch={fetch} />
    </td>
       </tr>
   )
})):(
<tr>
<td  colSpan='5'>No users yet</td>
</tr>
)
/**search */
 const handleSearch = (index)=>{
   
   /**searching algorithm written on the function */
   const result=index===''?Employees:searchEmployee(Employees,index)
let found=index===''?false:true
   setState({...state,Employees:result,found})
}
return (
      <div className={"app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header "+state.collapse}>
           <LayoutContext.Provider value={{uiContents:state,togglers:setState}}>
           <AdminNavbar/>
           <div className="app-main">
            <AdminSideNav/>
            <div className="app-main__outer">
                    <div className="app-main__inner">
                        <div className="row">
                            <div className="col-lg-3 my-auto">
                               <ModalUser type='admin_create_user' fetch={fetch}/>
                            </div>
                            <div className="col-lg-5 my-auto">
                                <div className="search-wrapper active">
                        <div className="input-holder">
  <input type="text" className="search-input" placeholder="Type id,name,department or usertype search"
  onChange={e=>handleSearch(e.target.value)}
  />
<button className="search-icon">
                                <span></span>
                                </button>
                        </div>
    
                    </div>                                   
                            </div>
        <div className="col-md-6 col-xl-4 my-auto">
            <div className="card mb-3 widget-content bg-midnight-bloom">
                <div className="widget-content-wrapper text-white">
                    <div className="widget-content-left">
                        <div className="widget-heading">Total Employees</div>
                        <div className="widget-subheading">Registered</div>
                    </div>
                    <div className="widget-content-right">
                        <div className="widget-numbers text-white"><span>{Employees.length}</span></div>
                    </div>
                </div>
            </div>
        </div>                     
                            <div className="col-lg-12">
                            <div className="main-card mb-3 card mt-2" > 
    {
        state.found?
          <h5 className="text-center">Employees found:{state.Employees.length}</h5>
   : <p></p>      
         }
                                                  
                  <MDBTable hover>
                      <MDBTableHead>
                          <tr>
                              <th>
      <FontAwesomeIcon icon={faBarcode} className='mx-2'/>                            
                                  Employee id
                             </th>
               <th>
               <FontAwesomeIcon icon={faUser} className='mx-2' />              
                   Name
           </th>

                              <th>
          <FontAwesomeIcon icon={faLayerGroup} className='mx-2' />                        
                                  Department
                </th>
                              <th>
             <FontAwesomeIcon icon={faBriefcase} className='mx-2'/>                     
                                  user type
                                  </th>
                              <th>
                <FontAwesomeIcon icon={faPenFancy} className='mx-2' />                 
                                  operation
                                  </th>
                          </tr>
                      </MDBTableHead>
                      <MDBTableBody>
                          {listEmployee}
                      </MDBTableBody>
                  </MDBTable>    
                  </div>          
                            </div>
                        </div>
                        </div>
                        </div>
           </div>
           </LayoutContext.Provider>    
            </div>
    )
}

export default Employee
