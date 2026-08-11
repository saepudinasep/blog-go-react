import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { Github, Instagram, Linkedin, ArrowUp } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='main-footer'>
      <Container>
        <Row className='g-5'>
          {/* Brand */}
          <Col lg={5} md={6}>
            <Link to='/' className='footer-brand'>
              <span className='footer-brand-mark'>B</span>
              <span>BlogSpace</span>
            </Link>

            <p className='footer-description'>
              A modern space for learning, sharing knowledge, and exploring ideas about web
              development, programming, and technology.
            </p>

            <div className='footer-socials'>
              <a href='https://github.com' target='_blank' rel='noreferrer' aria-label='GitHub'>
                <Github size={18} />
              </a>

              <a href='https://linkedin.com' target='_blank' rel='noreferrer' aria-label='LinkedIn'>
                <Linkedin size={18} />
              </a>

              <a
                href='https://instagram.com'
                target='_blank'
                rel='noreferrer'
                aria-label='Instagram'
              >
                <Instagram size={18} />
              </a>
            </div>
          </Col>

          {/* Navigation */}
          <Col lg={3} md={3} xs={6}>
            <h5 className='footer-heading'>Navigation</h5>

            <div className='footer-links'>
              <Link to='/'>Home</Link>
              <Link to='/blog'>Blog</Link>
              <Link to='/about'>About</Link>
              <Link to='/contact'>Contact</Link>
            </div>
          </Col>

          {/* Explore */}
          <Col lg={4} md={3} xs={6}>
            <h5 className='footer-heading'>Explore</h5>

            <div className='footer-links'>
              <Link to='/blog'>Latest Articles</Link>
              <Link to='/about'>About BlogSpace</Link>
              <Link to='/contact'>Get in Touch</Link>
            </div>
          </Col>
        </Row>

        {/* Bottom */}
        <div className='footer-bottom'>
          <div>© {currentYear} BlogSpace. All rights reserved.</div>

          <button
            type='button'
            className='back-to-top'
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              })
            }
            aria-label='Back to top'
          >
            Back to top
            <ArrowUp size={16} />
          </button>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
