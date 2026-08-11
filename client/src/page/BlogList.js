import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { ArrowRight, FileText, Plus } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import BlogCard from '../components/BlogCard';
import { useLoading } from '../context/LoadingContext';
import { showError, showSuccess } from '../utils/alert';

import './BlogList.css';

const BlogList = () => {
  const [apiData, setApiData] = useState([]);
  const [error, setError] = useState(false);

  const { showLoading, hideLoading } = useLoading();

  /*
   * =========================
   * GET BLOGS
   * =========================
   */

  const fetchBlogs = useCallback(async () => {
    try {
      setError(false);

      const apiUrl = `${process.env.REACT_APP_API_ROOT}blogs`;

      const response = await axios.get(apiUrl);

      if (response.status === 200 && response?.data?.statusText === 'OK') {
        setApiData(response?.data?.blog_records || []);
        return true;
      }

      setError(true);
      return false;
    } catch (error) {
      console.error('Failed to fetch blog records:', error);

      setError(true);
      return false;
    }
  }, []);

  /*
   * =========================
   * INITIAL LOAD
   * =========================
   */

  useEffect(() => {
    const loadBlogs = async () => {
      showLoading();

      try {
        await fetchBlogs();
      } finally {
        hideLoading();
      }
    };

    loadBlogs();
  }, [fetchBlogs, showLoading, hideLoading]);

  /*
   * =========================
   * RETRY
   * =========================
   */

  const handleRetry = async () => {
    showLoading();

    try {
      await fetchBlogs();
    } finally {
      hideLoading();
    }
  };

  /*
   * =========================
   * DELETE BLOG
   * =========================
   */

  const handleDelete = async (id, title) => {
    // Konfirmasi terlebih dahulu
    const confirmed = await Swal.fire({
      title: 'Delete Article?',
      text: `Are you sure you want to delete "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true,
    });

    if (!confirmed.isConfirmed) {
      return;
    }

    /*
     * Tampilkan global loading hanya ketika
     * request DELETE sedang berlangsung.
     */
    showLoading();

    try {
      const apiUrl = `${process.env.REACT_APP_API_ROOT}blogs/${id}`;

      const response = await axios.delete(apiUrl);

      if (response.status === 200 && response?.data?.statusText === 'OK') {
        /*
         * Matikan loading SEBELUM SweetAlert.
         * Agar SweetAlert tidak tertutup oleh global loading overlay.
         */
        hideLoading();

        await showSuccess('Article Deleted!', 'The article has been successfully deleted.');

        /*
         * Ambil ulang data setelah user menutup
         * SweetAlert success.
         */
        showLoading();

        try {
          await fetchBlogs();
        } finally {
          hideLoading();
        }

        return;
      }

      const message = response?.data?.msg || 'Failed to delete article.';

      hideLoading();

      await showError('Delete Failed', message);
    } catch (error) {
      console.error('Failed to delete blog:', error);

      const message =
        error?.response?.data?.msg || 'Something went wrong while deleting the article.';

      hideLoading();

      await showError('Delete Failed', message);
    }
  };

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
          {/* HEADER */}

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

              <Button as={Link} to='/blog/create' className='create-blog-button'>
                <Plus size={18} />
                Create Article
              </Button>
            </div>
          </div>

          {/* =========================
              ERROR
          ========================= */}

          {error && (
            <Row>
              <Col lg={7} className='mx-auto'>
                <div className='blog-error'>
                  <FileText size={35} />

                  <h3>Unable to load articles</h3>

                  <p>Something went wrong while retrieving the articles. Please try again later.</p>

                  <Button className='create-blog-button' onClick={handleRetry}>
                    Try Again
                  </Button>
                </div>
              </Col>
            </Row>
          )}

          {/* =========================
              EMPTY
          ========================= */}

          {!error && apiData.length === 0 && (
            <Row>
              <Col lg={7} className='mx-auto'>
                <div className='blog-empty'>
                  <FileText size={40} />

                  <h3>No articles yet</h3>

                  <p>There are currently no articles available. Create your first article.</p>

                  <Button as={Link} to='/blog/create' className='create-blog-button'>
                    <Plus size={17} />
                    Create Article
                  </Button>
                </div>
              </Col>
            </Row>
          )}

          {/* =========================
              ARTICLES
          ========================= */}

          {!error && apiData.length > 0 && (
            <Row className='g-4'>
              {apiData.map((record) => (
                <Col key={record.id} xl={4} lg={4} md={6}>
                  <BlogCard record={record} showActions={true} onDelete={handleDelete} />
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
