import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";

import Logo from "../../olx-logo.png";
import { FirebaseContext, LoadingContext } from "../../Store/Context";
import Loader from "../Loader/Loader";
import "./Signup.css";

export default function Signup() {
  const history = useHistory();
  const initialVlaues = { username: "", email: "", phone: "", password: "" };
  const [formValues, setFormValues] = useState(initialVlaues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const { firebase } = useContext(FirebaseContext);
  const { load, setLoad } = useContext(LoadingContext);

  const onChangeHandle = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      setLoad(true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(formValues.email, formValues.password)
        .then((result) => {
          result.user
            .updateProfile({ displayName: formValues.username })
            .then(() => {
              firebase
                .firestore()
                .collection("users")
                .add({
                  id: result.user.uid,
                  username: formValues.username,
                  phone: formValues.phone,
                })
                .then(() => {
                  firebase.auth().signOut();
                  setLoad(false);
                  history.push("/login");
                })
                .catch((error) => {
                  console.log(error.message);
                });
            });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formErrors]);

  const validate = (values) => {
    const errors = {};

    if (!values.username) {
      errors.username = "Username is required";
    } else if (!/^[A-Za-z\s]*$/.test(values.username)) {
      errors.username = "Username should only contain alphabets and space";
    }
    if (!values.password) {
      errors.password = "password is required";
    } else if (values.password.length < 4) {
      errors.password = "password is should atleast contain 4 characters";
    } else if (values.password.length >= 10) {
      errors.password = "password is should exceed 10 characters";
    }
    if (!values.phone) {
      errors.phone = "phone is required";
    } else if (values.phone.length !== 10) {
      errors.phone = "Invalid phone number";
    }
    if (!values.email) {
      errors.email = "email is required";
    } else if (
      !String(values.email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      errors.email = "Invalid email address";
    }

    return errors;
  };

  return (
    <div className="smain">
      {load && <Loader />}
      <div className="signupParentDiv">
        <img width="200px" height="200px" src={Logo} alt="logo" />
        <form onSubmit={handleSubmit} className="sform">
          <label htmlFor="fname">Username</label>
          <br />
          <input
            className="input"
            type="text"
            id="fname"
            disabled={load}
            value={formValues.username}
            onChange={onChangeHandle}
            name="username"
            placeholder="username"
            defaultValue="John"
          />
          <br />
          <p className="error">{formErrors.username}</p>
          <label htmlFor="fname">Email</label>
          <br />
          <input
            className="input"
            type="text"
            disabled={load}
            id="fname"
            name="email"
            placeholder="email"
            value={formValues.email}
            onChange={onChangeHandle}
            defaultValue="John"
          />
          <br />
          <p className="error">{formErrors.email}</p>
          <label htmlFor="lname">Phone</label>
          <br />
          <input
            className="input"
            type="number"
            disabled={load}
            id="lname"
            name="phone"
            value={formValues.phone}
            placeholder="phone"
            onChange={onChangeHandle}
            defaultValue="Doe"
          />
          <br />
          <p className="error">{formErrors.phone}</p>
          <label htmlFor="lname">Password</label>
          <br />
          <input
            className="input"
            type="password"
            disabled={load}
            id="lname"
            name="password"
            placeholder="password"
            value={formValues.password}
            onChange={onChangeHandle}
            defaultValue="Doe"
          />
          <br />
          <p className="error">{formErrors.password}</p>
          <button disabled={load}>Signup</button>
        </form>
        <span onClick={() => history.push("/login")}> Login</span>
      </div>
    </div>
  );
}
