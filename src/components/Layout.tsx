import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ScrollManager from './ScrollManager'

export default function Layout() {
  return (
    <>
      <ScrollManager />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
