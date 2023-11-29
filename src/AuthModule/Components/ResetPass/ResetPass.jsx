import React, { useState } from "react";
import logo from "../../../assets/images/4.png";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export default function ResetPass() {
  // *************control show password***************************
  const [showPass, setShowPass] = useState(false);
  const clickHandler = () => {
    setShowPass(!showPass);
  };
  // ********************************

  const navigate = useNavigate();
  const {
    register, //btsheel el values ui inputs
    handleSubmit, //integration
    formState: { errors }, //errors
  } = useForm();
  //****************to reset******************
  const onSubmit = (data) => {
    console.log(data);
    axios
      .post("https://upskilling-egypt.com:443/api/v1/Users/Reset", data)
      .then((response) => {
        console.log(data);
        navigate("/login");

        toast.success(response?.message || "Password changed successfully", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      })
      .catch((error) => {
        toast.error(
          error?.response?.data?.message ||
            "An error occurred. Please try again.",
          {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          }
        );
      });
  };
  return (
    <div className="Auth-container container-fluid">
      <div className="row bg-overlay vh-100 justify-content-center align-items-center">
        <div className="col-md-6">
          <div className="bg-white rounded p-3">
            <div className="logo-cont  text-center">
              <img src={logo} alt="logo" />
            </div>

            <form className="w-75 m-auto" onSubmit={handleSubmit(onSubmit)}>
              <h2>Reset Password</h2>
              <p>Please Enter Your Otp or Check Your Inbox</p>

              {/* email input */}
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  <i className="fa-regular fa-envelope"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="enter your email"
                  type="email"
                  {...register("email", {
                    required: true,
                    pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  })}
                />
              </InputGroup>

              {errors.email && errors.email.type === "required" && (
                <span className=" text-danger my-1">email is required</span>
              )}
              {errors.email && errors.email.type === "pattern" && (
                <span className=" text-danger my-1">invalid email</span>
              )}
              {/* //email input */}
              {/* otp input */}
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  <i className="fa-solid fa-lock"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="OTP"
                  type="text"
                  {...register("seed", {
                    required: true,
                  })}
                />
              </InputGroup>
              {errors.seed && errors.seed.type === "required" && (
                <span className="text-danger my-1">OTP is required</span>
              )}
              {/* //otp */}

              {/* password input */}
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  <i className="fa-solid fa-key"></i>
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  aria-label="password"
                  aria-describedby="password-input"
                  {...register("password", {
                    required: true,
                  })}
                />

                <InputGroup.Text onClick={clickHandler}>
                  {showPass ? (
                    <i className="fa-regular fa-eye-slash"></i>
                  ) : (
                    <i className="fa-regular fa-eye"></i>
                  )}
                </InputGroup.Text>
              </InputGroup>
              {errors.password && errors.password.type === "required" && (
                <span className="text-danger my-1">
                  new password is required
                </span>
              )}
              {/*//password input*/}
              {/* confirm password  */}
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  <i className="fa-solid fa-key"></i>
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  placeholder="confirm New Password"
                  aria-label="password"
                  aria-describedby="password-input"
                  {...register("confirmPassword", {
                    required: true,
                  })}
                />

                <InputGroup.Text onClick={clickHandler}>
                  {showPass ? (
                    <i className="fa-regular fa-eye-slash"></i>
                  ) : (
                    <i className="fa-regular fa-eye"></i>
                  )}
                </InputGroup.Text>
              </InputGroup>
              {errors.confirmPassword &&
                errors.confirmPassword.type === "required" && (
                  <span className="text-danger my-1">
                    confirm new password is required
                  </span>
                )}
              {/* //confirm password */}

              <div className="form-group my-3">
                <button className="btn btn-success w-100">
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
