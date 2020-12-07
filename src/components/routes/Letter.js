import React, { useState } from 'react'
import { LayoutContext } from '../contexts/contexts'
import Navbar from '../layout/Navbar/Navbar'
import SideNav from '../layout/SideNav/SideNav'
import { faEnvelope, faEnvelopeOpen, faPaperclip, faPlus, faInfo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import CreateLetters from '../letters/CreateLetters'
import ShowLetters from '../letters/ShowLetters'

   const Letter=()=> {
    const [state,setState]=useState({
        collapse : '',
        inbox:'text-info',
        myletter:'',
        create:'',
        info:''
    })
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
     <ul className="header-menu nav">
                        <li className="nav-item btn-outline-light btn row mx-3 my-auto"  
    onClick={()=>setState({...state,inbox:'text-info',myletter:'',
    create:'',info:''})}          
            >
            <FontAwesomeIcon icon={faEnvelopeOpen}
        className={'nav-link-icon my-auto mx-2 '+state.inbox}              
                        />
     <h5 className={'font-weight-bold my-auto '+state.inbox}>
                        Inbox letters             
                            </h5>         
                        </li>
                        <li className="nav-item row  mx-3"
onClick={()=>setState({...state,inbox:'',myletter:'text-info',
create:'',info:''})
         }                        
                        >
                      <FontAwesomeIcon icon={faPaperclip}
        className={'nav-link-icon my-auto mx-2 '+state.myletter}              
                        />
    <h5 className={'font-weight-bold my-auto '+state.myletter}>
                        my letters             
                            </h5>          
                        </li> 
                        <li className="nav-item my-auto mx-3 row"
onClick={()=>setState({...state,inbox:'',myletter:'',create:'text-info',info:''})      
   }                   
                        >
                      <FontAwesomeIcon icon={faPlus}
        className={'nav-link-icon my-auto mx-2 '+state.create}              
                        />
    <h5 className={'font-weight-bold my-auto '+state.create}>
    create letters            
        </h5>          
                </li>
                <li className="nav-item row my-auto mx-3"
 onClick={()=>setState({...state,inbox:'',myletter:'',create:'',info:'text-info'})     
            }                       
                        >
                      <FontAwesomeIcon icon={faInfo}
        className={'nav-link-icon my-auto mx-2 '+state.info}               
                        />
                        <h5 className={'font-weight-bold my-auto '+state.info}>
                            Info            
                            </h5>          
               </li>                                    
                        </ul>
                        
     </div>
 </div>
 {/**Body changing accordingly */}
 {
     
     state.create==='text-info'?<CreateLetters/>:
     state.inbox?<ShowLetters/>:<p></p>
 }
                    </div>
                    </div>
       </div>
       </LayoutContext.Provider>    
        </div>
    )
}

export default Letter
