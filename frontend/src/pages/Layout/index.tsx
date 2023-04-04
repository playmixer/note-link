import React from "react";
import Notify from "../../components/Notify";

const Layout = ({children}: { children: React.ReactNode }) => {

    return <div>
        <div>
            {children}
        </div>
        <Notify/>
    </div>
}

export default Layout
