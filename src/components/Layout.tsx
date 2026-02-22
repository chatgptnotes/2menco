import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import Breadcrumbs from './Breadcrumbs'

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar />
      <div className="lg:pl-[260px]">
        <Header />
        <main className="p-6">
          <div className="mx-auto max-w-7xl">
            <Breadcrumbs />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
