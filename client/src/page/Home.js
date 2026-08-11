import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Badge, Button, Col, Container, Row } from 'react-bootstrap';
import { ArrowRight, CodeSlash, FileText, Lightbulb, People } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

import BlogCard from '../components/BlogCard';
import { useLoading } from '../context/LoadingContext';

import './Home.css';

const Home = () => {
  const [apiData, setApiData] = useState([]);
  const [error, setError] = useState(false);

  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    const fetchData = async () => {
      console.time('fetch blogs');
      showLoading();

      // Reset state sebelum request
      setError(false);
      setApiData([]);

      try {
        const apiUrl = process.env.REACT_APP_API_ROOT + 'blogs';

        const response = await axios.get(apiUrl);

        if (response.status === 200 && response?.data?.statusText === 'OK') {
          const records = response?.data?.blog_records || [];

          setApiData(records);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error('Failed to fetch blog records:', error);

        setError(true);
      } finally {
        console.timeEnd('fetch blogs');
        hideLoading();
      }
    };

    fetchData();
  }, [showLoading, hideLoading]);

  // Ambil maksimal 3 artikel terbaru
  const latestBlogs = apiData.slice(0, 3);

  return (
    <main className='home-page'>
      {/* =========================
          HERO
      ========================= */}

      <section className='landing-hero'>
        <Container>
          <Row className='align-items-center'>
            <Col lg={8} className='mx-auto text-center'>
              <Badge bg='light' text='dark' className='hero-badge'>
                <CodeSlash size={15} className='me-2' />
                Go Fiber + React
              </Badge>

              <h1 className='landing-title'>
                Learn.
                <span> Build.</span>
                <br />
                Share.
              </h1>

              <p className='landing-description'>
                Explore articles about web development, programming, technology, and software
                engineering.
              </p>

              <div className='hero-buttons'>
                <Button as={Link} to='/blog' className='primary-button'>
                  Explore Articles
                  <ArrowRight size={18} />
                </Button>

                <Button as={Link} to='/about' variant='outline-light' className='secondary-button'>
                  About Us
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* =========================
          INTRODUCTION
      ========================= */}

      <section className='intro-section'>
        <Container>
          <Row className='align-items-center g-5'>
            <Col lg={6}>
              <span className='section-label'>ABOUT BLOGSPACE</span>

              <h2 className='section-title'>
                A place to learn and
                <span> grow together.</span>
              </h2>
            </Col>

            <Col lg={6}>
              <p className='intro-text'>
                BlogSpace is a place where developers can discover useful knowledge about
                programming, web development, backend, frontend, and modern technologies.
              </p>

              <p className='intro-text'>
                We believe that learning becomes more meaningful when knowledge is shared.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* =========================
          FEATURES
      ========================= */}

      <section className='features-section'>
        <Container>
          <div className='section-heading text-center'>
            <span className='section-label'>WHY BLOGSPACE</span>

            <h2 className='section-title'>Built for curious minds.</h2>
          </div>

          <Row className='g-4'>
            <Col md={4}>
              <div className='feature-card'>
                <div className='feature-icon'>
                  <Lightbulb size={25} />
                </div>

                <h3>Learn</h3>

                <p>Discover practical tutorials, programming concepts, and development tips.</p>
              </div>
            </Col>

            <Col md={4}>
              <div className='feature-card'>
                <div className='feature-icon'>
                  <CodeSlash size={25} />
                </div>

                <h3>Build</h3>

                <p>Turn knowledge into real projects and improve your development skills.</p>
              </div>
            </Col>

            <Col md={4}>
              <div className='feature-card'>
                <div className='feature-icon'>
                  <People size={25} />
                </div>

                <h3>Share</h3>

                <p>Share ideas, experiences, and knowledge with other developers.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* =========================
          LATEST ARTICLES
      ========================= */}

      <section className='articles-section'>
        <Container>
          <div className='section-heading articles-heading'>
            <div>
              <span className='section-label'>FROM THE BLOG</span>

              <h2 className='section-title'>Latest Articles</h2>
            </div>

            <Button as={Link} to='/blog' variant='link' className='view-all-button'>
              View all articles
              <ArrowRight size={17} />
            </Button>
          </div>

          {/* =========================
              API ERROR
          ========================= */}

          {error ? (
            <Row>
              <Col lg={7} className='mx-auto text-center py-5'>
                <div className='empty-blog-state'>
                  <FileText size={40} className='empty-blog-icon' />

                  <h4>Unable to load articles</h4>

                  <p>Something went wrong while retrieving the articles. Please try again later.</p>
                </div>
              </Col>
            </Row>
          ) : latestBlogs.length > 0 ? (
            /* =========================
                ARTICLES
            ========================= */

            <Row className='g-4'>
              {latestBlogs.map((record) => (
                <Col key={record.id} lg={4} md={6}>
                  <BlogCard record={record} />
                </Col>
              ))}
            </Row>
          ) : (
            /* =========================
                EMPTY STATE
            ========================= */

            <Row>
              <Col lg={7} className='mx-auto text-center py-5'>
                <div className='empty-blog-state'>
                  <FileText size={40} className='empty-blog-icon' />

                  <h4>No articles available</h4>

                  <p>There are currently no articles to display.</p>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </section>

      {/* =========================
          CTA
      ========================= */}

      <section className='cta-section'>
        <Container>
          <Row>
            <Col lg={8} className='mx-auto text-center'>
              <FileText size={35} className='cta-icon' />

              <h2>Ready to learn something new?</h2>

              <p>Explore our collection of articles and discover something useful today.</p>

              <Button as={Link} to='/blog' className='cta-button'>
                Explore the Blog
                <ArrowRight size={18} />
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default Home;
