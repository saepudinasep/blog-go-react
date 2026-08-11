import React, { useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { ArrowRight, CheckCircle, Envelope, GeoAlt, Telephone } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Hilangkan pesan sukses ketika user mulai mengedit kembali
    if (submitted) {
      setSubmitted(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    /*
     * Untuk sementara belum terhubung ke backend.
     *
     * Nanti di sini kita bisa menambahkan:
     *
     * await axios.post(
     *   process.env.REACT_APP_API_ROOT + 'contact',
     *   formData
     * );
     */

    console.log('Contact form:', formData);

    setSubmitted(true);

    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <main className='contact-page'>
      {/* =========================
          HERO
      ========================= */}

      <section className='contact-hero'>
        <Container>
          <Row>
            <Col lg={8} className='mx-auto text-center'>
              <div className='contact-breadcrumb'>
                <Link to='/'>Home</Link>

                <ArrowRight size={14} />

                <span>Contact</span>
              </div>

              <span className='section-label'>GET IN TOUCH</span>

              <h1>
                Let's start a<span> conversation.</span>
              </h1>

              <p>
                Have a question, idea, or just want to say hello? Feel free to send us a message.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* =========================
          CONTACT CONTENT
      ========================= */}

      <section className='contact-section'>
        <Container>
          <Row className='g-5'>
            {/* =========================
                CONTACT INFORMATION
            ========================= */}

            <Col lg={5}>
              <div className='contact-info'>
                <span className='section-label'>CONTACT INFORMATION</span>

                <h2>
                  We'd love to
                  <span> hear from you.</span>
                </h2>

                <p className='contact-intro'>
                  Whether you have a question about an article, want to discuss an idea, or simply
                  want to connect, don't hesitate to reach out.
                </p>

                {/* Email */}

                <div className='contact-info-item'>
                  <div className='contact-info-icon'>
                    <Envelope size={21} />
                  </div>

                  <div>
                    <span>Email</span>
                    <a href='mailto:saepudinasep2001@gmail.com'>saepudinasep2001@gmail.com</a>
                  </div>
                </div>

                {/* Phone */}

                <div className='contact-info-item'>
                  <div className='contact-info-icon'>
                    <Telephone size={21} />
                  </div>

                  <div>
                    <span>Phone</span>
                    <a href='tel:+6285721485664'>+62 857 2148 5664</a>
                  </div>
                </div>

                {/* Location */}

                <div className='contact-info-item'>
                  <div className='contact-info-icon'>
                    <GeoAlt size={21} />
                  </div>

                  <div>
                    <span>Location</span>
                    <p>Kabupaten Cirebon, Jawa Bara, Indonesia</p>
                  </div>
                </div>
              </div>

              {/* Small CTA */}

              <div className='contact-side-card'>
                <CheckCircle size={25} />

                <h3>Have an idea?</h3>

                <p>We're always interested in hearing new ideas, projects, and perspectives.</p>
              </div>
            </Col>

            {/* =========================
                CONTACT FORM
            ========================= */}

            <Col lg={7}>
              <div className='contact-form-card'>
                <div className='contact-form-header'>
                  <span className='section-label'>SEND A MESSAGE</span>

                  <h2>Tell us what's on your mind.</h2>

                  <p>Fill out the form below and we'll get back to you as soon as possible.</p>
                </div>

                {/* Success message */}

                {submitted && (
                  <Alert variant='success' className='contact-success-alert'>
                    <CheckCircle size={18} />

                    <div>
                      <strong>Message received!</strong>

                      <span>
                        Your message has been recorded locally. Backend integration will be added
                        later.
                      </span>
                    </div>
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row className='g-3'>
                    {/* Name */}

                    <Col md={6}>
                      <Form.Group controlId='contactName'>
                        <Form.Label>Name</Form.Label>

                        <Form.Control
                          type='text'
                          name='name'
                          placeholder='Your name'
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>

                    {/* Email */}

                    <Col md={6}>
                      <Form.Group controlId='contactEmail'>
                        <Form.Label>Email</Form.Label>

                        <Form.Control
                          type='email'
                          name='email'
                          placeholder='you@example.com'
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>

                    {/* Subject */}

                    <Col xs={12}>
                      <Form.Group controlId='contactSubject'>
                        <Form.Label>Subject</Form.Label>

                        <Form.Control
                          type='text'
                          name='subject'
                          placeholder='What would you like to talk about?'
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>

                    {/* Message */}

                    <Col xs={12}>
                      <Form.Group controlId='contactMessage'>
                        <Form.Label>Message</Form.Label>

                        <Form.Control
                          as='textarea'
                          rows={6}
                          name='message'
                          placeholder='Write your message here...'
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>

                    {/* Submit */}

                    <Col xs={12}>
                      <Button type='submit' className='contact-submit-button'>
                        Send Message
                        <ArrowRight size={18} />
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* =========================
          BOTTOM CTA
      ========================= */}

      <section className='contact-bottom'>
        <Container>
          <Row>
            <Col lg={8} className='mx-auto text-center'>
              <h2>Want to explore the blog first?</h2>

              <p>Discover our latest articles and learn something new today.</p>

              <Link to='/blog' className='contact-blog-button'>
                Explore Articles
                <ArrowRight size={18} />
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default Contact;
