import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { getToken } from '../../helper/getToken';
import axios from 'axios';
import { getFirstErrorMessage } from '../../helper/getErrorMessage';

const AdminNavBar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const pathname = location.pathname;
    const segments = pathname.split("/");
    const lastSegment = segments.pop();

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

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleAdminChangePassword = () => {
        try {
            const confirmOptions = {
                customUI: ({ onClose }) => (
                    <Modal classNames={"rounded-md"} open={true} onClose={onClose} center>
                        <div className="rounded-md p-6 -z-50">
                            <h2 className="font-bold text-xl mb-4">Change Password</h2>
                            <input
                                id='pass'
                                type="text"
                                placeholder="Current Password"
                                className="border rounded-md px-3 py-2 w-full mb-4"
                            />
                            <input
                                id='pass2'
                                type="text"
                                placeholder="New Password"
                                className="border rounded-md px-3 py-2 w-full mb-4"
                            />
                            <div className="flex items-center gap-4 justify-between">
                                <button
                                    id='btn'
                                    className="py-2 px-4 rounded-md bg-[#262847] text-white"
                                    onClick={() => {
                                        const password = document.getElementById('pass').value;
                                        const password2 = document.getElementById('pass2').value;
                                        const msgpara = document.getElementById('msg');
                                        const btn = document.getElementById('btn');
                                        msgpara.innerText = "";

                                        const user = localStorage.getItem('dmceuser');
                                        const { id } = JSON.parse(user);
                                        let data = new FormData();
                                        data.append('id', id);
                                        data.append('new_password', password2);
                                        data.append('current_password', password);

                                        const token = getToken();

                                        let config = {
                                            method: 'post',
                                            maxBodyLength: Infinity,
                                            url: `${import.meta.env.VITE_SERVER_DOMAIN}/admin/update/password`,
                                            headers: {
                                                'Accept': 'application/json',
                                                'Authorization': `Bearer ${token}`,
                                                ...data.getHeaders
                                            },
                                            data: data
                                        };
                                        btn.innerText = 'Loading';

                                        axios.request(config)
                                            .then((response) => {
                                                console.log(JSON.stringify(response.data));
                                                toast.success('Password changed successfully');
                                                onClose(); // Close modal on success
                                            })
                                            .catch((error) => {
                                                const msg = getFirstErrorMessage(error.response.data);
                                                msgpara.innerText = msg;
                                                btn.innerText = 'Change';
                                            });
                                    }}
                                >
                                    Change
                                </button>
                                <button
                                    className="py-2 px-4 rounded-md bg-[#262847] text-white"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                            </div>
                            <div>
                                <p className='text-center py-4 p-2 font-bold text-sm text-red-600 underline' id='msg'></p>
                            </div>
                        </div>
                    </Modal>
                ),
            };

            confirmAlert(confirmOptions);
        } catch (error) {
            toast.error(getFirstErrorMessage(error.response.data));
            onClose(); // Close modal on success
        }
    };

    return (
        <nav className='w-full bg-[#262847] py-3 px-8 flex items-center justify-between relative'>
            <div className='text-white flex gap-4 items-center'>
                <h1 onClick={() => navigate('/admin')} className='cursor-pointer text-4xl font-bold text-white'>Admin Panel</h1>
                {lastSegment !== 'admin' && (
                    <div onClick={() => navigate('/admin')} className='flex flex-col justify-center items-center cursor-pointer hover:scale-150 duration-100'>
                        <span><i className="fa-solid fa-house"></i></span>
                        <p className='text-sm'>Go to Home</p>
                    </div>
                )}
            </div>

            <div className='flex items-center gap-4'>
                {/* <p onClick={() => navigate('/admin/add-batch')} className='px-4 py-2 bg-white text-black font-bold cursor-pointer rounded-md'>Add Batch</p>
                <p onClick={() => navigate('/admin/add-subject')} className='px-4 py-2 bg-white text-black font-bold cursor-pointer rounded-md'>Add Subject</p>
                <p onClick={() => navigate('/admin/add-professor')} className='px-4 py-2 bg-white text-black font-bold cursor-pointer rounded-md'>Add Professor</p>
                <p onClick={() => navigate('/admin/assign-subject')} className='px-4 py-2 bg-white text-black font-bold cursor-pointer rounded-md'>Assign Subject</p>
                <button onClick={handleAdminChangePassword} className='px-4 py-2 bg-white text-black font-bold rounded-md'>Change Password</button>
                <button onClick={handleSignOut} className='px-4 py-2 bg-white text-black font-bold rounded-md'>Sign out</button> */}
                <button onClick={toggleSidebar} className='px-4 py-2 bg-white text-black font-bold rounded-md'><i className="fa-solid fa-bars"></i></button>
            </div>

            {sidebarOpen && (
                <div className="w-72 h-full fixed top-0 right-0 bg-white shadow-lg p-6 z-[1000]">
                    <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition duration-200" onClick={toggleSidebar}>
                        <i className="fa-solid fa-xmark px-4 py-2 bg-[#262847] text-white font-bold rounded-md"></i>
                    </button>
                    <ul className="mt-12 space-y-3">
                        <li className="group">
                            <a
                                onClick={() => { navigate('/admin/add-batch'); toggleSidebar(); }}
                                className="block text-lg text-gray-700 hover:text-[#262847] transition duration-200 cursor-pointer group-hover:bg-gray-100 p-2 rounded-md"
                            >
                                <i className="fa-solid fa-school mr-3"></i>   Add Batch
                            </a>
                        </li>
                        <li className="group">
                            <a
                                onClick={() => { navigate('/admin/add-subject'); toggleSidebar(); }}
                                className="block text-lg text-gray-700 hover:text-[#262847] transition duration-200 cursor-pointer group-hover:bg-gray-100 p-2 rounded-md"
                            >
                                 <i className="fa-solid fa-book mr-3"></i>  Add Subject
                            </a>
                        </li>
                        <li className="group">
                            <a
                                onClick={() => { navigate('/admin/add-professor'); toggleSidebar(); }}
                                className="block text-lg text-gray-700 hover:text-[#262847] transition duration-200 cursor-pointer group-hover:bg-gray-100 p-2 rounded-md"
                            >
                                 <i className="fa-solid fa-chalkboard-user mr-3"></i>  Add Professor
                            </a>
                        </li>
                        <li className="group">
                            <a
                                onClick={() => { navigate('/admin/assign-subject'); toggleSidebar(); }}
                                className="block text-lg text-gray-700 hover:text-[#262847] transition duration-200 cursor-pointer group-hover:bg-gray-100 p-2 rounded-md"
                            >
                                 <i className="fa-solid fa-hand mr-3"></i>  Assign Subject
                            </a>
                        </li>
                        <li className="group">
                            <a
                                onClick={() => { navigate('/admin/add-student'); toggleSidebar(); }}
                                className="block text-lg text-gray-700 hover:text-[#262847] transition duration-200 cursor-pointer group-hover:bg-gray-100 p-2 rounded-md"
                            >
                                <i className="fa-solid fa-plus mr-3"></i> Add students List
                            </a>
                        </li>
                        <li className="group">
                            <a
                                onClick={handleAdminChangePassword}
                                className="block text-lg text-gray-700 hover:text-[#262847] transition duration-200 cursor-pointer group-hover:bg-gray-100 p-2 rounded-md"
                            >
                             <i class="fa-solid fa-lock mr-3"></i>   Change Password
                            </a>
                        </li>
                        <hr className="border-gray-300" />
                        <li className="mt-6">
                            <a
                                onClick={handleSignOut}
                                className="block px-4 py-2 bg-[#262847] text-white text-lg font-bold rounded-md text-center cursor-pointer transition duration-200"
                            >
                                Sign Out
                            </a>
                        </li>
                    </ul>
                </div>

            )}
        </nav>
    );
};

export default AdminNavBar;
