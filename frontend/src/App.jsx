import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BackendHealthProvider } from './context/BackendHealthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ServerWakeupBanner from './components/common/ServerWakeupBanner';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import InstitutionPage from './pages/InstitutionPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminConsolePage from './pages/AdminConsolePage';
import CourseMatrixPage from './pages/CourseMatrixPage';
import CoachingPage from './pages/CoachingPage';
import ProblemStatementsPage from './pages/ProblemStatementsPage';
import UsersAdminPage from './pages/UsersAdminPage';
function App() {
  return (
    <BackendHealthProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-background text-on-background antialiased font-body">
            <ServerWakeupBanner />
            <Navbar />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/institution/:id" element={<InstitutionPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/course-matrix" element={<CourseMatrixPage />} />
                <Route path="/coaching" element={<CoachingPage />} />
                <Route path="/problem-statements" element={<ProblemStatementsPage />} />
                <Route path="/management" element={<AdminConsolePage />} />
                <Route path="/admin/users" element={<UsersAdminPage />} />
                <Route path="/users" element={<UsersAdminPage />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </BackendHealthProvider>
  );
}

export default App;