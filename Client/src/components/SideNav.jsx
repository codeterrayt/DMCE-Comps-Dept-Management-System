import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, Outlet, json } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import { checkLogin } from "../helper/checkLogin";
import { userContext } from "../App";

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
            navigate('/dmce/login')

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
        localStorage.clear()
        setLogin(false)
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
                        "min-w-[300px] max-md:w-full h-[calc(100vh-80px)] md:h-cover md:sticky  overflow-y-auto p-4 md:pr-0 md:border-grey md:border-r absolute max-md:top:[64px] bg-white  duration-500 " +
                        (!showSideNav
                            ? " max-md:opacity-0 max-md:pointer-events-none "
                            : " opacity-100 pointer-events-auto")
                    }
                >


                    <div className=" mb-3 w-full "><img src="https://www.dmce.ac.in/assets/img/dmce.png" className="w-16 m-auto" alt="logo" /> </div>
                    <hr className="border-grey mx-auto ml-6 mb-8 mr-6 " />

                    <NavLink
                        to={"/dmce/home"}
                        onClick={(e) => setPageState(e.target.innerText)}
                        className="ml-8 text-xl font-bold"
                    >

                        Home
                    </NavLink>
                    <br />
                    <br />
                    <NavLink
                        to={"/dmce/about"}
                        onClick={(e) => setPageState(e.target.innerText)}
                        className="ml-8 text-xl font-bold"
                    >

                        About
                    </NavLink>
                    <br />
                    <br />
                    <NavLink
                        to={"/dmce/internship"}
                        onClick={(e) => setPageState(e.target.innerText)}
                        className="ml-8 text-xl font-bold"
                    >

                        Internship
                    </NavLink>
                    <br />
                    <br />
                    <NavLink
                        to={"/dmce/achivement"}
                        onClick={(e) => setPageState(e.target.innerText)}
                        className="ml-8 text-xl font-bold"
                    >

                        Achivements
                    </NavLink>
                    <br />
                    <br />
                    <NavLink
                        to={"/dmce/extra-curriculum"}
                        onClick={(e) => setPageState(e.target.innerText)}
                        className="ml-8 text-xl font-bold"
                    >

                        Extra Activities
                    </NavLink>
                    <br />
                    <br />
                    <NavLink
                        to={"/dmce/hackathon"}
                        onClick={(e) => setPageState(e.target.innerText)}
                        className="ml-8 text-xl font-bold"
                    >

                        Hackathon
                    </NavLink>
                    <br />
                    <br />
                    <NavLink
                        to={"/dmce/higher-studies"}
                        onClick={(e) => setPageState(e.target.innerText)}
                        className="ml-8 text-xl font-bold"
                    >

                        Higher Studies
                    </NavLink>
                    <br />
                    <br />
                    <div className="w-[80%] ml-[1.2rem] p-4 absolute bottom-3">
                        {
                            login ? <div className="w-full  p-2 flex gap-4 text-xs mx-auto justify-center items-center  flex-col ">
                                <div className="flex w-full items-center gap-4 ">

                                    <Avatar alt="profile" src="https://varad177.github.io/portfolio/assets/hero.jpg" />
                                    <h1 className="text-xl font-bold">Hii {userInSession.name}</h1>
                                </div>
                                <button onClick={handleSignOut} className="btn1 mx-auto">Sign Out</button>
                            </div>
                                : <div className="w-full flex gap-3 text-xs mx-auto">

                                    <div className="flex  flex-col gap-2 w-full">
                                        <button className="btn1 mx-auto"><NavLink
                                            to={"/dmce/sign-up"}
                                            onClick={(e) => setPageState(e.target.innerText)}

                                        >

                                            Sign Up
                                        </NavLink></button>
                                        <button className="btn1 mx-auto"><NavLink
                                            to={"/dmce/login"}
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

            <div className="max-md:-mt-8 mt-5 md:pl-[300px] w-full">
                <Outlet />
            </div>
        </section>
    );
};

export default SideNav;
