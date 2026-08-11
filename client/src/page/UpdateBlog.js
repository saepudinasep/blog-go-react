import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { ArrowLeft, Pencil } from 'react-bootstrap-icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useLoading } from '../context/LoadingContext';
import { showError, showSuccess } from '../utils/alert';

import './UpdateBlog.css';

const UpdateBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { showLoading, hideLoading } = useLoading();

  const [submitting, setSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      post: '',
    },
  });

  /*
   * =========================
   * GET BLOG DETAIL
   * =========================
   */

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) {
        setNotFound(true);
        return;
      }

      showLoading();

      try {
        const apiUrl = process.env.REACT_APP_API_ROOT + 'blogs/' + id;

        const response = await axios.get(apiUrl);

        if (response.status === 200 && response?.data?.statusText === 'OK') {
          const record = response?.data?.data;

          if (!record) {
            setNotFound(true);
            return;
          }

          /*
           * Masukkan data dari API
           * ke React Hook Form.
           */
          reset({
            title: record.title || '',
            post: record.post || '',
          });

          return;
        }

        setNotFound(true);
      } catch (error) {
        console.error('Failed to fetch blog:', error);

        if (error?.response?.status === 404) {
          setNotFound(true);
        } else {
          await showError(
            'Failed to Load Article',
            error?.response?.data?.msg || 'Something went wrong while retrieving the article.',
          );
        }
      } finally {
        hideLoading();
      }
    };

    fetchBlog();
  }, [id, reset, showLoading, hideLoading]);

  /*
   * =========================
   * UPDATE BLOG
   * =========================
   */

  const onSubmit = async (data) => {
    setSubmitting(true);
    showLoading();

    try {
      const apiUrl = process.env.REACT_APP_API_ROOT + 'blogs/' + id;

      /*
       * Hanya kirim field yang
       * memang boleh di-update.
       */
      const payload = {
        title: data.title,
        post: data.post,
      };

      const response = await axios.put(apiUrl, payload);

      /*
       * =========================
       * SUCCESS
       * =========================
       */

      if (response.status === 200 && response?.data?.statusText === 'OK') {
        // Matikan loading SEBELUM SweetAlert
        hideLoading();
        setSubmitting(false);

        await showSuccess('Article Updated!', 'Your article has been successfully updated.');

        navigate('/blog');

        return;
      }

      /*
       * =========================
       * API ERROR
       * =========================
       */

      const message = response?.data?.msg || 'Failed to update article.';

      hideLoading();
      setSubmitting(false);

      await showError('Failed to Update Article', message);
    } catch (error) {
      console.error('Failed to update blog:', error);

      const message =
        error?.response?.data?.msg || 'Something went wrong while updating the article.';

      hideLoading();
      setSubmitting(false);

      await showError('Failed to Update Article', message);
    }
  };

  /*
   * =========================
   * NOT FOUND
   * =========================
   */

  if (notFound) {
    return (
      <main className='update-blog-page'>
        <section className='update-blog-error-section'>
          <Container>
            <Row>
              <Col lg={7} className='mx-auto'>
                <div className='update-blog-error-card'>
                  <div className='update-blog-error-icon'>
                    <Pencil size={30} />
                  </div>

                  <span className='section-label'>404</span>

                  <h1>Article not found</h1>

                  <p>The article you're trying to edit doesn't exist or may have been removed.</p>

                  <Button as={Link} to='/blog' className='update-action-button'>
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

  /*
   * =========================
   * FORM
   * =========================
   */

  return (
    <main className='update-blog-page'>
      {/* =========================
          HEADER
      ========================= */}

      <section className='update-blog-hero'>
        <Container>
          <Row>
            <Col lg={8} className='mx-auto'>
              <div className='update-blog-breadcrumb'>
                <Link to='/'>Home</Link>

                <span>/</span>

                <Link to='/blog'>Blog</Link>

                <span>/</span>

                <span>Edit</span>
              </div>

              <span className='section-label'>EDIT ARTICLE</span>

              <h1>
                Update your
                <span> article.</span>
              </h1>

              <p>Make changes to your article and keep your content up to date.</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* =========================
          FORM
      ========================= */}

      <section className='update-blog-section'>
        <Container>
          <Row>
            <Col lg={8} className='mx-auto'>
              <div className='update-blog-card'>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  {/* TITLE */}

                  <Form.Group className='mb-4' controlId='blogTitle'>
                    <Form.Label>Article Title</Form.Label>

                    <Form.Control
                      type='text'
                      placeholder='Enter article title...'
                      className={errors.title ? 'is-invalid' : ''}
                      {...register('title', {
                        required: 'Article title is required.',

                        minLength: {
                          value: 5,
                          message: 'Title must contain at least 5 characters.',
                        },

                        maxLength: {
                          value: 150,
                          message: 'Title must not exceed 150 characters.',
                        },
                      })}
                    />

                    {errors.title && <div className='invalid-feedback'>{errors.title.message}</div>}
                  </Form.Group>

                  {/* CONTENT */}

                  <Form.Group className='mb-4' controlId='blogPost'>
                    <Form.Label>Article Content</Form.Label>

                    <Form.Control
                      as='textarea'
                      rows={12}
                      placeholder='Write your article here...'
                      className={errors.post ? 'is-invalid' : ''}
                      {...register('post', {
                        required: 'Article content is required.',

                        minLength: {
                          value: 20,
                          message: 'Article content must contain at least 20 characters.',
                        },
                      })}
                    />

                    {errors.post && <div className='invalid-feedback'>{errors.post.message}</div>}
                  </Form.Group>

                  {/* ACTION */}

                  <div className='update-blog-actions'>
                    <Button
                      as={Link}
                      to={`/blog`}
                      variant='outline-secondary'
                      className='cancel-button'
                      disabled={submitting}
                    >
                      <ArrowLeft size={17} />
                      Cancel
                    </Button>

                    <Button type='submit' className='update-button' disabled={submitting}>
                      <Pencil size={17} />

                      {submitting ? 'Updating...' : 'Update Article'}
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default UpdateBlog;
