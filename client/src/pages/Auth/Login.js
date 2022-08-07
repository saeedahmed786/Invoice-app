import React, { useState } from 'react'
import "./Auth.css"
import logo from "../../assets/auth-logo.png"
import marketing from "../../assets/marketing-campaign-3025712-2526910.png"
import { FormControl, IconButton, Input, InputAdornment, InputLabel, TextField } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ErrorAlert, SuccessAlert } from '../../components/Messages/Messages'
import { Loading } from '../../components/Loading/Loading'
import { setAuthentication } from '../../components/Auth/auth'

export const Login = (props) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [values, setValues] = React.useState({
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

    const submitHandler = (e) => {
        e.preventDefault();
        setLoading(true);
        axios.post(`/api/users/login`, { email, password: values.password }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                setAuthentication(res.data, res.data.token);
                SuccessAlert(res.data.successMessage);
                props.history.push('/');
                document.location.reload();
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        });
    };

    return (
        <div className='Auth p-3'>
            <div className='row'>
                <div className='col-md-4 left'>
                    <div className='logoCont'>
                        <img src={logo} alt="Logo" width="32" height="32" />
                        <h2>Welcome to UniAncer</h2>
                    </div>
                    <img src={marketing} alt="Marketing compaign" className='marketing' />
                </div>
                <div className='col-md-6 right'>
                    <div>
                        <div className='mb-5 backBtn'>
                            <div><Link to="/signup">&lt; Back</Link></div>
                        </div>
                        {
                            loading ?
                                <Loading />
                                :
                                <form onSubmit={submitHandler}>
                                    <div className='input-container'>
                                        <TextField id="standard-basic" label="Email Address" variant="standard" onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                    <div className='input-container'>
                                        <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
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
                                            Login
                                        </button>
                                    </div>
                                </form>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
