import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.trim().length < 20) newErrors.message = 'Message must be at least 20 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus('submitting');
    try {
      // Submit to API
      const response = await fetch('/api/v1/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          course_id: null,
          honeypot: '',
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'hello@odaihub.in', href: 'mailto:hello@odaihub.in' },
    { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
    { icon: MapPin, label: 'Office', value: 'Bhubaneswar, Odisha, India', href: 'https://maps.google.com' },
    { icon: Clock, label: 'Hours', value: 'Mon-Fri: 9 AM - 6 PM IST', href: null },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        {/* Hero */}
        <div className="mb-16">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-label mb-6">
            <Mail className="w-4 h-4" />
            Contact Us
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold leading-tight mb-6 text-on-surface">
            Get in Touch
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl font-body">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 sticky top-24">
              <h3 className="font-headline text-xl font-bold text-on-surface mb-6">Contact Information</h3>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-on-surface hover:text-primary transition-colors">{item.value}</a>
                      ) : (
                        <p className="text-on-surface">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30">
              <h3 className="font-headline text-xl font-bold text-on-surface mb-4">Quick Links</h3>
              <div className="space-y-3">
                {[
                  { label: 'Course Matrix', href: '/course-matrix' },
                  { label: 'Coaching Centers', href: '/coaching' },
                  { label: 'Events', href: '/events' },
                  { label: 'Success Stories', href: '/success-stories' },
                  { label: 'Blog', href: '/blog' },
                  { label: 'Careers', href: '/careers' },
                ].map((link, index) => (
                  <Link key={index} to={link.href} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors text-on-surface hover:text-primary">
                    <ExternalLink className="w-5 h-5 text-on-surface-variant" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 shadow-sm">
              <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">Send Us a Message</h2>

              {status === 'success' && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-700">
                  <CheckCircle className="w-6 h-6 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Message Sent Successfully!</p>
                    <p className="text-sm">We'll get back to you within 24 hours.</p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-700">
                  <AlertCircle className="w-6 h-6 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Failed to Send Message</p>
                    <p className="text-sm">Please try again later or email us directly.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-on-surface mb-2">
                      Full Name <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                        errors.name ? 'border-error' : 'border-outline-variant'
                      } bg-surface text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="mt-1 text-sm text-error">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-on-surface mb-2">
                      Email Address <span className="text-error">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                        errors.email ? 'border-error' : 'border-outline-variant'
                      } bg-surface text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-error">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-on-surface mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-on-surface mb-2">
                      Subject <span className="text-error">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                        errors.subject ? 'border-error' : 'border-outline-variant'
                      } bg-surface text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20`}
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="courses">Course Information</option>
                      <option value="admissions">Admissions</option>
                      <option value="partnerships">Partnerships</option>
                      <option value="events">Events</option>
                      <option value="careers">Careers</option>
                      <option value="support">Technical Support</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && <p className="mt-1 text-sm text-error">{errors.subject}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-on-surface mb-2">
                    Message <span className="text-error">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-3 rounded-xl border transition-colors resize-none ${
                      errors.message ? 'border-error' : 'border-outline-variant'
                    } bg-surface text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20`}
                    placeholder="Tell us how we can help you..."
                  />
                  {errors.message && <p className="mt-1 text-sm text-error">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white text-lg transition-all"
                  style={{ backgroundColor: '#0b5ed7' }}
                >
                  {status === 'submitting' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;