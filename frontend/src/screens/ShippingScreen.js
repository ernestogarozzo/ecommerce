import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector, } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress } from '../actions/cartActions'

function ShippingScreen() {

    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')
    const [postalCode, setPostalCode] = useState('')

    const location = useNavigate()
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({ address, city, postalCode, country }))
        navigate('/payment')
    }

    return (
        <FormContainer>


            <CheckoutSteps step1 step2 />

            <h1>Shipping</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='address'>
                    <Form.Label>Address </Form.Label>
                    <Form.Control
                        required
                        type='text'
                        placeholder='Enter Address'
                        value={address ? address : ''}
                        onChange={(e) => setAddress(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='City'>
                    <Form.Label>City </Form.Label>
                    <Form.Control
                        required
                        type='text'
                        placeholder='Enter City'
                        value={city ? city : ''}
                        onChange={(e) => setCity(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='postalCode'>
                    <Form.Label>postalCode </Form.Label>
                    <Form.Control
                        required
                        type='text'
                        placeholder='Enter postalCode'
                        value={postalCode ? postalCode : ''}
                        onChange={(e) => setPostalCode(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='Country'>
                    <Form.Label>Country </Form.Label>
                    <Form.Control
                        required
                        type='text'
                        placeholder='Enter Country'
                        value={country ? country : ''}
                        onChange={(e) => setCountry(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary'>
                    Prosegui
                </Button>

            </Form>

        </FormContainer>
    )
}

export default ShippingScreen
