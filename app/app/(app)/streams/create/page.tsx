'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CreateStreamPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/streams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error creating stream:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create Stream</h1>
            <p className="text-muted-foreground">Start a new collaborative video stream</p>
          </div>
        </div>

        {/* Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Stream Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Stream Name</Label>
              <Input
                id="name"
                placeholder="Late Night Gaming Session"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell viewers what this stream is about..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            {/* Visibility */}
            <div className="space-y-2">
              <Label>Stream Visibility</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.isPublic}
                    onChange={() => setFormData({ ...formData, isPublic: true })}
                  />
                  <span className="text-sm text-foreground">Public</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!formData.isPublic}
                    onChange={() => setFormData({ ...formData, isPublic: false })}
                  />
                  <span className="text-sm text-foreground">Private</span>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Link href="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Creating...' : 'Create Stream'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
