import React from 'react';
import { Container, Nav, Navbar as BootstrapNavbar } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <BootstrapNavbar expand='lg' variant='dark' className='main-navbar'>
      <Container>
        {/* Brand */}
        <BootstrapNavbar.Brand as={Link} to='/' className='brand-logo'>
          <span className='brand-mark'>B</span>
          <span>BlogSpace</span>
        </BootstrapNavbar.Brand>

        {/* Hamburger */}
        <BootstrapNavbar.Toggle aria-controls='main-navbar-nav' />

        {/* Navigation */}
        <BootstrapNavbar.Collapse id='main-navbar-nav'>
          <Nav className='ms-auto align-items-lg-center'>
            <Nav.Link as={NavLink} to='/' end className='nav-item-link'>
              Home
            </Nav.Link>

            <Nav.Link as={NavLink} to='/blog' className='nav-item-link'>
              Blog
            </Nav.Link>

            <Nav.Link as={NavLink} to='/about' className='nav-item-link'>
              About
            </Nav.Link>

            <Nav.Link as={NavLink} to='/contact' className='nav-item-link'>
              Contact
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
