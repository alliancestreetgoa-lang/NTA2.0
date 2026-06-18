import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * On route change: if the URL carries a hash, scroll to that anchor (after the
 * landing page mounts); otherwise scroll to top. Lets header anchor links work
 * from sub-routes (e.g. navigating to "/#contact").
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // Wait a tick for the target section to render.
      const id = hash.replace('#', '')
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      })
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    }
  }, [pathname, hash])

  return null
}
