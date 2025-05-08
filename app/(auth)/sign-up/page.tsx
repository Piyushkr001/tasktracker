'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function SignUpPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', country: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/users/signup', {
      method: 'POST',
      body: JSON.stringify(form),
    })

    if (res.ok) {
      toast.success('Account created!')
      router.push('/sign-in?redirect_url=/dashboard')
    } else {
      toast.error('Signup failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold">Sign Up</h2>
        {['name', 'email', 'country'].map((field) => (
          <div key={field}>
            <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
            <Input name={field} value={(form as any)[field]} onChange={handleChange} required />
          </div>
        ))}
        <div>
          <Label htmlFor="password">Password</Label>
          <Input type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <Button type="submit" className="w-full">Create Account</Button>
      </form>
    </div>
  )
}
