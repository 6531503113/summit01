function validation(values) {
    let error = {};
    const email_pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/; 
    const password_pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/; 

    if(values.email === ""){
        error.email = "Email should not empty"
    }
    else if(!email_pattern.test(values.email)) {
        error.email = "Email didn't match"
    }else{
        error.email = ""
    }

    if(values.password === ""){
        error.password = "Password should not empty"
    }else if(!password_pattern.test(values.password)){
        error.password = "Password didn't match"
    }else {
        error.password = ""
    }
    return error;
}
export default validation;