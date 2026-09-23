import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Target, Lightbulb, Users, Globe, Star, Settings, BarChart3, School, GraduationCap, Briefcase, Calendar, ClipboardList, Shield, MapPin, Building2, Award, Layers, Mail, GitBranch, Layout, Calendar as CalendarIcon } from 'lucide-react';
import HierarchicalSearchCard from '../components/search/HierarchicalSearchCard';
import DirectSearchBar from '../components/search/DirectSearchBar';
import LinkInfoSection from '../components/features/LinkInfoSection';
import BerhampurUniversitySection from '../components/features/BerhampurUniversitySection';

const HomePage = () => {
  const navigate = useNavigate();

  const handleHierarchicalSearch = (params) => {
    const searchParams = new URLSearchParams();
    if (params.state_id) searchParams.append('state_id', params.state_id);
    if (params.district_id) searchParams.append('district_id', params.district_id);
    if (params.type_id) searchParams.append('type_id', params.type_id);
    navigate(`/search?${searchParams.toString()}`);
  };

  const handleDirectSearch = (term) => {
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const quickActions = [
    { icon: School, label: 'Institutions', path: '/management?tab=institutions', color: 'bg-blue-500', desc: 'Manage institutions hierarchy' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics', color: 'bg-green-500', desc: 'View analytics & reports' },
    { icon: Layout, label: 'Course Matrix', path: '/course-matrix', color: 'bg-purple-500', desc: 'College course finder' },
    { icon: Calendar, label: 'Events', path: '/management?tab=events', color: 'bg-orange-500', desc: 'Manage events & news' },
    { icon: ClipboardList, label: 'Problem Statements', path: '/problem-statements', color: 'bg-pink-500', desc: 'Manage problem statements' },
    { icon: Settings, label: 'Management Console', path: '/management', color: 'bg-indigo-500', desc: 'Full management console' },
  ];

  const recentStats = [
    { label: 'Institutions', value: '1,247', change: '+12%', trend: 'up' },
    { label: 'Courses', value: '3,892', change: '+8%', trend: 'up' },
    { label: 'Enquiries', value: '342', change: '-5%', trend: 'down' },
    { label: 'Active Users', value: '2,156', change: '+15%', trend: 'up' },
  ];

  const quickLinks = [
    { label: 'Institutions', path: '/management?tab=institutions', icon: School },
    { label: 'College Courses', path: '/management?tab=courses', icon: BookOpen },
    { label: 'Branches', path: '/management?tab=branches', icon: GitBranch },
    { label: 'Academic Years', path: '/management?tab=years', icon: GraduationCap },
    { label: 'States', path: '/management?tab=states', icon: Globe },
    { label: 'Cities', path: '/management?tab=cities', icon: MapPin },
    { label: 'Institution Types', path: '/management?tab=types', icon: Building2 },
    { label: 'Academy Courses', path: '/management?tab=academy_courses', icon: Award },
    { label: 'Academy Pillars', path: '/management?tab=academy_categories', icon: Layers },
    { label: 'Learner Enquiries', path: '/management?tab=enquiries', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-8 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="material-symbols-outlined text-base">admin_panel_settings</span>
              OD AI HUB Management Portal
            </div>
            <h1 className="font-headline text-4xl md:text-6xl font-bold leading-tight mb-6 text-on-surface">
              Management <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Manage institutions, courses, analytics, and the external OD AI HUB website from a single unified console.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto">
              {recentStats.map((stat, i) => (
                <div key={i} className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30">
                  <div className="text-2xl md:text-3xl font-bold text-on-surface">{stat.value}</div>
                  <div className="text-sm text-on-surface-variant flex items-center justify-center gap-1">
                    <span className={`font-semibold ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change}
                    </span>
                    <span>vs last month</span>
                  </div>
                  <div className="text-xs text-on-surface-variant mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/management" className="px-6 py-3 rounded-xl font-semibold text-white bg-primary hover:bg-primary/90 transition-colors shadow-md">
                Open Management Console
              </Link>
              <Link to="/analytics" className="px-6 py-3 rounded-xl font-semibold text-primary border-2 border-primary hover:bg-primary/5 transition-colors">
                View Analytics
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold text-on-surface mb-4">Quick Actions</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">Quickly access the most common management tasks</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, i) => (
              <Link
                key={i}
                to={action.path}
                className="group bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 hover:shadow-xl hover:border-primary/30 transition-all text-left flex flex-col"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white mb-4 ${action.color}`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <h3 className="font-headline text-xl font-bold text-on-surface mb-2">{action.label}</h3>
                <p className="text-on-surface-variant text-sm mb-4 flex-1">{action.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Open <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-6">
          <div className="stats-container bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm border border-outline-variant/30">
            <h3 className="font-headline text-xl font-semibold text-on-surface mb-6 text-center">Key Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentStats.map((stat, i) => (
                <div key={i} className="text-center p-4">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-on-surface-variant">{stat.label}</div>
                  <div className={`text-xs font-semibold mt-1 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change} vs last month
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Grid */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold text-on-surface mb-4">Management Console</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">Access all management features from the console</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, i) => (
              <Link
                key={i}
                to={link.path}
                className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30 hover:shadow-md hover:border-primary/30 transition-all flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <link.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium text-on-surface">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-primary to-primary-container rounded-3xl p-8 md:p-12 text-on-primary">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">Ready to Manage?</h2>
            <p className="text-on-primary/90 text-lg mb-6 max-w-xl mx-auto">
              Access the full management console to manage institutions, courses, analytics, and the external website content.
            </p>
            <Link to="/management" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-primary bg-white hover:bg-white/90 transition-colors">
              Open Management Console <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
export default HomePage;