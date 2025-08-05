import React, { useState, useEffect } from 'react';
import { 
  Users, Settings, BarChart3, FileText, Crown, Shield, UserPlus, 
  Edit, Trash2, Save, X, Eye, EyeOff, Calendar, DollarSign,
  CheckCircle, XCircle, Clock, AlertTriangle, Plus, Search
} from 'lucide-react';
import { adminUsers, permissions, userRoles, subscriptionPlans } from '../data/dataModels';

const AdminSystem = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [admins, setAdmins] = useState(adminUsers);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);

  const isSuperAdmin = currentUser?.role === userRoles.SUPER_ADMIN;

  // Mock user data for demonstration
  useEffect(() => {
    setUsers([
      {
        id: 'user-1',
        email: 'student1@reading.ac.uk',
        name: 'John Smith',
        university: 'University of Reading',
        course: 'MPharm',
        subscriptionType: 'yearly',
        subscriptionStatus: 'active',
        subscriptionExpiry: '2025-12-30',
        joinDate: '2025-01-15',
        lastActive: '2025-01-30',
        freeAccess: false
      },
      {
        id: 'user-2',
        email: 'student2@reading.ac.uk',
        name: 'Sarah Johnson',
        university: 'University of Reading',
        course: 'MPharm',
        subscriptionType: 'monthly',
        subscriptionStatus: 'active',
        subscriptionExpiry: '2025-02-28',
        joinDate: '2025-01-20',
        lastActive: '2025-01-29',
        freeAccess: false
      }
    ]);

    setAnalytics({
      totalStudents: 2,
      activeSubscriptions: 2,
      monthlyRevenue: 219.98,
      yearlyRevenue: 2639.76,
      courseBreakdown: {
        'MPharm': { students: 2, revenue: 219.98 }
      }
    });
  }, []);

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={analytics.totalStudents}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Subscriptions"
          value={analytics.activeSubscriptions}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Monthly Revenue"
          value={`£${analytics.monthlyRevenue}`}
          icon={DollarSign}
          color="purple"
        />
        <StatCard
          title="Yearly Revenue"
          value={`£${analytics.yearlyRevenue}`}
          icon={BarChart3}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <QuickActions isSuperAdmin={isSuperAdmin} />
      </div>
    </div>
  );

  const renderAdminManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin Management</h2>
        {isSuperAdmin && (
          <button
            onClick={() => setShowAddAdminModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <UserPlus size={20} />
            Add Admin
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.map((admin) => (
                <AdminRow
                  key={admin.id}
                  admin={admin}
                  currentUser={currentUser}
                  isSuperAdmin={isSuperAdmin}
                  onEdit={(admin) => console.log('Edit admin:', admin)}
                  onDelete={(adminId) => {
                    if (window.confirm('Are you sure you want to remove this admin?')) {
                      setAdmins(admins.filter(a => a.id !== adminId));
                    }
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onGrantFreeAccess={(userId, duration) => {
                    console.log('Grant free access:', userId, duration);
                  }}
                  onEditSubscription={(userId, newPlan) => {
                    console.log('Edit subscription:', userId, newPlan);
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSubscriptionManagement = () => (
    <SubscriptionManager 
      plans={subscriptionPlans}
      onUpdatePlan={(planId, updates) => console.log('Update plan:', planId, updates)}
      onCreateOffer={(offer) => console.log('Create offer:', offer)}
    />
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics & Reports</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Revenue by Course</h3>
          <div className="space-y-3">
            {Object.entries(analytics.courseBreakdown || {}).map(([course, data]) => (
              <div key={course} className="flex justify-between items-center">
                <span className="font-medium">{course}</span>
                <div className="text-right">
                  <div className="font-semibold">£{data.revenue}</div>
                  <div className="text-sm text-gray-500">{data.students} students</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Subscription Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Monthly Plans</span>
              <span className="font-semibold">1 (50%)</span>
            </div>
            <div className="flex justify-between">
              <span>Yearly Plans</span>
              <span className="font-semibold">1 (50%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900">StudyHub Admin</h1>
              {isSuperAdmin && (
                <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  <Crown size={12} />
                  Super Admin
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {currentUser?.name}</span>
              <button
                onClick={onLogout}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              <NavItem
                icon={BarChart3}
                label="Dashboard"
                active={activeTab === 'dashboard'}
                onClick={() => setActiveTab('dashboard')}
              />
              {isSuperAdmin && (
                <NavItem
                  icon={Shield}
                  label="Admin Management"
                  active={activeTab === 'admins'}
                  onClick={() => setActiveTab('admins')}
                />
              )}
              <NavItem
                icon={Users}
                label="User Management"
                active={activeTab === 'users'}
                onClick={() => setActiveTab('users')}
              />
              <NavItem
                icon={DollarSign}
                label="Subscriptions"
                active={activeTab === 'subscriptions'}
                onClick={() => setActiveTab('subscriptions')}
              />
              <NavItem
                icon={FileText}
                label="Content"
                active={activeTab === 'content'}
                onClick={() => setActiveTab('content')}
              />
              <NavItem
                icon={BarChart3}
                label="Analytics"
                active={activeTab === 'analytics'}
                onClick={() => setActiveTab('analytics')}
              />
              <NavItem
                icon={Settings}
                label="Settings"
                active={activeTab === 'settings'}
                onClick={() => setActiveTab('settings')}
              />
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'admins' && renderAdminManagement()}
            {activeTab === 'users' && renderUserManagement()}
            {activeTab === 'subscriptions' && renderSubscriptionManagement()}
            {activeTab === 'content' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold mb-4">Content Management</h2>
                <p className="text-gray-600">Content management interface will be integrated here.</p>
              </div>
            )}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold mb-4">System Settings</h2>
                <p className="text-gray-600">System settings interface will be integrated here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddAdminModal && (
        <AddAdminModal
          onSave={(adminData) => {
            const newAdmin = {
              id: `admin-${Date.now()}`,
              ...adminData,
              isActive: true,
              createdAt: new Date().toISOString(),
              appointedBy: currentUser.id
            };
            setAdmins([...admins, newAdmin]);
            setShowAddAdminModal(false);
          }}
          onCancel={() => setShowAddAdminModal(false)}
          isSuperAdmin={isSuperAdmin}
        />
      )}
    </div>
  );
};

// Component: Navigation Item
const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
      active
        ? 'bg-blue-100 text-blue-700 font-medium'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Icon size={20} />
    {label}
  </button>
);

// Component: Stat Card
const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

// Component: Recent Activity
const RecentActivity = () => (
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
    <div className="space-y-3">
      <ActivityItem
        action="New user registered"
        user="Sarah Johnson"
        time="2 hours ago"
        type="user"
      />
      <ActivityItem
        action="Subscription renewed"
        user="John Smith"
        time="5 hours ago"
        type="subscription"
      />
      <ActivityItem
        action="Content updated"
        user="Admin"
        time="1 day ago"
        type="content"
      />
    </div>
  </div>
);

// Component: Activity Item
const ActivityItem = ({ action, user, time, type }) => {
  const typeColors = {
    user: 'bg-blue-100 text-blue-600',
    subscription: 'bg-green-100 text-green-600',
    content: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${typeColors[type]}`} />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{action}</p>
        <p className="text-xs text-gray-500">{user} • {time}</p>
      </div>
    </div>
  );
};

// Component: Quick Actions
const QuickActions = ({ isSuperAdmin }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
    <div className="space-y-3">
      {isSuperAdmin && (
        <button className="w-full flex items-center gap-3 px-4 py-2 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
          <UserPlus size={20} className="text-blue-600" />
          <span className="font-medium">Add New Admin</span>
        </button>
      )}
      <button className="w-full flex items-center gap-3 px-4 py-2 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
        <Plus size={20} className="text-green-600" />
        <span className="font-medium">Add Content</span>
      </button>
      <button className="w-full flex items-center gap-3 px-4 py-2 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
        <DollarSign size={20} className="text-purple-600" />
        <span className="font-medium">Create Offer</span>
      </button>
    </div>
  </div>
);

// Component: Admin Row
const AdminRow = ({ admin, currentUser, isSuperAdmin, onEdit, onDelete }) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10">
          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {admin.name?.charAt(0) || admin.email.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">{admin.name}</div>
          <div className="text-sm text-gray-500">{admin.email}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center gap-2">
        {admin.role === userRoles.SUPER_ADMIN ? (
          <>
            <Crown size={16} className="text-yellow-500" />
            <span className="text-sm font-medium text-yellow-700">Super Admin</span>
          </>
        ) : (
          <>
            <Shield size={16} className="text-blue-500" />
            <span className="text-sm font-medium text-blue-700">Admin</span>
          </>
        )}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="text-sm text-gray-500">
        {admin.permissions?.length || 0} permissions
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div className="flex items-center gap-2">
        {isSuperAdmin && admin.id !== currentUser?.id && (
          <>
            <button
              onClick={() => onEdit(admin)}
              className="text-blue-600 hover:text-blue-900"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(admin.id)}
              className="text-red-600 hover:text-red-900"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </td>
  </tr>
);

// Component: User Row
const UserRow = ({ user, onGrantFreeAccess, onEditSubscription }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {user.name.charAt(0)}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{user.course}</div>
        <div className="text-sm text-gray-500">{user.university}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 capitalize">{user.subscriptionType}</div>
        <div className="text-sm text-gray-500">Expires: {user.subscriptionExpiry}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          user.subscriptionStatus === 'active' 
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {user.subscriptionStatus}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Settings size={16} />
          </button>
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                <button
                  onClick={() => {
                    onGrantFreeAccess(user.id, 30);
                    setShowActions(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Grant 30-day free access
                </button>
                <button
                  onClick={() => {
                    onEditSubscription(user.id, 'yearly');
                    setShowActions(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Change to yearly plan
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

// Component: Subscription Manager
const SubscriptionManager = ({ plans, onUpdatePlan, onCreateOffer }) => {
  const [editingPlan, setEditingPlan] = useState(null);
  const [showOfferModal, setShowOfferModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Subscription Management</h2>
        <button
          onClick={() => setShowOfferModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus size={20} />
          Create Offer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">£{plan.price}</span>
                  <span className="text-gray-500">/{plan.interval}</span>
                </div>
              </div>
              <button
                onClick={() => setEditingPlan(plan)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <Edit size={16} />
              </button>
            </div>
            
            <ul className="space-y-2 mb-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle size={16} className="text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Status: {plan.isActive ? 'Active' : 'Inactive'}</span>
              {plan.discount > 0 && (
                <span className="text-green-600 font-medium">{plan.discount}% off</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component: Add Admin Modal
const AddAdminModal = ({ onSave, onCancel, isSuperAdmin }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: userRoles.ADMIN,
    permissions: []
  });

  const permissionCategories = {
    'Content Management': [
      permissions.CONTENT_VIEW,
      permissions.CONTENT_CREATE,
      permissions.CONTENT_EDIT,
      permissions.CONTENT_DELETE,
      permissions.CONTENT_SUGGEST_CHANGES,
      permissions.CONTENT_EDIT_IMMEDIATE
    ],
    'Subscription Management': [
      permissions.SUBSCRIPTION_VIEW,
      permissions.SUBSCRIPTION_EDIT,
      permissions.SUBSCRIPTION_CREATE_OFFERS,
      permissions.SUBSCRIPTION_MANAGE_PRICING,
      permissions.SUBSCRIPTION_GRANT_FREE,
      permissions.SUBSCRIPTION_CONTROL_DURATION
    ],
    'User Management': [
      permissions.USER_VIEW,
      permissions.USER_EDIT,
      permissions.USER_DELETE,
      permissions.USER_GRANT_FREE_ACCESS
    ],
    'Website Management': [
      permissions.WEBSITE_EDIT_LAYOUT,
      permissions.WEBSITE_EDIT_DESIGN,
      permissions.WEBSITE_MANAGE_SETTINGS
    ],
    'Analytics': [
      permissions.ANALYTICS_VIEW_STUDENTS,
      permissions.ANALYTICS_VIEW_REVENUE,
      permissions.ANALYTICS_VIEW_REPORTS
    ],
    'System': [
      permissions.SYSTEM_VIEW_LOGS,
      permissions.SYSTEM_UNDO_CHANGES,
      permissions.SYSTEM_BACKUP_RESTORE
    ]
  };

  const handlePermissionChange = (permission, checked) => {
    if (checked) {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permission]
      });
    } else {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter(p => p !== permission)
      });
    }
  };

  const handleRoleChange = (role) => {
    if (role === userRoles.SUPER_ADMIN) {
      setFormData({
        ...formData,
        role,
        permissions: Object.values(permissions)
      });
    } else {
      setFormData({
        ...formData,
        role,
        permissions: []
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Add New Admin</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Admin name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          {isSuperAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Type</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="adminType"
                    checked={formData.role === userRoles.SUPER_ADMIN}
                    onChange={() => handleRoleChange(userRoles.SUPER_ADMIN)}
                  />
                  <Crown size={16} className="text-yellow-500" />
                  <span className="font-medium">Super Administrator</span>
                  <span className="text-sm text-gray-500">(Full access to everything)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="adminType"
                    checked={formData.role === userRoles.ADMIN}
                    onChange={() => handleRoleChange(userRoles.ADMIN)}
                  />
                  <Shield size={16} className="text-blue-500" />
                  <span className="font-medium">Regular Administrator</span>
                  <span className="text-sm text-gray-500">(Custom permissions)</span>
                </label>
              </div>
            </div>
          )}

          {formData.role === userRoles.ADMIN && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
              <div className="space-y-4 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
                {Object.entries(permissionCategories).map(([category, categoryPermissions]) => (
                  <div key={category}>
                    <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                    <div className="space-y-2 ml-4">
                      {categoryPermissions.map((permission) => (
                        <label key={permission} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(permission)}
                            onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                          />
                          <span className="text-sm">{permission.replace(/_/g, ' ').toLowerCase()}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onSave(formData)}
            disabled={!formData.email.trim() || !formData.name.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Add Admin
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSystem;

