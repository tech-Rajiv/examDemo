const emailValidation = (value) => {
  let error = "";
  switch (true) {
    case value.trim() === "":
      error = "please provide an email";
      break;
    case !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value): //regex copied, can be changed based on strictness
      error = "email is invalid";
      break;
    default:
      error = "";
  }
  return error;
};

const nameValidation = (value) => {
  let error = "";
  switch (true) {
    case value.trim() === "":
      error = "please provide an name";
      break;
    case value.length <= 2:
      error = "name is too short";
      break;
    default:
      error = "";
  }
  return error;
};

const roleValidation = (value) => {
  let error = "";
  switch (true) {
    case value.trim() === "":
      error = "please select a role";
      break;
    case value.toLowerCase() != "student" && value.toLowerCase() != "teacher":
      error = "role is not valid";
      break;
    default:
      error = "";
  }
  return error;
};

const passwordValidation = (value) => {
  let error = "";
  switch (true) {
    case !value:
      error = "please provide a password";
      break;
    case value.length <= 5:
      error = "length should be longer than 5 characters";
      break;
    default:
      error = "";
  }
  return error;
};

const authInputValidation = () => {
  const validationRootFn = (name, value) => {
    let error;
    switch (true) {
      case name == "email":
        const emailErr = emailValidation(value);
        return { isValid: emailErr ? false : true, error: emailErr };

      case name == "name":
        const nameErr = nameValidation(value);
        return { isValid: nameErr ? false : true, error: nameErr };

      case name == "role":
        const roleErr = roleValidation(value);
        return { isValid: roleErr ? false : true, error: roleErr };

      case name == "password":
        const passErr = passwordValidation(value);
        return { isValid: passErr ? false : true, error: passErr };

      default:
        return { isValid: true, error: "" };
    }
  };
  return {
    validationRootFn,
  };
};

export default authInputValidation;
