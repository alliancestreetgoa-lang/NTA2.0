import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ScrollManager from './ScrollManager'
import ScrollProgress from './ScrollProgress'

export default function Layout() {
  return (
    <>
      <ScrollManager />
      <ScrollProgress />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
