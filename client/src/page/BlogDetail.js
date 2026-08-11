import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { ArrowLeft, ArrowRight, FileText } from 'react-bootstrap-icons';
import { Link, useParams } from 'react-router-dom';

import { useLoading } from '../context/LoadingContext';

import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();

  const { showLoading, hideLoading } = useLoading();

  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      showLoading();

      // Reset state sebelum request
      setApiData(null);
      setError(false);
      setNotFound(false);

      try {
        const apiUrl = process.env.REACT_APP_API_ROOT + 'blogs/' + id;

        const response = await axios.get(apiUrl);

        if (response.status === 200 && response?.data?.statusText === 'OK') {
          setApiData(response?.data?.data || null);
        }
      } catch (error) {
        console.error('Failed to fetch blog detail:', error);

        if (error?.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(true);
        }
      } finally {
        hideLoading();
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, showLoading, hideLoading]);

  /* =========================
     NOT FOUND
  ========================= */

  if (notFound) {
    return (
      <main className='blog-detail-page'>
        <section className='blog-detail-error-section'>
          <Container>
            <Row>
              <Col lg={7} className='mx-auto'>
                <div className='detail-error-card'>
                  <div className='detail-error-icon'>
                    <FileText size={32} />
                  </div>

                  <span className='section-label'>404</span>

                  <h1>Article not found</h1>

                  <p>The article you're looking for doesn't exist or may have been removed.</p>

                  <Button as={Link} to='/blog' className='detail-action-button'>
                    <ArrowLeft size={17} />
                    Back to Blog
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    );
  }

  /* =========================
     API ERROR
  ========================= */

  if (error) {
    return (
      <main className='blog-detail-page'>
        <section className='blog-detail-error-section'>
          <Container>
            <Row>
              <Col lg={7} className='mx-auto'>
                <div className='detail-error-card'>
                  <div className='detail-error-icon'>
                    <FileText size={32} />
                  </div>

                  <span className='section-label'>ERROR</span>

                  <h1>Unable to load article</h1>

                  <p>Something went wrong while retrieving this article. Please try again later.</p>

                  <Button as={Link} to='/blog' className='detail-action-button'>
                    <ArrowLeft size={17} />
                    Back to Blog
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    );
  }

  /* =========================
     WAITING FOR DATA
  ========================= */

  // Loading sudah ditangani oleh Global LoadingSpinner.
  // Jangan tampilkan spinner kedua di halaman ini.
  if (!apiData) {
    return null;
  }

  /* =========================
     ARTICLE DETAIL
  ========================= */

  return (
    <main className='blog-detail-page'>
      {/* Article Hero */}

      <section className='blog-detail-hero'>
        <Container>
          <Row>
            <Col lg={9} className='mx-auto'>
              <div className='detail-breadcrumb'>
                <Link to='/'>Home</Link>

                <ArrowRight size={14} />

                <Link to='/blog'>Blog</Link>

                <ArrowRight size={14} />

                <span>Article</span>
              </div>

              <div className='detail-category'>ARTICLE</div>

              <h1>{apiData.title}</h1>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Article Content */}

      <section className='blog-detail-content'>
        <Container>
          <Row>
            <Col lg={9} className='mx-auto'>
              <article className='article-content-card'>
                <div className='article-content-header'>
                  <div className='article-icon'>
                    <FileText size={28} />
                  </div>

                  <div>
                    <span>BLOG ARTICLE</span>

                    <small>Read and learn something new</small>
                  </div>
                </div>

                <div className='article-divider' />

                <div className='article-body'>{apiData.post}</div>
              </article>

              {/* Back button */}

              <div className='article-navigation'>
                <Link to='/blog' className='back-blog-link'>
                  <ArrowLeft size={17} />
                  Back to all articles
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default BlogDetail;
