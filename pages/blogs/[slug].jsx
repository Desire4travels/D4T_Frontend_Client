import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

let DOMPurify;

if (typeof window !== 'undefined') {
  DOMPurify = require('dompurify');
}

import { FiArrowLeft, FiCalendar, FiUser, FiChevronRight } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const API_BASE_URL = "https://desire4travels-1.onrender.com/blogs";

export async function getServerSideProps(context) {
  const { slug } = context.params;

  try {
    const [blogResponse, similarResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/${slug}`),
      axios.get(API_BASE_URL),
    ]);

    const blog = blogResponse.data;

    if (!blog) {
      return {
        notFound: true,
      };
    }

    const similarBlogs = similarResponse.data
      .filter(b => b.category === blog.category && String(b.id) !== String(blog.id))
      .slice(0, 3)
      .map(blog => ({
        ...blog,
        image: blog.image?.startsWith('http') ? blog.image : `${API_BASE_URL.replace('/blogs', '')}${blog.image}`,
      }));

    return {
      props: {
        blog,
        similarBlogs,
      },
    };
  } catch (error) {
    return {
      props: {
        error: error.response?.data?.message || error.message || 'Failed to load blog',
      },
    };
  }
}

const BlogPost = ({ blog, similarBlogs = [], error }) => {
  const [tripFormData, setTripFormData] = useState({
    destination: '',
    startDate: null,
    noofdays: '',
    travelers: '',
    preference: '',
    mobileNumber: ''
  });

  if (error) {
    return (
      <div className="error-container">
        <Head>
          <title>Error | Desire4Travel</title>
        </Head>
        <div className="error-icon">!</div>
        <h3>Error Loading Content</h3>
        <p>{error}</p>
        <Link href="/blogs" className="error-back-btn">
          <FiArrowLeft /> Back to Blogs
        </Link>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="not-found-container">
        <Head>
          <title>Not Found | Desire4Travel</title>
        </Head>
        <h3>Blog Post Not Found</h3>
        <p>The requested blog post doesn't exist or may have been removed.</p>
        <Link href="/blogs" className="not-found-btn">
          <FiArrowLeft /> Browse All Blogs
        </Link>
      </div>
    );
  }

  const sanitizedContent = DOMPurify ? DOMPurify.sanitize(blog.content) : blog.content;

  const absoluteImageUrl = blog.image?.startsWith('http') ? blog.image : `${API_BASE_URL.replace('/blogs', '')}${blog.image}`;

  const handleTripChange = (e) => {
    const { name, value } = e.target;
    setTripFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setTripFormData(prev => ({ ...prev, startDate: date }));
  };

  const handleTripSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://desire4travels-1.onrender.com/api/plan-trip', tripFormData);
      alert('Trip planned successfully! We will contact you shortly.');
      setTripFormData({
        destination: '',
        startDate: null,
        noofdays: '',
        travelers: '',
        preference: '',
        mobileNumber: ''
      });
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || 'Failed to submit trip plan'}`);
    }
  };

  return (
    <div className="blog-page-wrapper">
      <Head>
        <title>{blog.title} | Desire4Travels</title>
        <meta name="description" content={blog.excerpt?.replace(/<[^>]+>/g, '') || 'Travel blog post'} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt?.replace(/<[^>]+>/g, '') || 'Travel blog post'} />
      </Head>

      <div className="main-content-area">
        <div className="blog-post-container">
          <article className="blog-post">
            <header className="blog-post-header">
              <h1>{blog.title}</h1>
              <div className="blog-meta">
                <span><FiUser /> {blog.author}</span>
                <span><FiCalendar /> {new Date(blog.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </header>

            <div className="blog-image-box">
              <img
                src={absoluteImageUrl}
                alt={blog.alt || blog.title}
                className="blog-featured-image"
                loading="eager"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
            </div>

            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </article>
        </div>

        <div className="side-suggestions right">
          <div className="trip-box">
            <h3>Plan Your Dream Trip</h3>
            <form onSubmit={handleTripSubmit}>
              <input
                type="text"
                name="destination"
                placeholder="Where to?"
                value={tripFormData.destination}
                onChange={handleTripChange}
                required
              />

              <DatePicker
                selected={tripFormData.startDate}
                onChange={handleDateChange}
                placeholderText="Travel Dates"
                minDate={new Date()}
                className="date-picker"
                required
              />

              <input
                type="number"
                name="noofdays"
                placeholder="Duration (days)"
                min="1"
                value={tripFormData.noofdays}
                onChange={handleTripChange}
                required
              />

              <input
                type="number"
                name="travelers"
                placeholder="Travelers"
                min="1"
                value={tripFormData.travelers}
                onChange={handleTripChange}
                required
              />

              <input
                type="tel"
                name="mobileNumber"
                placeholder="Your Phone Number"
                pattern="[0-9]{10}"
                value={tripFormData.mobileNumber}
                onChange={handleTripChange}
                required
              />

              <button type="submit" className="submit-btn">
                Get Custom Plan
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="bottom-suggestions">
        <h3 className="suggestions-title">You Might Also Like</h3>
        <div className="suggestions-grid">
          {similarBlogs.map(b => (
            <Link key={b.id} href={`/blogs/${b.id}`}>
              <div className="suggestion-card">
                <div className="suggestion-image-container">
                  <img
                    src={b.image}
                    alt={b.alt || b.title}
                    loading="lazy"
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>
                <div className="suggestion-info">
                  <h4>{b.title}</h4>
                  <p>{b.excerpt?.slice(0, 60)}...</p>
                  <span className="read-more">
                    Read More <FiChevronRight />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mobile-suggestions">
        <h3>Related Articles</h3>
        <div className="mobile-suggestions-grid">
          {similarBlogs.map(b => (
            <Link key={b.id} href={`/blogs/${b.id}`}>
              <div className="mobile-suggestion-card">
                <div className="mobile-suggestion-image">
                  <img
                    src={b.image}
                    alt={b.alt || b.title}
                    loading="lazy"
                  />
                </div>
                <div className="mobile-suggestion-info">
                  <h4>{b.title}</h4>
                  <p>{b.excerpt?.slice(0, 80)}...</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="sticky-contact-buttons">
        <a href="tel:+1234567890" className="sticky-button call">
          <span></span> Call Us
        </a>
        <a
          href="https://wa.me/1234567890"
          className="sticky-button whatsapp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span></span> WhatsApp
        </a>
      </div>
    </div>
  );
};

export default BlogPost;
