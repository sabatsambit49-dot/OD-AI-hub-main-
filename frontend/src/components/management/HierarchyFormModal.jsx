import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { hierarchyApi } from '../../api/hierarchyApi';
import { institutionApi } from '../../api/institutionApi';

// Comprehensive list of courses organized by stream
const COURSE_OPTIONS = [
  // Science Stream (B.Sc.)
  { value: "B.Sc. Computer Science (B.Sc. CS)", label: "B.Sc. Computer Science (B.Sc. CS)", stream: "Science" },
  { value: "B.Sc. Information Technology Management (B.Sc. ITM)", label: "B.Sc. Information Technology Management (B.Sc. ITM)", stream: "Science" },
  { value: "B.Sc. Physics Hons", label: "B.Sc. Physics Hons", stream: "Science" },
  { value: "B.Sc. Chemistry Hons", label: "B.Sc. Chemistry Hons", stream: "Science" },
  { value: "B.Sc. Mathematics Hons", label: "B.Sc. Mathematics Hons", stream: "Science" },
  { value: "B.Sc. Botany Hons", label: "B.Sc. Botany Hons", stream: "Science" },
  { value: "B.Sc. Zoology Hons", label: "B.Sc. Zoology Hons", stream: "Science" },
  { value: "B.Sc. Geology Hons", label: "B.Sc. Geology Hons", stream: "Science" },
  { value: "B.Sc. Biotechnology", label: "B.Sc. Biotechnology", stream: "Science" },
  { value: "B.Sc. Microbiology", label: "B.Sc. Microbiology", stream: "Science" },
  { value: "B.Sc. Statistics", label: "B.Sc. Statistics", stream: "Science" },
  { value: "B.Sc. Electronics", label: "B.Sc. Electronics", stream: "Science" },
  { value: "B.Sc. Environmental Science", label: "B.Sc. Environmental Science", stream: "Science" },
  { value: "B.Sc. Anthropology", label: "B.Sc. Anthropology", stream: "Science" },
  { value: "B.Sc. Geography", label: "B.Sc. Geography", stream: "Science" },
  // Computer Applications & IT (BCA)
  { value: "BCA (Bachelor of Computer Applications)", label: "BCA (Bachelor of Computer Applications)", stream: "Computer Applications & IT" },
  // Engineering Stream (B.Tech.)
  { value: "Computer Science & Engineering (CSE)", label: "Computer Science & Engineering (CSE)", stream: "Engineering" },
  { value: "Information Technology (IT)", label: "Information Technology (IT)", stream: "Engineering" },
  { value: "Artificial Intelligence & Machine Learning (AI & ML)", label: "Artificial Intelligence & Machine Learning (AI & ML)", stream: "Engineering" },
  { value: "Data Science", label: "Data Science", stream: "Engineering" },
  { value: "Electronics & Telecommunication Engineering (ETC)", label: "Electronics & Telecommunication Engineering (ETC)", stream: "Engineering" },
  { value: "Electrical & Electronics Engineering (EEE)", label: "Electrical & Electronics Engineering (EEE)", stream: "Engineering" },
  { value: "Electrical Engineering (EE)", label: "Electrical Engineering (EE)", stream: "Engineering" },
  { value: "Mechanical Engineering (ME)", label: "Mechanical Engineering (ME)", stream: "Engineering" },
  { value: "Civil Engineering (CE)", label: "Civil Engineering (CE)", stream: "Engineering" },
  { value: "Chemical Engineering", label: "Chemical Engineering", stream: "Engineering" },
  { value: "Metallurgical & Materials Engineering", label: "Metallurgical & Materials Engineering", stream: "Engineering" },
  { value: "Biotechnology / Biomedical Engineering", label: "Biotechnology / Biomedical Engineering", stream: "Engineering" },
  { value: "Textile Engineering", label: "Textile Engineering", stream: "Engineering" },
  // Arts & Humanities Stream (B.A.)
  { value: "B.A. Economics Hons", label: "B.A. Economics Hons", stream: "Arts & Humanities" },
  { value: "B.A. Political Science Hons", label: "B.A. Political Science Hons", stream: "Arts & Humanities" },
  { value: "B.A. History Hons", label: "B.A. History Hons", stream: "Arts & Humanities" },
  { value: "B.A. Sociology Hons", label: "B.A. Sociology Hons", stream: "Arts & Humanities" },
  { value: "B.A. English Hons", label: "B.A. English Hons", stream: "Arts & Humanities" },
  { value: "B.A. Odia Hons", label: "B.A. Odia Hons", stream: "Arts & Humanities" },
  { value: "B.A. Sanskrit Hons (Shastri)", label: "B.A. Sanskrit Hons (Shastri)", stream: "Arts & Humanities" },
  { value: "B.A. Philosophy Hons", label: "B.A. Philosophy Hons", stream: "Arts & Humanities" },
  { value: "B.A. Psychology Hons", label: "B.A. Psychology Hons", stream: "Arts & Humanities" },
  { value: "B.A. Geography Hons", label: "B.A. Geography Hons", stream: "Arts & Humanities" },
  { value: "B.A. Hindi Hons", label: "B.A. Hindi Hons", stream: "Arts & Humanities" },
  { value: "B.A. Education Hons", label: "B.A. Education Hons", stream: "Arts & Humanities" },
  { value: "B.A. Journalism & Mass Communication (BJMC)", label: "B.A. Journalism & Mass Communication (BJMC)", stream: "Arts & Humanities" },
  // Commerce & Management Stream (B.Com / BBA)
  { value: "B.Com. Accounting / Accountancy Hons", label: "B.Com. Accounting / Accountancy Hons", stream: "Commerce & Management" },
  { value: "B.Com. Finance Hons", label: "B.Com. Finance Hons", stream: "Commerce & Management" },
  { value: "B.Com. Management Hons", label: "B.Com. Management Hons", stream: "Commerce & Management" },
  { value: "BBA (Bachelor of Business Administration)", label: "BBA (Bachelor of Business Administration)", stream: "Commerce & Management" },
  { value: "BBM (Bachelor of Business Management)", label: "BBM (Bachelor of Business Management)", stream: "Commerce & Management" },
  // Medical & Health Sciences
  { value: "MBBS (Bachelor of Medicine, Bachelor of Surgery)", label: "MBBS (Bachelor of Medicine, Bachelor of Surgery)", stream: "Medical & Health Sciences" },
  { value: "BDS (Bachelor of Dental Surgery)", label: "BDS (Bachelor of Dental Surgery)", stream: "Medical & Health Sciences" },
  { value: "B.Pharm. (Bachelor of Pharmacy)", label: "B.Pharm. (Bachelor of Pharmacy)", stream: "Medical & Health Sciences" },
  { value: "B.Sc. Nursing", label: "B.Sc. Nursing", stream: "Medical & Health Sciences" },
  { value: "BAMS (Bachelor of Ayurvedic Medicine & Surgery)", label: "BAMS (Bachelor of Ayurvedic Medicine & Surgery)", stream: "Medical & Health Sciences" },
  { value: "BHMS (Bachelor of Homoeopathic Medicine & Surgery)", label: "BHMS (Bachelor of Homoeopathic Medicine & Surgery)", stream: "Medical & Health Sciences" },
  { value: "BPT (Bachelor of Physiotherapy)", label: "BPT (Bachelor of Physiotherapy)", stream: "Medical & Health Sciences" },
  { value: "BPO (Bachelor in Prosthetics and Orthotics)", label: "BPO (Bachelor in Prosthetics and Orthotics)", stream: "Medical & Health Sciences" },
  { value: "BASLP (Bachelor in Audiology and Speech-Language Pathology)", label: "BASLP (Bachelor in Audiology and Speech-Language Pathology)", stream: "Medical & Health Sciences" },
  // Agriculture & Allied Sciences
  { value: "B.Sc. (Hons.) Agriculture", label: "B.Sc. (Hons.) Agriculture", stream: "Agriculture & Allied Sciences" },
  { value: "B.Sc. (Hons.) Horticulture", label: "B.Sc. (Hons.) Horticulture", stream: "Agriculture & Allied Sciences" },
  { value: "B.Sc. (Hons.) Forestry", label: "B.Sc. (Hons.) Forestry", stream: "Agriculture & Allied Sciences" },
  { value: "B.F.Sc. (Bachelor of Fisheries Science)", label: "B.F.Sc. (Bachelor of Fisheries Science)", stream: "Agriculture & Allied Sciences" },
  { value: "B.Tech. Agricultural Engineering", label: "B.Tech. Agricultural Engineering", stream: "Agriculture & Allied Sciences" },
  { value: "B.Sc. (Hons.) Community Science", label: "B.Sc. (Hons.) Community Science", stream: "Agriculture & Allied Sciences" },
  // Law & Education
  { value: "LL.B. (3-Year Graduate Law)", label: "LL.B. (3-Year Graduate Law)", stream: "Law & Education" },
  { value: "Integrated B.A. LL.B. (5-Year)", label: "Integrated B.A. LL.B. (5-Year)", stream: "Law & Education" },
  { value: "Integrated BBA LL.B. (5-Year)", label: "Integrated BBA LL.B. (5-Year)", stream: "Law & Education" },
  { value: "Integrated B.Sc. LL.B. (5-Year)", label: "Integrated B.Sc. LL.B. (5-Year)", stream: "Law & Education" },
  { value: "B.Ed. (Bachelor of Education Teacher Training)", label: "B.Ed. (Bachelor of Education Teacher Training)", stream: "Law & Education" },
  { value: "B.P.Ed. (Bachelor of Physical Education)", label: "B.P.Ed. (Bachelor of Physical Education)", stream: "Law & Education" },
  { value: "Integrated B.A. B.Ed. / B.Sc. B.Ed. (4-Year NEP aligned)", label: "Integrated B.A. B.Ed. / B.Sc. B.Ed. (4-Year NEP aligned)", stream: "Law & Education" },
  // Specialized Creative & Professional Degrees
  { value: "B.Arch. (Bachelor of Architecture)", label: "B.Arch. (Bachelor of Architecture)", stream: "Specialized Creative & Professional" },
  { value: "B.Plan. (Bachelor of Planning)", label: "B.Plan. (Bachelor of Planning)", stream: "Specialized Creative & Professional" },
  { value: "B.V.A. (Bachelor of Visual Art)", label: "B.V.A. (Bachelor of Visual Art)", stream: "Specialized Creative & Professional" },
  { value: "B.P.A. (Bachelor of Performing Art)", label: "B.P.A. (Bachelor of Performing Art)", stream: "Specialized Creative & Professional" },
  { value: "BSW (Bachelor of Social Work)", label: "BSW (Bachelor of Social Work)", stream: "Specialized Creative & Professional" },
  { value: "BHMCT (Bachelor of Hotel Management & Catering Technology)", label: "BHMCT (Bachelor of Hotel Management & Catering Technology)", stream: "Specialized Creative & Professional" },
  { value: "BTTM (Bachelor of Tourism & Travel Management)", label: "BTTM (Bachelor of Tourism & Travel Management)", stream: "Specialized Creative & Professional" },
];

// Group courses by stream for optgroup
const COURSES_BY_STREAM = COURSE_OPTIONS.reduce((acc, course) => {
  if (!acc[course.stream]) acc[course.stream] = [];
  acc[course.stream].push({ value: course.value, label: course.label });
  return acc;
}, {});

const HierarchyFormModal = ({ isOpen, onClose, entityType, initialData, onSuccess }) => {
  const [formData, setFormData] = useState({});
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [types, setTypes] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({});
    }
    // Reset custom_name when entityType changes or modal closes/opens
    setFormData(prev => ({ ...prev, custom_name: '' }));
  }, [initialData, entityType, isOpen]);

  useEffect(() => {
    const loadParents = async () => {
      try {
        if (entityType === 'district' || entityType === 'institution') {
          const s = await hierarchyApi.getStates();
          setStates(s);
        }
        if (entityType === 'institution') {
          const t = await hierarchyApi.getInstitutionTypes();
          setTypes(t);
        }
        if (entityType === 'course' || entityType === 'academicYear') {
          const insts = await institutionApi.getInstitutions();
          setInstitutions(insts);
        }
        if (entityType === 'branch') {
          const c = await hierarchyApi.getCourses();
          setCourses(c);
        }
        if (entityType === 'academicYear') {
          const b = await hierarchyApi.getBranches();
          setBranches(b);
        }
      } catch (err) {
        console.error("Error loading modal dropdown options:", err);
      }
    };
    if (isOpen) loadParents();
  }, [isOpen, entityType]);

  // Handle state change for district loading in institution modal
  const handleStateChangeInInst = async (stateId) => {
    setFormData((prev) => ({ ...prev, state_id: stateId, district_id: '' }));
    if (stateId) {
      const d = await hierarchyApi.getDistricts(stateId);
      setDistricts(d);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (entityType === 'state') {
        if (formData.id) await hierarchyApi.updateState(formData.id, formData);
        else await hierarchyApi.createState(formData);
      } else if (entityType === 'district') {
        if (formData.id) await hierarchyApi.updateDistrict(formData.id, formData);
        else await hierarchyApi.createDistrict(formData);
      } else if (entityType === 'institutionType') {
        if (formData.id) await hierarchyApi.updateInstitutionType(formData.id, formData);
        else await hierarchyApi.createInstitutionType(formData);
      } else if (entityType === 'institution') {
        if (formData.id) await institutionApi.updateInstitution(formData.id, formData);
        else await institutionApi.createInstitution(formData);
      } else if (entityType === 'course') {
        if (formData.id) await hierarchyApi.updateCourse(formData.id, formData);
        else await hierarchyApi.createCourse(formData);
      } else if (entityType === 'branch') {
        if (formData.id) await hierarchyApi.updateBranch(formData.id, formData);
        else await hierarchyApi.createBranch(formData);
      } else if (entityType === 'academicYear') {
        const payload = {
          year_label: formData.year_label,
          total_seats: parseInt(formData.total_seats || 0),
          student_strength: parseInt(formData.student_strength || 0),
          branch_id: parseInt(formData.branch_id),
          college_name: formData.college_name || null,
        };
        if (formData.id) await hierarchyApi.updateAcademicYear(formData.id, payload);
        else await hierarchyApi.createAcademicYear(payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    state: "State",
    district: "District",
    institutionType: "Institution Type",
    institution: "Institution",
    course: "Course",
    branch: "Branch",
    academicYear: "Academic Year",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${formData.id ? 'Edit' : 'Add New'} ${titles[entityType] || ''}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 rounded-xl bg-error/10 text-error text-sm font-body">{error}</div>}

        {/* State Form */}
        {entityType === 'state' && (
          <div>
            <label className="block text-sm font-label font-semibold text-on-surface mb-1">State Name</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. California, Texas..."
              className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
            />
          </div>
        )}

        {/* District Form */}
        {entityType === 'district' && (
          <>
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">Select State</label>
              <select
                required
                value={formData.state_id || ''}
                onChange={(e) => setFormData({ ...formData, state_id: parseInt(e.target.value) })}
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              >
                <option value="">Select State...</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">District Name</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Los Angeles, Austin..."
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
          </>
        )}

        {/* Institution Type Form */}
        {entityType === 'institutionType' && (
          <div>
            <label className="block text-sm font-label font-semibold text-on-surface mb-1">Type Name</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. College, University, High School..."
              className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
            />
          </div>
        )}

        {/* Institution Form */}
        {entityType === 'institution' && (
          <>
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">Institution Name</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Stanford University..."
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">Select State</label>
              <select
                value={formData.state_id || ''}
                onChange={(e) => handleStateChangeInInst(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              >
                <option value="">Select State...</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">Select District</label>
              <select
                required
                value={formData.district_id || ''}
                onChange={(e) => setFormData({ ...formData, district_id: parseInt(e.target.value) })}
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              >
                <option value="">Select District...</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">Institution Type</label>
              <select
                required
                value={formData.institution_type_id || ''}
                onChange={(e) => setFormData({ ...formData, institution_type_id: parseInt(e.target.value) })}
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              >
                <option value="">Select Type...</option>
                {types.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">Address</label>
              <textarea
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Campus address..."
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
                rows="2"
              />
            </div>
          </>
        )}

        {/* Course Form */}
        {entityType === 'course' && (
          <>
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">Select Institution</label>
              <select
                required
                value={formData.institution_id || ''}
                onChange={(e) => setFormData({ ...formData, institution_id: parseInt(e.target.value) })}
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              >
                <option value="">Select Institution...</option>
                {institutions.map((i) => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">Course Name</label>
              <select
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              >
                <option value="">Select Course...</option>
                {Object.entries(COURSES_BY_STREAM).map(([stream, courses]) => (
                  <optgroup key={stream} label={stream}>
                    {courses.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </optgroup>
                ))}
                <option value="__custom__">Other (Custom Entry)</option>
              </select>
            </div>
            {formData.name === '__custom__' && (
              <div>
                <label className="block text-sm font-label font-semibold text-on-surface mb-1">Custom Course Name</label>
                <input
                  type="text"
                  required
                  value={formData.custom_name || ''}
                  onChange={(e) => setFormData({ ...formData, custom_name: e.target.value, name: e.target.value })}
                  placeholder="Enter custom course name..."
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
                rows="2"
              />
            </div>
          </>
        )}

        {/* Branch Form */}
        {entityType === 'branch' && (
          <>
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">Select Course</label>
              <select
                required
                value={formData.course_id || ''}
                onChange={(e) => setFormData({ ...formData, course_id: parseInt(e.target.value) })}
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              >
                <option value="">Select Course...</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">Branch Name</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Computer Science, Mechanical..."
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
          </>
        )}

        {/* Academic Year Form */}
        {entityType === 'academicYear' && (
          <>
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">Select Branch</label>
              <select
                required
                value={formData.branch_id || ''}
                onChange={(e) => setFormData({ ...formData, branch_id: parseInt(e.target.value) })}
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              >
                <option value="">Select Branch...</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">Year Label</label>
              <input
                type="text"
                required
                value={formData.year_label || ''}
                onChange={(e) => setFormData({ ...formData, year_label: e.target.value })}
                placeholder="e.g. 1st Year, 2nd Year..."
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">College Name / Details</label>
              <select
                value={formData.college_name || ''}
                onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              >
                <option value="">Select College / Institution...</option>
                {institutions.map((i) => (
                  <option key={i.id} value={i.name}>{i.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-label font-semibold text-on-surface mb-1">Total Seats</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.total_seats ?? ''}
                  onChange={(e) => setFormData({ ...formData, total_seats: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-label font-semibold text-on-surface mb-1">Student Strength</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.student_strength ?? ''}
                  onChange={(e) => setFormData({ ...formData, student_strength: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>
            </div>
          </>
        )}

        <div className="pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-outline-variant/40 text-on-surface-variant font-label text-sm font-semibold hover:bg-surface-container-low"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label text-sm font-semibold hover:bg-primary-container transition-colors shadow-sm"
          >
            {loading ? 'Saving...' : 'Save Record'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default HierarchyFormModal;
