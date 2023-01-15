import React from 'react'
import { Container } from 'react-bootstrap'

import Home from '../components/Home'
import LatestDeals from '../components/LatestDeals'
import CardCarousel from '../components/CardCarousel'


function HomeScreen() {  
  const sections = [
    {
      title: "categoriaA",
      color: "#000000"
    },
    {
      title: "categoriaB",
      color: "#121212"
    },
    {
      title: "categoriaC",
      color: "#7F00FF"
    },
    {
      title: "categoriaD",
      color: "#000000"
    }
  ];

  return (
    <div>

      <Home></Home>

      {sections.map((section,index) => (  
        <CardCarousel key={index} section = {section}></CardCarousel>                                       
      ))}      

    </div>
  )
}

export default HomeScreen
