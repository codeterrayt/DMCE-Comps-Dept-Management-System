import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkLogin } from '../helper/checkLogin';
import { getToken } from '../helper/getToken';
import toast from 'react-hot-toast';
import axios from 'axios';

import Loaders from './Loaders';

const Internship = () => {
    const navigate = useNavigate();
    const [internships, setInternships] = useState([]);
    const [loader, setLoader] = useState(false);

    function removeUnwantedFields(internships) {
        return internships.map(internship => {
            const { user_id, created_at, updated_at, ...rest } = internship;
            return rest;
        });
    }

    useEffect(() => {
        if (!checkLogin()) {
            return navigate('dmce/login');
        }
    }, []);

    useEffect(() => {
        getAllInternships();
    }, []);

    useEffect(() => {
        if (internships.length > 0) {
            // Initialize DataTable after the table has been rendered
            new DataTable('#example');
        }
    }, [internships]);

    const getAllInternships = () => {
        setLoader(true);
        const token = getToken();

        let config = {
            method: 'get',
            url: `${import.meta.env.VITE_SERVER_DOMAIN}/student/fetch/internships`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };

        axios.request(config)
            .then((response) => {
                const data = removeUnwantedFields(response.data.internships)
                setInternships(data);
                setLoader(false);
            })
            .catch((error) => {
                setLoader(false);
                console.log(error);
            });
    };

    const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

    return (
        <section className='w-full  min-h-screen p-4 md:p-8 '>
            {loader ? <Loaders message={"loading your internships"} /> :
                <div className='w-full'>
                    <div className='w-full flex items-center justify-between px-4 mt-8 '>
                        <h2 className='text-center text-xl md:text-3xl font-bold text-[#262847] '>Your Internships</h2>
                        <button
                            className="bg-[#262847] hover:bg-[#1e4f8f] p-2 px-4 text-white rounded-md w-fit  block md:hidden md:text-xl"
                            onClick={() => navigate('/dmce/add/internship')}
                        >
                            <i className="fa-solid fa-plus"></i>
                        </button>
                        <button
                            className="bg-[#262847] hover:bg-[#1e4f8f] p-2 px-4 text-white rounded-md w-fit  block max-md:hidden md:text-xl"
                            onClick={() => navigate('/dmce/add/internship')}
                        >
                            Add Internship
                        </button>
                    </div>

                    <div className="overflow-x-auto w-full mt-8 ">
                        <table  id="example" className="table table-striped " style={{width :'100%'}}>
                            <thead>
                                <tr>
                                    {internships.length && Object.keys(internships[0]).map(key => (
                                        <th className='text-sm text-center' key={key}>{key.toUpperCase().replace('_', ' ')}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {internships.length && internships.map(internship => (
                                    <tr key={internship.id}>
                                        {Object.values(internship).map((value, index) => (
                                            <td className='text-center text-sm' key={index}>
                                                {String(value).startsWith('http') ? (
                                                    <a href={String(value)}>View</a>
                                                ) : (
                                                    value
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            }
        </section>
    );
};

export default Internship;
