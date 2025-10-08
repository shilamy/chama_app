'use client';

import { useState } from 'react';
import { Plus, Podcast, BookOpen, Edit3, Eye, Trash2, Calendar, BarChart3 } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  type: 'podcast' | 'article';
  status: 'published' | 'draft';
  createdAt: string;
  views: number;
}

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'podcasts' | 'articles'>('all');

  const contentItems: ContentItem[] = [
    {
      id: '1',
      title: 'Financial Literacy for Chamas',
      type: 'podcast',
      status: 'published',
      createdAt: '2024-01-10',
      views: 1245
    },
    {
      id: '2',
      title: 'Investment Opportunities in 2024',
      type: 'article',
      status: 'published',
      createdAt: '2024-01-08',
      views: 892
    },
    {
      id: '3',
      title: 'Member Management Best Practices',
      type: 'article',
      status: 'draft',
      createdAt: '2024-01-05',
      views: 0
    },
    {
      id: '4',
      title: 'Understanding Group Savings',
      type: 'podcast',
      status: 'published',
      createdAt: '2024-01-03',
      views: 1567
    },
    {
      id: '5',
      title: 'Tax Planning for Small Groups',
      type: 'article',
      status: 'draft',
      createdAt: '2024-01-01',
      views: 0
    }
  ];

  const filteredItems = contentItems.filter(item => 
    activeTab === 'all' || item.type === activeTab.slice(0, -1)
  );

  const getTypeIcon = (type: string) => {
    return type === 'podcast' ? 
      <Podcast className="h-4 w-4 text-purple-600" /> : 
      <BookOpen className="h-4 w-4 text-blue-600" />;
  };

  const getTypeColor = (type: string) => {
    return type === 'podcast' ? 'bg-purple-100' : 'bg-blue-100';
  };

  const getStatusColor = (status: string) => {
    return status === 'published' ? 
      'bg-green-100 text-green-800' : 
      'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
              <p className="mt-2 text-gray-600">
                Manage your podcasts, articles, and educational content for members
              </p>
            </div>
            <button 
              className="inline-flex items-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Content
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Articles</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contentItems.filter(item => item.type === 'article').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <Podcast className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Podcasts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contentItems.filter(item => item.type === 'podcast').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contentItems.reduce((sum, item) => sum + item.views, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'all', name: 'All Content', count: contentItems.length },
                { id: 'podcasts', name: 'Podcasts', count: contentItems.filter(item => item.type === 'podcast').length },
                { id: 'articles', name: 'Articles', count: contentItems.filter(item => item.type === 'article').length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'all' | 'podcasts' | 'articles')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                  <span className="ml-2 bg-gray-100 text-gray-900 py-1 px-2.5 rounded-full text-xs font-medium">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content Grid */}
          <div className="p-6">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
                <p className="text-gray-500">Get started by creating your first piece of content.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
                    <div className="p-5">
                      {/* Header with type and status */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                          {getTypeIcon(item.type)}
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </div>

                      {/* Content title */}
                      <h3 className="font-semibold text-gray-900 mb-4 line-clamp-2 leading-tight">
                        {item.title}
                      </h3>

                      {/* Metadata */}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          {item.views.toLocaleString()} views
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white px-5 py-3 border-t border-gray-200 rounded-b-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-3">
                          <button className="inline-flex items-center text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200">
                            <Edit3 className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button className="inline-flex items-center text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </button>
                        </div>
                        <button className="inline-flex items-center text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-200">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}