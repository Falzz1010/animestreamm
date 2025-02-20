"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Loader2, Mail } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const [isResending, setIsResending] = useState(false)

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription>
            We sent you a verification link. Please check your email to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Mail className="h-6 w-6" />
          </div>
          <div className="text-center space-y-2">
            {email && (
              <p className="text-sm text-muted-foreground">
                We sent an email to <span className="font-medium text-foreground">{email}</span>
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Click the link in the email to verify your account.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 w-full">
            <Button asChild className="w-full">
              <Link href="/login">Return to login</Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 