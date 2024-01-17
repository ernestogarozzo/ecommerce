import React, { useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector, } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'

import { savePaymentMethod } from '../actions/cartActions'


function PaymentScreen() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [paymentMethod, setPaymentMethod] = useState('PayPal')

    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    if (!shippingAddress.address) {
        navigate('/shipping')
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')
    }


    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />

            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>Metodo di pagamento</Form.Label>
                    <Col>
                        <br></br>
                        <Form.Check type='radio' id='paypal' name='paymentMethod'
                            checked
                            label='PayPal or Credit Card'
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                        </Form.Check>
                    </Col>
                </Form.Group>
                <br></br>
                <Button type='submit' variant='primary'>Continua</Button>
            </Form>

        </FormContainer >
    )
}

export default PaymentScreen
