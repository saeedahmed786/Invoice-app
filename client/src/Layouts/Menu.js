import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import image from "../assets/IMG_E0472.JPG"
import { isAuthenticated, logout } from '../components/Auth/auth';
import Profile from '../components/Profile/Profile';
import { ErrorAlert } from '../components/Messages/Messages';
import axios from 'axios';

export default function NavMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [profileImage, setProfileImage] = useState("");
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    const getUserById = () => {
        axios.get(`/api/users/get/${isAuthenticated()._id}`, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                setProfileImage(res.data.file.url);
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        });
    };

    useEffect(() => {
        getUserById();
        return () => {

        }
    }, [])


    return (
        <div>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                {
                    profileImage ?
                        <img src={profileImage} alt="Profile Image" width="43" height="43" className='rounded-circle' />
                        :
                        <img src={image} alt="Profile Image" width="43" height="43" className='rounded-circle' />

                }
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem >
                    <Profile />
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <a href='/login' onClick={() => { logout(() => { }) }}>
                        Logout
                    </a>
                </MenuItem>
            </Menu>
        </div>
    );
}
