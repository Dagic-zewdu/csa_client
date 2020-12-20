import { faBarcode, faBell, faCalendar, faChartLine, faCog, faPaperPlane, faProjectDiagram, faSdCard } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact'
import React, { useContext,useState } from 'react'
import { useEffect } from 'react'
import ReactTimeAgo from 'react-time-ago/commonjs/ReactTimeAgo'
import { Progress } from 'reactstrap'
import { TellDay, tellTime } from '../../controllers/Date'
import { DeductionClass } from '../../controllers/Deductions'
import { StoreContext } from '../contexts/contexts'
import { fetchData_Deductions } from '../fetchers/Functions/FerchDeductions'
import ModalDeduction from '../layout/ModalDeduction'

 const CreatedDeduction=()=> {
    const [state,setState]=useState({
        deductions:[],
        unCompleted:[],
        newCompleted:[],
        seenCompleted:[],
        found:false
    })
    const { allowances,dispatchDeductions,deductions,employees,users }=useContext(StoreContext)
    const {state:Allowances,loading,error}=allowances
    const {state:Employees,loading:empLoading,error:empError}=employees
    const {state:Users,loading:userLoading,error:userError}=users
    const {state:Deductions,loading:deductionsLoading,error:deductionError}=deductions
const Deduction=new DeductionClass(Deductions,Allowances,Employees,Users)
const userDeductions=Deduction.userDeductions() 
const unCompleted=Deduction.userUnCompleted()  //array of uncompleted deductions
const newCompleted=Deduction.userNewCompleted() //array of completed unseen deductions
const seenCompleted=Deduction.userSeenCompleted()
const fetch=()=>fetchData_Deductions(dispatchDeductions)
useEffect(()=>{
    fetchData_Deductions(dispatchDeductions)
    setState({...state,unCompleted,newCompleted,seenCompleted,deductions:userDeductions})
},[deductionsLoading,JSON.stringify(Deductions)])
    const handleSearch=(index)=>{
   const UnCompleted=index===''?unCompleted:Deduction.searchUserDeductions(index).unCompleted
   const CompletedNew=index===''?newCompleted:Deduction.searchUserDeductions(index).completedUnseen
   const SeenCompleted=index===''?seenCompleted:Deduction.searchUserDeductions(index).completedSeen
   const found=index===''?false:true
   setState({...state,unCompleted:UnCompleted,newCompleted:CompletedNew,seenCompleted:SeenCompleted,found})
    }
  const listDeductions=state.deductions.length?
  state.unCompleted.map(d=>{
      return(
     <tr key={d._id}>
    <td className="text-center">
        {d.id}
    </td>
    <td className="text-center">
        {Deduction.findAllowance(d.allowance_id)?
        Deduction.findAllowance(d.allowance_id).id:''
        }
    </td>
    <td>
        {
            d.save_options==='draft'?
            <p className="text-center">
                Deduction is saved us a draft
            </p>:
            d.save_options==='approve'?
            <p className="text-center">
                Deduction is sent for approval
            </p>:
            <p></p>
        }
    </td>
    
    <td className="tex-center">
        <p className="font-italic float-right">
            {tellTime(d.created_date)}
        </p>
<ReactTimeAgo date={d.created_date} /> <br/>
{TellDay(d.created_date)}
    </td>
    <td>
<ModalDeduction type='view_details' fetch={fetch} deduction={d} 
    am={false} ftli={false} fe={false} />
<ModalDeduction type='view_progress' fetch={fetch} deduction={d}/>
{
    Deduction.Progress(d._id)===0||Deduction.Progress(d._id)===1||
    Deduction.Progress(d._id)===2||Deduction.Progress(d._id)===6?
    <ModalDeduction type='edit' fetch={fetch} deduction={d} />: 
   <p></p>
}
{
    Deduction.Progress(d._id)===0||Deduction.Progress(d._id)===1||
    Deduction.Progress(d._id)===5?
    <ModalDeduction type='delete' fetch={fetch} deduction={d} /> :
    <p></p>
}
</td>
    </tr>
      )
  }):
  <tr>
      <td colSpan={7} className='text-center text-danger font-weight-bold'>
     No deductions created yet
      </td>
  </tr>  

const CompletedNew=state.newCompleted.map(d=>{
    return(
   <tr key={d._id}>
  <td className="text-center text-success">
      {d.id}
  </td>
  <td className="text-center text-success">
      {Deduction.findAllowance(d.allowance_id)?
      Deduction.findAllowance(d.allowance_id).id:''
      }
  </td>
  <td>
        <p className="text-center text-success">
                Deduction is sent for approval
            </p>
        
    </td>
    
  <td>
      <p className="text-center font-italic font-weight-bold text-success">
          Deduction is completed
      </p>
  </td>
  
  <td className="tex-center text-success">
    <ModalDeduction type="view_final" deduction={d} fetch={fetch} user={true}/>
</td>
  </tr>
    )
})
const CompletedSeen=state.seenCompleted.map(d=>{
    return(
   <tr key={d._id}>
  <td className="text-center">
      {d.id}
  </td>
  <td className="text-center">
      {Deduction.findAllowance(d.allowance_id)?
      Deduction.findAllowance(d.allowance_id).id:''
      }
  </td>
  <td>
       <p className="text-center">
                Deduction is sent for approval
            </p>
    </td>
    
  <td>
      <p className="text-center font-italic font-weight-bold">
          Deduction is completed
      </p>
  </td>
  
  <td className="tex-center">
  <ModalDeduction type="view_final" deduction={d} fetch={fetch} user={true} />
</td>
  </tr>
    )
})





    return (
         <div className="container">
     <div className="row">
       <div className="col-lg-3 my-auto">
       </div>
            <div className="col-lg-5 my-auto">
            <div className="search-wrapper active">
                        <div className="input-holder">
  <input type="text" className="search-input" 
  placeholder="Type deduction id, allowance id"
  onChange={e=>handleSearch(e.target.value)}
  />
<button className="search-icon">
                                <span></span>
                                </button>
                        </div>
    </div> 

            </div>
            <div className="col-lg-4 my-auto">
            <div className="card mb-3 widget-content bg-grow-early">
                <div className="widget-content-wrapper text-white">
                    <div className="widget-content-left">
                        <div className="widget-heading">Deductions</div>
                        <div className="widget-subheading">Totall Made</div>
                    </div>
                    <div className="widget-content-right">
                        <div className="widget-numbers text-white"><span>
                            {userDeductions.length}
                            </span></div>
                    </div>
                </div>
            </div> 
                
                </div>  
                {/** */}
                <div className="container mt-3 main-card mb-3 card min-height">
            <div className="row">
         <div className="col-lg-12">
         {
         newCompleted.length?
         <h5 className="text-center font-weight-bold text-success">
             <FontAwesomeIcon icon={faBell} className='mx-2 text-success' />
             {newCompleted.length} Deductions are completed
             </h5>:
             <p></p>   
             }
         {
                 state.found?
                 <h5 className='text-center'>
   Deductions found -{state.unCompleted.length+state.newCompleted.length+state.seenCompleted.length}
                </h5>
         :
         <p></p>   
             }
       <MDBTable hover bordered striped>
         <MDBTableHead>
                          <tr>
                          <th>
             <FontAwesomeIcon icon={faBarcode} className='mx-2'/>                            
                Deduction id                                
                              </th>   
                              <th>
             <FontAwesomeIcon icon={faPaperPlane} className='mx-2'/>                            
                Allowance id attached                                
                              </th>

                              <th>
          <FontAwesomeIcon icon={faSdCard} className='mx-2' />                        
                saving option
                </th>
              
                <th>
          <FontAwesomeIcon icon={faCalendar} className='mx-2' />                        
                created
                </th>  
                <th>
          <FontAwesomeIcon icon={faCog} className='mx-2' />                        
                Options
                </th>  
                 </tr>
                      </MDBTableHead>
                    <MDBTableBody>
                          {CompletedNew}
                          {listDeductions}
                          {CompletedSeen}
                      </MDBTableBody>
                  </MDBTable>
                
             </div>         
            </div>
        </div>

                {/** */}          
     </div>
 </div>

    )
}

export default CreatedDeduction
