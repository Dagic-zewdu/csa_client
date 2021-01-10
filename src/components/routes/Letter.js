import React, { useContext, useState } from 'react'
import { LayoutContext,StoreContext } from '../contexts/contexts'
import Navbar from '../layout/Navbar/Navbar'
import SideNav from '../layout/SideNav/SideNav'
import {  faEnvelopeOpen, faComment, faEnvelopeOpenText, faUser, faBell } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink } from 'react-router-dom'
import Chat from '../letters/Chat'
import { Message } from '../../controllers/Message'

   const Letter=()=> {
    const [state,setState]=useState({
        collapse : '',
        
    })
    const {users,employees,messages,connections}=useContext(StoreContext)
    const Messages=new Message(messages.state,connections.state,[],users.state,employees.state)  //importing message class
    
    return (
          <div className={"app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header "+state.collapse}>
       <LayoutContext.Provider value={{uiContents:state,togglers:setState}}>
       <Navbar/>
       <div className="app-main">
        <SideNav/>
        <div className="app-main__outer">
                    <div className="app-main__inner">
{/* title*/}

{/**Navigations */}
    <div className="container">
        <div className="row">
            <div className="col-lg-3 row">
       <h4 className="text-center">
       <NavLink to='/message'> 
      <FontAwesomeIcon icon={faComment} className='fa-1x mx-2 text-danger' />  
            Messages
            </NavLink>  
            </h4>
            {
        Messages.notifiaction()?
      <h4 className="mx-1 text-info font-weight-bold">
<FontAwesomeIcon icon={faBell} className='text-info mx-1' />
{Messages.notifiaction() }  
      </h4>:
      <p></p>
      }  
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
    {/**chat */}
    <Chat />
    {/** */}
                   </div>
                    </div>
       </div>
       </LayoutContext.Provider>    
        </div>
    )
}

export default Letter