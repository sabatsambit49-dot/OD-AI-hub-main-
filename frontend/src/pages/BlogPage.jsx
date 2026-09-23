import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, ArrowRight, ExternalLink, PenTool } from 'lucide-react';
import { websiteApi } from '@/api/websiteApi';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await websiteApi.getBlogPosts({ status: 'published' });
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const pagePosts = posts.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handleBack = () => {
    setSelectedPost(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const readTime = (text) => {
    if (!text) return '1 min read';
    const wordsPerMinute = 200;
    const words = text.split(' ').length;
    return `${Math.max(1, Math.ceil(words / wordsPerMinute))} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-on-surface-variant font-label">Loading blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-label mb-6">
            <PenTool className="w-4 h-4" />
            Blog
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold leading-tight mb-6 text-on-surface">
            OD AI HUB Blog
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto font-body">
            Insights, tutorials, and stories from the frontlines of AI education and innovation.
          </p>
        </div>

        {selectedPost ? (
          /* Post Detail */
          <div className="max-w-3xl mx-auto animate-slide-up">
            <button
              onClick={handleBack}
              className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Blog
            </button>

            <article className="bg-surface-container-lowest rounded-3xl p-8 md:p-12 shadow-sm border border-outline-variant/30">
              <div className="mb-8">
                <div className="flex items-center gap-4 text-sm text-on-surface-variant mb-4">
                  <time dateTime={selectedPost.published_at}>{formatDate(selectedPost.published_at)}</time>
                  <span>·</span>
                  <span>{readTime(selectedPost.body)}</span>
                </div>
                <h1 className="font-headline text-3xl md:text-4xl font-bold text-on-surface leading-tight">{selectedPost.title}</h1>
              </div>

              {selectedPost.cover_image_url && (
                <div className="mb-8">
                  <img
                    src={selectedPost.cover_image_url}
                    alt={selectedPost.title}
                    className="w-full h-auto rounded-2xl shadow-lg"
                  />
                </div>
              )}

              <div className="prose prose-slate max-w-none">
                <div dangerouslySetInnerHTML={{ __html: selectedPost.body || selectedPost.excerpt }} />
              </div>

              <div className="mt-12 pt-8 border-t border-outline-variant/20">
                <Link to="/blog" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all" style={{ backgroundColor: '#0b5ed7' }}>
                  <ArrowLeft className="w-5 h-5" />
                  Back to Blog
                </Link>
              </div>
            </article>
          </div>
        ) : (
          /* Posts Grid */
          <div>
            {posts.length === 0 ? (
              <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
                <PenTool className="w-16 h-16 text-on-surface-variant/30 mx-auto mb-4" />
                <h3 className="font-headline text-xl font-semibold text-on-surface-variant mb-2">No Blog Posts Yet</h3>
                <p className="text-on-surface-variant/70">Check back soon for new articles!</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {pagePosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all flex flex-col h-full"
                    >
                      {post.cover_image_url && (
                        <div className="mb-4">
                          <img
                            src={post.cover_image_url}
                            alt={post.title}
                            className="w-full h-48 object-cover rounded-xl"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-on-surface-variant mb-3">
                        <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                        <span>·</span>
                        <span>{readTime(post.body)}</span>
                      </div>
                      <h3 className="font-headline text-xl font-bold text-on-surface mb-3 line-clamp-2">{post.title}</h3>
                      <p className="text-on-surface-variant leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#0b5ed7' }}>
                        Read More <ArrowRight className="w-4 h-4" />
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                      disabled={currentPage === 0}
                      className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <span className="text-on-surface-variant font-medium">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                      disabled={currentPage === totalPages - 1}
                      className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
