import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { ArrowRight, FileText } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import './BlogCard.css';

const BlogCard = ({ record }) => {
  return (
    <Card className='blog-card h-100'>
      {/* Article Header */}
      <div className='blog-card-image'>
        <span className='blog-card-icon'>
          <FileText size={32} />
        </span>
      </div>

      <Card.Body className='blog-card-body'>
        {/* Category */}
        <div className='blog-card-meta'>ARTICLE</div>

        {/* Title */}
        <Card.Title className='blog-card-title'>{record.title}</Card.Title>

        {/* Post */}
        <Card.Text className='blog-card-description'>{record.post}</Card.Text>

        {/* Read More */}
        <Button as={Link} to={`/blog/${record.id}`} variant='link' className='blog-card-link'>
          Read article
          <ArrowRight size={17} />
        </Button>
      </Card.Body>
    </Card>
  );
};

export default BlogCard;
