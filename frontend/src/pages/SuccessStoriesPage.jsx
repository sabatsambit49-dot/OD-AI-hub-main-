import React, { useState, useEffect } from 'react';
import { Star, ArrowLeft, ExternalLink } from 'lucide-react';
import { websiteApi } from '@/api/websiteApi';

const SuccessStoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);
  const [activeCategory, setActiveCategory] = useState('student');

  const categories = [
    { id: 'student', label: 'Students', icon: <Star className="w-5 h-5" /> },
    { id: 'startup', label: 'Startups', icon: <Star className="w-5 h-5" /> },
    { id: 'business', label: 'Business', icon: <Star className="w-5 h-5" /> },
    { id: 'institution', label: 'Institutions', icon: <Star className="w-5 h-5" /> },
  ];

  const categoryColors = {
    student: 'bg-blue-500',
    startup: 'bg-purple-500',
    business: 'bg-green-500',
    institution: 'bg-orange-500',
  };

  useEffect(() => {
    const loadStories = async () => {
      try {
        const data = await websiteApi.getSuccessStories({ category: activeCategory });
        setStories(data.filter(s => s.is_published));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStories();
  }, [activeCategory]);

  const handleStoryClick = (story) => {
    setSelectedStory(story);
  };

  const handleBack = () => {
    setSelectedStory(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-on-surface-variant font-label">Loading stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-label mb-6">
            <Star className="w-4 h-4" />
            Success Stories
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold leading-tight mb-6 text-on-surface">
            Real Stories, Real Impact
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto mb-8 font-body">
            Discover how OD AI HUB has transformed careers, launched startups, and empowered organizations.
          </p>
        </div>

        {selectedStory ? (
          /* Story Detail */
          <div className="max-w-3xl mx-auto animate-slide-up">
            <button
              onClick={handleBack}
              className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Stories
            </button>

            <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-12 shadow-sm border border-outline-variant/30">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                  style={{ backgroundColor: categoryColors[selectedStory.category] }}
                >
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: categoryColors[selectedStory.category] }}>
                    {selectedStory.category.charAt(0).toUpperCase() + selectedStory.category.slice(1)}
                  </span>
                </div>
              </div>

              <h2 className="font-headline text-3xl font-bold text-on-surface mb-4">{selectedStory.name}</h2>
              {selectedStory.role_or_organization && (
                <p className="text-on-surface-variant text-lg mb-6">{selectedStory.role_or_organization}</p>
              )}

              {selectedStory.photo_url && (
                <div className="mb-8">
                  <img
                    src={selectedStory.photo_url}
                    alt={selectedStory.name}
                    className="w-full max-w-md h-auto rounded-2xl shadow-lg mx-auto"
                  />
                </div>
              )}

              <div className="prose prose-slate max-w-none mb-8">
                <blockquote className="text-2xl md:text-3xl font-medium text-on-surface border-l-4 pl-6 italic leading-relaxed" style={{ borderColor: categoryColors[selectedStory.category] }}>
                  "{selectedStory.quote}"
                </blockquote>
              </div>

              {selectedStory.outcome && (
                <div className="bg-primary/5 rounded-2xl p-6 border-l-4" style={{ borderColor: categoryColors[selectedStory.category] }}>
                  <h3 className="font-headline text-lg font-semibold text-primary mb-2">Key Outcome</h3>
                  <p className="text-on-surface">{selectedStory.outcome}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Stories Grid with Category Tabs */
          <div>
            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
                    activeCategory === cat.id
                      ? `text-white shadow-sm ${cat.id === 'student' ? 'bg-blue-500' : cat.id === 'startup' ? 'bg-purple-500' : cat.id === 'business' ? 'bg-green-500' : 'bg-orange-500'}`
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>

            {stories.length === 0 ? (
              <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
                <Star className="w-16 h-16 text-on-surface-variant/30 mx-auto mb-4" />
                <h3 className="font-headline text-xl font-semibold text-on-surface-variant mb-2">No Stories Yet</h3>
                <p className="text-on-surface-variant/70">Be the first to share a success story in this category!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story) => (
                  <div
                    key={story.id}
                    onClick={() => handleStoryClick(story)}
                    className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: categoryColors[story.category] }} />
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-headline text-xl font-bold text-on-surface">{story.name}</h3>
                      <span className="px-2 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: categoryColors[story.category] }}>
                        {story.category.charAt(0).toUpperCase() + story.category.slice(1)}
                      </span>
                    </div>

                    {story.role_or_organization && (
                      <p className="text-xs text-on-surface-variant mb-4">{story.role_or_organization}</p>
                    )}

                    <blockquote className="text-on-surface-variant leading-relaxed mb-6 italic line-clamp-4">
                      "{story.quote}"
                    </blockquote>

                    {story.outcome && (
                      <div className="pt-4 border-t border-outline-variant/20">
                        <p className="text-xs text-primary font-medium">{story.outcome}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessStoriesPage;
