import React, { useState, useEffect, useMemo } from 'react';
import { Search, BookOpen, MapPin, Loader2, AlertCircle, Plus, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchCourseMatrix, fetchCities, addCollege } from '../api/courseMatrixApi';
import AddCollegeModal from '../components/courseMatrix/AddCollegeModal';

// Comprehensive list of courses organized by stream (same as HierarchyFormModal)
const COURSE_OPTIONS = [
  // Science Stream (B.Sc.)
  "B.Sc. Computer Science (B.Sc. CS)",
  "B.Sc. Information Technology Management (B.Sc. ITM)",
  "B.Sc. Physics Hons",
  "B.Sc. Chemistry Hons",
  "B.Sc. Mathematics Hons",
  "B.Sc. Botany Hons",
  "B.Sc. Zoology Hons",
  "B.Sc. Geology Hons",
  "B.Sc. Biotechnology",
  "B.Sc. Microbiology",
  "B.Sc. Statistics",
  "B.Sc. Electronics",
  "B.Sc. Environmental Science",
  "B.Sc. Anthropology",
  "B.Sc. Geography",
  // Computer Applications & IT (BCA)
  "BCA (Bachelor of Computer Applications)",
  // Engineering Stream (B.Tech.)
  "Computer Science & Engineering (CSE)",
  "Information Technology (IT)",
  "Artificial Intelligence & Machine Learning (AI & ML)",
  "Data Science",
  "Electronics & Telecommunication Engineering (ETC)",
  "Electrical & Electronics Engineering (EEE)",
  "Electrical Engineering (EE)",
  "Mechanical Engineering (ME)",
  "Civil Engineering (CE)",
  "Chemical Engineering",
  "Metallurgical & Materials Engineering",
  "Biotechnology / Biomedical Engineering",
  "Textile Engineering",
  // Arts & Humanities Stream (B.A.)
  "B.A. Economics Hons",
  "B.A. Political Science Hons",
  "B.A. History Hons",
  "B.A. Sociology Hons",
  "B.A. English Hons",
  "B.A. Odia Hons",
  "B.A. Sanskrit Hons (Shastri)",
  "B.A. Philosophy Hons",
  "B.A. Psychology Hons",
  "B.A. Geography Hons",
  "B.A. Hindi Hons",
  "B.A. Education Hons",
  "B.A. Journalism & Mass Communication (BJMC)",
  // Commerce & Management Stream (B.Com / BBA)
  "B.Com. Accounting / Accountancy Hons",
  "B.Com. Finance Hons",
  "B.Com. Management Hons",
  "BBA (Bachelor of Business Administration)",
  "BBM (Bachelor of Business Management)",
  // Medical & Health Sciences
  "MBBS (Bachelor of Medicine, Bachelor of Surgery)",
  "BDS (Bachelor of Dental Surgery)",
  "B.Pharm. (Bachelor of Pharmacy)",
  "B.Sc. Nursing",
  "BAMS (Bachelor of Ayurvedic Medicine & Surgery)",
  "BHMS (Bachelor of Homoeopathic Medicine & Surgery)",
  "BPT (Bachelor of Physiotherapy)",
  "BPO (Bachelor in Prosthetics and Orthotics)",
  "BASLP (Bachelor in Audiology and Speech-Language Pathology)",
  // Agriculture & Allied Sciences
  "B.Sc. (Hons.) Agriculture",
  "B.Sc. (Hons.) Horticulture",
  "B.Sc. (Hons.) Forestry",
  "B.F.Sc. (Bachelor of Fisheries Science)",
  "B.Tech. Agricultural Engineering",
  "B.Sc. (Hons.) Community Science",
  // Law & Education
  "LL.B. (3-Year Graduate Law)",
  "Integrated B.A. LL.B. (5-Year)",
  "Integrated BBA LL.B. (5-Year)",
  "Integrated B.Sc. LL.B. (5-Year)",
  "B.Ed. (Bachelor of Education Teacher Training)",
  "B.P.Ed. (Bachelor of Physical Education)",
  "Integrated B.A. B.Ed. / B.Sc. B.Ed. (4-Year NEP aligned)",
  // Specialized Creative & Professional Degrees
  "B.Arch. (Bachelor of Architecture)",
  "B.Plan. (Bachelor of Planning)",
  "B.V.A. (Bachelor of Visual Art)",
  "B.P.A. (Bachelor of Performing Art)",
  "BSW (Bachelor of Social Work)",
  "BHMCT (Bachelor of Hotel Management & Catering Technology)",
  "BTTM (Bachelor of Tourism & Travel Management)",
];

const CourseMatrixPage = () => {
  const { isEditor } = useAuth();
  const [data, setData] = useState({ courses: [], colleges: [] });
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [addCollegeModalOpen, setAddCollegeModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [matrixData, citiesData] = await Promise.all([
        fetchCourseMatrix(),
        fetchCities()
      ]);
      setData(matrixData);
      setCities(citiesData);
      setError(null);
    } catch (err) {
      setError('Failed to load course matrix data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredColleges = useMemo(() => {
    if (!selectedCourse) return [];

    return data.colleges.filter(college => {
      const offersCourse = college.courses_offered.includes(selectedCourse);
      const matchesSearch = college.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = !selectedCity || (college.city && college.city.toLowerCase() === selectedCity.toLowerCase());
      return offersCourse && matchesSearch && matchesCity;
    });
  }, [data, selectedCourse, searchQuery, selectedCity]);

  const handleAddCollege = async (collegeData) => {
    try {
      await addCollege(collegeData);
      setAddCollegeModalOpen(false);
      loadData();
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-surface p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary to-primary-container p-8 rounded-3xl shadow-md text-on-primary">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-headline text-4xl font-bold mb-4 flex items-center gap-3">
                <BookOpen className="w-10 h-10" />
                College Course Finder
              </h1>
              <p className="text-on-primary/90 text-lg max-w-2xl font-body">
                Select a course to discover which colleges and institutions offer it. You can further filter the results by searching for a specific college name or city.
              </p>
            </div>
            {isEditor && (
              <button
                onClick={() => setAddCollegeModalOpen(true)}
                className="bg-on-primary text-primary px-6 py-3 rounded-xl font-label font-semibold flex items-center gap-2 hover:bg-on-primary/90 transition-colors shadow-md"
              >
                <Plus className="w-5 h-5" />
                Add College
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-on-surface-variant font-label text-lg">Loading course data...</p>
          </div>
        ) : error ? (
          <div className="bg-error-container text-on-error-container p-6 rounded-2xl flex items-center gap-4">
            <AlertCircle className="w-8 h-8 flex-shrink-0" />
            <div>
              <h3 className="font-bold font-headline text-lg">Error</h3>
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* Sidebar Controls */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-surface-container-low p-6 rounded-2xl shadow-sm border border-outline-variant/30 sticky top-24">
                <h2 className="font-headline text-xl font-semibold text-on-surface mb-6">Filter Options</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-label font-bold text-on-surface mb-2">
                      Select Course <span className="text-error">*</span>
                    </label>
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="w-full bg-surface text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="">-- Choose a course --</option>
                      {COURSE_OPTIONS.map(course => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-label font-bold text-on-surface mb-2">
                      City
                    </label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full bg-surface text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="">All Cities</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-label font-bold text-on-surface mb-2">
                      Search College Name
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                      <input
                        type="text"
                        placeholder="e.g. Berhampur..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-surface text-on-surface border border-outline rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Area */}
            <div className="lg:col-span-3">
              {!selectedCourse ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 bg-surface-container-lowest rounded-2xl border-2 border-dashed border-outline-variant/50">
                  <BookOpen className="w-16 h-16 text-primary/40 mb-4" />
                  <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">No Course Selected</h3>
                  <p className="text-on-surface-variant font-body max-w-md">
                    Please select a course from the filter menu on the left to view the list of colleges offering it.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap justify-between items-center mb-6 px-2 gap-4">
                    <h2 className="font-headline text-2xl font-bold text-on-surface">
                      Colleges offering <span className="text-primary">{selectedCourse}</span>
                    </h2>
                    <div className="flex items-center gap-4">
                      <span className="bg-primary-container text-on-primary-container px-4 py-1.5 rounded-full font-label font-bold text-sm">
                        {filteredColleges.length} Found
                      </span>
                      {selectedCity && (
                        <span className="bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full font-label text-sm flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {selectedCity}
                        </span>
                      )}
                    </div>
                  </div>

                  {filteredColleges.length === 0 ? (
                    <div className="text-center p-12 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
                      <Building2 className="w-16 h-16 text-on-surface-variant/30 mx-auto mb-4" />
                      <h3 className="font-headline text-xl font-semibold text-on-surface-variant mb-2">No Colleges Match</h3>
                      <p className="text-on-surface-variant font-body">
                        No colleges match your current filters. Try changing the course, city, or search query.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredColleges.map((college, idx) => (
                        <div
                          key={college.id || idx}
                          className="bg-surface-container-lowest hover:bg-surface-container-low transition-colors p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex items-start gap-4"
                        >
                          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold flex-shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <h3 className="font-headline font-bold text-on-surface text-lg mb-1 leading-tight">
                              {college.name}
                            </h3>
                            {college.city && (
                              <div className="flex items-center gap-1.5 text-on-surface-variant text-sm font-label mb-2">
                                <MapPin className="w-4 h-4" />
                                <span>{college.city}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 text-on-surface-variant text-sm font-label">
                              <BookOpen className="w-4 h-4" />
                              <span>{selectedCourse}</span>
                            </div>
                            {college.source === 'db' && (
                              <span className="ml-2 px-2 py-0.5 bg-primary-container/50 text-primary text-xs font-label rounded">Custom</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Add College Modal */}
        <AddCollegeModal
          isOpen={addCollegeModalOpen}
          onClose={() => setAddCollegeModalOpen(false)}
          onSuccess={loadData}
          allCourses={COURSE_OPTIONS}
        />
      </div>
    </div>
  );
};

export default CourseMatrixPage;