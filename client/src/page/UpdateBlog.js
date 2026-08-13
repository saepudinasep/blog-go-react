import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { ArrowLeft, Image, Send, X } from 'react-bootstrap-icons';
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
  const [loadingData, setLoadingData] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  // Gambar lama dari database
  const [currentImage, setCurrentImage] = useState(null);

  // Preview gambar baru
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      post: '',
      image: null,
    },
  });

  const imageFile = watch('image');

  /*
   * =========================
   * GET BLOG DETAIL
   * =========================
   */

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) {
        setFetchError(true);
        setLoadingData(false);
        return;
      }

      showLoading();

      try {
        setFetchError(false);

        const apiUrl = `${process.env.REACT_APP_API_ROOT}blogs/${id}`;

        const response = await axios.get(apiUrl);

        if (response.status === 200 && response?.data?.statusText === 'OK') {
          const record = response?.data?.data;

          if (!record) {
            setFetchError(true);
            return;
          }

          /*
           * Isi form dengan data lama
           */

          reset({
            title: record.title || '',
            post: record.post || '',
            image: null,
          });

          /*
           * Simpan gambar lama
           */

          if (record.image) {
            setCurrentImage(record.image);
          } else {
            setCurrentImage(null);
          }

          setImagePreview(null);
        } else {
          setFetchError(true);
        }
      } catch (error) {
        console.error('Failed to fetch blog detail:', error);

        setFetchError(true);
      } finally {
        hideLoading();
        setLoadingData(false);
      }
    };

    fetchBlog();
  }, [id, reset, showLoading, hideLoading]);

  /*
   * =========================
   * IMAGE PREVIEW
   * =========================
   */

  useEffect(() => {
    if (!imageFile || imageFile.length === 0) {
      setImagePreview(null);
      return;
    }

    const file = imageFile[0];

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    /*
     * Invalid type
     */

    if (!allowedTypes.includes(file.type)) {
      setImagePreview(null);
      return;
    }

    /*
     * Invalid size
     */

    if (file.size > 2 * 1024 * 1024) {
      setImagePreview(null);
      return;
    }

    /*
     * File valid
     */

    clearErrors('image');

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [imageFile, clearErrors]);

  /*
   * =========================
   * REMOVE NEW IMAGE
   * =========================
   */

  const handleRemoveImage = () => {
    setValue('image', null, {
      shouldValidate: false,
    });

    setImagePreview(null);
    clearErrors('image');
  };

  /*
   * =========================
   * SUBMIT UPDATE
   * =========================
   */

  const onSubmit = async (data) => {
    setSubmitting(true);
    showLoading();

    try {
      const apiUrl = `${process.env.REACT_APP_API_ROOT}blogs/${id}`;

      /*
       * =========================
       * FORM DATA
       * =========================
       */

      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('post', data.post);

      /*
       * Hanya kirim image jika user
       * memilih gambar baru.
       *
       * Jika tidak:
       * gambar lama tetap digunakan
       */

      if (data.image && data.image.length > 0) {
        formData.append('image', data.image[0]);
      }

      /*
       * =========================
       * REQUEST
       * =========================
       */

      const response = await axios.put(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      /*
       * =========================
       * SUCCESS
       * =========================
       */

      if (response.status === 200 && response?.data?.statusText === 'OK') {
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
   * LOADING DATA
   * =========================
   */

  if (loadingData) {
    return (
      <main className='update-blog-page'>
        <section className='update-blog-loading'>
          <Container>
            <div className='update-loading-content'>
              <div className='update-spinner' />

              <p>Loading article...</p>
            </div>
          </Container>
        </section>
      </main>
    );
  }

  /*
   * =========================
   * FETCH ERROR
   * =========================
   */

  if (fetchError) {
    return (
      <main className='update-blog-page'>
        <section className='update-blog-error-section'>
          <Container>
            <Row>
              <Col lg={7} className='mx-auto'>
                <div className='update-error-card'>
                  <Image size={40} />

                  <span className='section-label'>ERROR</span>

                  <h1>Unable to load article</h1>

                  <p>
                    The article could not be retrieved. It may not exist or something went wrong.
                  </p>

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
   * IMAGE URL
   * =========================
   *
   * Misalnya database:
   *
   * uploads/blogs/abc.jpg
   *
   * API:
   * http://localhost:8080/
   *
   * Hasil:
   * http://localhost:8080/uploads/blogs/abc.jpg
   */

  const apiRoot = process.env.REACT_APP_API_ROOT || '';

  const imageUrl = currentImage
    ? `${apiRoot.replace(/\/$/, '')}/${currentImage.replace(/^\//, '')}`
    : null;

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

                <span>Update</span>
              </div>

              <span className='section-label'>UPDATE ARTICLE</span>

              <h1>
                Improve your
                <span> article.</span>
              </h1>

              <p>
                Update your article content, title, or image and keep your knowledge up to date.
              </p>
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
                  {/* =========================
                      TITLE
                  ========================= */}

                  <Form.Group className='mb-4' controlId='blogTitle'>
                    <Form.Label>Article Title</Form.Label>

                    <Form.Control
                      type='text'
                      placeholder='Enter article title...'
                      disabled={submitting}
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

                  {/* =========================
                      CONTENT
                  ========================= */}

                  <Form.Group className='mb-4' controlId='blogPost'>
                    <Form.Label>Article Content</Form.Label>

                    <Form.Control
                      as='textarea'
                      rows={12}
                      placeholder='Write your article here...'
                      disabled={submitting}
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
                      disabled={submitting}
                      className={errors.image ? 'is-invalid' : ''}
                      {...register('image', {
                        validate: {
                          fileType: (files) => {
                            if (!files || files.length === 0) {
                              return true;
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
                      Choose a new image only if you want to replace the current image.
                    </Form.Text>

                    {/* =========================
                        IMAGE DISPLAY
                    ========================= */}

                    {(imagePreview || imageUrl) && (
                      <div className='update-image-preview-wrapper'>
                        <div className='update-image-preview-header'>
                          <span>{imagePreview ? 'New Image Preview' : 'Current Image'}</span>

                          {imagePreview && (
                            <Button
                              type='button'
                              variant='link'
                              className='remove-image-button'
                              onClick={handleRemoveImage}
                              disabled={submitting}
                            >
                              <X size={18} />
                              Cancel New Image
                            </Button>
                          )}
                        </div>

                        <div className='update-image-preview'>
                          <img
                            src={imagePreview || imageUrl}
                            alt={imagePreview ? 'New article preview' : 'Current article'}
                          />
                        </div>
                      </div>
                    )}
                  </Form.Group>

                  {/* =========================
                      ACTION
                  ========================= */}

                  <div className='update-blog-actions'>
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

                    <Button type='submit' className='update-button' disabled={submitting}>
                      <Send size={17} />

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
