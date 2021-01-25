import React, { useContext,useState } from 'react'
import { StoreContext } from '../contexts/contexts'
import { LettersClass } from '../../controllers/Letters'
import { SpinnerLoading } from '../layout/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowClose, faEnvelope, faPaperclip, faEnvelopeSquare, faEnvelopeOpen, faObjectGroup, faUser } from '@fortawesome/free-solid-svg-icons'
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdbreact'

   const ShowLetters=()=> {
       const [state,setState]=useState({
          letters:[] 
       })
       //getting letter values from the context reducer
       const {letters,dispatchLetters,employees, dispatchEmployees,users}=
       useContext(StoreContext)
       //getting letters
       const {state:Letters,loading:lettersLoading,error}=letters
       const {state:Employees,loading:loadingEmp,error:errorEmp}=employees
       const {state:Users}=users
       const letter=new LettersClass(Letters,Employees,Users)
       const pl= letter.participationLetter() // participation letter
         const ac=letter.acceptedLetter() //accepted letter
         const all=letter.allLetters() //all letters
     const {seen,unseen}=letter.viewLetter()
   //unseen letters
  const unseenLetters=unseen.length?
  unseen.map(l=>{
      return(
          <tr key={l._id}>
            <td className='row'>
            <FontAwesomeIcon icon={faEnvelope} className='text-info my-auto mx-2' />
         <p className="text-info my-auto">{l.title}</p>
            </td>
            <td>
            
         {
       letter.isApproved(l._id)&&letter.isParticipation(l._id)&&
       letter.isAccepted(l._id)?
       <p className="text-success">Approved participationLetter</p>:
         letter.isAccepted(l._id)&&letter.isApproved(l._id)&&!letter.isParticipation(l._id)?
         <p className="text-success">Letter has been approved before</p>:
         letter.isAccepted(l._id)&&!letter.isApproved(l._id)&&!letter.isParticipation(l._id)?
        <p className="text-success">letter need approval</p>:
         !letter.isAccepted(l._id)&&letter.isParticipation(l._id)&&
         letter.isParticipation(l._id)?
         <p className="text-success">particpation letter</p>:
         letter.isAccepted(l._id)&&!letter.isApproved(l._id)&&
         letter.isParticipation(l._id)?
         <p className="text-success">Participation letter need approval</p>:
                 <p></p>       
         }       
            </td>
            <td>
            <p className="text-info">{letter.Department(l.creater)}</p>     
            </td>
            <td>
            <p className="text-info">{letter.Name(l.creater)} 
                .({letter.UserRole(l.creater)})
                </p>     
            </td>
          </tr>
      )
  })
  :
  <p></p>
  //seen letters
  const seenLetters=seen.length?
  seen.map(l=>{
      return(
          <tr key={l._id}>
            <td className='row'>
            <FontAwesomeIcon icon={faEnvelope} className='text-dark my-auto mx-2' />
         <p className="text-dark my-auto">{l.title}</p>
            </td>
            <td>
         {
            letter.isApproved(l._id)&&letter.isParticipation(l._id)&&
       letter.isAccepted(l._id)?
       <p className="text-success">Approved participationLetter</p>:
         letter.isAccepted(l._id)&&letter.isApproved(l._id)&&!letter.isParticipation(l._id)?
         <p className="text-success">Letter has been approved before</p>:
         letter.isAccepted(l._id)&&!letter.isApproved(l._id)&&!letter.isParticipation(l._id)?
        <p className="text-success">letter need approval</p>:
         !letter.isAccepted(l._id)&&letter.isParticipation(l._id)&&
         letter.isParticipation(l._id)?
         <p className="text-success">particpation letter</p>:
         letter.isAccepted(l._id)&&!letter.isApproved(l._id)&&
         letter.isParticipation(l._id)?
         <p className="text-success">Participation letter need approval</p>:
                 <p></p>
         }       
            </td>
            <td>
            <p className="text-info">{letter.Department(l.creater)}</p>     
            </td>
            <td>
            <p className="text-info">{letter.Name(l.creater)} 
                ({letter.UserRole(l.creater)})
                </p>     
            </td>
          </tr>
      )
  })
  :
  <p></p>
    return (
       <div className="container mt-3 main-card min-height mb-3 card">
  <div className="row">

   {
       lettersLoading?
       <div className="col-lg-12">
            <SpinnerLoading className='mt-5'/>
             <h3 className="text-center">Loading...</h3>   
            </div>:
            error?
            <div className="col-lg-12 ">

<div className="main-card mb-3 min-height card">
  <h3 className='mt-5 text-center text-danger'>
    <FontAwesomeIcon icon={faWindowClose} className='fa-2x'/>
    <br/>  
  ...oops loading failed the server is down or not active
  contact admin
  </h3>  
    </div>    
</div>:
  all.length?
   <div className="col-lg-12">
       {
           unseen.length?
           <h3 className="text-center text-success">
           <FontAwesomeIcon icon={faEnvelope} className='mx-2 text-success' />
           New Letters ({unseen.length})
       </h3>:
       <p></p>
       }
       {
           unseen.length?
           <div className="main-card card">
           <MDBTable hover>
                      <MDBTableHead>
                      <th>
      <FontAwesomeIcon icon={faPaperclip} className='mx-2'/>                            
                             Title
                             </th>
               <th>
               <FontAwesomeIcon icon={faEnvelopeSquare} className='mx-2' />              
                 letter type
           </th> 
           <th>
           <FontAwesomeIcon icon={faObjectGroup} className='mx-2' />
           From Department   
               </th>
               <th>
                 <FontAwesomeIcon icon={faUser} className='mx-2' /> 
                sender
                   </th>  
                      </MDBTableHead>
                      <MDBTableBody>
                          {unseenLetters}
                          {seenLetters}
           
                      </MDBTableBody>
                  </MDBTable> 
                  </div>:
                  <p></p>
       }
  
       </div>:
      <div className="container mt-5">
          <div className="row">
              <div className="col-lg-12 text-center">
<FontAwesomeIcon icon={faEnvelopeOpen} className='text-secondary fa-4x'/>
    <h3 className="text-center">
        You have no letters
    </h3>
              </div>
          </div>
      </div>   
   }
  </div>
       </div>
    )
}

export default ShowLetters
