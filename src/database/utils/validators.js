const signUpValidations = (props) => {
  const {
    firstName,
    lastName,
    gender,
    age,
    emailId,
    password,
    photoUrl,
    skills,
  } = props;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!firstName || password | emailId) {
    throw new Error(" Enter required fields");
  } else if (firstName.length < 3 || firstName.length > 30) {
    throw new Error("firstname exceding or under limit ");
  } else if (age < 18) {
    throw new Error("Under age to sign up ");
  } else if (skills.length > 5) {
    throw new Error("Skills more than 5 are not allowed ");
  } else if (gender !== "male" || gender !== "female" || gender !== "other") {
    throw new Error("Gender is not valid");
  } else if (!regex.test(emailId)) {
    throw new Error("Invalid email");
  }
};
