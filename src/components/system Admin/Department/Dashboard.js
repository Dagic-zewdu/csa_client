import React,{ useState, useContext, useEffect } from 'react'
import {LayoutContext, StoreContext} from '../../contexts/contexts'
import AdminNavbar from '../../layout/Navbar/AdminNavbar'
import AdminSideNav from '../../layout/SideNav/AdminSideNav'
import ModalDepartment from '../../layout/ModalDepartment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLayerGroup, faBuilding, faPhone, faPenFancy } from '@fortawesome/free-solid-svg-icons'
import { loadingDepartment, addDepartment, fetchDepartment } from '../../../store/Actions/departmentActions'
import { DotLoading } from '../../layout/Loading'
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdbreact'
import { searchDepartment } from '../../../controllers/search'
const DepartmentDashboard=()=> {
    const [state,setState]=useState({
        collapse : '',
        found:false,
        departments:[]
    })
  //importing states from redux
    const {department,dispatchDepartment}=useContext(StoreContext)
  const {state:departments,loading,error}=department
  //searching the index
  const handleSearch=(index)=>{
    const result=index===''?departments:searchDepartment(departments,index)
    let found=index===''?false:true
       setState({...state,departments:result,found})
  }
  
  useEffect(()=>{
  setState({...state,departments})
  },[loading])
  //fetching if any change occurs
  const fetch=async ()=>{
    /**pupulating with new data */
    try{
dispatchDepartment(loadingDepartment())
const newDepartment=await fetchDepartment()
/**updating redux store */
dispatchDepartment(addDepartment(newDepartment))
    }
    catch(err){
        dispatchDepartment({type:'ERROR'})
    }
}
  //displaying departments
  const listDepartment=loading?
  (
  <tr>
      <td  className='row text-center' colSpan='5'><DotLoading/></td>
      </tr>
      ):
      error?
      <tr>
         <td className='text-danger text-danger' colSpan='5'>
             Loading department failed  because server is not active
             contact system admin to activate it
             </td> 
      </tr>:
      state.departments.length?
 (state.departments.map(d=>{
    return(
        <tr key={d._id}>
 <td>{d.name}</td>
 <td>{d.office_number}</td>
 <td>{d.phone}</td>
 <td className='row'>
     <ModalDepartment type='edit_department' department={d} fetch={fetch} />
     <p className="text-danger mx-2">|</p>
     <ModalDepartment type='delete_department' department={d} fetch={fetch} />
     </td>
        </tr>
    )
 })):(
 <tr>
 <td  colSpan='5'>No Department yet</td>
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
                               <ModalDepartment type='create_department' fetch={fetch}/>
                            </div>
             <div className="col-lg-5 my-auto">
  <div className="col-lg-5 my-auto">
                                <div className="search-wrapper active">
                        <div className="input-holder">
  <input type="text" className="search-input"
   placeholder="Department name,office,phone number"
  onChange={e=>handleSearch(e.target.value)}
  />
<button className="search-icon">
                                <span></span>
                                </button>
                        </div>
    
                    </div>                                   
                            </div>
                 </div>
                 <div class="col-md-6 col-xl-4">
            <div class="card mb-3 widget-content bg-arielle-smile">
                <div class="widget-content-wrapper text-white">
                    <div class="widget-content-left">
                        <div class="widget-heading">Totall Department</div>
                        <div class="widget-subheading">Registered</div>
                    </div>
    <div class="widget-content-right">
        <div class="widget-numbers text-white">
            <span>
                {departments.length}
                </span>
                </div>
    </div>
                </div>
            </div>
        </div>
        <div className="col-lg-12">
        <div className="main-card mb-3 card mt-2" > 
    {
        state.found?
          <h5 className="text-center">
        Departments found:{state.departments.length}</h5>
   : 
        <p></p>      
         }
                                                  
                  <MDBTable hover>
                      <MDBTableHead>
                          <tr>
                              <th>
      <FontAwesomeIcon icon={faLayerGroup} className='mx-2'/>                         
      Department name
                             </th>
               <th>
               <FontAwesomeIcon icon={faBuilding} className='mx-2' />              
        office
           </th>

                              <th>
          <FontAwesomeIcon icon={faPhone} className='mx-2' />                        
                    Phone
                </th>
             <th>
                <FontAwesomeIcon icon={faPenFancy} className='mx-2' />                 
                                  operation
                                  </th>
                          </tr>
                      </MDBTableHead>
                      <MDBTableBody>
                          {listDepartment}
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

export default DepartmentDashboard
