'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LearnMore() {
  return (
    <section className="w-full px-4 py-8 md:py-12 lg:py-16 bg-background text-foreground">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          About the TaskPilot
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          <Card className="flex-1">
            <CardContent className="p-6 flex flex-col gap-4">
              <h3 className="text-xl font-semibold">Core Features</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>Sign up and log in (JWT authentication)</li>
                <li>Create and manage up to 4 projects per user</li>
                <li>CRUD operations for tasks</li>
                <li>Status tracking & date fields for tasks</li>
              </ul>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge>Auth</Badge>
                <Badge>Projects</Badge>
                <Badge>Tasks</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardContent className="p-6 flex flex-col gap-4">
              <h3 className="text-xl font-semibold">Tech Stack</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>ReactJS (Frontend)</li>
                <li>ExpressJS (Backend)</li>
                <li>MongoDB or PostgreSQL</li>
                <li>JWT Authentication</li>
              </ul>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="outline">React</Badge>
                <Badge variant="outline">Express</Badge>
                <Badge variant="outline">MongoDB</Badge>
                <Badge variant="outline">JWT</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6 flex flex-col gap-4">
            <h3 className="text-xl font-semibold">Submission & Bonus</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Push to GitHub with a proper <code>README.md</code></li>
              <li>Deployment is mandatory</li>
              <li>Bonus: Add extra features or self-host your app</li>
            </ul>
            <Link href="https://github.com/your-username/your-repo-name" >
            <Button className="self-start mt-2" variant="default">
              Read Full Instructions <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
