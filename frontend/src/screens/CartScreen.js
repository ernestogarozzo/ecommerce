import React, { useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { Card, Row, Col, Image, ListGroup, Button, Form, ListGroupItem } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';

import { addToCart, removeFromCart } from '../actions/cartActions';
import { Message } from '../components/Message';

export default function CartScreen() {
    const params = useParams();
    const location = useLocation()
    const productId = params.id
    const qty = location.state ? Number(location.state) : 1

    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)
    const { cartItems } = cart
    console.log('cartItem:', cartItems)

    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, qty))
        }
    }, [dispatch, productId, qty])

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }

    return (
        <Row>
            <Col md={8}>
                <h1>Carrello</h1>
                {cartItems.length === 0 ? (
                    <Message variant='info'>
                        Non hai prodotti nel carrello <Link to='/'>Indietro</Link>
                    </Message>
                ) : (
                    <ListGroup variant='flush'>
                        {cartItems.map(item => (
                            <ListGroup.Item key={item.product}>
                                <Row>
                                    <Col md={2}>
                                        <Image src={item.image} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </Col>

                                    <Col md={2}>
                                        ${item.price}
                                    </Col>

                                    <Col md={3}>
                                        <Form.Control
                                            as="select"
                                            value={item.qty}
                                            onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}
                                        >
                                            {

                                                [...Array(item.countInStock).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))
                                            }

                                        </Form.Control>
                                    </Col>

                                    <Col md={1}>
                                        <Button
                                            type='button'
                                            variant='light'

                                        >
                                            <i className='fas fa-trash' onClick={() => removeFromCartHandler(item.product)}></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>

            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Subtotale ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</h2>
                            ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                        </ListGroup.Item>
                    </ListGroup>

                    <ListGroup.Item>
                        <Button
                            type='button'
                            className='btn-block'
                            disabled={cartItems.length === 0}

                        >
                            Completa l'acquisto
                        </Button>
                    </ListGroup.Item>


                </Card>
            </Col>
        </Row>
    )

}