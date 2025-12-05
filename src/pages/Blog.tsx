import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Post {
  id: string;
  title: string;
  content: string;
  published: string;
  labels?: string[];
  url: string;
}

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchQuery, selectedCategory]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      const fetchedPosts = data.items || [];
      setPosts(fetchedPosts);
      const allLabels = fetchedPosts.flatMap((post: Post) => post.labels || []);
      setCategories([...new Set(allLabels)]);
    } catch (err) {
      setError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(post => post.labels?.includes(selectedCategory));
    }
    setFilteredPosts(filtered);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  if (loading) return <div className="text-center py-8">Loading blog posts...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Zwanski Tech Blog</h1>

      {/* Carousel for featured posts */}
      {filteredPosts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Featured Posts</h2>
          <Slider {...sliderSettings}>
            {filteredPosts.slice(0, 5).map((post) => (
              <div key={post.id} className="px-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: post.content.substring(0, 200) + '...' }}></p>
                  <a href={post.url} className="text-blue-500 hover:underline">Read more</a>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
            <p className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: post.content.substring(0, 150) + '...' }}></p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{new Date(post.published).toLocaleDateString()}</span>
              <a href={post.url} className="text-blue-500 hover:underline">Read more</a>
            </div>
            {post.labels && (
              <div className="mt-2">
                {post.labels.map((label) => (
                  <span key={label} className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2">
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && !loading && (
        <div className="text-center py-8">No posts found matching your criteria.</div>
      )}
    </div>
  );
};

export default Blog;
