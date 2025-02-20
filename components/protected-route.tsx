"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "./auth-provider"
import { Loader2 } from "lucide-react"

export function withAuth<T extends object>(
  WrappedComponent: React.ComponentType<T>
) {
  return function ProtectedRoute(props: T) {
    const { user, loading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.push('/login')
        } else if (pathname === '/profile') {
          // Redirect ke dashboard jika mencoba mengakses /profile
          router.push('/dashboard')
        }
      }
    }, [user, loading, router, pathname])

    if (loading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )
    }

    if (!user) {
      return null
    }

    return <WrappedComponent {...props} />
  }
} 