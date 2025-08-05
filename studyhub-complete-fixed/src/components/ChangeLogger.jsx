import React, { useState, useEffect, useCallback } from 'react';
import { 
  History, Undo2, Eye, Search, Filter, Calendar, User, 
  FileText, Settings, Trash2, Plus, Edit, AlertTriangle,
  CheckCircle, XCircle, Clock, RotateCcw, Download
} from 'lucide-react';

// Change Logger Hook - This will be used throughout the app
export const useChangeLogger = (userId, userRole) => {
  const [changes, setChanges] = useState([]);

  const logChange = useCallback((changeData) => {
    const change = {
      id: `change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      userId,
      userRole,
      userName: changeData.userName || 'Unknown User',
      type: changeData.type, // 'content', 'admin', 'subscription', 'user', 'system'
      action: changeData.action, // 'create', 'update', 'delete', 'restore'
      entity: changeData.entity, // What was changed
      entityId: changeData.entityId,
      entityName: changeData.entityName,
      description: changeData.description,
      oldValue: changeData.oldValue || null,
      newValue: changeData.newValue || null,
      metadata: changeData.metadata || {},
      canUndo: changeData.canUndo !== false, // Default to true
      undoData: changeData.undoData || null,
      isUndone: false,
      undoneAt: null,
      undoneBy: null,
      severity: changeData.severity || 'info', // 'info', 'warning', 'critical'
      category: changeData.category || 'general',
      affectedUsers: changeData.affectedUsers || [],
      ipAddress: changeData.ipAddress || 'Unknown',
      userAgent: changeData.userAgent || 'Unknown'
    };

    setChanges(prev => [change, ...prev]);
    
    // Store in localStorage for persistence
    const storedChanges = JSON.parse(localStorage.getItem('studyhub_changes') || '[]');
    const updatedChanges = [change, ...storedChanges].slice(0, 10000); // Keep last 10k changes
    localStorage.setItem('studyhub_changes', JSON.stringify(updatedChanges));

    return change.id;
  }, [userId, userRole]);

  const undoChange = useCallback((changeId, undoUserId, undoUserName) => {
    const change = changes.find(c => c.id === changeId);
    if (!change || !change.canUndo || change.isUndone) {
      return false;
    }

    // Create undo change log
    const undoChange = {
      id: `undo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      userId: undoUserId,
      userRole,
      userName: undoUserName,
      type: 'system',
      action: 'undo',
      entity: change.entity,
      entityId: change.entityId,
      entityName: change.entityName,
      description: `Undid: ${change.description}`,
      oldValue: change.newValue,
      newValue: change.oldValue,
      metadata: { originalChangeId: changeId },
      canUndo: false,
      severity: 'warning',
      category: 'undo'
    };

    // Mark original change as undone
    const updatedChanges = changes.map(c => 
      c.id === changeId 
        ? { ...c, isUndone: true, undoneAt: new Date().toISOString(), undoneBy: undoUserId }
        : c
    );

    setChanges([undoChange, ...updatedChanges]);

    // Update localStorage
    const storedChanges = JSON.parse(localStorage.getItem('studyhub_changes') || '[]');
    const updatedStoredChanges = storedChanges.map(c => 
      c.id === changeId 
        ? { ...c, isUndone: true, undoneAt: new Date().toISOString(), undoneBy: undoUserId }
        : c
    );
    updatedStoredChanges.unshift(undoChange);
    localStorage.setItem('studyhub_changes', JSON.stringify(updatedStoredChanges));

    return change.undoData;
  }, [changes, userRole]);

  const getChanges = useCallback((filters = {}) => {
    let filteredChanges = changes;

    if (filters.type) {
      filteredChanges = filteredChanges.filter(c => c.type === filters.type);
    }
    if (filters.userId) {
      filteredChanges = filteredChanges.filter(c => c.userId === filters.userId);
    }
    if (filters.entity) {
      filteredChanges = filteredChanges.filter(c => c.entity === filters.entity);
    }
    if (filters.dateFrom) {
      filteredChanges = filteredChanges.filter(c => new Date(c.timestamp) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filteredChanges = filteredChanges.filter(c => new Date(c.timestamp) <= new Date(filters.dateTo));
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredChanges = filteredChanges.filter(c => 
        c.description.toLowerCase().includes(searchLower) ||
        c.entityName.toLowerCase().includes(searchLower) ||
        c.userName.toLowerCase().includes(searchLower)
      );
    }

    return filteredChanges;
  }, [changes]);

  // Load changes from localStorage on mount
  useEffect(() => {
    const storedChanges = JSON.parse(localStorage.getItem('studyhub_changes') || '[]');
    setChanges(storedChanges);
  }, []);

  return { logChange, undoChange, getChanges, changes };
};

// Main Change Logger Component
const ChangeLogger = ({ currentUser, onUndo }) => {
  const { changes, undoChange, getChanges } = useChangeLogger(currentUser?.id, currentUser?.role);
  const [filters, setFilters] = useState({
    type: '',
    dateFrom: '',
    dateTo: '',
    search: '',
    severity: '',
    showUndone: false
  });
  const [selectedChange, setSelectedChange] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredChanges = getChanges(filters).filter(change => 
    filters.showUndone || !change.isUndone
  );

  const handleUndo = async (change) => {
    if (!window.confirm(`Are you sure you want to undo: ${change.description}?`)) {
      return;
    }

    const undoData = undoChange(change.id, currentUser.id, currentUser.name);
    if (undoData && onUndo) {
      await onUndo(change, undoData);
    }
  };

  const exportChanges = () => {
    const dataStr = JSON.stringify(filteredChanges, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `studyhub-changes-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Change History</h2>
          <p className="text-gray-600">Track all changes made to your StudyHub platform</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <Filter size={20} />
            Filters
          </button>
          <button
            onClick={exportChanges}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download size={20} />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg"
                  placeholder="Search changes..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Types</option>
                <option value="content">Content</option>
                <option value="admin">Admin</option>
                <option value="subscription">Subscription</option>
                <option value="user">User</option>
                <option value="system">System</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.showUndone}
                onChange={(e) => setFilters({ ...filters, showUndone: e.target.checked })}
              />
              <span className="text-sm">Show undone changes</span>
            </label>
            
            <button
              onClick={() => setFilters({
                type: '',
                dateFrom: '',
                dateTo: '',
                search: '',
                severity: '',
                showUndone: false
              })}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Changes"
          value={changes.length}
          icon={History}
          color="blue"
        />
        <StatCard
          title="Today's Changes"
          value={changes.filter(c => 
            new Date(c.timestamp).toDateString() === new Date().toDateString()
          ).length}
          icon={Clock}
          color="green"
        />
        <StatCard
          title="Undone Changes"
          value={changes.filter(c => c.isUndone).length}
          icon={RotateCcw}
          color="orange"
        />
        <StatCard
          title="Critical Changes"
          value={changes.filter(c => c.severity === 'critical').length}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Changes List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Recent Changes ({filteredChanges.length})</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredChanges.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <History size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No changes found matching your criteria</p>
            </div>
          ) : (
            filteredChanges.map((change) => (
              <ChangeItem
                key={change.id}
                change={change}
                onUndo={handleUndo}
                onViewDetails={setSelectedChange}
                canUndo={currentUser?.role === 'super_admin' || change.userId === currentUser?.id}
              />
            ))
          )}
        </div>
      </div>

      {/* Change Details Modal */}
      {selectedChange && (
        <ChangeDetailsModal
          change={selectedChange}
          onClose={() => setSelectedChange(null)}
          onUndo={handleUndo}
          canUndo={currentUser?.role === 'super_admin' || selectedChange.userId === currentUser?.id}
        />
      )}
    </div>
  );
};

// Component: Stat Card
const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600'
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

// Component: Change Item
const ChangeItem = ({ change, onUndo, onViewDetails, canUndo }) => {
  const getChangeIcon = (type, action) => {
    if (type === 'content') {
      if (action === 'create') return <Plus size={16} className="text-green-600" />;
      if (action === 'update') return <Edit size={16} className="text-blue-600" />;
      if (action === 'delete') return <Trash2 size={16} className="text-red-600" />;
    }
    if (type === 'admin') return <Settings size={16} className="text-purple-600" />;
    if (type === 'user') return <User size={16} className="text-indigo-600" />;
    if (type === 'system') return <History size={16} className="text-gray-600" />;
    return <FileText size={16} className="text-gray-600" />;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-orange-600 bg-orange-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`px-6 py-4 hover:bg-gray-50 ${change.isUndone ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-shrink-0 mt-1">
            {getChangeIcon(change.type, change.action)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {change.description}
              </p>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(change.severity)}`}>
                {change.severity}
              </span>
              {change.isUndone && (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                  Undone
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <User size={12} />
                {change.userName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formatTimestamp(change.timestamp)}
              </span>
              <span className="capitalize">{change.entity}</span>
              {change.entityName && (
                <span className="font-medium">"{change.entityName}"</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onViewDetails(change)}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="View details"
          >
            <Eye size={16} />
          </button>
          
          {change.canUndo && !change.isUndone && canUndo && (
            <button
              onClick={() => onUndo(change)}
              className="p-1 text-orange-400 hover:text-orange-600"
              title="Undo this change"
            >
              <Undo2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Component: Change Details Modal
const ChangeDetailsModal = ({ change, onClose, onUndo, canUndo }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-lg font-semibold">Change Details</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <XCircle size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <p className="text-sm text-gray-900 capitalize">{change.type}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Action</label>
              <p className="text-sm text-gray-900 capitalize">{change.action}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">User</label>
              <p className="text-sm text-gray-900">{change.userName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Timestamp</label>
              <p className="text-sm text-gray-900">{new Date(change.timestamp).toLocaleString()}</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <p className="text-sm text-gray-900">{change.description}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Entity</label>
            <p className="text-sm text-gray-900">{change.entity} - {change.entityName}</p>
          </div>
          
          {change.oldValue && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Old Value</label>
              <pre className="text-xs bg-gray-100 p-3 rounded border overflow-x-auto">
                {typeof change.oldValue === 'object' 
                  ? JSON.stringify(change.oldValue, null, 2)
                  : change.oldValue
                }
              </pre>
            </div>
          )}
          
          {change.newValue && (
            <div>
              <label className="block text-sm font-medium text-gray-700">New Value</label>
              <pre className="text-xs bg-gray-100 p-3 rounded border overflow-x-auto">
                {typeof change.newValue === 'object' 
                  ? JSON.stringify(change.newValue, null, 2)
                  : change.newValue
                }
              </pre>
            </div>
          )}
          
          {change.metadata && Object.keys(change.metadata).length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Metadata</label>
              <pre className="text-xs bg-gray-100 p-3 rounded border overflow-x-auto">
                {JSON.stringify(change.metadata, null, 2)}
              </pre>
            </div>
          )}
          
          {change.isUndone && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-orange-800">
                <RotateCcw size={16} />
                <span className="font-medium">This change has been undone</span>
              </div>
              <p className="text-sm text-orange-700 mt-1">
                Undone on {new Date(change.undoneAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex gap-3 mt-6">
          {change.canUndo && !change.isUndone && canUndo && (
            <button
              onClick={() => {
                onUndo(change);
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              <Undo2 size={16} />
              Undo Change
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeLogger;


