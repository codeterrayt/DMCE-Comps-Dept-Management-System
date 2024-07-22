import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import logo from '../../assets/dmce.png'
import { getToken } from '../../helper/getToken';
import axios from 'axios';

const NavBar = () => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        const token = getToken();
        const loding = toast.loading('Logging out');

        let data = new FormData();
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${import.meta.env.VITE_SERVER_DOMAIN}/logout`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...data.getHeaders
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                localStorage.clear();
                if (response?.data?.status === 'success') {
                    toast.dismiss(loding);
                    toast.success("Logout successful");
                    return navigate('/login');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const user = JSON.parse(localStorage.getItem('dmceuser'));

    return (
        <nav className="bg-[#262847] text-white p-3 flex justify-between items-center px-8 ">
            <div>
                <img src={logo} alt="Logo" onClick={()=>navigate('/')} className="h-16 cursor-pointer" />
            </div>
            <div className="flex items-center">
                <div className="mr-4">
                    <span className="font-bold">{user.name}</span>
                    <br />
                    <span className="text-sm">{user.role}</span>
                </div>
                <button
                    onClick={handleSignOut}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    Sign Out
                </button>
            </div>

        </nav>
    );
};

export default NavBar;
