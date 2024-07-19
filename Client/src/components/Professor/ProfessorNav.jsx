import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import logo from '../../assets/dmce.png'

const NavBar = () => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem('dmceuser');
        toast.success("Signed out successfully.");
        navigate('/login');
    };

    const user = JSON.parse(localStorage.getItem('dmceuser'));

    return (
        <nav className="bg-[#262847] text-white p-3 flex justify-between items-center">
            <div>
                <img src={logo} alt="Logo" className="h-16" />
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
