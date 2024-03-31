import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const SideNav = () => {
    let page = window.location.pathname.split("/")[2];
    let [pageState, setPageState] = useState(page ? page.replace("-", " ") : '');

    useEffect(() => {
        setShowSideNav(false);
        pageStateTab.current.click();
    }, [pageState]);

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

    return (
        <section className="border relative flex py-0 m-0 max-md:flex-col w-full">
            <div className="sticky md:top-[20px] z-30 ">
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
                        "min-w-[300px] h-[calc(100vh-80px-60px)] md:h-cover md:sticky  overflow-y-auto p-4 md:pr-0 md:border-grey md:border-r absolute max-md:top:[64px] bg-white  duration-500 " +
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

                </div>
            </div>

            <div className="max-md:-mt-8 mt-5 w-full">
                <Outlet />
            </div>
        </section>
    );
};

export default SideNav;
