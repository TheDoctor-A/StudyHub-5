// Enhanced Data Models for StudyHub Complete System
// Supports unlimited hierarchical nesting and comprehensive tracking

// Universities data structure
export const universities = [
  {
    id: 'reading',
    name: 'University of Reading',
    code: 'UOR',
    location: 'Reading, UK',
    established: 1892,
    description: 'A leading research university with excellence in teaching and learning',
    logo: '/assets/university-reading-logo.png',
    courses: ['mpharm'],
    isActive: true,
    createdAt: '2025-01-30T00:00:00Z',
    updatedAt: '2025-01-30T00:00:00Z'
  }
];

// Courses data structure
export const courses = [
  {
    id: 'mpharm',
    name: 'Master of Pharmacy (MPharm)',
    code: 'MPHARM',
    universityId: 'reading',
    duration: '4 years',
    level: 'Undergraduate',
    description: 'Professional pharmacy degree preparing students for careers in pharmaceutical practice',
    requirements: ['A-levels in Chemistry and Biology', 'Mathematics GCSE Grade B or above'],
    careerProspects: ['Community Pharmacist', 'Hospital Pharmacist', 'Industrial Pharmacist', 'Research Scientist'],
    isActive: true,
    createdAt: '2025-01-30T00:00:00Z',
    updatedAt: '2025-01-30T00:00:00Z'
  }
];

// Hierarchical Content Structure - Supports unlimited nesting
export const contentStructure = {
  'reading-mpharm': {
    id: 'reading-mpharm',
    universityId: 'reading',
    courseId: 'mpharm',
    subjects: {
      'pharmacology': {
        id: 'pharmacology',
        name: 'Pharmacology',
        description: 'Study of drug action and interaction with living systems',
        order: 1,
        icon: 'pill',
        color: '#3B82F6',
        isActive: true,
        hasContent: false,
        contentTypes: ['notes', 'flashcards', 'past-papers', 'practice-papers'],
        topics: {
          'drug-mechanisms': {
            id: 'drug-mechanisms',
            name: 'Drug Mechanisms of Action',
            description: 'How drugs interact with biological systems',
            order: 1,
            hasContent: true,
            contentTypes: ['notes', 'flashcards'],
            subtopics: {
              'receptor-theory': {
                id: 'receptor-theory',
                name: 'Receptor Theory',
                description: 'Principles of drug-receptor interactions',
                order: 1,
                hasContent: true,
                contentTypes: ['notes', 'flashcards'],
                content: {
                  notes: [
                    {
                      id: 'receptor-theory-basics',
                      title: 'Introduction to Receptor Theory',
                      content: 'Receptor theory explains how drugs produce their effects...',
                      author: 'System',
                      createdAt: '2025-01-30T00:00:00Z',
                      updatedAt: '2025-01-30T00:00:00Z'
                    }
                  ],
                  flashcards: [
                    {
                      id: 'receptor-def',
                      front: 'What is a receptor?',
                      back: 'A protein molecule that binds to specific substances and triggers a biological response',
                      difficulty: 'easy',
                      createdAt: '2025-01-30T00:00:00Z'
                    }
                  ]
                }
              }
            }
          },
          'pharmacokinetics': {
            id: 'pharmacokinetics',
            name: 'Pharmacokinetics',
            description: 'What the body does to drugs - ADME processes',
            order: 2,
            hasContent: true,
            contentTypes: ['notes', 'past-papers'],
            content: {
              notes: [
                {
                  id: 'adme-overview',
                  title: 'ADME Processes Overview',
                  content: 'Absorption, Distribution, Metabolism, and Excretion...',
                  author: 'System',
                  createdAt: '2025-01-30T00:00:00Z',
                  updatedAt: '2025-01-30T00:00:00Z'
                }
              ]
            }
          }
        }
      },
      'pharmaceutical-chemistry': {
        id: 'pharmaceutical-chemistry',
        name: 'Pharmaceutical Chemistry',
        description: 'Chemical aspects of drug design and development',
        order: 2,
        icon: 'flask',
        color: '#10B981',
        isActive: true,
        hasContent: false,
        contentTypes: ['notes', 'flashcards', 'past-papers'],
        topics: {
          'organic-chemistry': {
            id: 'organic-chemistry',
            name: 'Organic Chemistry Foundations',
            description: 'Basic organic chemistry principles for pharmacy',
            order: 1,
            hasContent: true,
            contentTypes: ['notes', 'practice-papers']
          }
        }
      }
    },
    createdAt: '2025-01-30T00:00:00Z',
    updatedAt: '2025-01-30T00:00:00Z'
  }
};

// Subscription plans with enhanced features
export const subscriptionPlans = [
  {
    id: 'monthly',
    name: 'Monthly Plan',
    price: 19.99,
    currency: 'GBP',
    interval: 'month',
    features: [
      'Access to all study materials',
      'Interactive flashcards',
      'Past papers with solutions',
      'Practice tests',
      'Progress tracking',
      'Mobile app access'
    ],
    isActive: true,
    discount: 0,
    originalPrice: 19.99
  },
  {
    id: 'yearly',
    name: 'Yearly Plan',
    price: 199.99,
    currency: 'GBP',
    interval: 'year',
    features: [
      'All Monthly Plan features',
      '2 months free (17% savings)',
      'Priority support',
      'Exclusive content updates',
      'Study group access',
      'Career guidance resources'
    ],
    isActive: true,
    discount: 17,
    originalPrice: 239.88,
    popular: true
  }
];

// User roles and permissions system
export const userRoles = {
  STUDENT: 'student',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
};

export const permissions = {
  // Content Management
  CONTENT_VIEW: 'content_view',
  CONTENT_CREATE: 'content_create',
  CONTENT_EDIT: 'content_edit',
  CONTENT_DELETE: 'content_delete',
  CONTENT_SUGGEST_CHANGES: 'content_suggest_changes',
  CONTENT_EDIT_IMMEDIATE: 'content_edit_immediate',
  
  // Subscription Management
  SUBSCRIPTION_VIEW: 'subscription_view',
  SUBSCRIPTION_EDIT: 'subscription_edit',
  SUBSCRIPTION_CREATE_OFFERS: 'subscription_create_offers',
  SUBSCRIPTION_MANAGE_PRICING: 'subscription_manage_pricing',
  SUBSCRIPTION_GRANT_FREE: 'subscription_grant_free',
  SUBSCRIPTION_CONTROL_DURATION: 'subscription_control_duration',
  
  // User Management
  USER_VIEW: 'user_view',
  USER_EDIT: 'user_edit',
  USER_DELETE: 'user_delete',
  USER_GRANT_FREE_ACCESS: 'user_grant_free_access',
  
  // Admin Management
  ADMIN_VIEW: 'admin_view',
  ADMIN_CREATE: 'admin_create',
  ADMIN_EDIT_PERMISSIONS: 'admin_edit_permissions',
  ADMIN_DELETE: 'admin_delete',
  
  // Website Management
  WEBSITE_EDIT_LAYOUT: 'website_edit_layout',
  WEBSITE_EDIT_DESIGN: 'website_edit_design',
  WEBSITE_MANAGE_SETTINGS: 'website_manage_settings',
  
  // Analytics
  ANALYTICS_VIEW_STUDENTS: 'analytics_view_students',
  ANALYTICS_VIEW_REVENUE: 'analytics_view_revenue',
  ANALYTICS_VIEW_REPORTS: 'analytics_view_reports',
  
  // System
  SYSTEM_VIEW_LOGS: 'system_view_logs',
  SYSTEM_UNDO_CHANGES: 'system_undo_changes',
  SYSTEM_BACKUP_RESTORE: 'system_backup_restore'
};

// Admin user data with your email as super admin
export const adminUsers = [
  {
    id: 'admin-1',
    email: 'Abdul66924@gmail.com',
    name: 'Abdul',
    role: userRoles.SUPER_ADMIN,
    permissions: Object.values(permissions), // All permissions
    isActive: true,
    createdAt: '2025-01-30T00:00:00Z',
    lastLogin: '2025-01-30T00:00:00Z',
    appointedBy: 'system',
    avatar: '/avatars/admin-1.jpg'
  }
];

// Change log structure for tracking all modifications
export const changeLogStructure = {
  id: 'string', // Unique identifier
  timestamp: 'ISO string', // When the change occurred
  userId: 'string', // Who made the change
  userEmail: 'string', // Email of the user
  userRole: 'string', // Role of the user
  action: 'string', // CREATE, UPDATE, DELETE, RESTORE
  entityType: 'string', // content, user, admin, subscription, etc.
  entityId: 'string', // ID of the affected entity
  entityPath: 'string', // Full path for nested content
  changes: {
    before: 'object', // State before change
    after: 'object', // State after change
    fields: ['array'] // List of changed fields
  },
  description: 'string', // Human-readable description
  canUndo: 'boolean', // Whether this change can be undone
  undoData: 'object', // Data needed to undo the change
  isUndone: 'boolean', // Whether this change has been undone
  undoneAt: 'ISO string', // When it was undone
  undoneBy: 'string' // Who undid it
};

// Mock change log data
export const changeLogs = [
  {
    id: 'log-1',
    timestamp: '2025-01-30T10:30:00Z',
    userId: 'admin-1',
    userEmail: 'Abdul66924@gmail.com',
    userRole: 'super_admin',
    action: 'CREATE',
    entityType: 'content',
    entityId: 'receptor-theory-basics',
    entityPath: 'reading-mpharm/pharmacology/drug-mechanisms/receptor-theory',
    changes: {
      before: null,
      after: {
        title: 'Introduction to Receptor Theory',
        content: 'Receptor theory explains how drugs produce their effects...'
      },
      fields: ['title', 'content']
    },
    description: 'Created new note: Introduction to Receptor Theory',
    canUndo: true,
    undoData: { action: 'delete', entityId: 'receptor-theory-basics' },
    isUndone: false
  }
];

// Demo and trial configuration
export const demoConfig = {
  isEnabled: true,
  duration: 7, // days
  accessLevel: 'limited', // limited, full
  allowedContent: {
    subjects: ['pharmacology'], // Only pharmacology for demo
    contentTypes: ['notes'], // Only notes, no flashcards/papers
    maxItems: 3 // Maximum 3 items per content type
  },
  features: {
    downloadEnabled: false,
    printEnabled: false,
    shareEnabled: false,
    progressTracking: true
  }
};

// System settings that can be modified from admin panel
export const systemSettings = {
  site: {
    name: 'StudyHub',
    tagline: 'Your University Study Materials, All in One Place',
    description: 'Access comprehensive study materials, flashcards, past papers, and practice tests specifically tailored to your university and course.',
    logo: '/assets/studyhub-logo.png',
    favicon: '/assets/favicon.ico',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981'
  },
  features: {
    registrationEnabled: true,
    demoEnabled: true,
    subscriptionRequired: true,
    socialLogin: false,
    emailVerification: false
  },
  limits: {
    maxUniversities: 50,
    maxCoursesPerUniversity: 100,
    maxSubjectsPerCourse: 20,
    maxContentPerSubject: 1000
  },
  integrations: {
    github: {
      enabled: true,
      autoSync: true,
      repository: 'TheDoctor-A/studyhub-Project',
      branch: 'master'
    },
    vercel: {
      enabled: true,
      autoDeploy: true,
      projectId: 'studyhub-project'
    },
    analytics: {
      enabled: true,
      provider: 'google',
      trackingId: ''
    }
  }
};

export default {
  universities,
  courses,
  contentStructure,
  subscriptionPlans,
  userRoles,
  permissions,
  adminUsers,
  changeLogStructure,
  changeLogs,
  demoConfig,
  systemSettings
};

