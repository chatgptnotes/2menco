import { Book, MessageCircle, Mail } from 'lucide-react'
import PageTransition from '../components/PageTransition'

const Help = () => (
  <PageTransition>
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Help & Support</h1><p className="text-sm text-gray-500 mt-1">Get assistance with BETTROI BOS</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Book, title: 'Documentation', desc: 'Read guides and tutorials', link: '#' },
          { icon: MessageCircle, title: 'Community', desc: 'Join discussions', link: '#' },
          { icon: Mail, title: 'Contact Support', desc: 'Get direct help', link: '#' },
        ].map(s => (
          <div key={s.title} className="card-hover cursor-pointer">
            <s.icon className="h-8 w-8 text-blue-400 mb-3" />
            <h3 className="text-sm font-semibold text-white mb-1">{s.title}</h3>
            <p className="text-xs text-gray-500">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </PageTransition>
)

export default Help
