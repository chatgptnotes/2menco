import { useState } from 'react'
import { 
  Plus, 
  Filter, 
  Search, 
  Calendar, 
  User, 
  Flag,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreVertical,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee: string
  dueDate: string
  category: string
  tags: string[]
  progress: number
  createdAt: string
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Setup Digital CMO Agent',
      description: 'Configure and deploy the Digital Chief Marketing Officer agent for automated marketing campaigns',
      status: 'in-progress',
      priority: 'high',
      assignee: 'BT (Biji Tharakan Thomas)',
      dueDate: '2025-01-20',
      category: 'Technology',
      tags: ['agent', 'marketing', 'automation'],
      progress: 75,
      createdAt: '2025-01-10'
    },
    {
      id: '2',
      title: 'Review Q1 Marketing Campaign Performance',
      description: 'Analyze the results of Q1 marketing campaigns and identify optimization opportunities',
      status: 'completed',
      priority: 'medium',
      assignee: 'Digital CMO',
      dueDate: '2025-01-15',
      category: 'Marketing',
      tags: ['analysis', 'campaign', 'performance'],
      progress: 100,
      createdAt: '2025-01-05'
    },
    {
      id: '3',
      title: 'Configure KPI Dashboard',
      description: 'Set up real-time KPI monitoring dashboard for business metrics tracking',
      status: 'pending',
      priority: 'high',
      assignee: 'Digital CTO',
      dueDate: '2025-01-25',
      category: 'Technology',
      tags: ['dashboard', 'kpi', 'monitoring'],
      progress: 0,
      createdAt: '2025-01-12'
    },
    {
      id: '4',
      title: 'Train Sales Team on BOS',
      description: 'Conduct training sessions for sales team on using the Business Operating System',
      status: 'pending',
      priority: 'low',
      assignee: 'BT (Biji Tharakan Thomas)',
      dueDate: '2025-02-01',
      category: 'Training',
      tags: ['training', 'sales', 'bos'],
      progress: 0,
      createdAt: '2025-01-15'
    },
    {
      id: '5',
      title: 'Optimize Lead Generation Process',
      description: 'Review and optimize the lead generation workflow for better conversion rates',
      status: 'in-progress',
      priority: 'high',
      assignee: 'Digital CMO',
      dueDate: '2025-01-30',
      category: 'Marketing',
      tags: ['optimization', 'leads', 'conversion'],
      progress: 45,
      createdAt: '2025-01-08'
    },
    {
      id: '6',
      title: 'Financial Q4 Review',
      description: 'Complete Q4 financial review and prepare Q1 budget planning',
      status: 'pending',
      priority: 'medium',
      assignee: 'Digital CFO',
      dueDate: '2025-01-28',
      category: 'Finance',
      tags: ['finance', 'review', 'budget'],
      progress: 0,
      createdAt: '2025-01-14'
    }
  ])

  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')

  const statuses = ['all', 'pending', 'in-progress', 'completed', 'cancelled']
  const priorities = ['all', 'low', 'medium', 'high', 'critical']
  const categories = ['all', 'Technology', 'Marketing', 'Finance', 'Training', 'Operations']

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesStatus && matchesPriority && matchesCategory && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success-600 bg-success-50'
      case 'in-progress': return 'text-warning-600 bg-warning-50'
      case 'pending': return 'text-gray-600 bg-gray-50'
      case 'cancelled': return 'text-danger-600 bg-danger-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-danger-600'
      case 'high': return 'text-warning-600'
      case 'medium': return 'text-primary-600'
      case 'low': return 'text-success-600'
      default: return 'text-gray-600'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <Flag className="h-4 w-4" />
      case 'high': return <AlertCircle className="h-4 w-4" />
      case 'medium': return <Clock className="h-4 w-4" />
      case 'low': return <CheckCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const updateTaskStatus = (taskId: string, newStatus: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus as Task['status'] } : task
    ))
  }

  const updateTaskProgress = (taskId: string, newProgress: number) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, progress: newProgress } : task
    ))
  }

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'completed').length
    const inProgress = tasks.filter(t => t.status === 'in-progress').length
    const pending = tasks.filter(t => t.status === 'pending').length
    const overdue = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length

    return { total, completed, inProgress, pending, overdue }
  }

  const stats = getTaskStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600">Track and manage all business operations tasks</p>
        </div>
        <button className="btn btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500">Total Tasks</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-success-600">{stats.completed}</div>
          <div className="text-sm text-gray-500">Completed</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-warning-600">{stats.inProgress}</div>
          <div className="text-sm text-gray-500">In Progress</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-danger-600">{stats.overdue}</div>
          <div className="text-sm text-gray-500">Overdue</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div>
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input w-32"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <select 
                value={selectedPriority} 
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="input w-32"
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>
                    {priority === 'all' ? 'All Priority' : priority}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input w-32"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div key={task.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status.replace('-', ' ')}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)} bg-gray-50`}>
                      {getPriorityIcon(task.priority)}
                      <span className="ml-1">{task.priority}</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mt-2">{task.title}</h3>
                <p className="text-gray-600 mt-1">{task.description}</p>
                
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {task.assignee}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Due: {task.dueDate}
                  </div>
                  <div className="flex items-center">
                    <Flag className="h-4 w-4 mr-1" />
                    {task.category}
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium">{task.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-primary-600"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-3">
                  {task.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button className="p-2 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => updateTaskStatus(task.id, 'pending')}
                    className={`px-3 py-1 text-xs rounded-md ${
                      task.status === 'pending' 
                        ? 'bg-gray-100 text-gray-700' 
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    Pending
                  </button>
                  <button 
                    onClick={() => updateTaskStatus(task.id, 'in-progress')}
                    className={`px-3 py-1 text-xs rounded-md ${
                      task.status === 'in-progress' 
                        ? 'bg-warning-100 text-warning-700' 
                        : 'bg-gray-50 text-gray-500 hover:bg-warning-100'
                    }`}
                  >
                    In Progress
                  </button>
                  <button 
                    onClick={() => updateTaskStatus(task.id, 'completed')}
                    className={`px-3 py-1 text-xs rounded-md ${
                      task.status === 'completed' 
                        ? 'bg-success-100 text-success-700' 
                        : 'bg-gray-50 text-gray-500 hover:bg-success-100'
                    }`}
                  >
                    Complete
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={task.progress}
                    onChange={(e) => updateTaskProgress(task.id, parseInt(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm text-gray-500">{task.progress}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-gray-400 mb-4">
            <Filter className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-500">Try adjusting your filters or create a new task.</p>
        </div>
      )}
    </div>
  )
}

export default Tasks
