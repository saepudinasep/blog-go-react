import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import {
  ArrowRight,
  CheckCircle,
  CodeSlash,
  Lightbulb,
  People,
  Rocket,
} from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

import './About.css';

const About = () => {
  const technologies = ['React', 'JavaScript', 'Go', 'Fiber', 'GORM', 'MySQL'];

  return (
    <main className='about-page'>
      {/* =========================
          HERO
      ========================= */}

      <section className='about-hero'>
        <Container>
          <Row>
            <Col lg={9} className='mx-auto text-center'>
              <div className='about-breadcrumb'>
                <Link to='/'>Home</Link>
                <ArrowRight size={14} />
                <span>About</span>
              </div>

              <span className='section-label'>ABOUT BLOGSPACE</span>

              <h1>
                Knowledge becomes
                <span> more valuable </span>
                when shared.
              </h1>

              <p>
                BlogSpace is a space for developers and technology enthusiasts to learn, explore
                ideas, and share knowledge through practical articles.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* =========================
          INTRODUCTION
      ========================= */}

      <section className='about-intro'>
        <Container>
          <Row className='align-items-center g-5'>
            <Col lg={6}>
              <span className='section-label'>OUR STORY</span>

              <h2>
                Built from a passion for
                <span> technology.</span>
              </h2>

              <p>
                Technology is constantly evolving. New frameworks, programming languages, tools, and
                approaches appear every day.
              </p>

              <p>
                BlogSpace was created as a place to document knowledge, experiences, and lessons
                learned while building software.
              </p>

              <p>
                Our goal is simple: make technical knowledge easier to understand and more useful in
                real-world projects.
              </p>
            </Col>

            <Col lg={6}>
              <div className='about-visual'>
                <div className='about-code-card'>
                  <div className='code-window-header'>
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className='code-content'>
                    <div>
                      <span className='code-keyword'>const</span>{' '}
                      <span className='code-variable'>learning</span> = {'{'}
                    </div>

                    <div className='code-indent'>
                      <span className='code-property'>curiosity</span>:{' '}
                      <span className='code-value'>true</span>,
                    </div>

                    <div className='code-indent'>
                      <span className='code-property'>practice</span>:{' '}
                      <span className='code-value'>true</span>,
                    </div>

                    <div className='code-indent'>
                      <span className='code-property'>sharing</span>:{' '}
                      <span className='code-value'>true</span>
                    </div>

                    <div>{'}'}</div>

                    <div className='code-comment'>Keep learning. Keep building.</div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* =========================
          VALUES
      ========================= */}

      <section className='about-values'>
        <Container>
          <div className='about-section-heading text-center'>
            <span className='section-label'>OUR VALUES</span>

            <h2>What we believe in.</h2>

            <p>Three simple principles guide everything we share.</p>
          </div>

          <Row className='g-4'>
            <Col md={4}>
              <div className='value-card'>
                <div className='value-icon'>
                  <Lightbulb size={25} />
                </div>

                <h3>Keep Learning</h3>

                <p>
                  Stay curious and continuously improve your knowledge through learning and
                  experimentation.
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className='value-card'>
                <div className='value-icon'>
                  <CodeSlash size={25} />
                </div>

                <h3>Build Real Things</h3>

                <p>Turn concepts into real projects and learn through practical implementation.</p>
              </div>
            </Col>

            <Col md={4}>
              <div className='value-card'>
                <div className='value-icon'>
                  <People size={25} />
                </div>

                <h3>Share Knowledge</h3>

                <p>
                  Knowledge becomes more meaningful when it can help someone else solve a problem.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* =========================
          TECHNOLOGIES
      ========================= */}

      <section className='about-tech'>
        <Container>
          <Row className='align-items-center g-5'>
            <Col lg={6}>
              <span className='section-label'>TECHNOLOGY</span>

              <h2>
                Built with modern
                <span> technologies.</span>
              </h2>

              <p>
                BlogSpace itself is built using technologies that are commonly used in modern web
                application development.
              </p>

              <div className='technology-list'>
                {technologies.map((technology) => (
                  <div key={technology} className='technology-item'>
                    <CheckCircle size={17} />
                    <span>{technology}</span>
                  </div>
                ))}
              </div>
            </Col>

            <Col lg={6}>
              <div className='tech-highlight'>
                <Rocket size={35} />

                <h3>Learn by building.</h3>

                <p>
                  The best way to understand technology is to experiment with it, build something,
                  and learn from the process.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* =========================
          CTA
      ========================= */}

      <section className='about-cta'>
        <Container>
          <Row>
            <Col lg={8} className='mx-auto text-center'>
              <span className='section-label'>START EXPLORING</span>

              <h2>
                There is always something
                <span> new to learn.</span>
              </h2>

              <p>Explore our articles and discover useful ideas for your next project.</p>

              <Link to='/blog' className='about-cta-button'>
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

export default About;
