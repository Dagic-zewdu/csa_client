import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutContext,StoreContext } from '../../contexts/contexts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faPaperclip, faCog } from '@fortawesome/free-solid-svg-icons'
import DepartmentFetch from '../../fetchers/departmentFetch'
import PlaceFetchers from '../../fetchers/placeFetchers'
import EmployeeFetcher from '../../fetchers/employeeFetchers'
import UsersFetcher from '../../fetchers/UsersFetcher'
import FieldAllowanceFetcher from '../../fetchers/FieldAllowanceFetcher'
import ConfigFetch from '../../fetchers/configFetcher'
import CompanyFetcher from '../../fetchers/CompanyFetcher'
import ClimatePlacesFetcher from '../../fetchers/ClimatePlacesFetcher'
import DeductionFetcher from '../../fetchers/DeductionFetcher'
const AdminSideNav=()=> {
  
    const setToggler=useContext(LayoutContext)
  const {sidetheme}=setToggler.uiContents
  
  
   return (
                <div className={"app-sidebar sidebar-shadow "+sidetheme}>
                    <div className="app-header__logo">
        <div className="logo-src">
            <EmployeeFetcher/>
            <DepartmentFetch/>
            <PlaceFetchers/>
            <UsersFetcher/>
            <FieldAllowanceFetcher/>
            <ConfigFetch/>
            <CompanyFetcher/>
            <ClimatePlacesFetcher/>
            <DeductionFetcher/>
        </div>
        <div className="header__pane ml-auto">
            <div>
                <button type="button" className="hamburger close-sidebar-btn hamburger--elastic" data-classname="closed-sidebar">
                    <span className="hamburger-box">
                        <span className="hamburger-inner"></span>
                    </span>
                </button>
            </div>
        </div>
                    </div>
                    <div className="app-header__mobile-menu">
                        <div>
                            <button type="button" className="hamburger hamburger--elastic mobile-toggle-nav">
                                <span className="hamburger-box">
                                    <span className="hamburger-inner"></span>
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className="app-header__menu">
                        <span>
                            <button type="button" className="btn-icon btn-icon-only btn btn-primary btn-sm mobile-toggle-header-nav">
                                <span className="btn-icon-wrapper">
                                    <i className="fa fa-ellipsis-v fa-w-6"></i>
                                </span>
                            </button>
                        </span>
                    </div>    <div className="scrollbar-sidebar">
                        <div className="app-sidebar__inner">
<ul className="vertical-nav-menu">
    <li className="app-sidebar__heading">Allowance System</li>
   
    <li>
       <NavLink to='/configuration' className="mm-active">
            <FontAwesomeIcon icon={faCog} className='metismenu-icon pe-7s-display2'/>
          configure
           </NavLink>
    </li>
    <li className="app-sidebar__heading">Users</li>
 
    <li>
        <NavLink to='/employee'>
    
            <i className="metismenu-icon pe-7s-display2"></i>
           <h6>Employee</h6>
            </NavLink>
   
    </li>
    <li>
        <NavLink to='/users'>
    
            <i className="metismenu-icon pe-7s-display2"></i>
           <h6>users</h6>
            </NavLink>
   
    </li>
    <li>
        <NavLink to='/fieldAllowance'>
    
            <i className="metismenu-icon pe-7s-display2"></i>
           <h6>Field allowance</h6>
            </NavLink>
   
    </li>
    <li className="app-sidebar__heading">Organization</li>
 
    <li  >
        <NavLink to='/company'>
            <i className="metismenu-icon pe-7s-display2"></i>
           <h6>Company</h6>
           </NavLink>
    </li>
    <li>
        <NavLink to='/department'>
            <i className="metismenu-icon pe-7s-display2"></i>
         <h6>Department</h6> 
            <i className="metismenu-state-icon pe-7s-angle-down caret-left"></i>
            </NavLink>
    </li>
    <li>
    <li className="app-sidebar__heading">Place</li>
<NavLink to='/places'>
            <i className="metismenu-icon pe-7s-display2"></i>
         <h6>Places</h6> 
            <i className="metismenu-state-icon pe-7s-angle-down caret-left"></i>
            </NavLink>
            <NavLink to='/climate_places'>
            <i className="metismenu-icon pe-7s-display2"></i>
         <h6>Climate places</h6> 
            <i className="metismenu-state-icon pe-7s-angle-down caret-left"></i>
            </NavLink>    
    </li>
   
    <li className="app-sidebar__heading">Statistics</li>
    <li>
    <NavLink to='/reports'>
            <i className="metismenu-icon pe-7s-display2"></i>
            Reports
            </NavLink>
    </li>
 
</ul>
</div>
</div>
                </div>
    )
}

export default AdminSideNav
