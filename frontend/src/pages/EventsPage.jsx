import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, ArrowLeft, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { websiteApi } from '@/api/websiteApi';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await websiteApi.getEvents({ event_type: filterType || undefined, upcoming_only: true });
        setEvents(data.filter(e => e.status === 'published'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, [filterType]);

  const filteredEvents = events.filter(e => {
    if (filterType) return e.type === filterType;
    return true;
  });

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const pageEvents = filteredEvents.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleBack = () => {
    setSelectedEvent(null);
  };

  const handleRegister = async (event) => {
    window.location.href = `/contact?event=${encodeURIComponent(event.title)}&type=event_registration`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getTypeBadge = (type) => {
    const colors = {
      workshop: 'bg-blue-500/15 text-blue-700',
      hackathon: 'bg-purple-500/15 text-purple-700',
      demo_class: 'bg-green-500/15 text-green-700',
      seminar: 'bg-orange-500/15 text-orange-700',
    };
    const icons = {
      workshop: <Users className="w-3 h-3" />,
      hackathon: <Users className="w-3 h-3" />,
      demo_class: <Calendar className="w-3 h-3" />,
      seminar: <MapPin className="w-3 h-3" />,
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${colors[type] || 'bg-gray-500/15 text-gray-700'}`}>
        {icons[type]}
        {type.replace('_', ' ')}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-on-surface-variant font-label">Loading events...</p>
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
            <Calendar className="w-4 h-4" />
            Events
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold leading-tight mb-6 text-on-surface">
            Upcoming Events & Workshops
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto mb-8 font-body">
            Join our community events, workshops, hackathons, and seminars to learn, network, and grow.
          </p>
        </div>

        {selectedEvent ? (
          /* Event Detail */
          <div className="max-w-3xl mx-auto animate-slide-up">
            <button
              onClick={handleBack}
              className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Events
            </button>

            <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-12 shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline text-3xl font-bold text-on-surface">{selectedEvent.title}</h2>
                {getTypeBadge(selectedEvent.type)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl">
                  <Calendar className="w-6 h-6" style={{ color: '#0b5ed7' }} />
                  <div>
                    <p className="text-xs text-on-surface-variant">Date</p>
                    <p className="font-semibold text-on-surface">{formatDate(selectedEvent.event_date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl">
                  <Clock className="w-6 h-6" style={{ color: '#0b5ed7' }} />
                  <div>
                    <p className="text-xs text-on-surface-variant">Time</p>
                    <p className="font-semibold text-on-surface">{formatTime(selectedEvent.event_date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl">
                  <MapPin className="w-6 h-6" style={{ color: '#0b5ed7' }} />
                  <div>
                    <p className="text-xs text-on-surface-variant">Mode / Location</p>
                    <p className="font-semibold text-on-surface capitalize">{selectedEvent.mode} {selectedEvent.location ? `· ${selectedEvent.location}` : ''}</p>
                  </div>
                </div>
              </div>

              <div className="prose prose-slate max-w-none mb-8">
                <p className="text-on-surface-variant leading-relaxed">{selectedEvent.description}</p>
              </div>

              {selectedEvent.registration_open && (
                <button
                  onClick={() => handleRegister(selectedEvent)}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white text-lg transition-all"
                  style={{ backgroundColor: '#0b5ed7' }}
                >
                  Register Now <ExternalLink className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Events Grid */
          <div>
            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <button
                onClick={() => setFilterType('')}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${!filterType ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                All Events
              </button>
              <button
                onClick={() => setFilterType('workshop')}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${filterType === 'workshop' ? 'bg-blue-500/15 text-blue-700' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                Workshops
              </button>
              <button
                onClick={() => setFilterType('hackathon')}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${filterType === 'hackathon' ? 'bg-purple-500/15 text-purple-700' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                Hackathons
              </button>
              <button
                onClick={() => setFilterType('demo_class')}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${filterType === 'demo_class' ? 'bg-green-500/15 text-green-700' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                Demo Classes
              </button>
              <button
                onClick={() => setFilterType('seminar')}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${filterType === 'seminar' ? 'bg-orange-500/15 text-orange-700' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                Seminars
              </button>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
                <Calendar className="w-16 h-16 text-on-surface-variant/30 mx-auto mb-4" />
                <h3 className="font-headline text-xl font-semibold text-on-surface-variant mb-2">No Events Found</h3>
                <p className="text-on-surface-variant/70">No upcoming events match your filter.</p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {pageEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: '#0b5ed7' }} />
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-headline text-xl font-bold text-on-surface">{event.title}</h3>
                        {getTypeBadge(event.type)}
                      </div>

                      <div className="space-y-3 mb-6 text-sm text-on-surface-variant">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>{formatDate(event.event_date)} · {formatTime(event.event_date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="capitalize">{event.mode} {event.location ? `· ${event.location}` : ''}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 flex-shrink-0" />
                          <span>{event.registration_count || 0} registered</span>
                        </div>
                      </div>

                      <p className="text-on-surface-variant line-clamp-3 mb-4">{event.description}</p>

                      {event.registration_open && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRegister(event); }}
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white transition-all"
                          style={{ backgroundColor: '#0b5ed7' }}
                        >
                          Register
                        </button>
                      )}
                    </div>
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
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-on-surface-variant font-medium">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                      disabled={currentPage === totalPages - 1}
                      className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
