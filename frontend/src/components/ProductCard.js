import React from 'react'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import { Link } from 'react-router-dom'

function ProductCard({ product }) {
  return (    
    <Link to={`/product/${product._id}`}>
      <Card className="text-white border-0 rounded ratio ratio-1x1">        
        <Card.Img className="rounded" src={product.image}/>      

        <Card.ImgOverlay>
          <Card.Title as="div">
                  <strong>{product.name}</strong>
          </Card.Title>

          <Card.Text as="div">
              <div className="my-3">
                <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} />
              </div>
          </Card.Text>

          <Card.Text as="h3">
            ${product.price}
          </Card.Text>
        </Card.ImgOverlay>
      </Card>
    </Link>
  )
}

export default ProductCard


