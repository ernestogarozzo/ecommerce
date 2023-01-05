import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate, createSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Button, Form, ListGroupItem } from 'react-bootstrap'
import Rating from '../components/Rating'
import { listProductDetails } from '../actions/productActions'


function ProductScreen({ }) {
  const [qty, setQty] = useState(1);
  const params = useParams();
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const productDetails = useSelector(state => state.productDetails);
  const { product } = productDetails;


  useEffect(() => {
    dispatch(listProductDetails(`${params.id}`))

  }, [dispatch, params])



  const addToCartEventHandler = ((id, qty) => {
    navigate(`/cart/${id}`, { state: qty })

  })

  return (
    <div>
      <Link to='/' className='btn btn-light my-3'>Indietro</Link>
      <h1>{product.name}</h1>
      <Row>
        <Col md={6}>
          <Image src={product.image} />
        </Col>

        <Col md={3}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>

            <ListGroup.Item>
              <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} />
            </ListGroup.Item>

            <ListGroup.Item>
              <h5>{product.description}</h5>
            </ListGroup.Item>

          </ListGroup>
        </Col>

        <Col md={3}>
          <ListGroup variant='flush'>
            <ListGroupItem>
              <Row>
                <Col>Price:</Col>
                <Col>${product.price}</Col>
              </Row>
            </ListGroupItem>

            <ListGroupItem>
              <Row>
                <Col>Status:</Col>
                <Col>{product.countInStock > 1 ? 'Disponibile' : 'Esaurito'}</Col>
              </Row>
            </ListGroupItem>

            {product.countInStock > 0 && (
              <ListGroup.Item>
                <Row>
                  <Col>Qty</Col>
                  <Col xs='auto' className='my-1'>
                    <Form.Control
                      as="select"
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                    >
                      {

                        [...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))
                      }

                    </Form.Control>
                  </Col>
                </Row>
              </ListGroup.Item>
            )}

            <ListGroupItem>
              <Row>
                <Button className='btn-block'
                  onClick={() => addToCartEventHandler(`${params.id}`, qty)}
                  type='button' disabled={
                    product.countInStock === 0}>Aggiungi al carrello</Button>
              </Row>
            </ListGroupItem>


          </ListGroup>
        </Col>
      </Row>
    </div>

  )
}

export default ProductScreen
