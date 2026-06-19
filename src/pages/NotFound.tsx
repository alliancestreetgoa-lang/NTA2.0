import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-[#0a0a0b]">
      <div className="container-x text-center">
        <p className="eyebrow justify-center">Error 404</p>
        <h1 className="mt-4 font-display text-5xl font-bold text-white sm:text-7xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-[#9aa6b3]">
          The page you're looking for has moved or no longer exists.
        </p>
        <Link to="/" className="btn-gold mx-auto mt-8">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>
    </section>
  )
}
