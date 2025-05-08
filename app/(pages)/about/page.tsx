'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, Rocket } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <section className="w-full px-4 py-8 md:py-12 bg-background text-foreground">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold">About Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A full-stack application built to help developers track tasks across projects using modern technologies and clean practices.
          </p>
        </header>

        {/* Overview */}
        <Card>
          <CardContent className="p-6 flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">🧩 Project Overview</h2>
            <p className="text-muted-foreground">
              This task was designed to simulate a real-world development challenge. Over 2 days, you're expected to build a scalable, secure, and user-friendly task tracker application using ReactJS, ExpressJS, and MongoDB/PostgreSQL with JWT authentication.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Badge>2 Day Deadline</Badge>
              <Badge>JWT Auth</Badge>
              <Badge>CRUD</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="flex flex-col lg:flex-row gap-6">
          <Card className="flex-1">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-semibold">🛠️ Features</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Signup & Login with JWT</li>
                <li>Create up to 4 projects per user</li>
                <li>Create, Read, Update, Delete tasks</li>
                <li>Status tracking & timestamps</li>
              </ul>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="outline">User Auth</Badge>
                <Badge variant="outline">Projects</Badge>
                <Badge variant="outline">Tasks</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Tech Stack */}
          <Card className="flex-1">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-semibold">⚙️ Tech Stack</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>ReactJS (Frontend)</li>
                <li>ExpressJS (Backend)</li>
                <li>MongoDB / PostgreSQL (Database)</li>
                <li>JWT (Authentication)</li>
              </ul>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">Express</Badge>
                <Badge variant="secondary">MongoDB</Badge>
                <Badge variant="secondary">JWT</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submission */}
        <Card>
          <CardContent className="p-6 flex flex-col gap-4">
            <h3 className="text-xl font-semibold">🚀 Submission Guidelines</h3>
            <p className="text-muted-foreground">
              Submit your completed application by pushing it to a public GitHub repository. Include a <code>README.md</code> with setup instructions. Deployment is mandatory. Bonus points for additional features or self-hosting.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Button variant="default" asChild>
                <Link href="https://github.com" target="_blank">
                  <Github className="mr-2 h-4 w-4" />
                  View Repository
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
