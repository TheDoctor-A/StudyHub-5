import React, { useState, useEffect } from 'react';
import { Plus, ChevronRight, ChevronDown, Edit, Trash2, FileText, Brain, FileCheck, PenTool, Save, X, FolderPlus, File } from 'lucide-react';
import { contentStructure } from '../data/dataModels';

const ContentManager = ({ universityId, courseId, userRole, onContentChange }) => {
  const [content, setContent] = useState({});
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [editingItem, setEditingItem] = useState(null);
  const [newItemForm, setNewItemForm] = useState({ show: false, parentPath: '', type: 'subject' });
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const key = `${universityId}-${courseId}`;
    setContent(contentStructure[key] || { subjects: {} });
  }, [universityId, courseId]);

  const contentTypeIcons = {
    notes: FileText,
    flashcards: Brain,
    'past-papers': FileCheck,
    'practice-papers': PenTool
  };

  const contentTypeLabels = {
    notes: 'Notes',
    flashcards: 'Flashcards',
    'past-papers': 'Past Papers',
    'practice-papers': 'Practice Papers'
  };

  // Toggle expansion of tree items
  const toggleExpanded = (path) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedItems(newExpanded);
  };

  // Get item at specific path
  const getItemAtPath = (path) => {
    const parts = path.split('/');
    let current = content;
    
    for (const part of parts) {
      if (part === 'subjects') {
        current = current.subjects || {};
      } else if (part === 'topics') {
        current = current.topics || {};
      } else if (part === 'subtopics') {
        current = current.subtopics || {};
      } else {
        current = current[part];
      }
      if (!current) return null;
    }
    return current;
  };

  // Set item at specific path
  const setItemAtPath = (path, value) => {
    const parts = path.split('/');
    const newContent = JSON.parse(JSON.stringify(content));
    let current = newContent;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (part === 'subjects') {
        if (!current.subjects) current.subjects = {};
        current = current.subjects;
      } else if (part === 'topics') {
        if (!current.topics) current.topics = {};
        current = current.topics;
      } else if (part === 'subtopics') {
        if (!current.subtopics) current.subtopics = {};
        current = current.subtopics;
      } else {
        if (!current[part]) current[part] = {};
        current = current[part];
      }
    }
    
    const lastPart = parts[parts.length - 1];
    current[lastPart] = value;
    
    setContent(newContent);
    if (onContentChange) {
      onContentChange(newContent);
    }
  };

  // Add new item
  const addNewItem = (parentPath, type, data) => {
    const id = data.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newItem = {
      id,
      name: data.name,
      description: data.description || '',
      order: Date.now(),
      hasContent: data.hasContent || false,
      contentTypes: data.contentTypes || ['notes'],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (type === 'subject') {
      newItem.icon = data.icon || 'book';
      newItem.color = data.color || '#3B82F6';
      newItem.topics = {};
    } else if (type === 'topic') {
      newItem.subtopics = {};
    } else {
      // For deeper nesting, we can add more levels dynamically
      newItem.subtopics = {};
    }

    if (data.hasContent) {
      newItem.content = {};
      data.contentTypes.forEach(contentType => {
        newItem.content[contentType] = [];
      });
    }

    const itemPath = parentPath ? `${parentPath}/${id}` : `subjects/${id}`;
    setItemAtPath(itemPath, newItem);
    
    // Auto-expand the parent to show the new item
    if (parentPath) {
      setExpandedItems(prev => new Set([...prev, parentPath]));
    }
  };

  // Edit existing item
  const editItem = (path, data) => {
    const item = getItemAtPath(path);
    if (!item) return;

    const updatedItem = {
      ...item,
      name: data.name,
      description: data.description,
      hasContent: data.hasContent,
      contentTypes: data.contentTypes,
      updatedAt: new Date().toISOString()
    };

    if (data.hasContent && !item.content) {
      updatedItem.content = {};
      data.contentTypes.forEach(contentType => {
        updatedItem.content[contentType] = [];
      });
    }

    setItemAtPath(path, updatedItem);
    setEditingItem(null);
  };

  // Delete item
  const deleteItem = (path) => {
    if (!window.confirm('Are you sure you want to delete this item and all its content?')) {
      return;
    }

    const parts = path.split('/');
    const parentPath = parts.slice(0, -1).join('/');
    const itemKey = parts[parts.length - 1];
    
    const parent = getItemAtPath(parentPath);
    if (parent) {
      delete parent[itemKey];
      setContent({ ...content });
      if (onContentChange) {
        onContentChange(content);
      }
    }
  };

  // Add content to an item
  const addContent = (itemPath, contentType, contentData) => {
    const item = getItemAtPath(itemPath);
    if (!item || !item.content) return;

    const newContentItem = {
      id: `${contentType}-${Date.now()}`,
      ...contentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!item.content[contentType]) {
      item.content[contentType] = [];
    }
    
    item.content[contentType].push(newContentItem);
    setContent({ ...content });
    if (onContentChange) {
      onContentChange(content);
    }
  };

  // Render tree item
  const renderTreeItem = (item, path, level = 0) => {
    const isExpanded = expandedItems.has(path);
    const hasChildren = (item.topics && Object.keys(item.topics).length > 0) || 
                      (item.subtopics && Object.keys(item.subtopics).length > 0);
    const canAddChildren = level < 10; // Limit nesting to 10 levels for performance

    return (
      <div key={path} className="select-none">
        <div 
          className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer ${
            selectedItem === path ? 'bg-blue-50 border border-blue-200' : ''
          }`}
          style={{ marginLeft: `${level * 20}px` }}
          onClick={() => setSelectedItem(path)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(path);
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          
          {!hasChildren && <div className="w-6" />}
          
          <div className="flex items-center gap-2 flex-1">
            {item.hasContent ? <File size={16} className="text-blue-500" /> : <FolderPlus size={16} className="text-gray-500" />}
            <span className="font-medium">{item.name}</span>
            {item.description && (
              <span className="text-sm text-gray-500">- {item.description}</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {item.hasContent && item.contentTypes && (
              <div className="flex gap-1">
                {item.contentTypes.map(type => {
                  const Icon = contentTypeIcons[type];
                  return Icon ? (
                    <Icon key={type} size={14} className="text-gray-400" title={contentTypeLabels[type]} />
                  ) : null;
                })}
              </div>
            )}
            
            {canAddChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNewItemForm({
                    show: true,
                    parentPath: path,
                    type: level === 0 ? 'topic' : 'subtopic'
                  });
                }}
                className="p-1 hover:bg-blue-100 rounded text-blue-600"
                title="Add sub-item"
              >
                <Plus size={14} />
              </button>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingItem({ path, item });
              }}
              className="p-1 hover:bg-gray-200 rounded text-gray-600"
              title="Edit"
            >
              <Edit size={14} />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteItem(path);
              }}
              className="p-1 hover:bg-red-100 rounded text-red-600"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div>
            {item.topics && Object.entries(item.topics).map(([key, topic]) =>
              renderTreeItem(topic, `${path}/topics/${key}`, level + 1)
            )}
            {item.subtopics && Object.entries(item.subtopics).map(([key, subtopic]) =>
              renderTreeItem(subtopic, `${path}/subtopics/${key}`, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  // Render content editor for selected item
  const renderContentEditor = () => {
    if (!selectedItem) {
      return (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <File size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Select an item to view or edit its content</p>
          </div>
        </div>
      );
    }

    const item = getItemAtPath(selectedItem);
    if (!item) return null;

    return (
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
          {item.description && (
            <p className="text-gray-600 mt-1">{item.description}</p>
          )}
        </div>

        {item.hasContent ? (
          <div className="space-y-6">
            {item.contentTypes?.map(contentType => (
              <ContentTypeSection
                key={contentType}
                contentType={contentType}
                items={item.content?.[contentType] || []}
                onAddContent={(data) => addContent(selectedItem, contentType, data)}
                onEditContent={(id, data) => {
                  // Implementation for editing content
                }}
                onDeleteContent={(id) => {
                  // Implementation for deleting content
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FolderPlus size={48} className="mx-auto mb-4 text-gray-300" />
            <p>This is a container item. Add sub-items or enable content to start adding materials.</p>
            <button
              onClick={() => setEditingItem({ path: selectedItem, item })}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Enable Content
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full bg-white">
      {/* Tree View */}
      <div className="w-1/3 border-r border-gray-200 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Content Structure</h3>
          <button
            onClick={() => setNewItemForm({ show: true, parentPath: '', type: 'subject' })}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <Plus size={16} />
            Add Subject
          </button>
        </div>

        <div className="space-y-1">
          {content.subjects && Object.entries(content.subjects).map(([key, subject]) =>
            renderTreeItem(subject, `subjects/${key}`, 0)
          )}
        </div>
      </div>

      {/* Content Editor */}
      {renderContentEditor()}

      {/* New Item Form Modal */}
      {newItemForm.show && (
        <NewItemForm
          type={newItemForm.type}
          onSave={(data) => {
            addNewItem(newItemForm.parentPath, newItemForm.type, data);
            setNewItemForm({ show: false, parentPath: '', type: 'subject' });
          }}
          onCancel={() => setNewItemForm({ show: false, parentPath: '', type: 'subject' })}
        />
      )}

      {/* Edit Item Form Modal */}
      {editingItem && (
        <EditItemForm
          item={editingItem.item}
          onSave={(data) => editItem(editingItem.path, data)}
          onCancel={() => setEditingItem(null)}
        />
      )}
    </div>
  );
};

// Content Type Section Component
const ContentTypeSection = ({ contentType, items, onAddContent, onEditContent, onDeleteContent }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContent, setNewContent] = useState({});

  const Icon = contentTypeIcons[contentType];
  const label = contentTypeLabels[contentType];

  const handleAddContent = () => {
    if (contentType === 'notes') {
      onAddContent({
        title: newContent.title || 'Untitled Note',
        content: newContent.content || '',
        author: 'Current User'
      });
    } else if (contentType === 'flashcards') {
      onAddContent({
        front: newContent.front || '',
        back: newContent.back || '',
        difficulty: newContent.difficulty || 'medium'
      });
    }
    
    setNewContent({});
    setShowAddForm(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon size={20} className="text-blue-600" />
          <h4 className="text-lg font-medium">{label}</h4>
          <span className="text-sm text-gray-500">({items.length})</span>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          <Plus size={14} />
          Add {label.slice(0, -1)}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          {contentType === 'notes' && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Note title"
                value={newContent.title || ''}
                onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <textarea
                placeholder="Note content"
                value={newContent.content || ''}
                onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32"
              />
            </div>
          )}
          
          {contentType === 'flashcards' && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Front of card"
                value={newContent.front || ''}
                onChange={(e) => setNewContent({ ...newContent, front: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <textarea
                placeholder="Back of card"
                value={newContent.back || ''}
                onChange={(e) => setNewContent({ ...newContent, back: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24"
              />
              <select
                value={newContent.difficulty || 'medium'}
                onChange={(e) => setNewContent({ ...newContent, difficulty: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          )}
          
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAddContent}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Save size={14} />
              Save
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewContent({});
              }}
              className="flex items-center gap-2 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              <X size={14} />
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={item.id || index} className="p-3 bg-gray-50 rounded border">
            {contentType === 'notes' && (
              <div>
                <h5 className="font-medium">{item.title}</h5>
                <p className="text-sm text-gray-600 mt-1">{item.content?.substring(0, 100)}...</p>
              </div>
            )}
            {contentType === 'flashcards' && (
              <div>
                <p className="font-medium">{item.front}</p>
                <p className="text-sm text-gray-600 mt-1">{item.back}</p>
                <span className={`inline-block px-2 py-1 text-xs rounded mt-2 ${
                  item.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  item.difficulty === 'hard' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.difficulty}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// New Item Form Component
const NewItemForm = ({ type, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    hasContent: false,
    contentTypes: ['notes'],
    icon: 'book',
    color: '#3B82F6'
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Add New {type}</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder={`Enter ${type} name`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg h-20"
              placeholder="Optional description"
            />
          </div>
          
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.hasContent}
                onChange={(e) => setFormData({ ...formData, hasContent: e.target.checked })}
              />
              <span className="text-sm font-medium text-gray-700">This item will contain study materials</span>
            </label>
          </div>
          
          {formData.hasContent && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Types</label>
              <div className="space-y-2">
                {Object.entries(contentTypeLabels).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.contentTypes.includes(key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            contentTypes: [...formData.contentTypes, key]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            contentTypes: formData.contentTypes.filter(t => t !== key)
                          });
                        }
                      }}
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onSave(formData)}
            disabled={!formData.name.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Add {type}
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

// Edit Item Form Component
const EditItemForm = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: item.name || '',
    description: item.description || '',
    hasContent: item.hasContent || false,
    contentTypes: item.contentTypes || ['notes']
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Edit Item</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg h-20"
            />
          </div>
          
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.hasContent}
                onChange={(e) => setFormData({ ...formData, hasContent: e.target.checked })}
              />
              <span className="text-sm font-medium text-gray-700">This item contains study materials</span>
            </label>
          </div>
          
          {formData.hasContent && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Types</label>
              <div className="space-y-2">
                {Object.entries(contentTypeLabels).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.contentTypes.includes(key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            contentTypes: [...formData.contentTypes, key]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            contentTypes: formData.contentTypes.filter(t => t !== key)
                          });
                        }
                      }}
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onSave(formData)}
            disabled={!formData.name.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Save Changes
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

export default ContentManager;

