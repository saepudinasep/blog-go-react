import axios from 'axios';
import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { ArrowLeft, Image, Send } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useLoading } from '../context/LoadingContext';
import { showError, showSuccess } from '../utils/alert';

import './CreateBlog.css';

const CreateBlog = () => {
  const navigate = useNavigate();

  const { showLoading, hideLoading } = useLoading();

  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      post: '',
      image: null,
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    showLoading();

    try {
      const apiUrl = `${process.env.REACT_APP_API_ROOT}blogs`;

      /*
       * =========================
       * CREATE FORM DATA
       * =========================
       */

      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('post', data.post);

      // File input mengembalikan FileList
      if (data.image && data.image.length > 0) {
        formData.append('image', data.image[0]);
      }

      /*
       * =========================
       * SEND REQUEST
       * =========================
       */

      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      /*
       * =========================
       * SUCCESS
       * =========================
       */

      if (response.status === 201 && response?.data?.statusText === 'Created') {
        reset();

        hideLoading();
        setSubmitting(false);

        await showSuccess('Article Created!', 'Your article has been successfully published.');

        navigate('/blog');

        return;
      }

      /*
       * =========================
       * API ERROR
       * =========================
       */

      const message = response?.data?.msg || 'Failed to create article.';

      hideLoading();
      setSubmitting(false);

      await showError('Failed to Create Article', message);
    } catch (error) {
      console.error('Failed to create blog:', error);

      const message =
        error?.response?.data?.msg || 'Something went wrong while creating the article.';

      hideLoading();
      setSubmitting(false);

      await showError('Failed to Create Article', message);
    }
  };

  return (
    <main className='create-blog-page'>
      {/* =========================
          HEADER
      ========================= */}

      <section className='create-blog-hero'>
        <Container>
          <Row>
            <Col lg={8} className='mx-auto'>
              <div className='create-blog-breadcrumb'>
                <Link to='/'>Home</Link>

                <span>/</span>

                <Link to='/blog'>Blog</Link>

                <span>/</span>

                <span>Create</span>
              </div>

              <span className='section-label'>CREATE ARTICLE</span>

              <h1>
                Share your
                <span> knowledge.</span>
              </h1>

              <p>
                Write and publish an article to share your knowledge, ideas, and experience with
                other developers.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* =========================
          FORM
      ========================= */}

      <section className='create-blog-section'>
        <Container>
          <Row>
            <Col lg={8} className='mx-auto'>
              <div className='create-blog-card'>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  {/* =========================
                      TITLE
                  ========================= */}

                  <Form.Group className='mb-4' controlId='blogTitle'>
                    <Form.Label>Article Title</Form.Label>

                    <Form.Control
                      type='text'
                      placeholder='Enter article title...'
                      className={errors.title ? 'is-invalid' : ''}
                      disabled={submitting}
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

                  {/* =========================
                      CONTENT
                  ========================= */}

                  <Form.Group className='mb-4' controlId='blogPost'>
                    <Form.Label>Article Content</Form.Label>

                    <Form.Control
                      as='textarea'
                      rows={12}
                      placeholder='Write your article here...'
                      className={errors.post ? 'is-invalid' : ''}
                      disabled={submitting}
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

                  {/* =========================
                      IMAGE
                  ========================= */}

                  <Form.Group className='mb-4' controlId='blogImage'>
                    <Form.Label>
                      <Image size={17} className='me-2' />
                      Article Image
                    </Form.Label>

                    <Form.Control
                      type='file'
                      accept='image/jpeg,image/png,image/webp'
                      className={errors.image ? 'is-invalid' : ''}
                      disabled={submitting}
                      {...register('image', {
                        required: 'Article image is required.',
                        validate: {
                          fileType: (files) => {
                            if (!files || files.length === 0) {
                              return 'Article image is required.';
                            }

                            const file = files[0];

                            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

                            if (!allowedTypes.includes(file.type)) {
                              return 'Only JPG, PNG, and WebP images are allowed.';
                            }

                            return true;
                          },

                          fileSize: (files) => {
                            if (!files || files.length === 0) {
                              return true;
                            }

                            const file = files[0];

                            // Maksimal 2 MB
                            if (file.size > 2 * 1024 * 1024) {
                              return 'Image size must not exceed 2 MB.';
                            }

                            return true;
                          },
                        },
                      })}
                    />

                    {errors.image && <div className='invalid-feedback'>{errors.image.message}</div>}

                    <Form.Text className='text-muted'>
                      JPG, PNG, or WebP. Maximum file size 2 MB.
                    </Form.Text>
                  </Form.Group>

                  {/* =========================
                      ACTION
                  ========================= */}

                  <div className='create-blog-actions'>
                    <Button
                      as={Link}
                      to='/blog'
                      variant='outline-secondary'
                      className='cancel-button'
                      disabled={submitting}
                    >
                      <ArrowLeft size={17} />
                      Cancel
                    </Button>

                    <Button type='submit' className='publish-button' disabled={submitting}>
                      <Send size={17} />

                      {submitting ? 'Publishing...' : 'Publish Article'}
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

export default CreateBlog;
