import React, { useContext,useState } from 'react'
import { StoreContext, LayoutContext } from '../../contexts/contexts'
import AdminNavbar from '../../layout/Navbar/AdminNavbar'
import { loadingCompany, fetchCompany, addCompany } from '../../../store/Actions/companyActions'
import AdminSideNav from '../../layout/SideNav/AdminSideNav'
import { SpinnerLoading } from '../../layout/Loading'
import { files_url } from '../../config/config'
import ModalCompany from '../../layout/ModalCompany'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStamp, faObjectGroup, faUserCircle, faCity, faPhone } from '@fortawesome/free-solid-svg-icons'
  const Company=()=> {
      const [state,setState]=useState({
         collapse:''
      })
      const {company,dispatchCompany}=useContext(StoreContext)
      const {state:COMPANY,loading,error}=company
      const Company=COMPANY[0]
      const fetch=async ()=>{
          try{
        dispatchCompany(loadingCompany())
        const com=await fetchCompany()
        dispatchCompany(addCompany(com))
    }
    catch(err){
        dispatchCompany({type:'ERROR'})
    }  
      }
    
    return (
      <div className={"app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header "+state.collapse}>
       <LayoutContext.Provider value={{uiContents:state,togglers:setState}}>
       <AdminNavbar/>
       <div className="app-main">
        <AdminSideNav/>
        <div className="app-main__outer">
                    <div className="app-main__inner">
              {
                  loading?
                  <div className="mt-5">
               <SpinnerLoading/>  
                  </div>:
               error?
               <p className="text-center mt-5 text-danger">
              Server is not active loading failed    
                   </p>:             
                        <div className="row">
        {/***Title */}
        <div className="app-page-title">
<div className="page-title-wrapper">
    <div className="page-title-heading">
        <div className="page-title-icon">
            <FontAwesomeIcon icon={faStamp} 
            className='pe-7s-car icon-gradient bg-mean-fruit text-warning' />
           
        </div>
        <div>
     {Company.name}      
           <div className="page-title-subheading">
   This is company info that is configured before it is useful to set
   correct information for the system. it will attach to letters and tor
    </div>
        </div>
    </div>
    <div className="page-title-actions mx-4">
      <div className="d-inline-block dropdown">
            <ModalCompany company={Company} fetch={fetch} />
        </div>
    </div>  
    </div>
</div>      
        {/** company logo */} 
<div className="col-md-6 mt-6">
    <div className="main-card mb-3 card">
        <div className="card-body">
            <h5 className="card-title text-center">
   <img src={files_url+Company.logo} alt=""/>         
            </h5>
            </div>
            </div>
            </div>
            <div className="col-lg-6">
            <div className="main-card mb-3 card">         
       <div className="row mt-2">
       <FontAwesomeIcon icon={faStamp}
        className='fa-3x text-info my-auto mx-2'/>
        <p className="text-center my-auto font-weight-bold">
        Company name : {Company.name}       
           </p>
       </div>
       <div className="row mt-2">
       <FontAwesomeIcon icon={faObjectGroup}
        className='fa-3x text-info my-auto mx-2'/>
        <p className="text-center my-auto font-weight-bold">
        Department_length : {Company.dept_length}       
           </p>
       </div>
       <div className="row mt-2">
       <FontAwesomeIcon icon={faUserCircle}
        className='fa-3x text-info my-auto mx-2'/>
        <p className="text-center my-auto font-weight-bold">
        Employee quantity : {Company.emp_length}       
           </p>
       </div>
       <div className="row mt-2">
       <FontAwesomeIcon icon={faCity}
        className='fa-3x text-info my-auto mx-2'/>
        <p className="text-center my-auto font-weight-bold">
        Address : {Company.city+'-'+Company.subcity+'-'+Company.woreda
          +'-' +Company.house
        }       
           </p>
       </div>
       <div className="row mt-2">
       <FontAwesomeIcon icon={faPhone}
        className='fa-3x text-info my-auto mx-2'/>
        <p className="text-center my-auto font-weight-bold">
        phone 1 : {Company.phone_1}       
           </p>
       </div>
       <div className="row mt-2">
       <FontAwesomeIcon icon={faPhone}
        className='fa-3x text-info my-auto mx-2'/>
        <p className="text-center my-auto font-weight-bold">
        phone 2 : {Company.phone_2}       
           </p>
       </div>            
       </div>
            </div>   
                                              
                </div>
                }
                </div>
                </div>
       </div>
       </LayoutContext.Provider>    
        </div>
    )
}

export default Company
