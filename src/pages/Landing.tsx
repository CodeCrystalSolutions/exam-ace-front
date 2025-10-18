import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Users, 
  Shield, 
  BarChart3, 
  Clock, 
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Target,
  Award
} from "lucide-react";
import heroImage from "@/assets/hero-exam-system.jpg";

export default function Landing() {
  const features = [
    {
      icon: BookOpen,
      title: "Smart Exam Creation",
      description: "Create and manage comprehensive exams with ease. Add questions, set durations, and configure passing scores.",
    },
    {
      icon: Users,
      title: "Multi-Tenant Support",
      description: "Perfect for organizations. Each tenant gets isolated data with complete admin control over their users.",
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Granular permissions for admins, teachers, and students. Everyone sees exactly what they need.",
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Track performance, completion rates, and detailed insights. Make data-driven decisions instantly.",
    },
    {
      icon: Clock,
      title: "Timed Assessments",
      description: "Set precise time limits for exams. Automatic submission ensures fair assessment for all students.",
    },
    {
      icon: Award,
      title: "Instant Feedback",
      description: "AI-powered evaluation and detailed feedback. Students learn and improve with every attempt.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "50K+", label: "Exams Created" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ExamSystem</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge className="w-fit" variant="secondary">
              <Sparkles className="mr-1 h-3 w-3" />
              Trusted by educators worldwide
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Modern Exam Management Made{" "}
              <span className="text-primary">Simple</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Create, manage, and evaluate exams with our powerful multi-tenant platform. 
              Built for organizations that value efficiency and insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center"
                  >
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="font-semibold">10,000+ educators</div>
                <div className="text-muted-foreground">already using ExamSystem</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-3xl blur-3xl" />
            <img
              src={heroImage}
              alt="Exam Management Dashboard"
              className="relative rounded-2xl shadow-2xl border"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4" variant="secondary">
            <Target className="mr-1 h-3 w-3" />
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Everything you need to manage exams
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful features designed for educators, by educators. From creation to evaluation, 
            we've got you covered.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="w-fit" variant="secondary">
                Why Choose Us
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Built for modern education
              </h2>
              <div className="space-y-4">
                {[
                  "Multi-tenant architecture for complete data isolation",
                  "Role-based access control for security and compliance",
                  "AI-powered evaluation for instant, detailed feedback",
                  "Real-time analytics and reporting dashboards",
                  "Scalable infrastructure that grows with you",
                  "24/7 support from our dedicated team",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-success/10 flex items-center justify-center mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    </div>
                    <p className="text-lg">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-2">
                <CardHeader>
                  <BookOpen className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-2xl">Unlimited</CardTitle>
                  <CardDescription>Exams & Questions</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 mt-8">
                <CardHeader>
                  <Shield className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-2xl">Secure</CardTitle>
                  <CardDescription>Data Encryption</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2">
                <CardHeader>
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-2xl">10K+</CardTitle>
                  <CardDescription>Active Users</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 mt-8">
                <CardHeader>
                  <Award className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-2xl">99.9%</CardTitle>
                  <CardDescription>Uptime SLA</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32">
        <Card className="border-2 bg-gradient-to-br from-primary/5 to-purple-500/5">
          <CardContent className="p-12 text-center">
            <Badge className="mb-4" variant="secondary">
              <Sparkles className="mr-1 h-3 w-3" />
              Get Started Today
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to transform your exam management?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of educators and organizations using ExamSystem. 
              Start your free trial today, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold">ExamSystem</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 ExamSystem. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
