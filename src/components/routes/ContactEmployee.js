import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutContext, StoreContext } from '../contexts/contexts'
import Navbar from '../layout/Navbar/Navbar'
import SideNav from '../layout/SideNav/SideNav'
import {  faEnvelopeOpen, faComment, faEnvelopeOpenText, faUser } from '@fortawesome/free-solid-svg-icons'
import DataLoading from '../layout/DataLoading'
import ErrorLoading from '../layout/ErrorLoading'
import Contacts from '../letters/Contacts'

const ContactEmployee=()=> {
    const [state,setState]=useState({
        collapse:''
    })
    const { employees }=useContext(StoreContext)
    const {loading:empLoading,error:empError}=employees
    return (
          <div className={"app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header "+state.collapse}>
       <LayoutContext.Provider value={{uiContents:state,togglers:setState}}>
       <Navbar/>
       <div className="app-main">
        <SideNav/>
        <div className="app-main__outer">
                    <div className="app-main__inner">
{/**Navigations */}
<div className="container">
        <div className="row">
            <div className="col-lg-3">
       <h4 className="text-center">
       <NavLink to='/message'> 
      <FontAwesomeIcon icon={faComment} className='fa-1x mx-2 text-danger' />  
            Messages
            </NavLink>  
            </h4>
           </div>
           <div className="col-lg-3">
        <h4 className="text-center">
        <NavLink to='/outbox'> 
       <FontAwesomeIcon icon={faEnvelopeOpen} className='fa-1x mx-2 text-danger' />  
            Inbox letters
            </NavLink>  
            </h4>
           </div>
           <div className="col-lg-3">
        <h4 className="text-center">
        <NavLink to='/inbox'> 
       <FontAwesomeIcon icon={faEnvelopeOpenText} className='fa-1x mx-2 text-danger' />  
            outbox letters
            </NavLink>  
            </h4>
           </div>  
           <div className="col-lg-3">
        <h4 className="text-center">
        <NavLink to='/contact'> 
       <FontAwesomeIcon icon={faUser} className='fa-1x mx-2 text-danger' />  
        Employees to contact
            </NavLink>  
            </h4>
           </div>  
        </div>
    </div>
{
    empLoading?
    <DataLoading/>:
    empError?
    <ErrorLoading/>:
    <Contacts/>
}
                    </div>
                    </div>
       </div>
       </LayoutContext.Provider>    
        </div>
    )
}

export default ContactEmployee
