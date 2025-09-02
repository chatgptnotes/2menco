import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Layout from '../Layout'

// Mock the child components
vi.mock('../Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>
}))

vi.mock('../Header', () => ({
  default: () => <div data-testid="header">Header</div>
}))

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Layout', () => {
  it('renders without crashing', () => {
    renderWithRouter(<Layout />)
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('header')).toBeInTheDocument()
  })

  it('renders main content area', () => {
    renderWithRouter(<Layout />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
