import React, { useState, useContext } from 'react'
import { LayoutContext, StoreContext } from '../../contexts/contexts'
import AdminNavbar from '../../layout/Navbar/AdminNavbar'
import AdminSideNav from '../../layout/SideNav/AdminSideNav'
import ModalFieldAllowance from '../../layout/ModalFieldAllowance'
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdbreact'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCity, faFlag, faPenFancy, faBarcode, faSuitcase, faVenusMars, faOutdent } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from 'react'
import { DotLoading } from '../../layout/Loading'
import { loadingFieldAllowance, addFieldAllowance, fetchFieldAllowance } from '../../../store/Actions/FieldAllowanceActions'
import { searchFieldEmployee } from '../../../controllers/search'

   const FieldDashboard=()=> {
    const [state,setState]=useState({
        found:false,
        Employees:[]
    })
    //getting field employees by destructuring      
   const {fieldEmployees,dispatchFieldEmplooyees}=useContext(StoreContext)
   const {state:Employees,loading,error}=fieldEmployees
   useEffect(()=>{
     setState({
       ...state,Employees
     })
   },[loading])
   const fetch=async ()=>{
       try{
           dispatchFieldEmplooyees(loadingFieldAllowance())
           let emp=await fetchFieldAllowance()
           dispatchFieldEmplooyees(addFieldAllowance(emp))
       }
       catch(err){
         dispatchFieldEmplooyees({type:'ERROR'})
       }
   }
    const handleSearch=(index)=>{
/**searching algorithm written on the function */
const result=index===''?Employees:searchFieldEmployee(Employees,index)
let found=index===''?false:true
   setState({...state,Employees:result,found})
    }
    const listEmployees=loading?
    (
<tr>
<td  className='row text-center' colSpan='5'><DotLoading/></td>
</tr>
):
error?
<tr>
  <td className='text-danger text-danger' colSpan='5'>
      Loading failed  because server is not active
      contact system admin to activate it
      </td> 
</tr>:
state.Employees.length?
(state.Employees.map(d=>{
return(
 <tr key={d._id}>
<td>{d.emp_id}</td>
<td>{d.position}</td>
<td>{d.inside_addis_ababa}</td>
<td>{d.outside_addis_ababa}</td>
<td className='row'>
<ModalFieldAllowance type='edit_field_allowance'
employee={d} fetch={fetch} />
<p className="text-danger mx-2">|</p>
<ModalFieldAllowance type='delete_field_allowance'
employee={d} fetch={fetch} />
</td>
 </tr>
)
})):(
<tr>
<td  colSpan='5'>No Employee with field allowance</td>
</tr>
)         
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
            <ModalFieldAllowance type='create_field_allowance' fetch={fetch} />    
                </div>
                <div className="col-lg-5 my-auto">
                                <div className="search-wrapper active">
                        <div className="input-holder">
  <input type="text" className="search-input" placeholder="Type Employee id,position"
  onChange={e=>handleSearch(e.target.value)}
  />
<button className="search-icon">
                                <span></span>
                                </button>
                        </div>
    
                    </div>                                   
        </div> 
        <div class="col-md-6 col-xl-4">
            <div class="card mb-3 widget-content bg-grow-early">
                <div class="widget-content-wrapper text-white">
                    <div class="widget-content-left">
                        <div class="widget-heading">Totall employees with</div>
                        <div class="widget-subheading">field allowance registered</div>
                    </div>
                    <div class="widget-content-right">
                        <div class="widget-numbers text-white"><span>
                            {Employees.length}
                            </span></div>
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
          <FontAwesomeIcon icon={faBarcode} className='mx-2' />                        
                     Employee id
                </th>
                              <th>
      <FontAwesomeIcon icon={faSuitcase} className='mx-2'/>                            
                        job position
                             </th>
               <th>
               <FontAwesomeIcon icon={faCity} className='mx-2' />              
                   Allowance in addis ababa
           </th>
           <th>
               <FontAwesomeIcon icon={faOutdent} className='mx-2' />              
                   Allowance outside addis ababa
           </th>
           <th>
               <FontAwesomeIcon icon={faPenFancy} className='mx-2' />              
                   operation
           </th>       
                          </tr>
                      </MDBTableHead>
                      <MDBTableBody>
                          {listEmployees}
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

export default FieldDashboard
