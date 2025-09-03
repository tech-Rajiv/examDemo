const emailValidation = (value) => {
  let error = "";
  switch (true) {
    case value.trim() === "":
      error = "please provide an email";
      break;
    case value.length <= 5:
      error = "please provide a valid email";
      break;
    case !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value): //regex copied
      error = "email is invalid";
      break;
    default:
      error = "";
  }
  return { result: value, error };
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
  return { result: value, error };
}

const roleValidation =(value) =>{
    let error = "";
  switch (true) {
    case value.trim() === "":
      error = "please select a role";
      break;
    case value.toLowerCase() != 'student' && value.toLowerCase() != 'teacher':
      error = "role is not valid";
      break;
    default:
      error = "";
  }
  return { result: value, error };
}

const passwordValidation = (value) => {
  let error = "";
  switch (true) {
    case !value:
      error = "please provide a password";
      break;
    case value.length <= 5:
      error = "password must be longer than 5 characters";
      break;
    default:
      error = "";
  }
  return { result: value, error };
};

const authInputValidation = () => {
  return {
    emailValidation,
    passwordValidation,
    nameValidation,
    roleValidation
  };
};

export default authInputValidation;
