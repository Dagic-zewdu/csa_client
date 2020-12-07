import React from 'react'

function cpy() {
    return (
        <div className={"app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header "+state.collapse}>
       <LayoutContext.Provider value={{uiContents:state,togglers:setState}}>
       <Navbar/>
       <div className="app-main">
        <SideNav/>
        <div className="app-main__outer">
                    <div className="app-main__inner">
{/**your code here */}

                    </div>
                    </div>
       </div>
       </LayoutContext.Provider>    
        </div>
    )
}

export default cpy
