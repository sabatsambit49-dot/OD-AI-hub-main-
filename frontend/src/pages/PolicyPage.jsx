import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, ArrowRight } from 'lucide-react';
import { websiteApi } from '@/api/websiteApi';

const PolicyPage = ({ slug, title, icon: Icon }) => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPage = async () => {
      try {
        const data = await websiteApi.getStaticPage(slug);
        setPage(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPage();
  }, [slug]);

  const renderBlocks = (blocks) => {
    if (!blocks || !Array.isArray(blocks)) return null;
    return blocks.map((block, index) => {
      switch (block.type) {
        case 'heading':
          return <h2 key={index} className="font-headline text-2xl font-bold text-on-surface mb-4 mt-8">{block.content}</h2>;
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
        <div className="mb-12">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-label mb-6">
            <Icon className="w-4 h-4" />
            {title}
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold leading-tight mb-6 text-on-surface">
            {title}
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl font-body">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none space-y-8">
          {page?.body_blocks && page.body_blocks.map((block, index) => {
            switch (block.type) {
              case 'heading':
                return <h2 key={index} className="font-headline text-2xl font-bold text-on-surface mb-4 mt-8">{block.content}</h2>;
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
          })}

          {/* Default content if no page data */}
          {!page && (
            <>
              <section>
                <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">Introduction</h2>
                <p className="text-on-surface-variant leading-relaxed text-lg mb-4">
                  This {title.toLowerCase()} governs your use of OD AI HUB's website, services, and programs.
                  By accessing or using our services, you agree to be bound by this {title.toLowerCase()}.
                </p>
                <p className="text-on-surface-variant leading-relaxed text-lg">
                  Please read this {title.toLowerCase()} carefully. If you do not agree with any part of it,
                  you may not access our services.
                </p>
              </section>

              <section>
                <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">Information We Collect</h2>
                <p className="text-on-surface-variant leading-relaxed text-lg mb-4">
                  We collect information you provide directly to us, such as when you register for courses,
                  submit enquiries, register for events, or contact us.
                </p>
                <h3 className="font-headline text-xl font-bold text-on-surface mb-3">Personal Information</h3>
                <ul className="list-disc list-inside space-y-2 text-on-surface-variant mb-4">
                  <li>Name, email address, phone number</li>
                  <li>Educational background and interests</li>
                  <li>Course preferences and enrollment history</li>
                  <li>Payment information (processed securely by third parties)</li>
                </ul>
              </section>

              <section>
                <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">How We Use Your Information</h2>
                <ul className="list-disc list-inside space-y-2 text-on-surface-variant mb-4">
                  <li>To provide and improve our courses and services</li>
                  <li>To communicate with you about your enrollments and enquiries</li>
                  <li>To send updates about new courses, events, and offerings</li>
                  <li>To process payments and issue certificates</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">Data Security</h2>
                <p className="text-on-surface-variant leading-relaxed text-lg mb-4">
                  We implement appropriate technical and organizational measures to protect your personal
                  information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <p className="text-on-surface-variant leading-relaxed text-lg">
                  However, no method of transmission over the Internet or electronic storage is 100% secure.
                  We cannot guarantee absolute security of your data.
                </p>
              </section>

              <section>
                <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">Your Rights</h2>
                <p className="text-on-surface-variant leading-relaxed text-lg mb-4">
                  Depending on your location, you may have the following rights regarding your personal data:
                </p>
                <ul className="list-disc list-inside space-y-2 text-on-surface-variant mb-4">
                  <li>Right to access your personal data</li>
                  <li>Right to rectify inaccurate data</li>
                  <li>Right to erasure (right to be forgotten)</li>
                  <li>Right to restrict processing</li>
                  <li>Right to data portability</li>
                  <li>Right to object to processing</li>
                </ul>
              </section>

              <section>
                <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">Contact Us</h2>
                <p className="text-on-surface-variant leading-relaxed text-lg mb-4">
                  If you have any questions about this {title.toLowerCase()}, please contact us:
                </p>
                <ul className="list-disc list-inside space-y-2 text-on-surface-variant mb-4">
                  <li>Email: privacy@odaihub.in</li>
                  <li>Phone: +91 98765 43210</li>
                  <li>Address: Bhubaneswar, Odisha, India</li>
                </ul>
              </section>
            </>
          )}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 p-8 rounded-3xl text-center" style={{ backgroundColor: '#0b5ed7' }}>
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-white mb-4">
            Have Questions About This {title}?
          </h2>
          <p className="text-white/90 text-lg mb-6 max-w-xl mx-auto">
            Our team is here to help. Reach out to us for any clarifications or concerns.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white bg-white/20 hover:bg-white/30 transition-colors">
            Contact Us <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
