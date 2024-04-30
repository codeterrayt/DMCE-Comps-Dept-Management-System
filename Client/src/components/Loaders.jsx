import React from 'react'

const Loaders = ({message}) => {
  return (
   <div className='w-full h-screen flex items-center justify-center flex-col gap-4'>
     <div className='loader '></div>
     <p className='text-center mx-auto font-bold text-xl'>{message ? message : "Loading"}</p>
   </div>
  )
}

export default Loaders