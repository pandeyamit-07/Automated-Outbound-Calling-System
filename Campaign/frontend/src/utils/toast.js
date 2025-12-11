import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// SUCCESS
export const toastSuccess = (msg) =>
  toast.success(msg, {
    position: "top-right",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  });

// ERROR
export const toastError = (msg) =>
  toast.error(msg, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  });
