import React, { useState, useEffect } from 'react';
import { academyAdminApi } from '../../api/academyAdminApi';

const AcademyEnquiriesSection = ({ isEditor, setToast }) => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeEnquiry, setActiveEnquiry] = useState(null);
  const [exporting, setExporting] = useState(false);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const params = selectedStatus !== 'all' ? { status: selectedStatus } : {};
      const data = await academyAdminApi.getEnquiries(params);
      setEnquiries(data);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to fetch enquiries', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [selectedStatus]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await academyAdminApi.updateEnquiryStatus(id, newStatus);
      setToast({ message: `Status marked as ${newStatus}`, type: 'success' });
      fetchEnquiries();
      if (activeEnquiry && activeEnquiry.id === id) {
        setActiveEnquiry(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to update status', type: 'error' });
    }
  };

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      await academyAdminApi.downloadEnquiriesCsv(selectedStatus);
      setToast({ message: 'Enquiries CSV exported successfully', type: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to export CSV', type: 'error' });
    } finally {
      setExporting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/15 text-blue-700 border border-blue-500/30">New</span>;
      case 'contacted':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 border border-amber-500/30">Contacted</span>;
      case 'closed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">Closed</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-surface-container text-on-surface-variant">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters and Export */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-headline text-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">contact_mail</span>
            Learner & Student Enquiries
          </h2>
          <p className="text-xs text-on-surface-variant">
            Track inquiries submitted through the OD AI Academy and website forms.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Status Filter Tabs */}
          <div className="flex bg-surface-container rounded-xl p-1 text-xs font-semibold">
            {['all', 'new', 'contacted', 'closed'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  selectedStatus === st ? 'bg-surface text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCsv}
            disabled={exporting}
            className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-base">download</span>
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Enquiries Table */}
      {loading ? (
        <div className="py-16 text-center text-on-surface-variant">Loading enquiries...</div>
      ) : enquiries.length === 0 ? (
        <div className="py-16 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2 text-on-surface-variant/60">inbox</span>
          <p className="font-semibold">No enquiries found</p>
          <p className="text-xs text-on-surface-variant/80 mt-1">There are no inquiries matching "{selectedStatus}".</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body">
              <thead className="bg-surface-container-high/50 border-b border-outline-variant/20 text-on-surface-variant font-label uppercase">
                <tr>
                  <th className="px-5 py-3.5">Learner Name</th>
                  <th className="px-4 py-3.5">Contact</th>
                  <th className="px-4 py-3.5">Class / Degree</th>
                  <th className="px-4 py-3.5">Program / Course</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-on-surface text-sm">{enq.name}</div>
                      {enq.message && (
                        <div className="text-xs text-on-surface-variant truncate max-w-xs" title={enq.message}>
                          "{enq.message}"
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-on-surface">{enq.phone}</div>
                      {enq.email && <div className="text-xs text-on-surface-variant">{enq.email}</div>}
                    </td>
                    <td className="px-4 py-3.5 text-on-surface-variant font-medium">
                      {enq.class_or_degree || '—'}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-1 rounded bg-primary/10 text-primary font-semibold text-xs">
                        {enq.course_title || 'General Academy'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-on-surface-variant">
                      {enq.created_at ? new Date(enq.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3.5">
                      {getStatusBadge(enq.status)}
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setActiveEnquiry(enq)}
                        className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-semibold"
                      >
                        Details
                      </button>

                      {isEditor && (
                        <>
                          {enq.status === 'new' && (
                            <button
                              onClick={() => handleStatusUpdate(enq.id, 'contacted')}
                              className="px-2 py-1 rounded-lg bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 font-semibold"
                            >
                              Contacted
                            </button>
                          )}
                          {enq.status !== 'closed' && (
                            <button
                              onClick={() => handleStatusUpdate(enq.id, 'closed')}
                              className="px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 font-semibold"
                            >
                              Close
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enquiry Details Modal */}
      {activeEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full border border-outline-variant/30 shadow-2xl p-6 text-sm">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-4">
              <h3 className="font-headline font-bold text-lg text-on-surface">Enquiry Details #{activeEnquiry.id}</h3>
              <button
                onClick={() => setActiveEnquiry(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-surface-container-high"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <span className="text-xs font-semibold text-on-surface-variant block">Learner Name</span>
                <span className="font-bold text-base text-on-surface">{activeEnquiry.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs font-semibold text-on-surface-variant block">Phone</span>
                  <a href={`tel:${activeEnquiry.phone}`} className="font-medium text-primary hover:underline">
                    {activeEnquiry.phone}
                  </a>
                </div>
                <div>
                  <span className="text-xs font-semibold text-on-surface-variant block">Email</span>
                  <a href={`mailto:${activeEnquiry.email}`} className="font-medium text-primary hover:underline">
                    {activeEnquiry.email || 'None provided'}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs font-semibold text-on-surface-variant block">Class / Degree</span>
                  <span className="font-medium text-on-surface">{activeEnquiry.class_or_degree || '—'}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-on-surface-variant block">Target Program</span>
                  <span className="font-medium text-primary">{activeEnquiry.course_title || 'General Academy'}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-on-surface-variant block">Message</span>
                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface mt-1 whitespace-pre-wrap">
                  {activeEnquiry.message || 'No additional message.'}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-on-surface-variant">
                  Received: {activeEnquiry.created_at ? new Date(activeEnquiry.created_at).toLocaleString() : '—'}
                </span>
                <div>{getStatusBadge(activeEnquiry.status)}</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/20">
              {isEditor && activeEnquiry.status !== 'closed' && (
                <button
                  onClick={() => handleStatusUpdate(activeEnquiry.id, 'closed')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
                >
                  Mark as Closed
                </button>
              )}
              <button
                onClick={() => setActiveEnquiry(null)}
                className="px-4 py-2 rounded-xl border border-outline-variant font-semibold text-xs text-on-surface-variant hover:bg-surface-container-high"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademyEnquiriesSection;
