import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { ArrowRight, FileText } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

import BlogCard from '../components/BlogCard';
import { useLoading } from '../context/LoadingContext';

import './BlogList.css';

const BlogList = () => {
  const [apiData, setApiData] = useState([]);
  const [error, setError] = useState(false);

  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    const fetchData = async () => {
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
        hideLoading();
      }
    };

    fetchData();
  }, [showLoading, hideLoading]);

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
          {/* Heading */}

          <div className='blog-list-heading'>
            <div>
              <span className='section-label'>ALL ARTICLES</span>

              <h2>Latest posts</h2>
            </div>

            <div className='blog-list-actions'>
              {!error && (
                <span className='article-count'>
                  {apiData.length} {apiData.length === 1 ? 'Article' : 'Articles'}
                </span>
              )}

              <Link to='/create-blog' className='create-blog-button'>
                Create Post
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          {/* =========================
              API ERROR
          ========================= */}

          {error ? (
            <Row>
              <Col lg={7} className='mx-auto'>
                <div className='blog-error'>
                  <FileText size={35} />

                  <h3>Unable to load articles</h3>

                  <p>Something went wrong while retrieving the articles. Please try again later.</p>

                  <Link to='/' className='back-home-button'>
                    Back to Home
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </Col>
            </Row>
          ) : apiData.length === 0 ? (
            /* =========================
                EMPTY
            ========================= */

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
          ) : (
            /* =========================
                ARTICLES
            ========================= */

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
