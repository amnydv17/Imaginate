import React from 'react'
import Header from '../componenets/Header'
import Steps from '../componenets/Steps'
import Description from '../componenets/Description'
import Testimonials from '../componenets/Testimonials'
import GenerateBtn from '../componenets/GenerateBtn'


const Home = () => {
  return (
    <div>
      <Header/>
      <Steps/>
      <Description/>
      <Testimonials/>
      <GenerateBtn/>
    </div>
  )
}

export default Home