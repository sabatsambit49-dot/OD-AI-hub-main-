import React, { useState, useEffect } from 'react';
import { websiteAdminApi } from '../../../api/websiteAdminApi';

const CertificatesSection = ({ isEditor, isAdmin, setToast }) => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCert, setEditingCert] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const data = await websiteAdminApi.getCertificates();
      setCertificates(data);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to fetch certificates', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleCreate = () => {
    setEditingCert({
      certificate_id: '',
      holder_name: '',
      program: '',
      issued_on: new Date().toISOString().slice(0, 10),
    });
  };

  const handleEdit = (cert) => {
    setEditingCert({
      ...cert,
      issued_on: cert.issued_on ? new Date(cert.issued_on).toISOString().slice(0, 10) : '',
    });
  };

  const handleDelete = async (id, certId) => {
    if (!window.confirm(`Are you sure you want to delete certificate "${certId}"? This cannot be undone.`)) return;
    try {
      await websiteAdminApi.deleteCertificate(id);
      setToast({ message: 'Certificate deleted', type: 'success' });
      fetchCertificates();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to delete certificate', type: 'error' });
    }
  };

  const handleSaveCert = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        certificate_id: editingCert.certificate_id,
        holder_name: editingCert.holder_name,
        program: editingCert.program,
        issued_on: editingCert.issued_on,
      };
      if (editingCert.id) {
        await websiteAdminApi.updateCertificate(editingCert.id, data);
      } else {
        await websiteAdminApi.createCertificate(data);
      }
      setToast({ message: editingCert.id ? 'Certificate updated successfully' : 'Certificate created successfully', type: 'success' });
      setEditingCert(null);
      fetchCertificates();
    } catch (err) {
      console.error(err);
      setToast({ message: editingCert.id ? 'Failed to update certificate' : 'Failed to create certificate', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-headline text-lg font-bold text-on-surface">Certificates</h2>
          <p className="text-xs text-on-surface-variant">
            Manage certificates for the /certificate-verification page.
          </p>
        </div>
        {isEditor && (
          <button
            onClick={handleCreate}
            className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Certificate
          </button>
        )}
      </div>

      <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 text-xs font-medium">
        <label className="block text-on-surface-variant font-semibold mb-1">Search</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by certificate ID, holder name, program..."
          className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface outline-none"
        />
      </div>

      {loading ? (
        <div className="py-16 text-center text-on-surface-variant">Loading certificates...</div>
      ) : certificates.length === 0 ? (
        <div className="py-16 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2 text-on-surface-variant/60">badge</span>
          <p className="font-semibold">No certificates found</p>
          <p className="text-xs text-on-surface-variant/80 mt-1">Click "Add Certificate" to create the first one.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 text-on-surface-variant font-label text-xs uppercase tracking-wider">
                <th className="p-4">ID</th>
                <th className="p-4">Certificate ID</th>
                <th className="p-4">Holder Name</th>
                <th className="p-4">Program</th>
                <th className="p-4">Issued On</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-body text-sm">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="p-4 font-mono text-xs text-on-surface-variant">{cert.id}</td>
                  <td className="p-4 font-mono text-sm text-on-surface">{cert.certificate_id}</td>
                  <td className="p-4 text-on-surface">{cert.holder_name}</td>
                  <td className="p-4 text-on-surface-variant">{cert.program}</td>
                  <td className="p-4 text-on-surface-variant">
                    {cert.issued_on ? new Date(cert.issued_on).toLocaleDateString() : '-'}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {isEditor && (
                      <button
                        onClick={() => handleEdit(cert)}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(cert.id, cert.certificate_id)}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Certificate Modal */}
      {editingCert && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full border border-outline-variant/30 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">badge</span>
              {editingCert.id ? `Edit Certificate: ${editingCert.certificate_id}` : 'Add New Certificate'}
            </h3>

            <form onSubmit={handleSaveCert} className="space-y-4 text-xs font-body">
              <div>
                <label className="block font-semibold mb-1">Certificate ID <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={editingCert.certificate_id || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, certificate_id: e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '') })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  placeholder="e.g., ODAI-2024-001"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Holder Name <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={editingCert.holder_name || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, holder_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Program <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={editingCert.program || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, program: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Issued On <span className="text-error">*</span></label>
                <input
                  type="date"
                  value={editingCert.issued_on || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, issued_on: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setEditingCert(null)}
                  className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editingCert.id ? 'Save Changes' : 'Create Certificate')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatesSection;