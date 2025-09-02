import { useState } from 'react'
import { 
  HelpCircle, 
  BookOpen, 
  Video, 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Users,
  Settings,
  BarChart3
} from 'lucide-react'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I get started with BETTROI BOS?',
      answer: 'Start by reviewing the Quick Start Guide in the Documents section. Set up your first digital agent, configure your KPIs, and begin tracking your progress toward 1 million AED in 9 months.',
      category: 'Getting Started'
    },
    {
      id: '2',
      question: 'What are Digital Agents and how do they work?',
      answer: 'Digital Agents are AI-powered systems that automate specific business functions. Each agent (CMO, CRO, CFO, COO, CTO, CXO) handles different aspects of your business operations and can be configured and monitored through the Agents page.',
      category: 'Digital Agents'
    },
    {
      id: '3',
      question: 'How do I track my business KPIs?',
      answer: 'Use the KPIs & Metrics page to monitor your key performance indicators. You can set targets, track progress, and view trends over time. The dashboard provides real-time updates on your business performance.',
      category: 'KPIs & Metrics'
    },
    {
      id: '4',
      question: 'Can I customize the dashboard for my business?',
      answer: 'Yes! Go to Settings > Appearance to customize themes, colors, and layout. You can also configure which KPIs are displayed on your dashboard and set up custom alerts.',
      category: 'Customization'
    },
    {
      id: '5',
      question: 'How do I manage tasks and projects?',
      answer: 'Use the Task Management page to create, assign, and track tasks. You can set priorities, due dates, and monitor progress. Tasks can be organized by category and filtered by various criteria.',
      category: 'Task Management'
    },
    {
      id: '6',
      question: 'What file types are supported for documents?',
      answer: 'BETTROI BOS supports PDF, DOC, Markdown files, and folder organization. You can upload, categorize, and tag documents for easy retrieval and management.',
      category: 'Document Management'
    },
    {
      id: '7',
      question: 'How secure is my business data?',
      answer: 'Your data is protected with enterprise-grade security including encryption, role-based access control, and secure authentication. We comply with UAE PDPL, India DPDP, and EU GDPR regulations.',
      category: 'Security'
    },
    {
      id: '8',
      question: 'Can I integrate with other business tools?',
      answer: 'Yes! Go to Settings > Integrations to connect with popular business tools like Google Workspace, Slack, and payment processors. More integrations are being added regularly.',
      category: 'Integrations'
    }
  ]

  const tutorials = [
    {
      title: 'Getting Started with BETTROI BOS',
      description: 'Learn the basics of setting up your digital business operating system',
      duration: '15 min',
      icon: <BookOpen className="h-6 w-6" />,
      category: 'Beginner'
    },
    {
      title: 'Configuring Digital Agents',
      description: 'Step-by-step guide to setting up and optimizing your AI agents',
      duration: '25 min',
      icon: <Users className="h-6 w-6" />,
      category: 'Intermediate'
    },
    {
      title: 'Setting Up KPI Dashboards',
      description: 'Create comprehensive performance monitoring dashboards',
      duration: '20 min',
      icon: <BarChart3 className="h-6 w-6" />,
      category: 'Intermediate'
    },
    {
      title: 'Advanced Task Management',
      description: 'Master task workflows and team collaboration',
      duration: '30 min',
      icon: <FileText className="h-6 w-6" />,
      category: 'Advanced'
    },
    {
      title: 'System Customization',
      description: 'Personalize your BOS experience and workflows',
      duration: '20 min',
      icon: <Settings className="h-6 w-6" />,
      category: 'Advanced'
    }
  ]

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto h-16 w-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mb-4">
          <HelpCircle className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-600 mt-2">Get help with BETTROI BOS and find answers to common questions</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center hover:shadow-lg transition-shadow cursor-pointer">
          <BookOpen className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900">Documentation</h3>
          <p className="text-sm text-gray-600">Browse comprehensive guides</p>
        </div>
        <div className="card text-center hover:shadow-lg transition-shadow cursor-pointer">
          <Video className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900">Video Tutorials</h3>
          <p className="text-sm text-gray-600">Watch step-by-step videos</p>
        </div>
        <div className="card text-center hover:shadow-lg transition-shadow cursor-pointer">
          <MessageCircle className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900">Live Chat</h3>
          <p className="text-sm text-gray-600">Get instant help</p>
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search help articles, FAQs, and tutorials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Tutorials */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Video Tutorials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tutorials.map((tutorial, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="text-primary-600">
                  {tutorial.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{tutorial.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{tutorial.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{tutorial.duration}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      tutorial.category === 'Beginner' ? 'bg-green-100 text-green-800' :
                      tutorial.category === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {tutorial.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {filteredFAQs.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-lg">
              <button
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => toggleFAQ(faq.id)}
              >
                <div>
                  <h3 className="font-medium text-gray-900">{faq.question}</h3>
                  <p className="text-sm text-gray-500 mt-1">{faq.category}</p>
                </div>
                {expandedFAQ === faq.id ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {expandedFAQ === faq.id && (
                <div className="px-4 pb-3 border-t border-gray-200">
                  <p className="text-gray-700 mt-3">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-600" />
                <span className="text-gray-700">support@bettroi.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-600" />
                <span className="text-gray-700">+971 50 123 4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary-600" />
                <span className="text-gray-700">Mon-Fri 9:00 AM - 6:00 PM GST</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Support Channels</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-5 w-5 text-primary-600" />
                <span className="text-gray-700">Live Chat (24/7)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-600" />
                <span className="text-gray-700">Email Support</span>
              </div>
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-primary-600" />
                <span className="text-gray-700">Knowledge Base</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="#" className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
            <ExternalLink className="h-5 w-5 text-primary-600" />
            <div>
              <h3 className="font-medium text-gray-900">API Documentation</h3>
              <p className="text-sm text-gray-600">Developer guides and API references</p>
            </div>
          </a>
          
          <a href="#" className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
            <ExternalLink className="h-5 w-5 text-primary-600" />
            <div>
              <h3 className="font-medium text-gray-900">Community Forum</h3>
              <p className="text-sm text-gray-600">Connect with other users</p>
            </div>
          </a>
          
          <a href="#" className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
            <ExternalLink className="h-5 w-5 text-primary-600" />
            <div>
              <h3 className="font-medium text-gray-900">Training Programs</h3>
              <p className="text-sm text-gray-600">Certification and training courses</p>
            </div>
          </a>
          
          <a href="#" className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
            <ExternalLink className="h-5 w-5 text-primary-600" />
            <div>
              <h3 className="font-medium text-gray-900">Release Notes</h3>
              <p className="text-sm text-gray-600">Latest updates and features</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Help
