import React, { useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import "../assets/css/login.css";

import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import { CheckToken } from "../library/helper";
import { authenticateUser } from "../library/store/authentication";
import { useDispatch } from "react-redux";

export default function LoginPage() {
  const history = useHistory();
  const dispatch = useDispatch();

  const LoginSchema = Yup.object().shape({
    clientid: Yup.string().required("Access Token is required"),
    token: Yup.string().required("Client ID is required"),
  });

  useEffect(() => {
    if (CheckToken()) {
      history.push("/dashboard");
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      clientid: "",
      token: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (data) => {
      console.log("data",data)
      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', data.clientid)
      setTimeout(() => {
        formik.setSubmitting(false);
        history.push("/dashboard");
      }, 2000);
    },
  });

  const { errors, touched, isSubmitting, handleSubmit } = formik;

  return (
    <div className="form-box">
      <div className="fullHeight p-ai-center p-d-flex p-jc-center">
        <div className="shadow card m-3 px-3 py-4 px-sm-4 py-sm-5">
          <h4 className="text-center">Sign in to TradeX</h4>
          <p className="text-center mb-3">Enter Dhan API details below.</p>
          <FormikProvider value={formik}>
            <Form onSubmit={handleSubmit} className="p-fluid">
              <div className="p-field">
                <span className="p-float-label">
                  <InputText
                    id="clientid"
                    name="clientid"
                    value={formik.values.clientid}
                    onChange={formik.handleChange}
                    className={classNames({
                      "p-invalid": Boolean(touched.clientid && errors.clientid),
                    })}
                  />
                  <label
                    htmlFor="name"
                    className={classNames({
                      "p-error": Boolean(touched.clientid && errors.clientid),
                    })}
                  >
                    Client ID*
                  </label>
                </span>
                {Boolean(touched.clientid && errors.clientid) && (
                  <small className="p-error">{formik.errors["clientid"]}</small>
                )}
              </div>

              <div className="p-field">
                <span className="p-float-label">
                  <InputText
                    id="token"
                    name="token"
                    feedback={false}
                    value={formik.values.token}
                    onChange={formik.handleChange}
                    className={classNames({
                      "p-invalid": Boolean(touched.token && errors.token),
                    })}
                  />
                  <label
                    htmlFor="token"
                    className={classNames({
                      "p-error": Boolean(touched.token && errors.token),
                    })}
                  >
                    Access Token*
                  </label>
                </span>
                {Boolean(touched.token && errors.token) && (
                  <small className="p-error">{formik.errors["token"]}</small>
                )}
              </div>
              <div className="submitBtnBox">
                <Button
                  type="submit"
                  label="Submit"
                  iconPos="right"
                  loading={isSubmitting}
                  className="mt-4 submitBtn"
                  disabled={isSubmitting}
                />
              </div>

            </Form>
          </FormikProvider>
        </div>
      </div>
    </div>
  );
}
