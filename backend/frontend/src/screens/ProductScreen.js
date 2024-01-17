import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate, createSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Button, Form, ListGroupItem, Card } from 'react-bootstrap'
import Rating from '../components/Rating'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { createProductReview, listProductDetails } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'


function ProductScreen({ }) {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const params = useParams();
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const productDetails = useSelector(state => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin

  const productReviewCreate = useSelector(state => state.productReviewCreate)
  const { loading: loadingProductReview, error: errorProductReview, success: successProductReview, } = productReviewCreate


  useEffect(() => {
    if (successProductReview) {
      setRating(0)
      setComment('')
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
    }


    dispatch(listProductDetails(`${params.id}`))
  }, [dispatch, params, successProductReview])


  const addToCartEventHandler = (id, qty) => {
    navigate(`/cart/${id}`, { state: qty })
  }


  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createProductReview(
      params.id, { rating, comment }
    ))
  }






  return (
    <div>
      <Link to='/' className='btn btn-light my-3'>Indietro</Link>
      <h1>{product.name}</h1>
      <Row>
        <Col md={6} sm={4}>
          <div>
            <Image src={product.image} />
          </div>
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
          <Card>
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
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <h4>Reviews</h4>
          {product.reviews.length === 0 && <Message variant='info'>No Reviews</Message>}

          <ListGroup variant='flush'>
            {product.reviews.map((review) => (
              <ListGroup.Item key={review._id}>
                <strong>{review.name}</strong>
                <Rating value={review.rating} color='#f8e825' />
                <p>{review.createdAt.substring(0, 10)}</p>
                <p>{review.comment}</p>
              </ListGroup.Item>
            ))}

            <ListGroup.Item>
              <h4>Write a review</h4>

              {loadingProductReview && <Loader />}
              {successProductReview && <Message variant='success'>Review Submitted</Message>}
              {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}

              {userInfo ? (
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId='rating'>
                    <Form.Label>Rating</Form.Label>
                    <Form.Control
                      as='select'
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value=''>Select...</option>
                      <option value='1'>1 - Poor</option>
                      <option value='2'>2 - Fair</option>
                      <option value='3'>3 - Good</option>
                      <option value='4'>4 - Very Good</option>
                      <option value='5'>5 - Excellent</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId='comment'>
                    <Form.Label>Review</Form.Label>
                    <Form.Control
                      as='textarea'
                      row='5'
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  <Button
                    disabled={loadingProductReview}
                    type='submit'
                    variant='primary'
                  >
                    Submit
                  </Button>

                </Form>
              ) : (
                <Message variant='info'>Please <Link to='/login'>login</Link> to write a review</Message>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </div>

  )
}

export default ProductScreen
