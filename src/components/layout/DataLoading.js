import React from 'react'
import { DotLoading } from './Loading'

   const DataLoading=()=> {
    return (
        <div className="col-lg-12">
            <div className="main-card mb-3 min-height card">
             <h3 className="text-center">Loading...</h3> 
              <DotLoading className='mt-5'/>  
                </div>    
            </div>
    )
}

export default DataLoading
