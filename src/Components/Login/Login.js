import React, { useState, useContext, useEffect } from "react";
import Swal from 'sweetalert2'
import { FirebaseContext, LoadingContext } from "../../Store/Context";
import { useHistory } from "react-router-dom";
import Logo from "../../olx-logo.png";
import Loader from "../Loader/Loader";
import "./Login.css";

function Login() {
  const initialVlaues = { email: "", password: "" };
  const [formValues, setFormValues] = useState(initialVlaues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const { firebase } = useContext(FirebaseContext);
  const { load, setLoad } = useContext(LoadingContext);
  const history = useHistory();

  const loginHandle = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  }

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      setLoad(true);
      firebase
        .auth()
        .signInWithEmailAndPassword(formValues.email, formValues.password)
        .then((result) => {
          console.log(result);
          setLoad(false);
          history.push("/");
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Login failed',
            text: 'incorrect email or password',
          }).then(() => {
            setLoad(false);
            history.push("/login")
          })
        });
    }
  }, [formErrors])


  const validate = (values) => {
    const errors = {};

    if (!values.password) {
      errors.password = "password is required";
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
    <div className="lmain">
      {load && <Loader />}
      <div className="loginParentDiv">
        <img width="200px" height="200px" src={Logo} alt="logo"></img>
        <form onSubmit={loginHandle} className="lfrom">
          <label htmlFor="fname">Email</label>
          <br />
          <input
            className="input"
            type="email"
            id="fname"
            value={formValues.email}
            onChange={handleChange}
            name="email"
            placeholder="email"
            defaultValue="John"
          />
          <br />
          <p className="error">{formErrors.email}</p>
          <label htmlFor="lname">Password</label>
          <br />
          <input
            className="input"
            type="password"
            id="lname"
            value={formValues.password}
            onChange={handleChange}
            name="password"
            placeholder="password"
            defaultValue="Doe"
          />
          <p className="error">{formErrors.password}</p>
          <br />
          <br />
          <button>Login</button>
        </form>
        <span onClick={() => history.push("/signup")}>Signup</span>
      </div>
    </div>
  );
}

export default Login;
