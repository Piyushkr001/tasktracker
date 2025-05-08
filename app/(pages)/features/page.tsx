'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function FeaturesPage() {
  return (
    <section className="w-full px-4 py-8 md:py-12 bg-background text-foreground">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold">🔍 Application Features</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore all the key features included in the Task Tracker app, designed for multi-user collaboration and effective task management.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* User Features */}
          <Card className="flex-1">
            <CardContent className="p-6 flex flex-col gap-4">
              <h2 className="text-2xl font-semibold">👤 User Management</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Secure user signup and login</li>
                <li>JWT-based authentication</li>
                <li>Each user has a name, email, country, and password</li>
                <li>Encapsulated user data</li>
              </ul>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="outline">Auth</Badge>
                <Badge variant="outline">Security</Badge>
                <Badge variant="outline">JWT</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Project Features */}
          <Card className="flex-1">
            <CardContent className="p-6 flex flex-col gap-4">
              <h2 className="text-2xl font-semibold">📁 Project Management</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Create up to 4 projects per user</li>
                <li>View and manage projects easily</li>
                <li>Scoped task tracking per project</li>
              </ul>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary">Projects</Badge>
                <Badge variant="secondary">Limit</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Task Features */}
          <Card className="flex-1">
            <CardContent className="p-6 flex flex-col gap-4">
              <h2 className="text-2xl font-semibold">📝 Task Management</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Create, Read, Update, and Delete tasks</li>
                <li>Status tracking (e.g., Todo, In Progress, Done)</li>
                <li>Task timestamps: creation and completion dates</li>
              </ul>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge>CRUD</Badge>
                <Badge>Status</Badge>
                <Badge>Date Tracking</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Bonus Features */}
          <Card className="flex-1">
            <CardContent className="p-6 flex flex-col gap-4">
              <h2 className="text-2xl font-semibold">🌟 Bonus Features</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Optional deployment or self-hosting</li>
                <li>Readme documentation and GitHub setup</li>
                <li>Dark/light mode compatible UI</li>
              </ul>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="outline">Deployment</Badge>
                <Badge variant="outline">Documentation</Badge>
                <Badge variant="outline">Dark Mode</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
