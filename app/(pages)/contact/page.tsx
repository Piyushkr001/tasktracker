'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  return (
    <section className="w-full px-4 py-8 md:py-12 bg-background text-foreground">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold">📬 Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions or feedback about the Task Tracker project? Reach out using the form below.
          </p>
        </header>

        {/* Flex Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Contact Info */}
          <div className="flex-1 space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-semibold">🗂 Information</h2>
                <p className="text-muted-foreground">
                  This Task Tracker app was created as part of a 2-day developer trainee challenge. Feel free to ask about the technologies used, contributions, or deployment.
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Email:</strong> dev@taskpilot.app</p>
                  <p><strong>GitHub:</strong> github.com/Piyushkr001/tasktracker</p>
                  <p><strong>Location:</strong> Remote / Global</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="flex-1">
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl font-semibold">📨 Send a Message</h2>
                <form className="flex flex-col gap-4">
                  <Input type="text" placeholder="Your Name" required />
                  <Input type="email" placeholder="Your Email" required />
                  <Textarea placeholder="Your Message" rows={5} required />
                  <Button type="submit" className="w-fit self-end">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
