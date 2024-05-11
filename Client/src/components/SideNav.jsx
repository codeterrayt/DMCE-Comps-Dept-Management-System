import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, Outlet, json } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import { checkLogin } from "../helper/checkLogin";
import { userContext } from "../App";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { getToken } from "../helper/getToken";
import axios from "axios";
import toast from "react-hot-toast";
import { getFirstErrorMessage } from "../helper/getErrorMessage";
import logo from '../assets/dmce.png'

const SideNav = () => {
    let page = window.location.pathname.split("/")[2];
    let [pageState, setPageState] = useState(page ? page.replace("-", " ") : '');
    const navigate = useNavigate();

    const { user } = useContext(userContext)

    useEffect(() => {
        setShowSideNav(false);
        pageStateTab.current.click();
    }, [pageState]);

    const [userInSession, setUserInSession] = useState({})
    const [login, setLogin] = useState(false)

    useEffect(() => {
        if (!checkLogin()) {
            return navigate('/login')

        } else {
            const user = localStorage.getItem('dmceuser')
            const userData = JSON.parse(user)
            setUserInSession(userData)
            setLogin(true)
        }
    }, [login, user])

    let activeTabLine = useRef();
    let sideBarIcon = useRef();
    let pageStateTab = useRef();
    let [showSideNav, setShowSideNav] = useState(false);

    const changePageState = (e) => {
        let { offsetWidth, offsetLeft } = e.target;
        activeTabLine.current.style.width = offsetWidth + "px";
        activeTabLine.current.style.left = offsetLeft + "px";

        if (e.target === sideBarIcon.current) {
            setShowSideNav(!showSideNav);
        }
    };


    const handleSignOut = () => {

        const token = getToken()

        let data = new FormData();
        const loading = toast.loading('logging out..')
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
                localStorage.clear()
                if (response?.data?.status == 'success') {
                    setLogin(false)
                    toast.dismiss(loading)
                    toast.success("logout done")
                    return navigate('/login')
                }

            })
            .catch((error) => {
                console.log(error);
            });



    }

    const handleChangePassword = () => {
        try {
            const confirmOptions = {
                customUI: ({ onClose }) => (
                    <Modal classNames={"rounded-md"} open={true} onClose={onClose} center>
                        <div className="rounded-md p-6">
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
                                        const password = document.getElementById('pass').value
                                        const password2 = document.getElementById('pass2').value
                                        const btn = document.getElementById('btn')

                                        const user = localStorage.getItem('dmceuser')
                                        const { id } = JSON.parse(user)
                                        let data = new FormData();
                                        data.append('id', id);
                                        data.append('new_password', password2);

                                        data.append('current_password', password);

                                        const token = getToken();

                                        let config = {
                                            method: 'post',
                                            maxBodyLength: Infinity,
                                            url: `${import.meta.env.VITE_SERVER_DOMAIN}/student/update/password`,
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
                                                console.log(error.response.data);
                                                onClose();
                                                toast.error(getFirstErrorMessage(error.response.data));
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
                        </div>
                    </Modal>
                ),
            };

            confirmAlert(confirmOptions);
        } catch (error) {
            setLoader(false);
            toast.error(error.message);
        }
    }




    return (
        <section className="border relative flex py-0 m-0 max-md:flex-col w-full">
            <div className="sticky md:fixed  md:top-[20px] z-30 ">
                <div className="md:hidden bg-white  border-b border-grey flex flex-nowrap overflow-x-auto ">
                    <button
                        onClick={changePageState}
                        ref={sideBarIcon}
                        className="p-5 capitalize "
                    >
                        <i className="fa-solid fa-bars-staggered pointer-events-none"></i>
                    </button>
                    <button
                        ref={pageStateTab}
                        onClick={changePageState}
                        className="p-5 capitalize "
                    >
                        {pageState}
                    </button>
                    <hr
                        ref={activeTabLine}
                        onClick={changePageState}
                        className="absolute bottom-0 duration-500"
                    />
                </div>

                <div
                    className={
                        "min-w-[300px] max-md:w-full h-[calc(100vh-80px)] md:h-cover md:sticky  overflow-y-auto md:pr-0 md:border-grey md:border-r absolute max-md:top:[64px] bg-white  duration-500 " +
                        (!showSideNav
                            ? " max-md:opacity-0 max-md:pointer-events-none "
                            : " opacity-100 pointer-events-auto")
                    }
                >


                    <div className=" mb-3 w-full "><img src={logo} onClick={() => navigate('/dmce/home')} className="w-16 m-auto cursor-pointer" alt="logo" /> </div>
                    <hr className="border-grey mx-auto ml-6 mb-8 mr-6 " />

                    <NavLink
                        to={"/dmce/home"}
                        onClick={(e) => setPageState(e.target.innerText)}
                        className="pl-8 text-xl font-bold sidebar-link"
                    >

                        Home
                    </NavLink>

                    {/* <NavLink
                        to={"/dmce/about"}
                        onClick={(e) => setPageState(e.target.innerText)}
                        className="pl-8 text-xl font-bold sidebar-link"
                    >

                        About
                    </NavLink>
                    <br />
                    <br /> */}
                    <NavLink
                        to={"/dmce/internship"}
                        onClick={(e) => setPageState(e.target.innerText)}
                        className="pl-8 text-xl font-bold sidebar-link"
                    >

                        Internship
                    </NavLink>

                    <NavLink
                        to={"/dmce/achivement"}
                        onClick={(e) => setPageState(e.target.innerText)}
                        className="pl-8 text-xl font-bold sidebar-link"
                    >

                        Achievements
                    </NavLink>

                    <NavLink
                        to={"/dmce/extra-curriculum"}
                        onClick={(e) => setPageState(e.target.innerText)}
                        className="pl-8 text-xl font-bold sidebar-link"
                    >

                        Extra Activities
                    </NavLink>

                    <NavLink
                        to={"/dmce/hackathon"}
                        onClick={(e) => setPageState(e.target.innerText)}
                        className="pl-8 text-xl font-bold sidebar-link"
                    >

                        Hackathon
                    </NavLink>

                    <NavLink
                        to={"/dmce/higher-studies"}
                        onClick={(e) => setPageState(e.target.innerText)}
                        className="pl-8 text-xl font-bold sidebar-link"
                    >

                        Higher Studies
                    </NavLink>

                    <NavLink
                        to={"/dmce/placement"}
                        onClick={(e) => setPageState(e.target.innerText)}
                        className="pl-8 text-xl font-bold sidebar-link"
                    >

                        Placement
                    </NavLink>


                    {/* <div className="w-full p-4">
                        <button onClick={handleChangePassword} className=" border w-full bg-[#262847] text-white p-2 mx-auto rounded-md"  > Change Password </button>

                    </div> */}
                    <div className="w-full px-4  mt-8 absolute bottom-2">
                        {
                            login ? <div className="w-full  p-2 flex gap-4 text-xs mx-auto justify-center items-center  flex-col ">
                                <div className="flex flex-col w-full items-center gap-2 mt-8 ">


                                    <h1 className="text-xl font-bold text-center">Hii {userInSession.name} <i className="fa-solid fa-pen-to-square pl-3 hover:text-xl cursor-pointer" onClick={() => navigate('/dmce/edit-profile')}></i> <i className="fa-solid fa-lock pl-3 hover:text-xl cursor-pointer" onClick={handleChangePassword}></i></h1>


                                    <button onClick={handleSignOut} className="btn1 mx-auto">Sign Out</button>
                                </div>

                            </div>
                                : <div className="w-full flex gap-3 text-xs mx-auto">

                                    <div className="flex  flex-col gap-2 w-full">
                                        <button className="btn1 mx-auto"><NavLink
                                            to={"/sign-up"}
                                            onClick={(e) => setPageState(e.target.innerText)}

                                        >

                                            Sign Up
                                        </NavLink></button>
                                        <button className="btn1 mx-auto"><NavLink
                                            to={"/login"}
                                            onClick={(e) => setPageState(e.target.innerText)}

                                        >

                                            Login
                                        </NavLink></button>
                                    </div>

                                </div>

                        }
                    </div>

                </div>
            </div>

            <div className="max-md:-mt-8  md:pl-[300px] w-full">
                <Outlet />
            </div>
        </section>
    );
};

export default SideNav;
