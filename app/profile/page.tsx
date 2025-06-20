"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { ErrorMessage } from "@/components/ErrorMessage"
import type { User, ApiResponse } from "@/lib/types"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    avatar: "",
  })

  // Mock user ID - in a real app, this would come from authentication
  const userId = "507f1f77bcf86cd799439011"

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`)
        const data: ApiResponse<User> = await response.json()

        if (data.success && data.data) {
          setUser(data.data)
          setFormData({
            name: data.data.name,
            bio: data.data.bio,
            avatar: data.data.avatar,
          })
        } else {
          // Create a mock user for demo purposes
          const mockUser: User = {
            _id: userId,
            name: "Demo User",
            email: "demo@example.com",
            avatar: "",
            bio: "Book enthusiast and avid reader",
            joinedDate: new Date().toISOString(),
            totalReviews: 0,
          }
          setUser(mockUser)
          setFormData({
            name: mockUser.name,
            bio: mockUser.bio,
            avatar: mockUser.avatar,
          })
        }
      } catch (error) {
        setError("Failed to fetch user profile")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data: ApiResponse<User> = await response.json()

      if (data.success && data.data) {
        setUser(data.data)
        setEditing(false)
      } else {
        setError(data.error || "Failed to update profile")
      }
    } catch (error) {
      setError("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        bio: user.bio,
        avatar: user.avatar,
      })
    }
    setEditing(false)
    setError(null)
  }

  if (loading) {
    return <LoadingSpinner text="Loading profile..." />
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="User profile not found" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && <ErrorMessage message={error} />}

          {/* Avatar and Basic Info */}
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-2xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground">
                Member since {new Date(user.joinedDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{user.totalReviews}</div>
                <div className="text-muted-foreground">Reviews Written</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">0</div>
                <div className="text-muted-foreground">Books Read</div>
              </CardContent>
            </Card>
          </div>

          {/* Editable Fields */}
          {editing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={handleCancel} disabled={saving}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Bio</h3>
                <p className="text-muted-foreground">{user.bio || "No bio provided yet."}</p>
              </div>

              <Button onClick={() => setEditing(true)}>Edit Profile</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
