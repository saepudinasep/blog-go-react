import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { ArrowRight, FileText, Pencil, Trash } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

import './BlogCard.css';

const BlogCard = ({ record, showActions = false, onDelete }) => {
  return (
    <Card className='blog-card h-100'>
      {/* =========================
          ARTICLE HEADER
      ========================= */}

      <div className='blog-card-image'>
        <span className='blog-card-icon'>
          <FileText size={32} />
        </span>
      </div>

      {/* =========================
          ARTICLE BODY
      ========================= */}

      <Card.Body className='blog-card-body d-flex flex-column'>
        {/* Category */}

        <div className='blog-card-meta'>ARTICLE</div>

        {/* Title */}

        <Card.Title className='blog-card-title'>{record.title}</Card.Title>

        {/* Post */}

        <Card.Text className='blog-card-description'>{record.post}</Card.Text>

        {/* Read More */}

        <div className='mt-auto'>
          <Button as={Link} to={`/blog/${record.id}`} variant='link' className='blog-card-link'>
            Read article
            <ArrowRight size={17} />
          </Button>

          {/* =========================
              ACTION BUTTONS
          ========================= */}

          {showActions && (
            <div className='blog-card-actions'>
              <Button as={Link} to={`/blog/edit/${record.id}`} className='edit-blog-button'>
                <Pencil size={16} />
                Edit
              </Button>

              <Button
                type='button'
                className='delete-blog-button'
                onClick={() => onDelete?.(record.id, record.title)}
              >
                <Trash size={16} />
                Delete
              </Button>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default BlogCard;
