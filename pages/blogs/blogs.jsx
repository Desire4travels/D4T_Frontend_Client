import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import axios from 'axios';

const API_BASE_URL = "https://desire4travels-1.onrender.com/blogs";
const API_FEEDBACK_URL = "https://desire4travels-1.onrender.com/blog-feedback";

export async function getServerSideProps() {
  try {
    const response = await axios.get(API_BASE_URL);
    const data = response.data;

    const blogsWithAbsoluteUrls = data.map(blog => ({
      ...blog,
      image: blog.image && (blog.image.startsWith('http') ? blog.image : `${API_BASE_URL.replace('/blogs', '')}${blog.image}`)
    }));

    return {
      props: {
        initialBlogs: blogsWithAbsoluteUrls
      }
    };
  } catch (error) {
    return {
      props: {
        initialBlogs: [],
        error: error.response?.data?.message || error.message || 'Failed to fetch blogs'
      }
    };
  }
}

const BlogList = ({ initialBlogs, error: initialError }) => {
  const [blogs] = useState(initialBlogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(6);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    number: '',
    feedback: '',
    yourStory: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const filteredBlogs = useMemo(() => {
    let result = blogs;

    if (selectedCategory !== 'all') {
      result = result.filter(blog => blog.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(blog =>
        blog.title.toLowerCase().includes(term) ||
        blog.author.toLowerCase().includes(term) ||
        blog.excerpt.toLowerCase().includes(term)
      );
    }

    return result;
  }, [blogs, selectedCategory, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredBlogs]);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await axios.post(API_FEEDBACK_URL, formData);
      setSubmitted(true);
    } catch (err) {
      setFormError('Something went wrong. Please try again.');
    }
  };

  const categories = ['all', ...new Set(blogs.map(blog => blog.category.toLowerCase()))];

  if (initialError) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <p>Error: {initialError}</p>
        <button onClick={() => window.location.reload()} className="retry-button" aria-label="Retry loading blogs">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="blog-list-container">
      <header className="blog-hero">
        <div className="hero-content">
          <h1>Desire4Travels Stories</h1>
          <p>Discover inspiring travel stories, expert tips, and breathtaking destinations from around the globe.</p>
          <button className="btn-primary share" onClick={() => setIsModalOpen(true)}>
            Share Your Story
          </button>
        </div>
      </header>

      <div className="blog-content-container">
        <div className="search-filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="clear-search"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <div className="category-filter">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
            <div className="select-arrow">▼</div>
          </div>
        </div>

        <div className="blog-grid">
          {currentBlogs.length > 0 ? (
            currentBlogs.map((blog, index) => (
              <BlogCard key={blog.id} blog={blog} index={index} />
            ))
          ) : (
            <div className="no-results">
              <img src="/images/no-results.svg" alt="No results" className="no-results-img" />
              <h3>No matching posts found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-button"
              aria-label="Previous page"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                aria-label={`Go to page ${number}`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-button"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div className='sticky-buttons-container'>
        <a href="tel:+91 79770 22583" className="sticky-button" target="_blank" rel="noopener noreferrer">
          Call
        </a>
        <a href="https://wa.me/1234567890" className="sticky-button" target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)} aria-label="Close modal">×</button>
            <h2 className="modal-title">Share Your Story</h2>

            {submitted ? (
              <div className="success-box">
                <svg className="checkmark" viewBox="0 0 52 52">
                  <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                  <path className="checkmark-check" fill="none" d="M14 27l8 8 16-16" />
                </svg>
                <p className="success-message">Thank you for your story!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="modal-form">
                <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
                <input type="tel" name="number" placeholder="Phone Number" value={formData.number} onChange={handleChange} required />
                <input type="text" name="feedback" placeholder="Short Feedback" value={formData.feedback} onChange={handleChange} required />
                <textarea name="yourStory" placeholder="Tell us your story..." rows="5" value={formData.yourStory} onChange={handleChange} required></textarea>
                <button type="submit" className="submit-button" aria-label="Submit feedback">Submit</button>
                {formError && <p className="error-message">{formError}</p>}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const BlogCard = ({ blog, index }) => {
  return (
    <div
      className="blog-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <Link href={blog.url} className="blog-link">
        <div className="blog-image-container">
          <img
            src={blog.image}
            alt={blog.alt ? blog.alt.replace(/<[^>]+>/g, '') : blog.title}
            className="blog-image"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-image.jpg';
            }}
          />
          <div className="image-overlay"></div>
          <span className="blog-category-badge">{blog.category}</span>
        </div>
        <div className="blog-content">
          <div className="blog-title">{blog.title}</div>
          <div className="blog-excerpt">{blog.excerpt}</div>
          <div className="blog-meta">
            <span className="blog-author">
              <svg className="author-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {blog.author}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogList;
