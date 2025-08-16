function validation(values) {
    let error = {};
    const email_pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const password_pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    const phone_pattern = /^[0-9]{10}$/;

    // ตรวจสอบ Firstname
    if (values.firstname === "") {
        error.firstname = "First name should not be empty";
    } else if (!/^[A-Za-z]+$/.test(values.firstname)) {
        error.firstname = "First name should only contain letters";
    }
    
    // ตรวจสอบ Lastname
    if (values.lastname === "") {
        error.lastname = "Last name should not be empty";
    } else if (!/^[A-Za-z]+$/.test(values.lastname)) {
        error.lastname = "Last name should only contain letters";
    }

    // ตรวจสอบ Email
    if (values.email === "") {
        error.email = "Email should not be empty";
    } else if (!email_pattern.test(values.email)) {
        error.email = "Invalid email format";
    }

    // ตรวจสอบ Password
    if (values.password === "") {
        error.password = "Password should not be empty";
    } else if (values.password.length < 6) {
        error.password = "Password must be at least 6 characters long";
    } else if (!password_pattern.test(values.password)) {
        error.password = "Password must contain at least one letter and one number";
    }

    // ตรวจสอบ Confirm Password
    if (values.confirmPassword === "") {
        error.confirmPassword = "Confirm Password should not be empty";
    } else if (values.confirmPassword !== values.password) {
        error.confirmPassword = "Passwords do not match";
    }

    // ตรวจสอบ Phone number
    if (values.phone === "") {
        error.phone = "Phone number should not be empty";
    } else if (!phone_pattern.test(values.phone)) {
        error.phone = "Invalid phone number format";
    }

    return error;
}
export default validation;
