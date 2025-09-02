import { useState } from 'react'
import { 
  FileText, 
  File, 
  Folder, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Calendar,
  User,
  Tag,
  BookOpen,
  BarChart3,
  Users,
  Settings,
  CheckSquare,
  Target,
  TrendingUp
} from 'lucide-react'

interface Document {
  id: string
  name: string
  type: 'pdf' | 'doc' | 'md' | 'folder'
  category: string
  size: string
  lastModified: string
  author: string
  tags: string[]
  description: string
  icon: React.ReactNode
  color: string
}

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Million Dollar Plan',
      type: 'pdf',
      category: 'Strategic Planning',
      size: '2.4 MB',
      lastModified: '2025-01-15',
      author: 'BT (Biji Tharakan Thomas)',
      tags: ['strategy', 'planning', 'revenue'],
      description: 'Complete 9-month plan to achieve 1 million AED revenue',
      icon: <Target className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      id: '2',
      name: 'Quick Start Guide',
      type: 'md',
      category: 'Documentation',
      size: '156 KB',
      lastModified: '2025-01-10',
      author: 'Digital CTO',
      tags: ['guide', 'onboarding', 'setup'],
      description: 'Step-by-step guide to get started with BETTROI BOS',
      icon: <BookOpen className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    {
      id: '3',
      name: 'Standard Operating Procedures',
      type: 'folder',
      category: 'Operations',
      size: '--',
      lastModified: '2025-01-12',
      author: 'Digital COO',
      tags: ['sop', 'processes', 'operations'],
      description: 'Complete set of standard operating procedures for all business processes',
      icon: <CheckSquare className="h-6 w-6" />,
      color: 'bg-purple-500'
    },
    {
      id: '4',
      name: 'Agent Configuration Templates',
      type: 'doc',
      category: 'Technology',
      size: '892 KB',
      lastModified: '2025-01-08',
      author: 'Digital CTO',
      tags: ['templates', 'agents', 'configuration'],
      description: 'Templates for configuring and deploying digital agents',
      icon: <Users className="h-6 w-6" />,
      color: 'bg-indigo-500'
    },
    {
      id: '5',
      name: 'KPI Dashboard Configuration',
      type: 'md',
      category: 'Analytics',
      size: '234 KB',
      lastModified: '2025-01-14',
      author: 'Digital CFO',
      tags: ['dashboard', 'kpi', 'analytics'],
      description: 'Configuration guide for KPI dashboard setup and customization',
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'bg-orange-500'
    },
    {
      id: '6',
      name: 'Task Contract System',
      type: 'pdf',
      category: 'Management',
      size: '1.8 MB',
      lastModified: '2025-01-11',
      author: 'Digital COO',
      tags: ['contracts', 'tasks', 'management'],
      description: 'Complete task contract system for project management',
      icon: <CheckSquare className="h-6 w-6" />,
      color: 'bg-pink-500'
    },
    {
      id: '7',
      name: 'Acronyms & Glossary',
      type: 'md',
      category: 'Reference',
      size: '89 KB',
      lastModified: '2025-01-09',
      author: 'Digital CTO',
      tags: ['reference', 'glossary', 'acronyms'],
      description: 'Comprehensive glossary of business terms and acronyms',
      icon: <BookOpen className="h-6 w-6" />,
      color: 'bg-teal-500'
    },
    {
      id: '8',
      name: 'BOS Phases SOPs',
      type: 'folder',
      category: 'Operations',
      size: '--',
      lastModified: '2025-01-13',
      author: 'Digital COO',
      tags: ['phases', 'sop', 'implementation'],
      description: 'Standard operating procedures for each BOS implementation phase',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-yellow-500'
    }
  ])

  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const categories = [
    { id: 'all', name: 'All Categories', count: documents.length },
    { id: 'Strategic Planning', name: 'Strategic Planning', count: documents.filter(d => d.category === 'Strategic Planning').length },
    { id: 'Documentation', name: 'Documentation', count: documents.filter(d => d.category === 'Documentation').length },
    { id: 'Operations', name: 'Operations', count: documents.filter(d => d.category === 'Operations').length },
    { id: 'Technology', name: 'Technology', count: documents.filter(d => d.category === 'Technology').length },
    { id: 'Analytics', name: 'Analytics', count: documents.filter(d => d.category === 'Analytics').length },
    { id: 'Management', name: 'Management', count: documents.filter(d => d.category === 'Management').length },
    { id: 'Reference', name: 'Reference', count: documents.filter(d => d.category === 'Reference').length }
  ]

  const types = [
    { id: 'all', name: 'All Types', count: documents.length },
    { id: 'pdf', name: 'PDF', count: documents.filter(d => d.type === 'pdf').length },
    { id: 'doc', name: 'Document', count: documents.filter(d => d.type === 'doc').length },
    { id: 'md', name: 'Markdown', count: documents.filter(d => d.type === 'md').length },
    { id: 'folder', name: 'Folder', count: documents.filter(d => d.type === 'folder').length }
  ]

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    const matchesType = selectedType === 'all' || doc.type === selectedType
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesCategory && matchesType && matchesSearch
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-5 w-5" />
      case 'doc': return <File className="h-5 w-5" />
      case 'md': return <FileText className="h-5 w-5" />
      case 'folder': return <Folder className="h-5 w-5" />
      default: return <File className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'text-red-600'
      case 'doc': return 'text-blue-600'
      case 'md': return 'text-green-600'
      case 'folder': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getFileExtension = (type: string) => {
    switch (type) {
      case 'pdf': return '.pdf'
      case 'doc': return '.doc'
      case 'md': return '.md'
      case 'folder': return ''
      default: return ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents & Resources</h1>
          <p className="text-gray-600">Access all your business documentation and resources</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Import
          </button>
          <button className="btn btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900">{documents.length}</div>
          <div className="text-sm text-gray-500">Total Documents</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{documents.filter(d => d.type === 'pdf').length}</div>
          <div className="text-sm text-gray-500">PDF Files</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{documents.filter(d => d.type === 'md').length}</div>
          <div className="text-sm text-gray-500">Markdown Files</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">{documents.filter(d => d.type === 'folder').length}</div>
          <div className="text-sm text-gray-500">Folders</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input w-40"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)}
                className="input w-32"
              >
                {types.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name} ({type.count})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${
                  viewMode === 'grid' 
                    ? 'bg-primary-100 text-primary-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="grid grid-cols-2 gap-1 w-4 h-4">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${
                  viewMode === 'list' 
                    ? 'bg-primary-100 text-primary-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="space-y-1 w-4 h-4">
                  <div className="bg-current rounded-sm h-1"></div>
                  <div className="bg-current rounded-sm h-1"></div>
                  <div className="bg-current rounded-sm h-1"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="card hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${doc.color}`}>
                  {doc.icon}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-medium ${getTypeColor(doc.type)}`}>
                    {getTypeIcon(doc.type)}
                  </span>
                  <span className="text-xs text-gray-500">{getFileExtension(doc.type)}</span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{doc.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Category</span>
                  <span className="font-medium">{doc.category}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Size</span>
                  <span className="font-medium">{doc.size}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Modified</span>
                  <span className="font-medium">{doc.lastModified}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Author</span>
                  <span className="font-medium">{doc.author}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                {doc.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                <button className="btn btn-secondary flex-1 text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </button>
                <button className="btn btn-primary flex-1 text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="card hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${doc.color}`}>
                  {doc.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{doc.name}</h3>
                    <span className={`text-xs font-medium ${getTypeColor(doc.type)}`}>
                      {getTypeIcon(doc.type)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{doc.description}</p>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <span>{doc.category}</span>
                    <span>{doc.size}</span>
                    <span>Modified: {doc.lastModified}</span>
                    <span>By: {doc.author}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {doc.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                    {doc.tags.length > 2 && (
                      <span className="text-xs text-gray-500">+{doc.tags.length - 2}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button className="p-2 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredDocuments.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-gray-400 mb-4">
            <FileText className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-500">Try adjusting your filters or create a new document.</p>
        </div>
      )}
    </div>
  )
}

export default Documents
