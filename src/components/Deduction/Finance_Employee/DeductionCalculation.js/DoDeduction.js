import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { LayoutContext } from '../../../contexts/contexts'
import Navbar from '../../../layout/Navbar/Navbar'
import SideNav from '../../../layout/SideNav/SideNav'
import DeductionCalculation from './DeductionCalculation'

const DoDeduction=(props)=> {
    const {id:_id}=props.match.params
    const [state,setState]=useState({
        collapse : 'closed-sidebar-mobile closed-sidebar',
    })
    return (
     <div className={"app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header "+state.collapse}>
       <LayoutContext.Provider value={{uiContents:state,togglers:setState}}>
       <Navbar/>
       <div className="app-main">
           <SideNav/>
        <div className="app-main__outer">
                    <div className="app-main__inner">
 <DeductionCalculation _id={_id} />

                    </div>
                    </div>
       </div>
       </LayoutContext.Provider>    
        </div>   
    )
}

export default withRouter( DoDeduction)
