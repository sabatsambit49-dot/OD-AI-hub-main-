import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Lightbulb, Users, Globe, ArrowRight } from 'lucide-react';
import { websiteApi } from '@/api/websiteApi';

const AboutPage = () => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPage = async () => {
      try {
        const data = await websiteApi.getStaticPage('about');
        setPage(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPage();
  }, []);

  const renderBlocks = (blocks) => {
    if (!blocks || !Array.isArray(blocks)) return null;
    return blocks.map((block, index) => {
      switch (block.type) {
        case 'heading':
          return <h2 key={index} className="font-headline text-2xl font-bold text-on-surface mb-4">{block.content}</h2>;
        case 'paragraph':
          return <p key={index} className="text-on-surface-variant leading-relaxed mb-4 text-lg">{block.content}</p>;
        case 'image':
          return (
            <div key={index} className="mb-8">
              <img src={block.content} alt="" className="w-full max-w-3xl h-auto rounded-2xl shadow-lg mx-auto" />
            </div>
          );
        case 'list':
          return (
            <ul key={index} className="list-disc list-inside space-y-2 text-on-surface-variant mb-4">
              {block.content.split('\n').filter(Boolean).map((item, i) => (
                <li key={i} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          );
        default:
          return <p key={index} className="text-on-surface-variant leading-relaxed mb-4">{block.content}</p>;
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-on-surface-variant font-label">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-label mb-6">
            <Target className="w-4 h-4" />
            About Us
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold leading-tight mb-6 text-on-surface">
            About OD AI HUB
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto font-body">
            Empowering the next generation of AI innovators and technology leaders.
          </p>
        </div>

        {/* Content Blocks */}
        <div className="space-y-12">
          {page?.body_blocks && renderBlocks(page.body_blocks)}

          {/* Default content if no page data */}
          {!page && (
            <>
              <section>
                <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">Our Mission</h2>
                <p className="text-on-surface-variant leading-relaxed text-lg mb-4">
                  OD AI HUB is dedicated to democratizing access to cutting-edge AI education and technology resources.
                  We believe that the power of artificial intelligence should be accessible to everyone — students,
                  professionals, entrepreneurs, and institutions alike.
                </p>
                <p className="text-on-surface-variant leading-relaxed text-lg">
                  Through our comprehensive programs, industry partnerships, and innovation labs, we bridge the gap
                  between academic knowledge and real-world application, creating pathways for success in the AI-driven future.
                </p>
              </section>

              <section>
                <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">Our Pillars</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { icon: Lightbulb, title: 'Academy', desc: 'World-class AI and technology courses' },
                    { icon: Target, title: 'Innovation Lab', desc: 'Cutting-edge research and development' },
                    { icon: Users, title: 'Startup Ecosystem', desc: 'Incubation and acceleration programs' },
                    { icon: Globe, title: 'For Business', desc: 'Enterprise AI solutions and consulting' },
                    { icon: Users, title: 'For Institutions', desc: 'Academic partnerships and training' },
                    { icon: Target, title: 'Events', desc: 'Workshops, hackathons, and seminars' },
                  ].map((item, index) => (
                    <div key={index} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-headline text-xl font-bold text-on-surface mb-2">{item.title}</h3>
                      <p className="text-on-surface-variant">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: 'Innovation First', desc: 'We continuously push boundaries and explore new frontiers in AI technology.' },
                    { title: 'Accessibility', desc: 'We believe quality AI education should be available to everyone, everywhere.' },
                    { title: 'Excellence', desc: 'We maintain the highest standards in our programs, partnerships, and outcomes.' },
                  ].map((value, index) => (
                    <div key={index} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 text-center">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Target className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-headline text-xl font-bold text-on-surface mb-2">{value.title}</h3>
                      <p className="text-on-surface-variant">{value.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 rounded-3xl text-center" style={{ backgroundColor: '#0b5ed7' }}>
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Start Your AI Journey?
          </h2>
          <p className="text-white/90 text-lg mb-6 max-w-xl mx-auto">
            Join thousands of learners, innovators, and organizations building the future with OD AI HUB.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/course-matrix" className="px-8 py-3 rounded-xl font-semibold text-white bg-white/20 hover:bg-white/30 transition-colors">
              Explore Courses
            </Link>
            <Link to="/contact" className="px-8 py-3 rounded-xl font-semibold text-white bg-white/20 hover:bg-white/30 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
