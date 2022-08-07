import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import image from "../assets/IMG_E0472.JPG"
import { logout } from '../components/Auth/auth';
import Profile from '../components/Profile/Profile';

export default function NavMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <img src={image} alt="Profile Image" width="43" height="43" className='rounded-circle' />
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
