import { useState, useEffect } from 'react'
import { 
  Plus, Search, Calendar
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  due_date: string
  created_at: string
  agent_id: string
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    supabase.from('agent_tasks').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setTasks(data)
      setLoading(false)
    })
  }, [])

  const statuses = ['all', 'pending', 'in-progress', 'completed', 'cancelled']
  const priorities = ['all', 'low', 'medium', 'high', 'critical']

  const filtered = tasks.filter(t => {
    const ms = selectedStatus === 'all' || t.status === selectedStatus
    const mp = selectedPriority === 'all' || t.priority === selectedPriority
    const mq = !searchTerm || t.title.toLowerCase().includes(searchTerm.toLowerCase())
    return ms && mp && mq
  })

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('agent_tasks').update({ status }).eq('id', id)
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))
  }

  const getStatusColor = (s: string) => {
    switch (s) { case 'completed': return 'text-success-600 bg-success-50'; case 'in-progress': return 'text-warning-600 bg-warning-50'; default: return 'text-gray-600 bg-gray-50' }
  }
  const getPriorityColor = (p: string) => {
    switch (p) { case 'critical': return 'text-danger-600'; case 'high': return 'text-warning-600'; case 'medium': return 'text-primary-600'; default: return 'text-success-600' }
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    overdue: tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed').length,
  }

  if (loading) return <div className="text-center py-12"><p className="text-gray-500">Loading tasks...</p></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
        <p className="text-gray-600">Track and manage all business operations tasks</p></div>
        <button className="btn btn-primary"><Plus className="h-4 w-4 mr-2" />Create Task</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card text-center"><div className="text-2xl font-bold text-gray-900">{stats.total}</div><div className="text-sm text-gray-500">Total</div></div>
        <div className="card text-center"><div className="text-2xl font-bold text-success-600">{stats.completed}</div><div className="text-sm text-gray-500">Completed</div></div>
        <div className="card text-center"><div className="text-2xl font-bold text-warning-600">{stats.inProgress}</div><div className="text-sm text-gray-500">In Progress</div></div>
        <div className="card text-center"><div className="text-2xl font-bold text-gray-600">{stats.pending}</div><div className="text-sm text-gray-500">Pending</div></div>
        <div className="card text-center"><div className="text-2xl font-bold text-danger-600">{stats.overdue}</div><div className="text-sm text-gray-500">Overdue</div></div>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input pl-10" />
          </div>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="input w-32">
            {statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'All Status' : s}</option>)}
          </select>
          <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)} className="input w-32">
            {priorities.map(p => <option key={p} value={p}>{p === 'all' ? 'All Priority' : p}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="card text-center py-12"><p className="text-gray-500">No tasks found. Run the SQL migration and seed script to populate data.</p></div>
        ) : filtered.map((task) => (
          <div key={task.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>{task.status}</div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)} bg-gray-50`}>{task.priority}</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                {task.description && <p className="text-gray-600 mt-1">{task.description}</p>}
                {task.due_date && (
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />Due: {new Date(task.due_date).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center space-x-2">
              <button onClick={() => updateStatus(task.id, 'pending')} className={`px-3 py-1 text-xs rounded-md ${task.status === 'pending' ? 'bg-gray-100 text-gray-700' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>Pending</button>
              <button onClick={() => updateStatus(task.id, 'in-progress')} className={`px-3 py-1 text-xs rounded-md ${task.status === 'in-progress' ? 'bg-warning-100 text-warning-700' : 'bg-gray-50 text-gray-500 hover:bg-warning-100'}`}>In Progress</button>
              <button onClick={() => updateStatus(task.id, 'completed')} className={`px-3 py-1 text-xs rounded-md ${task.status === 'completed' ? 'bg-success-100 text-success-700' : 'bg-gray-50 text-gray-500 hover:bg-success-100'}`}>Complete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tasks
