import React, { useState } from 'react'
import "./Auth.css"
import logo from "../../assets/auth-logo.png"
import marketing from "../../assets/marketing-campaign-3025712-2526910.png"
import GoogleLogin from 'react-google-login'
import { FormControl, IconButton, Input, InputAdornment, InputLabel, TextField } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import axios from "axios"
import { ErrorAlert, SuccessAlert } from '../../components/Messages/Messages'
import { Loading } from '../../components/Loading/Loading'
import { setAuthentication } from '../../components/Auth/auth'

export const Signup = (props) => {
    const [email, setEmail] = useState("")
    const [fullName, setFullName] = useState("")
    const [loading, setLoading] = useState(false)
    const [values, setValues] = React.useState({
        // amount: '',
        password: '',
        showPassword: false,
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const responseError = (response) => {
        console.log(response);
    };

    const sendGoogleToken = (response) => {
        console.log(response)
        axios.post(`/api/users/google-login`, {
            idToken: response.tokenId
        })
            .then((res) => {
                if (res.status === 200) {
                    setAuthentication(res.data, res.data.token);
                    SuccessAlert(res.data.successMessage);
                    props.history.push('/');
                    document.location.reload();
                }
            })
            .catch((error) => {
                console.log("GOOGLE SIGNIN ERROR", error.response);
            });
    };

    const submitHandler = (e) => {
        e.preventDefault();
        setLoading(true);
        axios.post(`/api/users/signup`, { fullName, email, password: values.password }).then((res) => {
            setLoading(false);
            if (res.status === 200) {
                SuccessAlert(res.data.successMessage);
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        }).catch((error) => {
            setLoading(false)
            ErrorAlert("Bad Request!", error)
        });
    };

    return (
        <div className='Auth p-3'>
            <div className='row'>
                <div className='col-md-4 left'>
                    <div className='logoCont'>
                        <Link to="/">
                            <img src={logo} alt="Logo" width="32" height="32" />
                        </Link>
                        <h2>Welcome to UniAncer</h2>
                    </div>
                    <img src={marketing} alt="Marketing compaign" className='marketing' />
                </div>
                <div className='col-md-6 right'>
                    <div>
                        <h3>Create Account</h3>
                        {
                            loading ?
                                <Loading />
                                :
                                <>
                                    <div className='text-center mt-4 google-btn'>
                                        <GoogleLogin
                                            clientId="563209229426-qr00bs8cip1dgvaj0eaqatdnh2mcfa3f.apps.googleusercontent.com"
                                            buttonText="Login with Google"
                                            onSuccess={sendGoogleToken}
                                            onFailure={responseError}
                                        // cookiePolicy={'single_host_origin'}
                                        />
                                        <h5>OR</h5>
                                    </div>
                                    <form onSubmit={submitHandler}>
                                        <div className='input-container'>
                                            <TextField id="standard-basic" label="Full Name" variant="standard" onChange={(e) => setFullName(e.target.value)} />
                                        </div>
                                        <div className='input-container'>
                                            <TextField type="email" id="standard-basic" label="Email Address" variant="standard" onChange={(e) => setEmail(e.target.value)} />
                                        </div>
                                        <div className='input-container'>
                                            <FormControl className='w-100' variant="standard">
                                                <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                                                <Input
                                                    id="standard-adornment-password"
                                                    type={values.showPassword ? 'text' : 'password'}
                                                    value={values.password}
                                                    onChange={handleChange('password')}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                onMouseDown={handleMouseDownPassword}
                                                            >
                                                                {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                />
                                            </FormControl>
                                        </div>
                                        <div>
                                            <button className='btn' type='submit'>
                                                Create Account
                                            </button>
                                        </div>
                                        <div className='bottomText'>
                                            Already have an account? <Link to="/login" >Log in</Link>
                                        </div>
                                    </form>
                                </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
