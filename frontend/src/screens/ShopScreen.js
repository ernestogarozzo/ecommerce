import React from 'react'
import { Container } from 'react-bootstrap'

import Home from '../components/Home'
import LatestDeals from '../components/LatestDeals'
import MyCarousel from '../components/CardCarousel'


function ShopScreen() {  

  return (
    <div>
      <div className='c-card-carousel c-black'>
        <h2>Filtri</h2>

      </div>
      <LatestDeals></LatestDeals>   
    </div>
  )
}

export default ShopScreen
