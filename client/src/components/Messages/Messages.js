import swal from "sweetalert"

export const SuccessAlert = (msg) => {
    swal("Success!", msg, "success");
}
export const ErrorAlert = (msg) => {
    swal("Error!", msg, "error");
}