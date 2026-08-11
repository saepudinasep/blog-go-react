import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { ArrowRight, FileText } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

import BlogCard from '../components/BlogCard';

import './BlogList.css';

const BlogList = () => {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_ROOT + 'blogs';

        const response = await axios.get(apiUrl);

        if (response.status === 200 && response?.data?.statusText === 'OK') {
          setApiData(response?.data?.blog_records || []);
        }
      } catch (error) {
        console.error('Failed to fetch blog records:', error);

        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className='blog-list-page'>
      {/* =========================
          PAGE HEADER
      ========================= */}

      <section className='blog-list-hero'>
        <Container>
          <Row>
            <Col lg={8}>
              <div className='blog-breadcrumb'>
                <Link to='/'>Home</Link>

                <ArrowRight size={14} />

                <span>Blog</span>
              </div>

              <span className='section-label'>OUR BLOG</span>

              <h1>
                Explore our
                <span> articles.</span>
              </h1>

              <p>
                Discover articles, tutorials, ideas, and insights about web development,
                programming, and technology.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* =========================
          ARTICLES
      ========================= */}

      <section className='blog-list-section'>
        <Container>
          <div className='blog-list-heading'>
            <div>
              <span className='section-label'>ALL ARTICLES</span>

              <h2>Latest posts</h2>
            </div>

            {!loading && !error && (
              <span className='article-count'>
                {apiData.length} {apiData.length === 1 ? 'Article' : 'Articles'}
              </span>
            )}
          </div>

          {/* Loading */}

          {loading && (
            <Row>
              <Col className='text-center py-5'>
                <div className='blog-loading'>
                  <div className='loading-spinner' />

                  <p>Loading articles...</p>
                </div>
              </Col>
            </Row>
          )}

          {/* Error */}

          {!loading && error && (
            <Row>
              <Col lg={7} className='mx-auto'>
                <div className='blog-error'>
                  <FileText size={35} />

                  <h3>Unable to load articles</h3>

                  <p>Something went wrong while retrieving the articles. Please try again later.</p>
                </div>
              </Col>
            </Row>
          )}

          {/* Empty */}

          {!loading && !error && apiData.length === 0 && (
            <Row>
              <Col lg={7} className='mx-auto'>
                <div className='blog-empty'>
                  <FileText size={40} />

                  <h3>No articles yet</h3>

                  <p>There are currently no articles available. Check back again later.</p>

                  <Link to='/' className='back-home-button'>
                    Back to Home
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </Col>
            </Row>
          )}

          {/* Articles */}

          {!loading && !error && apiData.length > 0 && (
            <Row className='g-4'>
              {apiData.map((record) => (
                <Col key={record.id} xl={4} lg={4} md={6}>
                  <BlogCard record={record} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </main>
  );
};

export default BlogList;
