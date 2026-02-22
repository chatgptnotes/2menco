import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Calendar, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useToast } from '../components/Toast'
import PageTransition from '../components/PageTransition'

interface Task {
  id: string; title: string; description: string; status: string;
  priority: string; due_date: string; created_at: string; agent_id: string
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [search, setSearch] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    supabase.from('agent_tasks').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setTasks(data)
      setLoading(false)
    })
  }, [])

  const filtered = tasks.filter(t => {
    const ms = selectedStatus === 'all' || t.status === selectedStatus
    const mq = !search || t.title?.toLowerCase().includes(search.toLowerCase())
    return ms && mq
  })

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('agent_tasks').update({ status }).eq('id', id)
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))
    toast(`Task marked as ${status}`, 'success')
  }

  const statusColor = (s: string) => {
    switch (s) { case 'completed': return 'bg-emerald-500/10 text-emerald-400'; case 'in-progress': return 'bg-amber-500/10 text-amber-400'; default: return 'bg-white/5 text-gray-400' }
  }
  const priorityColor = (p: string) => {
    switch (p) { case 'critical': case 'high': return 'text-red-400'; case 'medium': return 'text-amber-400'; default: return 'text-emerald-400' }
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    overdue: tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed').length,
  }

  if (loading) return <div className="space-y-4 animate-pulse"><div className="h-8 bg-white/5 rounded w-48" /><div className="h-96 bg-white/5 rounded-xl" /></div>

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Tasks</h1>
            <p className="text-sm text-gray-500 mt-1">Manage business operations</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: 'Total', value: stats.total, color: 'text-white' },
            { label: 'Completed', value: stats.completed, color: 'text-emerald-400' },
            { label: 'In Progress', value: stats.inProgress, color: 'text-amber-400' },
            { label: 'Pending', value: stats.pending, color: 'text-gray-400' },
            { label: 'Overdue', value: stats.overdue, color: 'text-red-400' },
          ].map(s => (
            <div key={s.label} className="card text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input type="text" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-9" />
          </div>
          <div className="flex gap-1 bg-white/5 rounded-lg p-0.5">
            {['all', 'pending', 'in-progress', 'completed'].map(s => (
              <button key={s} onClick={() => setSelectedStatus(s)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${selectedStatus === s ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >{s === 'all' ? 'All' : s}</button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="card text-center py-12"><p className="text-gray-500 text-sm">No tasks found</p></div>
          ) : filtered.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="card-hover"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => updateStatus(task.id, task.status === 'completed' ? 'pending' : 'completed')}
                    className={`flex-shrink-0 ${task.status === 'completed' ? 'text-emerald-400' : 'text-gray-600 hover:text-gray-400'}`}
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-200'}`}>{task.title}</p>
                    {task.description && <p className="text-xs text-gray-600 truncate mt-0.5">{task.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span className={`text-xs font-medium ${priorityColor(task.priority)}`}>{task.priority}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColor(task.status)}`}>{task.status}</span>
                  {task.due_date && (
                    <span className="text-xs text-gray-600 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />{new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  )
}

export default Tasks
