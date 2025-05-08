import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

const HeroSection: FC = () => {
  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black flex items-center justify-center px-4 md:px-12 transition-colors duration-300">
      <div className="max-w-6xl w-full flex flex-col-reverse md:flex-row items-center gap-10">
        {/* Text Content */}
        <div className="flex-1 text-center md:text-left space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-gray-800 dark:text-white">
            Track Tasks Effortlessly
            <br />
            <span className="text-primary dark:text-primary-400">
              Stay Organized. Stay Ahead.
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            TaskPilot helps you manage projects with ease. Create, track, and update your tasks in one clean dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <Link href="/sign-in?redirect_url=/dashboard" passHref>
            <Button size="lg" className="px-6">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            </Link>
            <Link href="/learn-more" passHref>
            <Button variant="outline" size="lg" className="px-6">
              Learn More
            </Button>
            </Link>
          </div>
        </div>

        {/* Illustration */}
        <div className="flex-1 flex justify-center">
          <img
            src="/images/task-management-illustration.webp"
            alt="Task Management Illustration"
            className="w-full max-w-md dark:brightness-90"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
