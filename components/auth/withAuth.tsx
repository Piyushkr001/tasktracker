'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { verifyTokenClient } from '@/lib/auth-client'


export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthWrapper(props: P) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const token = localStorage.getItem('token')
      const isValid = token && verifyTokenClient(token)

      if (!isValid) {
        router.push('/sign-in?redirect_url=/dashboard')
      } else {
        setLoading(false)
      }
    }, [])

    if (loading) return <div className="p-8 text-center">Loading...</div>

    return <Component {...props} />
  }
}
