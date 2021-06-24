import React, {useState, useEffect, Fragment} from 'react';
import {gql, useMutation, useLazyQuery} from '@apollo/client';
import {useRouter} from 'next/router';
import Spinner from '@atlaskit/spinner';
import {LOGIN, SEND_OTP, VALIDATE_OTP, UPDATE_PASSWORD} from '../gql/user';
import {
  storeToken,
  storeUser,
  storeVendor,
  storeStaff,
  storeMember,
} from '../components/shared/local';
import {ToastProvider, useToasts} from 'react-toast-notifications';
import * as moment from 'moment';

const LoginForm = ({setError, setToken}) => {
  const router = useRouter ();
  const {addToast} = useToasts ();

  useEffect (() => {
    router.prefetch ('/dashboard');
  }, []);

  const [isError, setIsError] = useState (false);
  const [isSuccess, setIsSuccess] = useState (false);
  const [mode, setMode] = useState (0);
  const [successMessage, setSuccessMessage] = useState ();
  const [errorMessage, setErrorMessage] = useState ();
  const [email, setEmail] = useState ();

  const [formLoader, setFormLoader] = useState (false);

  const [otp, setOtp] = useState ('');
  const [password, setPassword] = useState ('');
  const [confirm_password, setConfirmPassword] = useState ('');
  const [ispasswordMatch, setIspasswordMatch] = useState (false);
  let year = moment ().year ();
  const [currentYear, setCurrentYear] = useState (`${year}`);

  ispasswordMatch;
  const [authenticate, {loading, error}] = useMutation (LOGIN, {
    onError: error => {
      setFormLoader (false);
      addToast (error.graphQLErrors[0].message, {
        appearance: 'warning',
        autoDismiss: true,
      });
      setIsError (true);
      setErrorMessage (error.graphQLErrors[0].message);
    },
    onCompleted({authenticate}) {
      const token = authenticate.token;
      const user = authenticate.user;
      const vendor = authenticate.vendor;
      storeToken (token);
      storeUser (user);
      storeVendor (vendor);

      if (user.role === 'member') {
        const member = authenticate.member;
        storeMember (member);
        setFormLoader (false);
        router.push ('/members-app');
      }

      if (
        user.role === 'super_admin' ||
        user.role === 'admin' ||
        user.role === 'staff' ||
        user.role === 'manager'
      ) {
        const staff = authenticate.staff;
        storeStaff (staff);
        setFormLoader (false);
        setFormLoader (false);
        router.replace ('/dashboard');
      }
    },
  });

  const [otpRequest, {otpLoading, otpError}] = useMutation (SEND_OTP, {
    onError: error => {
      setFormLoader (false);
      addToast (error.graphQLErrors[0].message, {
        appearance: 'warning',
        autoDismiss: true,
      });
      setIsError (true);
      setErrorMessage (error.graphQLErrors[0].message);
    },
    onCompleted({sendOtp}) {
      setIsSuccess (true);
      setFormLoader (false);
      setSuccessMessage (sendOtp.message);
      setMode (2);
      console.log (sendOtp);
    },
  });

  const [
    validateOtp,
    {validateLoading, validateError},
  ] = useMutation (VALIDATE_OTP, {
    onError: error => {
      setFormLoader (false);
      addToast (error.graphQLErrors[0].message, {
        appearance: 'warning',
        autoDismiss: true,
      });
      setIsError (true);
      setErrorMessage (error.graphQLErrors[0].message);
    },
    onCompleted({validateOtp}) {
      setIsSuccess (true);
      setFormLoader (false);
      setSuccessMessage (validateOtp.message);
      updatePasswordRequest ({
        variables: {
          id: validateOtp.id,
          password,
          old_password: confirm_password,
        },
      });
      setMode (2);
    },
  });

  //update password
  const [
    updatePasswordRequest,
    {updatePasswordLoading, updatePasswordError},
  ] = useMutation (UPDATE_PASSWORD, {
    onError: error => {
      setFormLoader (false);
      addToast (error.graphQLErrors[0].message, {
        appearance: 'warning',
        autoDismiss: true,
      });
      setIsError (true);
      setErrorMessage (error.graphQLErrors[0].message);
    },
    onCompleted({updateUserPassword}) {
      setIsSuccess (true);
      setFormLoader (false);
      setSuccessMessage ('Password Updated, Please Login with new password');
      setMode (0);
      console.log (updateUserPassword);
    },
  });
  const submit = async event => {
    setIsError (false);
    setIsSuccess (false);
    event.preventDefault ();
    setFormLoader (true);
    authenticate ({variables: {email, password}});
  };

  const sendOtp = async e => {
    e.preventDefault ();
    setIsSuccess (false);
    setIsError (false);
    setFormLoader (true);
    otpRequest ({variables: {email}});
  };

  const submitValidatOtp = async e => {
    e.preventDefault ();
    setIsSuccess (false);
    setIsError (false);
    setFormLoader (true);
    validateOtp ({variables: {email, otp}});
  };
  const checkPasswordMatch = val => {
    if (val === password) {
      setIspasswordMatch (false);
      setConfirmPassword (val);
    } else {
      setIspasswordMatch (true);
      console.log ('no match');
    }
  };

  return (
    <Fragment>
      <div className="container-fluid px-0">
        <nav className="page-nav fixed-top">
          <h1 className="nav-h1 my-0">KASU CORPERATIVE</h1>
        </nav>
        <section className="section-one">
          <header className="page-header row">
            <div className="col-lg-7 d-flex flex-column justify-content-center">
              <h1 className="page-heading mb-0">
                <span style={{color: '#0081FF'}}>Welcome</span> to KASU
              </h1>
              <h1 className="page-heading">
                Multipurpose Corperative Society.
              </h1>
              <p className="page-para">
                a fast growing  financial society in Nigeria . we are interested in delivering excellent, quality and speedy services for customers satisfaction while consistently being transparent, expanding our clients base and legacy nationally and internationally.
              </p>

              <a href="#services" className="service-link">
                Our
                Services
              </a>
            </div>
            <div className="col-lg-5">
              {mode === 0 &&
                <form className="form" onSubmit={submit}>
                  <h2 className="form-heading">Welcome back.</h2>
                  <p className="form-oara">
                    Quickly Login to continue to your dashboard
                  </p>
                  {isSuccess &&
                    <p className="success page-para">{successMessage}</p>}
                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input
                      className="form-control"
                      id="exampleInputEmail"
                      type="text"
                      value={email || ''}
                      onChange={({target}) => setEmail (target.value)}
                      placeholder="KS22918"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      id="exampleInputPassword1"
                      value={password || ''}
                      onChange={({target}) => setPassword (target.value)}
                      className="form-control"
                      placeholder="**********"
                    />
                  </div>
                  <p>
                    <a
                      href="#"
                      className="forgot-pw"
                      onClick={() => setMode (1)}
                    >
                      Forgot password?
                    </a>
                  </p>
                  {isError && <p className="error page-para">{errorMessage}</p>}
                  <button
                    disabled={loading}
                    type="submit"
                    className="btn btn-lg btn-block btn-primary"
                    style={{fontSize: '16px', color: '#fff'}}
                  >
                    {formLoader &&
                      <Spinner appearance="invert" size="medium" />}
                    Login Now
                  </button>
                </form>}
              {mode === 1 &&
                <form className="form" onSubmit={sendOtp}>
                  <h2 className="form-heading">Reset Password.</h2>
                  <p className="form-oara">Forgot Password</p>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      className="form-control"
                      id="exampleInputPassword1"
                      type="text"
                      value={email || ''}
                      onChange={({target}) => setEmail (target.value)}
                      placeholder="KS22918"
                    />
                  </div>
                  <p>
                    <a
                      href="#"
                      className="forgot-pw"
                      onClick={() => setMode (0)}
                    >
                      Login
                    </a>
                  </p>
                  {isError && <p className="error page-para">{errorMessage}</p>}
                  {isSuccess &&
                    <p className="success page-para">{successMessage}</p>}
                  <button
                    disabled={loading}
                    type="submit"
                    className="btn btn-lg btn-block btn-primary"
                    style={{fontSize: '16px', color: '#fff'}}
                  >
                    {formLoader &&
                      <Spinner appearance="invert" size="medium" />}
                    Reset Password
                  </button>
                </form>}
              {mode === 2 &&
                <form className="form" onSubmit={submitValidatOtp}>
                  <h2 className="form-heading">Reset Password.</h2>
                  <p className="form-oara">Update Your Password</p>
                  {isSuccess &&
                    <p className="success page-para">{successMessage}</p>}
                  <div className="form-group">
                    <label className="form-label">One Time Password(OTP)</label>
                    <input
                      className="form-control"
                      id="exampleInputPassword1"
                      type="password"
                      // defaultValue={otp || ""}
                      onChange={({target}) => setOtp (target.value)}
                      placeholder="******"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      className="form-control"
                      id="exampleInputPassword1"
                      type="password"
                      // defaultValue={password || ""}
                      onChange={({target}) => setPassword (target.value)}
                      placeholder="******"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password(OTP)</label>
                    <input
                      className="form-control"
                      id="exampleInputPassword1"
                      type="password"
                      // defaultValue={confirm_password || ""}
                      onChange={({target}) => {
                        checkPasswordMatch (target.value);
                      }}
                      placeholder="******"
                    />
                    {ispasswordMatch &&
                      <p className="error page-para">Password do not match</p>}
                  </div>
                  <p>
                    <a
                      href="#"
                      className="forgot-pw"
                      onClick={() => setMode (0)}
                    >
                      Login
                    </a>
                  </p>
                  {isError && <p className="error page-para">{errorMessage}</p>}
                  <button
                    disabled={loading}
                    type="submit"
                    className="btn btn-lg btn-block btn-primary"
                    style={{fontSize: '16px', color: '#fff'}}
                  >
                    {formLoader &&
                      <Spinner appearance="invert" size="medium" />}
                    Reset Password
                  </button>
                </form>}
            </div>

          </header>
        </section>
        <section className="section-two" id="services">
          <div className="text-center pb-5">
            <h2 className="service-h2">Services We Offer</h2>
            <p className="blue-border" />
          </div>

          <div className="row pt-3">
            <div className="col-lg-4">
              <img src="./images/coin_img.png" alt="" className="img-fluid" />
              <h3 className="h3">Loan Applications</h3>
              <p className="page-para">
                This is a Package of KASU Multipurpose Cooperative society that creates financial opportunities and fundings for staff and business owners.
                {' '}
                we offer quick loan that is easy to access both online or off line.
                {' '}
                Our loan services is aimed at reviving and solving both business and personal needs for staff of Kaduna State University. The minimum tenor for a loan is 3 months.
              </p>
            </div>
            <div className="col-lg-4">
              <img src="./images/coin_img.png" alt="" className="img-fluid" />
              <h3 className="h3">Savings and Withdrawals</h3>
              <p className="page-para">
                This subsidiary enables staffs to open a savings account where they can save some part of their salary for future purpose. It only takes few minutes to open a KASU savings account.
                Withdrawal could be done at the customers discretion either online or offline by requesting for withdrawal.
              </p>
            </div>
            <div className="col-lg-4">
              <img src="./images/coin_img.png" alt="" className="img-fluid" />
              <h3 className="h3">Investment Opportunities</h3>
              <p className="page-para">
                Our aim is to provide a safe, trusted and secured investment platform where staff can see their money growing. Individuals are assured of a monthly interest rate on all return for investment. The minimum amount for investing is #20,000  for a specific duration.
              </p>
            </div>
          </div>
        </section>
        <footer className="page-footer py-5">
          <p className="footer-para mb-0">
            {' '}Copyright © {currentYear} <span
              style={{color: '#0081FF'}}
              className="px-1"
            >
              Kasu Cooperative.
            </span> All rights reserved
          </p>
        </footer>
      </div>
    </Fragment>
  );
};
export default LoginForm;
