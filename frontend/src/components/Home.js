import React, { useEffect } from 'react';

import { listProducts } from '../actions/productActions'
import { useDispatch, useSelector } from 'react-redux'

import { Row, Col } from 'react-bootstrap'
import Carousel from 'react-bootstrap/Carousel';

import Product from './Product';

function Home() {

  const dispatch = useDispatch()
  const productList = useSelector(state => state.productList)
  const { error, loading, products } = productList

  useEffect(() => {
    dispatch(listProducts())

  }, [])


  return (

    <Carousel fade>
      {products.map((product, index) => (          
          
        <Carousel.Item key={product._id}>
            <Col className="c-home">
              <p className='c-title mx-0'>Best products</p>
                <Col sm={12} md={{ span: 3, offset: 7 }} lg={4} xl={3}>
                  <Product  product={product} />                             
                </Col>              
            </Col>
        </Carousel.Item>

      ))}  
    </Carousel>
    
    
  )
}

export default Home
