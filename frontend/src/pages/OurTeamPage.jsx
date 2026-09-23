import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Linkedin, Twitter, Github, Mail } from 'lucide-react';
import { websiteApi } from '@/api/websiteApi';

const OurTeamPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const data = await websiteApi.getTeamMembers();
        setMembers(data.filter(m => m.status === 'published'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadTeam();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-on-surface-variant font-label">Loading team...</p>
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
            <Users className="w-4 h-4" />
            Our Team
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold leading-tight mb-6 text-on-surface">
            The People Behind OD AI HUB
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto font-body">
            A diverse team of educators, researchers, entrepreneurs, and technologists united by a passion for AI education.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
            <Users className="w-16 h-16 text-on-surface-variant/30 mx-auto mb-4" />
            <h3 className="font-headline text-xl font-semibold text-on-surface-variant mb-2">No Team Members Yet</h3>
            <p className="text-on-surface-variant/70">Team members will appear here once added in the Management Console.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
              <div key={member.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary-container flex items-center justify-center font-bold text-2xl md:text-3xl flex-shrink-0 overflow-hidden">
                    {member.photo_url ? (
                      <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-primary">{member.name?.charAt(0) || '?'}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-headline text-xl font-bold text-on-surface">{member.name}</h3>
                    <p className="text-primary font-medium">{member.role}</p>
                  </div>
                </div>

                {member.bio && (
                  <p className="text-on-surface-variant leading-relaxed mb-6">{member.bio}</p>
                )}

                <div className="flex items-center gap-4 pt-4 border-t border-outline-variant/20">
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-primary">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {member.twitter && (
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-blue-400">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {member.github && (
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-gray-400">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-red-400">
                      <Mail className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 p-8 rounded-3xl text-center" style={{ backgroundColor: '#0b5ed7' }}>
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-white mb-4">
            Join Our Team
          </h2>
          <p className="text-white/90 text-lg mb-6 max-w-xl mx-auto">
            We're always looking for passionate individuals to join our mission of democratizing AI education.
          </p>
          <Link to="/careers" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white bg-white/20 hover:bg-white/30 transition-colors">
            View Open Positions <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OurTeamPage;
