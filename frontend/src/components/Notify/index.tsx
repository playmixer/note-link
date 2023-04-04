import React from "react";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

const Notify = () => {
    return <ToastContainer/>
}

export default Notify

export const notify = {
    default: toast,
    success: toast.success,
    error: toast.error

}
