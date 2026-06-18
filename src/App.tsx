import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import DivisionPage from './pages/DivisionPage'
import CommoditiesPage from './pages/CommoditiesPage'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone art-directed page — its own masthead, outside the dark shell */}
        <Route path="/commodities" element={<CommoditiesPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/divisions/:slug" element={<DivisionPage />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
