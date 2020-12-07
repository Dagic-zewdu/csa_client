import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutContext,StoreContext } from '../../contexts/contexts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faPaperclip, faStamp, faCalculator, faMapMarker, faChartBar, faInfo } from '@fortawesome/free-solid-svg-icons'
import DepartmentFetch from '../../fetchers/departmentFetch'
import PlaceFetchers from '../../fetchers/placeFetchers'
import EmployeeFetcher from '../../fetchers/employeeFetchers'
import UsersFetcher from '../../fetchers/UsersFetcher'
import FieldAllowanceFetcher from '../../fetchers/FieldAllowanceFetcher'
import ConfigFetch from '../../fetchers/configFetcher'
import CompanyFetcher from '../../fetchers/CompanyFetcher'
import LettersFetcher from '../../fetchers/LettersFetcher'
import AllowanceFetchers from '../../fetchers/AllowanceFetchers'
import ClimatePlacesFetcher from '../../fetchers/ClimatePlacesFetcher'
import DeductionFetcher from '../../fetchers/DeductionFetcher'
const SideNav=()=> {
  
    const setToggler=useContext(LayoutContext)
  const {sidetheme}=setToggler.uiContents
  
  
   return (
                <div className={"app-sidebar sidebar-shadow "+sidetheme}>
                    <div className="app-header__logo">
            <AllowanceFetchers/>
            <EmployeeFetcher/>
            <PlaceFetchers/>
            <FieldAllowanceFetcher/>
            <ConfigFetch/>
            <CompanyFetcher/>
            <DepartmentFetch/>
            <UsersFetcher/>
            <LettersFetcher/>
            <ClimatePlacesFetcher/>
            <DeductionFetcher/>
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
       <NavLink to='/' className="mm-active">
            <FontAwesomeIcon icon={faStamp} 
            className='metismenu-icon pe-7s-diamond fa-2x text-warning'/>
          </NavLink>
    </li>
   
    <li className="app-sidebar__heading">
        <FontAwesomeIcon icon={faCalculator}
        className='metismenu-icon pe-7s-diamond fa-2x text-info mx-2'
        />
        calculate
        </li>
 
    <li>
        <NavLink to='/allowance'>
    
            <i className="metismenu-icon pe-7s-display2"></i>
           <p className="font-weight-bold">
           Allowances
           </p>
            </NavLink>
   
    </li>
    <li>
        <NavLink to='/deduction'>
    
            <i className="metismenu-icon pe-7s-display2"></i>
            <p className="font-weight-bold">
          Deductions
           </p>
            </NavLink>
   
    </li>
    
    <li className="app-sidebar__heading">
    <FontAwesomeIcon icon={faPaperclip}
        className='metismenu-icon pe-7s-diamond fa-2x text-info mx-2'
        />
        Document
        </li>
 
    <li  >
        <NavLink to='/letter'>
            <i className="metismenu-icon pe-7s-display2"></i>
            <p className="font-weight-bold">
          Letter
           </p>
           </NavLink>
    </li>
    <li>
        <NavLink to='/tor'>
            <i className="metismenu-icon pe-7s-display2"></i>
            <p className="font-weight-bold">
         Terms of reference
         </p>
           </NavLink>
    </li>
    <li>
    <li className="app-sidebar__heading">
    <FontAwesomeIcon icon={faMapMarker}
        className='metismenu-icon pe-7s-diamond fa-2x text-info mx-2'
        />
        Place
        </li>
<NavLink to='/places'>
            <i className="metismenu-icon pe-7s-display2"></i>
            <p className="font-weight-bold">
         Places
         </p> 
            <i className="metismenu-state-icon pe-7s-angle-down caret-left"></i>
            </NavLink>
    </li>
   
    <li className="app-sidebar__heading">
    <FontAwesomeIcon icon={faChartBar}
        className='metismenu-icon pe-7s-diamond fa-2x text-info mx-2'
        />
        Statistics
        </li>
    <li>
    <NavLink to='/reports'>
            <i className="metismenu-icon pe-7s-display2"></i>
            <p className="font-weight-bold">
         Reports
         </p>
         </NavLink>
    </li>
    <li className="app-sidebar__heading">
    <NavLink to ='/info'> 
    <FontAwesomeIcon icon={faInfo}
        className='metismenu-icon pe-7s-diamond fa-2x text-info mx-2'
        />
       
    Information
    </NavLink>
        </li>
    <li>
    
    </li>
</ul>
</div>
</div>
                </div>
    )
}

export default SideNav
