import React,{useState} from 'react'
import {LayoutContext} from '../contexts/contexts'
import AdminNavbar from '../layout/Navbar/AdminNavbar'
import AdminSideNav from '../layout/SideNav/AdminSideNav'
const Admin=()=> {
    const [state,setState]=useState({
        collapse : '',
    })
  
    return (
        <div className={"app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header "+state.collapse}>
       <LayoutContext.Provider value={{uiContents:state,togglers:setState}}>
       <AdminNavbar/>
       <div className="app-main">
        <AdminSideNav/>
       </div>
       </LayoutContext.Provider>    
        </div>
    )
}

export default Admin
