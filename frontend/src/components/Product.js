import React from 'react'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import { Link } from 'react-router-dom'

function Product({ product }) {
  return (
    <Card className="my-3 p-1 rounded c-gray text-white">
      <Link to={`/product/${product._id}`}>
        <Card.Img className="border-0 rounded" src={product.image}  />
      </Link>

      <Card.Body className="p-1 text-white">
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div">
            <strong className='text-white'>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <div className="my-3">
            <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} />
          </div>
        </Card.Text>


        <Card.Text as="h3">
          ${product.price}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product
