import React from 'react'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

function CheckoutSteps({ step1, step2, step3, step4 }) {
    return (
        <Nav className='justify-content-center mb-4'>
            <Nav.Item>
                {step1 ? (
                    <LinkContainer to={'/login'}>
                        <Nav.Link>Accedi</Nav.Link>
                    </LinkContainer>)
                    : (<LinkContainer to={'/login'}>
                        <Nav.Link disabled>Accedi</Nav.Link>
                    </LinkContainer>)
                }
            </Nav.Item>

            <Nav.Item>
                {step2 ? (
                    <LinkContainer to={'/shipping'}>
                        <Nav.Link>Spedizione</Nav.Link>
                    </LinkContainer>)
                    : (<LinkContainer to={'/shipping'}>
                        <Nav.Link disabled>Spedizione</Nav.Link>
                    </LinkContainer>)
                }
            </Nav.Item>
            <Nav.Item>
                {step3 ? (
                    <LinkContainer to={'/payment'}>
                        <Nav.Link>Pagamento</Nav.Link>
                    </LinkContainer>)
                    : (<LinkContainer to={'/payment'}>
                        <Nav.Link disabled>Pagamento</Nav.Link>
                    </LinkContainer>)
                }
            </Nav.Item>
            <Nav.Item>
                {step4 ? (
                    <LinkContainer to={'/placeorder'}>
                        <Nav.Link>Conferma</Nav.Link>
                    </LinkContainer>)
                    : (<LinkContainer to={'/placeorder'}>
                        <Nav.Link disabled>Conferma</Nav.Link>
                    </LinkContainer>)
                }
            </Nav.Item>
        </Nav>
    )
}

export default CheckoutSteps
