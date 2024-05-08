import React from 'react';
import AnimationWrapper from './Page-Animation';

function CertificatePopup({ certificateUrl, onClose }) {
    const isPdf = certificateUrl.toLowerCase().endsWith('.pdf');
    console.log(certificateUrl);

    return (
        <AnimationWrapper onClick={onClose} className="z-[50] h-screen fixed w-full inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="max-w-xl w-full bg-white p-6 rounded-lg shadow-lg required relative">
                <button onClick={onClose} className="absolute -top-4 p-2 px-3 z-[1000000]  bg-[#262847] -right-4 rounded-full text-white ">
                    <i className="fa-solid fa-xmark"></i>
                </button>
                <div className="w-full h-[88vh] overflow-hidden relative">
                    {isPdf ? (
                        <iframe src={certificateUrl} className="w-full h-[90vh] overflow-auto" frameBorder="0"></iframe>
                    ) : (
                        <img src={certificateUrl} className="w-full h-[90vh] object-contain" alt="Document" />
                    )}
                </div>
            </div>
        </AnimationWrapper>
    );
}

export default CertificatePopup;
