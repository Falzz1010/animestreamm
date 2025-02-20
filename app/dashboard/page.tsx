"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Settings, List, Heart, Clock, Edit } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { withAuth } from "@/components/protected-route"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface Profile {
  username: string | null
  avatar_url: string | null
  updated_at: string | null
}

function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    async function loadProfile() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("username, avatar_url, updated_at")
          .eq("id", user?.id || '')
          .single()

        if (error) throw error
        setProfile(data)
      } catch (error) {
        console.error("Error loading profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [user, router])

  async function handleUpdateProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsUpdating(true)

    const formData = new FormData(e.currentTarget)
    const username = formData.get('username') as string

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          username,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id)

      if (error) throw error
      
      // Refresh profile data
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('username, avatar_url, updated_at')
        .eq('id', user?.id)
        .single()

      setProfile(updatedProfile)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        {/* Profile Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-lg">
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-center">
                  <h3 className="text-2xl font-semibold">
                    {profile?.username || user?.email?.split("@")[0]}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" variant="outline">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          name="username"
                          defaultValue={profile?.username || ''}
                          placeholder="Enter username"
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isUpdating}>
                        {isUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <nav className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <List className="mr-2 h-4 w-4" />
                  Watchlist
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Heart className="mr-2 h-4 w-4" />
                  Favorites
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Clock className="mr-2 h-4 w-4" />
                  History
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>
                Manage your anime watchlist, favorites, and history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="watchlist">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="watchlist" className="mt-4">
                  <div className="rounded-lg border bg-muted/50 p-8 text-center">
                    <h3 className="mb-2 text-lg font-medium">
                      Your watchlist is empty
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Start adding anime to your watchlist to keep track of what you want to watch.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="favorites" className="mt-4">
                  <div className="rounded-lg border bg-muted/50 p-8 text-center">
                    <h3 className="mb-2 text-lg font-medium">
                      No favorites yet
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Add anime to your favorites to quickly access them later.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="history" className="mt-4">
                  <div className="rounded-lg border bg-muted/50 p-8 text-center">
                    <h3 className="mb-2 text-lg font-medium">
                      No watch history
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Your watch history will appear here once you start watching anime.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your recent anime watching activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-muted/50 p-8 text-center">
                <h3 className="mb-2 text-lg font-medium">
                  No recent activity
                </h3>
                <p className="text-sm text-muted-foreground">
                  Start watching anime to see your activity here.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default withAuth(DashboardPage) 