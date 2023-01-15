import React, { useEffect } from 'react'

import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import ProductCard from './ProductCard'

import { Row, Col} from 'react-bootstrap'
import { listProducts } from '../actions/productActions'
import { useDispatch, useSelector } from 'react-redux'


function LatestDeals() {

  const dispatch = useDispatch()
  const productList = useSelector(state => state.productList)
  const { error, loading, products } = productList


  useEffect(() => {
    dispatch(listProducts())

  }, [])

  return (
    <div className="c-last-deals c-gray">
      <h1 className='c-sub-title text-white'>Ultimi prodotti</h1>
        {loading ? <Loader />
          : error ? <Message variant='danger'>{error}</Message>
            :
            <div>
              <Row>
                {products.map(product => (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                  </ Col>
                ))}
              </Row>
            </div>
        }

    </div>
  )
}

export default LatestDeals
