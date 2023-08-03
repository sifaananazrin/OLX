import React, { Fragment, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./Create.css";
import Header from "../Header/Header";

import {
  FirebaseContext,
  AuthContext,
  LoadingContext,
} from "../../Store/Context";
import Loader from "../Loader/Loader";

const Create = () => {
  const values = {
    name: "",
    category: "",
    price: "",
  };

  const { firebase } = useContext(FirebaseContext);
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [formValues, setFormValues] = useState(values);
  const [isSubmit, setIsSubmit] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { load, setLoad } = useContext(LoadingContext);
  const date = new Date();
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      setLoad(true);
      firebase
        .storage()
        .ref(`/image/${image.name}`)
        .put(image)
        .then(({ ref }) => {
          ref.getDownloadURL().then((url) => {
            firebase
              .firestore()
              .collection("products")
              .add({
                name: formValues.name,
                category: formValues.category,
                price: formValues.price,
                image: url,
                userId: user.uid,
                createdAt: date.toDateString(),
              })
              .then(() => {
                setLoad(false);
                history.push("/");
              });
          });
        });
    }
  }, [formErrors]);

  const validate = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = "Product name is required";
    } else if (!/^[A-Za-z\s]*$/.test(values.username)) {
      errors.name = "Product name should only contain alphabets and space";
    }
    if (!values.category) {
      errors.category = "category is required";
    } else if (!/^[A-Za-z\s]*$/.test(values.username)) {
      errors.category = "category should only contain alphabets and space";
    }
    if (!values.price) {
      errors.price = "price is required";
    }
    if (image == null) {
      errors.image = "Image is required";
    }

    return errors;
  };

  return (
    <Fragment>
      {load && <Loader />}
      <Header />
      <card>
        <div className="centerDiv">
          <h4>Add Products</h4>
          <form className="pform" onSubmit={handleSubmit}>
            <label htmlFor="fname">Name</label>
            <br />
            <input
              className="input"
              type="text"
              disabled={load}
              id="fname"
              value={formValues.name}
              name="name"
              onChange={handleChange}
              placeholder="Product name"
            />
            <p className="error">{formErrors.name}</p>
            <label htmlFor="fname">Category</label>
            <br />
            <input
              className="input"
              type="text"
              disabled={load}
              id="fname"
              value={formValues.category}
              placeholder="Category"
              onChange={handleChange}
              name="category"
            />
            <p className="error">{formErrors.category}</p>
            <label htmlFor="fname">Price</label>
            <br />
            <input
              className="input"
              type="number"
              disabled={load}
              id="fname"
              value={formValues.price}
              onChange={handleChange}
              name="price"
              placeholder="Price"
            />
            <p className="error">{formErrors.price}</p>
            <br />
            <img
              alt=""
              width="200px"
              height="200px"
              src={image ? URL.createObjectURL(image) : ""}
            ></img>
            <br />
            <input
              onChange={(event) => {
                setImage(event.target.files[0]);
              }}
              disabled={load}
              type="file"
            />
            <p className="error">{formErrors.image}</p>
            <button className="uploadBtn">upload and Submit</button>
          </form>
        </div>
      </card>
    </Fragment>
  );
};

export default Create;
