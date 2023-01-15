import React from 'react'
import { Navbar, Nav, Container, Row, NavDrop, NavDropdown } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import { logout } from '../actions/userActions'


function Header() {
  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin
  const dispatch = useDispatch()

  const logoutHandler = () => {
    dispatch(logout())
  }

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

                {userInfo ? (
                  <NavDropdown title={userInfo.name} id='username'>
                    <LinkContainer to='/profile'>
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <LinkContainer to="/login">
                    <Nav.Link ><i className='fas fa-user'></i>Accedi</Nav.Link>
                  </LinkContainer>

                )}
              </Nav>



            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </div>
  )
}

export default Header
