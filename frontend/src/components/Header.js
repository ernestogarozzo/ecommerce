import React from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'


function Header() {
  return (
    <div>
      <header>
        <Navbar bg="dark" variant='dark' expand="lg" collapseOnSelect>
          <Container>

            <LinkContainer to={'/'} >
              <Navbar.Brand >CSR Boutique</Navbar.Brand>
            </LinkContainer>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">

                <LinkContainer to="/cart">
                  <Nav.Link ><i className='fas fa-shopping-cart'></i>  Carrello</Nav.Link>
                </LinkContainer>

                <LinkContainer to="/login">
                  <Nav.Link ><i className='fas fa-user'></i>  Accedi</Nav.Link>
                </LinkContainer>
              </Nav>

            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </div>
  )
}

export default Header
