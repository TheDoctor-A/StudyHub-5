import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import all components
import LandingPage from './components/LandingPage';
import UniversitySelection from './components/UniversitySelection';
import CourseSelection from './components/CourseSelection';
import SubscriptionPlans from './components/SubscriptionPlans';
import PaymentPage from './components/PaymentPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import AdminLogin from './components/AdminLogin';
import AdminSystem from './components/AdminSystem';
import ContentManager from './components/ContentManager';
import ChangeLogger, { useChangeLogger } from './components/ChangeLogger';

// Import services
import { getAutoSyncService, ContentSyncHelper, AdminSyncHelper } from './services/AutoSyncService';

// Import data
import { universities, courses, subscriptionPlans, adminUsers } from './data/dataModels';

function App() {
  const [user, setUser] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [autoSyncService] = useState(() => getAutoSyncService({
    githubToken: process.env.REACT_APP_GITHUB_TOKEN,
    githubRepo: 'TheDoctor-A/studyhub-Project',
    githubBranch: 'master',
    autoSyncEnabled: true,
    syncInterval: 30000
  }));

  const [contentSyncHelper] = useState(() => new ContentSyncHelper(autoSyncService));
  const [adminSyncHelper] = useState(() => new AdminSyncHelper(autoSyncService));

  const { logChange, undoChange } = useChangeLogger(
    adminUser?.id || user?.id,
    adminUser?.role || user?.role
  );

  useEffect(() => {
    const loadSavedState = () => {
      try {
        const savedUser = localStorage.getItem('studyhub_user');
        const savedAdminUser = localStorage.getItem('studyhub_admin_user');
        const savedUniversity = localStorage.getItem('studyhub_university');
        const savedCourse = localStorage.getItem('studyhub_course');
        const savedSubscription = localStorage.getItem('studyhub_subscription');

        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedAdminUser) setAdminUser(JSON.parse(savedAdminUser));
        if (savedUniversity) setSelectedUniversity(JSON.parse(savedUniversity));
        if (savedCourse) setSelectedCourse(JSON.parse(savedCourse));
        if (savedSubscription) setSubscription(JSON.parse(savedSubscription));
      } catch (error) {
        console.error('Error loading saved state:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSavedState();
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('studyhub_user', JSON.stringify(user));
    else localStorage.removeItem('studyhub_user');
  }, [user]);

  useEffect(() => {
    if (adminUser) localStorage.setItem('studyhub_admin_user', JSON.stringify(adminUser));
    else localStorage.removeItem('studyhub_admin_user');
  }, [adminUser]);

  useEffect(() => {
    if (selectedUniversity) localStorage.setItem('studyhub_university', JSON.stringify(selectedUniversity));
  }, [selectedUniversity]);

  useEffect(() => {
    if (selectedCourse) localStorage.setItem('studyhub_course', JSON.stringify(selectedCourse));
  }, [selectedCourse]);

  useEffect(() => {
    if (subscription) localStorage.setItem('studyhub_subscription', JSON.stringify(subscription));
  }, [subscription]);

  const handleLogin = (userData) => {
    setUser(userData);
    logChange({
      type: 'user',
      action: 'login',
      entity: 'user',
      entityId: userData.id,
      entityName: userData.name,
      description: `User ${userData.name} logged in`,
      userName: userData.name
    });
  };

  const handleLogout = () => {
    if (user) {
      logChange({
        type: 'user',
        action: 'logout',
        entity: 'user',
        entityId: user.id,
        entityName: user.name,
        description: `User ${user.name} logged out`,
        userName: user.name
      });
    }
    setUser(null);
    setSelectedUniversity(null);
    setSelectedCourse(null);
    setSubscription(null);
  };

  const handleAdminLogin = (adminData) => {
    setAdminUser(adminData);
    logChange({
      type: 'admin',
      action: 'login',
      entity: 'admin',
      entityId: adminData.id,
      entityName: adminData.name,
      description: `Admin ${adminData.name} logged in`,
      userName: adminData.name,
      severity: 'warning'
    });
  };

  const handleAdminLogout = () => {
    if (adminUser) {
      logChange({
        type: 'admin',
        action: 'logout',
        entity: 'admin',
        entityId: adminUser.id,
        entityName: adminUser.name,
        description: `Admin ${adminUser.name} logged out`,
        userName: adminUser.name,
        severity: 'warning'
      });
    }
    setAdminUser(null);
  };

  const handleRegister = (userData) => {
    setUser(userData);
    logChange({
      type: 'user',
      action: 'create',
      entity: 'user',
      entityId: userData.id,
      entityName: userData.name,
      description: `New user registered: ${userData.name}`,
      userName: userData.name,
      newValue: userData
    });
  };

  const handleUniversitySelect = (university) => {
    setSelectedUniversity(university);
    logChange({
      type: 'user',
      action: 'update',
      entity: 'selection',
      entityId: 'university',
      entityName: university.name,
      description: `University selected: ${university.name}`,
      userName: user?.name || 'Anonymous',
      oldValue: selectedUniversity,
      newValue: university
    });
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    logChange({
      type: 'user',
      action: 'update',
      entity: 'selection',
      entityId: 'course',
      entityName: course.name,
      description: `Course selected: ${course.name}`,
      userName: user?.name || 'Anonymous',
      oldValue: selectedCourse,
      newValue: course
    });
  };

  const handleSubscription = (subscriptionData) => {
    setSubscription(subscriptionData);
    logChange({
      type: 'subscription',
      action: 'create',
      entity: 'subscription',
      entityId: subscriptionData.id,
      entityName: subscriptionData.planName,
      description: `New subscription: ${subscriptionData.planName}`,
      userName: user?.name || 'Anonymous',
      newValue: subscriptionData,
      severity: 'info'
    });
  };

  const handleContentChange = (contentData) => {
    if (selectedUniversity && selectedCourse) {
      contentSyncHelper.syncContentStructure(
        selectedUniversity.id,
        selectedCourse.id,
        contentData
      );

      logChange({
        type: 'content',
        action: 'update',
        entity: 'content_structure',
        entityId: `${selectedUniversity.id}-${selectedCourse.id}`,
        entityName: `${selectedUniversity.name} - ${selectedCourse.name}`,
        description: 'Content structure updated',
        userName: adminUser?.name || user?.name || 'System',
        newValue: contentData,
        canUndo: true,
        undoData: { contentData }
      });
    }
  };

  const handleUndo = async (change, undoData) => {
    try {
      if (change.type === 'content' && undoData.contentData) {
        if (selectedUniversity && selectedCourse) {
          contentSyncHelper.syncContentStructure(
            selectedUniversity.id,
            selectedCourse.id,
            undoData.contentData
          );
        }
      }
    } catch (error) {
      console.error('Undo failed:', error);
    }
  };

  const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false }) => {
    if (requireAdmin && !adminUser) {
      return <Navigate to="/admin/login" replace />;
    }
    if (requireAuth && !user && !adminUser) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading StudyHub...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/university" element={<UniversitySelection universities={universities} onSelect={handleUniversitySelect} selected={selectedUniversity} />} />
          <Route path="/course" element={<CourseSelection courses={courses} university={selectedUniversity} onSelect={handleCourseSelect} selected={selectedCourse} />} />
          <Route path="/subscription" element={<SubscriptionPlans plans={subscriptionPlans} university={selectedUniversity} course={selectedCourse} />} />
          <Route path="/payment" element={<PaymentPage university={selectedUniversity} course={selectedCourse} onSubscribe={handleSubscription} />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage onRegister={handleRegister} />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard user={user} university={selectedUniversity} course={selectedCourse} subscription={subscription} onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/admin/login" element={<AdminLogin onLogin={handleAdminLogin} />} />
          <Route path="/admin/*" element={<ProtectedRoute requireAdmin={true}><AdminSystem currentUser={adminUser} onLogout={handleAdminLogout} /></ProtectedRoute>} />
          <Route path="/admin/content-manager" element={<ProtectedRoute requireAdmin={true}><div className="min-h-screen bg-gray-50"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><ContentManager universityId={selectedUniversity?.id || 'university-of-reading'} courseId={selectedCourse?.id || 'mpharm'} userRole={adminUser?.role} onContentChange={handleContentChange} /></div></div></ProtectedRoute>} />
          <Route path="/admin/change-history" element={<ProtectedRoute requireAdmin={true}><div className="min-h-screen bg-gray-50"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><ChangeLogger currentUser={adminUser} onUndo={handleUndo} /></div></div></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#363636', color: '#fff' }, success: { duration: 3000, theme: { primary: 'green', secondary: 'black' } } }} />
      </div>
    </Router>
  );
}

export default App;
