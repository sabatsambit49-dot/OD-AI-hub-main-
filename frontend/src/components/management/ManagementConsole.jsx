import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { hierarchyApi } from '../../api/hierarchyApi';
import { institutionApi } from '../../api/institutionApi';
import HierarchyFormModal from './HierarchyFormModal';
import SyllabusUploadModal from './SyllabusUploadModal';
import EventInfoFormModal from './EventInfoFormModal';
import UsersSection from '../admin/UsersSection';
import AcademyCoursesSection from './AcademyCoursesSection';
import AcademyCategoriesSection from './AcademyCategoriesSection';
import AcademyEnquiriesSection from './AcademyEnquiriesSection';
import PillarsSection from './website/PillarsSection';
import PillarSectionsSection from './website/PillarSectionsSection';
import OfferingsSection from './website/OfferingsSection';
import InstitutionAudiencesSection from './website/InstitutionAudiencesSection';
import EventsSection from './website/EventsSection';
import EventRegistrationsSection from './website/EventRegistrationsSection';
import SuccessStoriesSection from './website/SuccessStoriesSection';
import BlogPostsSection from './website/BlogPostsSection';
import CertificatesSection from './website/CertificatesSection';
import StaticPagesSection from './website/StaticPagesSection';
import TeamMembersSection from './website/TeamMembersSection';
import JobListingsSection from './website/JobListingsSection';
import FooterLinksSection from './website/FooterLinksSection';
import EmptyState from '../common/EmptyState';
import Toast from '../common/Toast';

const ManagementConsole = () => {
  const { user, isAdmin, isEditor, isViewer } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'institutions';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState([]);

  // Data states
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('institution');
  const [selectedItem, setSelectedItem] = useState(null);

  const [syllabusModalOpen, setSyllabusModalOpen] = useState(false);
  const [eventInfoModalOpen, setEventInfoModalOpen] = useState(false);
  const [eventInfoType, setEventInfoType] = useState('event');

  const [toast, setToast] = useState(null);

  // Sync tab with searchParams if searchParams change
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  // Fetch cities on mount
  useEffect(() => {
    hierarchyApi.getDistricts().then(data => setCities(data)).catch(console.error);
  }, []);

  const fetchData = async () => {
    if (['users', 'academy_courses', 'academy_categories', 'enquiries', 'pillars', 'pillar_sections', 'offerings', 'institution_audiences', 'events', 'event_registrations', 'success_stories', 'blog_posts', 'certificates', 'static_pages', 'team_members', 'job_listings', 'footer_links'].includes(activeTab)) return;
    setLoading(true);
    try {
      let data = [];
      const params = selectedCity ? { district_id: selectedCity } : {};
      if (activeTab === 'states') data = await hierarchyApi.getStates();
      else if (activeTab === 'cities') data = await hierarchyApi.getDistricts();
      else if (activeTab === 'types') data = await hierarchyApi.getInstitutionTypes();
      else if (activeTab === 'institutions') data = await institutionApi.getInstitutions(params);
      else if (activeTab === 'courses') data = await hierarchyApi.getCourses();
      else if (activeTab === 'branches') data = await hierarchyApi.getBranches();
      else if (activeTab === 'years') data = await hierarchyApi.getAcademicYears();
      setDataList(data);
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to fetch console data", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, selectedCity]);

  const handleCreateNew = () => {
    if (activeTab === 'syllabus') {
      setSyllabusModalOpen(true);
    } else if (activeTab === 'events') {
      setEventInfoType('event');
      setEventInfoModalOpen(true);
    } else {
      const typeMap = {
        states: 'state',
        cities: 'district',
        types: 'institutionType',
        institutions: 'institution',
        courses: 'course',
        branches: 'branch',
        years: 'academicYear',
      };
      setModalType(typeMap[activeTab] || 'institution');
      setSelectedItem(null);
      setModalOpen(true);
    }
  };

  const handleEdit = (item) => {
    const typeMap = {
      states: 'state',
      cities: 'district',
      types: 'institutionType',
      institutions: 'institution',
      courses: 'course',
      branches: 'branch',
      years: 'academicYear',
    };
    setModalType(typeMap[activeTab] || 'institution');
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record? This action is permanent.")) return;
    try {
      if (activeTab === 'states') await hierarchyApi.deleteState(id);
      else if (activeTab === 'cities') await hierarchyApi.deleteDistrict(id);
      else if (activeTab === 'types') await hierarchyApi.deleteInstitutionType(id);
      else if (activeTab === 'institutions') await institutionApi.deleteInstitution(id);
      else if (activeTab === 'courses') await hierarchyApi.deleteCourse(id);
      else if (activeTab === 'branches') await hierarchyApi.deleteBranch(id);
      else if (activeTab === 'years') await hierarchyApi.deleteAcademicYear(id);

      setToast({ message: "Record deleted successfully", type: "success" });
      fetchData();
    } catch (err) {
      console.error(err);
      setToast({ message: err.response?.data?.detail || "Delete operation failed", type: "error" });
    }
  };

  const handleBatchImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await institutionApi.importInstitutionsCsv(formData);
      setToast({ message: res.message || "Batch import successful", type: "success" });
      fetchData();
    } catch (err) {
      console.error(err);
      setToast({ message: err.response?.data?.detail || "Batch import failed", type: "error" });
    }
  };

  const allTabs = [
    { id: 'academy_courses', label: 'OD AI Academy Courses', icon: 'workspace_premium' },
    { id: 'academy_categories', label: 'Academy Pillars', icon: 'category' },
    { id: 'enquiries', label: 'Learner Enquiries', icon: 'contact_mail' },
    { id: 'pillars', label: 'Pillars', icon: 'category' },
    { id: 'pillar_sections', label: 'Pillar Sections', icon: 'folder' },
    { id: 'offerings', label: 'Offerings', icon: 'inventory_2' },
    { id: 'institution_audiences', label: 'Institution Audiences', icon: 'groups' },
    { id: 'events', label: 'Events', icon: 'event' },
    { id: 'event_registrations', label: 'Event Registrations', icon: 'event_note' },
    { id: 'success_stories', label: 'Success Stories', icon: 'star' },
    { id: 'blog_posts', label: 'Blog Posts', icon: 'article' },
    { id: 'certificates', label: 'Certificates', icon: 'badge' },
    { id: 'static_pages', label: 'Static Pages', icon: 'description' },
    { id: 'team_members', label: 'Team Members', icon: 'person' },
    { id: 'job_listings', label: 'Job Listings', icon: 'work' },
    { id: 'footer_links', label: 'Footer Links', icon: 'link' },
    { id: 'institutions', label: 'Institutions', icon: 'school' },
    { id: 'cities', label: 'Cities', icon: 'location_city' },
    { id: 'courses', label: 'College Courses', icon: 'auto_stories' },
    { id: 'branches', label: 'Branches', icon: 'account_tree' },
    { id: 'years', label: 'Academic Years', icon: 'date_range' },
    { id: 'states', label: 'States', icon: 'map' },
    { id: 'types', label: 'Institution Types', icon: 'domain' },
    { id: 'syllabus', label: 'Syllabus Uploads', icon: 'picture_as_pdf' },
    ...(isAdmin ? [{ id: 'users', label: 'Users & Sessions', icon: 'people' }] : []),
  ];

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-surface flex items-center gap-3">
            <img src="/logo.jpg" alt="ODAIHUB Logo" className="w-9 h-9 rounded-full object-cover shadow-sm border border-outline-variant/30" />
            ODAIHUB Management Console
          </h1>
          <p className="font-body text-sm text-on-surface-variant mt-1">
            Manual data entry & management hierarchy (State → District → Type → Institution → Course → Branch → Year).
          </p>
        </div>

        {/* Role Gated Actions */}
        <div className="flex items-center gap-3">
          {isAdmin && !['users', 'academy_courses', 'academy_categories', 'enquiries', 'pillars', 'pillar_sections', 'offerings', 'institution_audiences', 'events', 'event_registrations', 'success_stories', 'blog_posts', 'certificates', 'static_pages', 'team_members', 'job_listings', 'footer_links'].includes(activeTab) && (
            <label className="cursor-pointer bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant font-label text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">upload_file</span>
              Batch CSV Import
              <input type="file" accept=".csv" onChange={handleBatchImport} className="hidden" />
            </label>
          )}

          {isEditor && !['users', 'academy_courses', 'academy_categories', 'enquiries', 'pillars', 'pillar_sections', 'offerings', 'institution_audiences', 'events', 'event_registrations', 'success_stories', 'blog_posts', 'certificates', 'static_pages', 'team_members', 'job_listings', 'footer_links'].includes(activeTab) ? (
            <button
              onClick={handleCreateNew}
              className="bg-primary hover:bg-primary-container text-on-primary font-label text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Add New Record
            </button>
          ) : !['users', 'academy_courses', 'academy_categories', 'enquiries', 'pillars', 'pillar_sections', 'offerings', 'institution_audiences', 'events', 'event_registrations', 'success_stories', 'blog_posts', 'certificates', 'static_pages', 'team_members', 'job_listings', 'footer_links'].includes(activeTab) ? (
            <div className="bg-amber-500/15 text-amber-700 font-label text-xs font-semibold px-4 py-2 rounded-xl border border-amber-500/30">
              Read-Only Viewer Mode (Login as Admin/Editor to mutate)
            </div>
          ) : null}
        </div>
      </div>

      {/* City Filter Dropdown */}
      {['institutions', 'courses', 'branches', 'years'].includes(activeTab) && cities.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-label font-bold text-on-surface mb-2">Filter by City</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full max-w-xs bg-surface text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-outline-variant/30 mb-6 gap-2 pb-2">
        {allTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`font-label text-sm font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Rendering: Users vs Academy vs Generic Hierarchy Table */}
      {activeTab === 'users' ? (
        <UsersSection />
      ) : activeTab === 'academy_courses' ? (
        <AcademyCoursesSection isAdmin={isAdmin} isEditor={isEditor} setToast={setToast} />
      ) : activeTab === 'academy_categories' ? (
        <AcademyCategoriesSection isEditor={isEditor} isAdmin={isAdmin} setToast={setToast} />
      ) : activeTab === 'enquiries' ? (
        <AcademyEnquiriesSection isEditor={isEditor} setToast={setToast} />
      ) : activeTab === 'pillars' ? (
        <PillarsSection isEditor={isEditor} isAdmin={isAdmin} setToast={setToast} />
      ) : activeTab === 'pillar_sections' ? (
        <PillarSectionsSection isEditor={isEditor} isAdmin={isAdmin} setToast={setToast} />
      ) : activeTab === 'offerings' ? (
        <OfferingsSection isEditor={isEditor} isAdmin={isAdmin} setToast={setToast} />
      ) : activeTab === 'institution_audiences' ? (
        <InstitutionAudiencesSection isEditor={isEditor} isAdmin={isAdmin} setToast={setToast} />
      ) : activeTab === 'events' ? (
        <EventsSection isEditor={isEditor} isAdmin={isAdmin} setToast={setToast} />
      ) : activeTab === 'event_registrations' ? (
        <EventRegistrationsSection isEditor={isEditor} isAdmin={isAdmin} setToast={setToast} />
      ) : activeTab === 'success_stories' ? (
        <SuccessStoriesSection isEditor={isEditor} isAdmin={isAdmin} setToast={setToast} />
      ) : activeTab === 'blog_posts' ? (
        <BlogPostsSection isEditor={isEditor} isAdmin={isAdmin} setToast={setToast} />
      ) : activeTab === 'certificates' ? (
        <CertificatesSection isEditor={isEditor} isAdmin={isAdmin} setToast={setToast} />
      ) : activeTab === 'static_pages' ? (
        <StaticPagesSection isEditor={isEditor} isAdmin={isAdmin} setToast={setToast} />
      ) : activeTab === 'team_members' ? (
        <TeamMembersSection isEditor={isEditor} isAdmin={isAdmin} setToast={setToast} />
      ) : activeTab === 'job_listings' ? (
        <JobListingsSection isEditor={isEditor} isAdmin={isAdmin} setToast={setToast} />
      ) : activeTab === 'footer_links' ? (
        <FooterLinksSection isEditor={isEditor} isAdmin={isAdmin} setToast={setToast} />
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-primary">
              <span className="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
            </div>
          ) : dataList.length === 0 ? (
            <EmptyState
              title={`No ${activeTab} records`}
              description="The database starts completely empty with zero seed data as required. Add your first record to begin populating."
              actionText={isEditor ? `Add First ${activeTab.slice(0, -1)}` : null}
              onAction={handleCreateNew}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 text-on-surface-variant font-label text-xs uppercase tracking-wider">
                    <th className="p-4">ID</th>
                    <th className="p-4">Name / Title</th>
                    {activeTab === 'years' && <th className="p-4">College Name</th>}
                    {activeTab === 'years' && <th className="p-4">Seats / Strength</th>}
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 font-body text-sm">
                  {dataList.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="p-4 font-mono text-xs text-on-surface-variant">{item.id}</td>
                      <td className="p-4 font-semibold text-on-surface">
                        {item.name || item.year_label || item.title}
                      </td>
                      {activeTab === 'years' && (
                        <td className="p-4 text-on-surface-variant">
                          {item.college_name || '-'}
                        </td>
                      )}
                      {activeTab === 'years' && (
                        <td className="p-4 font-label text-xs">
                          <span className="text-primary font-bold">{item.total_seats}</span> Seats /{' '}
                          <span className="text-amber-600 font-bold">{item.student_strength}</span> Enrolled
                        </td>
                      )}
                      <td className="p-4 text-right space-x-2">
                        {isEditor && (
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(item.id)}
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
        </div>
      )}

      {/* Modals */}
      {modalOpen && (
        <HierarchyFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          entityType={modalType}
          initialData={selectedItem}
          onSuccess={() => {
            setToast({ message: "Record saved successfully", type: "success" });
            fetchData();
          }}
        />
      )}

      {syllabusModalOpen && (
        <SyllabusUploadModal
          isOpen={syllabusModalOpen}
          onClose={() => setSyllabusModalOpen(false)}
          onSuccess={() => {
            setToast({ message: "Syllabus uploaded successfully", type: "success" });
            fetchData();
          }}
        />
      )}

      {eventInfoModalOpen && (
        <EventInfoFormModal
          isOpen={eventInfoModalOpen}
          onClose={() => setEventInfoModalOpen(false)}
          entityType={eventInfoType}
          onSuccess={() => {
            setToast({ message: "Event / Post published successfully", type: "success" });
            fetchData();
          }}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ManagementConsole;
