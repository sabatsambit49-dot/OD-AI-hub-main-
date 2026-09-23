import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, BadgeCheck, AlertCircle, CheckCircle, XCircle, Badge } from 'lucide-react';
import { websiteApi } from '@/api/websiteApi';

const CertificateVerificationPage = () => {
  const [certificateId, setCertificateId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certificateId.trim()) {
      setError('Please enter a certificate ID');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await websiteApi.verifyCertificate(certificateId.trim().toUpperCase());
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCertificateId('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        {/* Hero */}
        <div className="mb-12">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-label mb-6">
              <Badge className="w-4 h-4" />
              Certificate Verification
            </div>
            <h1 className="font-headline text-4xl md:text-6xl font-bold leading-tight mb-6 text-on-surface">
              Verify Your Certificate
            </h1>
            <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto font-body">
              Enter your certificate ID to verify its authenticity and view details.
            </p>
          </div>
        </div>

        {/* Verification Form */}
        <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 shadow-sm">
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label htmlFor="certificateId" className="block text-sm font-semibold text-on-surface mb-2">
                Certificate ID <span className="text-error">*</span>
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  type="text"
                  id="certificateId"
                  name="certificateId"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value.toUpperCase())}
                  className="w-full px-4 py-4 pl-12 rounded-xl border border-outline-variant bg-surface text-on-surface text-lg font-mono focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g., ODAI-2024-001"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !certificateId.trim()}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white text-lg transition-all"
              style={{ backgroundColor: '#0b5ed7' }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <BadgeCheck className="w-5 h-5" />
                  Verify Certificate
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-700">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-8 animate-fade-in">
              {result.verified ? (
                /* Valid Certificate */
                <div className="bg-emerald-500/5 border border-emerald-500/30 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="font-headline text-2xl font-bold text-emerald-700">Certificate Verified</h2>
                      <p className="text-emerald-600">This certificate is authentic and valid.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-surface-container-low rounded-xl p-6">
                      <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Certificate ID</p>
                      <p className="font-mono text-lg font-bold text-on-surface">{result.certificate_id}</p>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-6">
                      <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Holder Name</p>
                      <p className="font-semibold text-on-surface">{result.holder_name}</p>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-6">
                      <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Program</p>
                      <p className="font-semibold text-on-surface">{result.program}</p>
                    </div>
                  </div>

                  {result.issued_on && (
                    <div className="mt-6 p-4 bg-surface-container-low rounded-xl">
                      <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Issued On</p>
                      <p className="font-semibold text-on-surface">{new Date(result.issued_on).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  )}

                  <div className="mt-6 text-center">
                    <p className="text-on-surface-variant">
                      This certificate can be verified at any time by visiting this page and entering the certificate ID.
                    </p>
                  </div>
                </div>
              ) : (
                /* Invalid Certificate */
                <div className="bg-red-500/5 border border-red-500/30 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="font-headline text-2xl font-bold text-red-700 mb-2">Certificate Not Found</h2>
                  <p className="text-red-600 mb-4">
                    No certificate found with ID: <strong className="font-mono">{certificateId.toUpperCase()}</strong>
                  </p>
                  <p className="text-red-600/70">
                    Please check the certificate ID and try again. If you believe this is an error, contact our support team.
                  </p>
                  <Link to="/contact" className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white" style={{ backgroundColor: '#0b5ed7' }}>
                    Contact Support <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateVerificationPage;
