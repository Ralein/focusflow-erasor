import React from 'react'

function Hero() {
  return (
    <section className="bg-black h-screen overflow-hidden flex flex-col justify-center items-center">
        <div className='flex items-baseline justify-center'>
        <h2 className='text-white border px-3 p-2 rounded-full text-center border-white'>See What's New | <span className='text-sky-300'>AI Diagram</span></h2>
        </div>
  <div className="mx-auto max-w-screen-xl px-4 py-8 lg:flex">
    <div className="mx-auto max-w-xl text-center">
      <h1 className="text-3xl text-sky-300 font-extrabold sm:text-5xl">
      Documents & diagrams
        <strong className="font-extrabold text-white sm:block"> 
        for engineering teams. </strong>
      </h1>

      <p className="mt-4 sm:text-xl/relaxed text-slate-200">
      All-in-one markdown editor, collaborative canvas, and diagram-as-code builder
      </p>

      
    </div>
  </div>
</section>
  )
}

export default Hero