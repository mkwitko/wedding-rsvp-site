import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './HomePage'

const AdminPage = lazy(() => import('./admin/AdminPage').then((m) => ({ default: m.AdminPage })))
const ConvitePage = lazy(() => import('./components/ConvitePage').then((m) => ({ default: m.ConvitePage })))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={
          <Suspense fallback={<p style={{ padding: 24 }}>Carregando…</p>}>
            <AdminPage />
          </Suspense>
        } />
        <Route
          path="/convite/:id"
          element={
            <Suspense fallback={<p style={{ padding: 24 }}>Carregando…</p>}>
              <ConvitePage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
