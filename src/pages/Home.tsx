import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, Clock, DollarSign, Calendar,
  CheckCircle, ChevronRight, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fade in variant for staggered animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Container for staggered animations
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-brand-600 text-white p-2 rounded-lg">
                <Clock className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-gray-900">ShiftMaster</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <a
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-brand-50 to-brand-100 p-6 no-underline outline-none focus:shadow-md"
                              href="#"
                            >
                              <Calendar className="h-6 w-6 text-brand-600" />
                              <div className="mb-2 mt-4 text-lg font-medium text-brand-900">
                                Smart Scheduling
                              </div>
                              <p className="text-sm leading-tight text-brand-700">
                                Advanced algorithms that optimize shifts based on employee availability, skills, and business needs.
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <a
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              href="#"
                            >
                              <div className="text-sm font-medium leading-none">Shift Management</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Drag-and-drop interface for easy schedule creation
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <a
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              href="#"
                            >
                              <div className="text-sm font-medium leading-none">Payroll Integration</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Seamlessly sync time tracking with payroll systems
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <a
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              href="#"
                            >
                              <div className="text-sm font-medium leading-none">Team Communication</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Request time off, swap shifts, and get notified instantly
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Pricing</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 w-[400px] md:w-[500px]">
                        <li className="flex flex-col gap-2 p-2">
                          <p className="text-sm font-medium leading-none">Flexible plans for teams of all sizes</p>
                          <p className="text-sm text-muted-foreground">Choose a plan that works for your organization</p>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <a
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              href="#pricing"
                            >
                              <div className="text-sm font-medium leading-none">View Pricing Options</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Starting from just $29/month
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      href="#" 
                      className={navigationMenuTriggerStyle()}
                    >
                      About Us
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      href="#" 
                      className={navigationMenuTriggerStyle()}
                    >
                      Contact
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* Login Dropdown */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="border-brand-600 text-brand-600 hover:bg-brand-50">
                    Login
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2">
                  <div className="grid gap-2">
                    <Link to="/login" className="flex items-center space-x-2 rounded-md p-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                      <Users className="h-5 w-5" />
                      <span>Employee Login</span>
                    </Link>
                    <div className="h-px bg-border my-1" />
                    <Link to="/login?type=admin" className="flex items-center space-x-2 rounded-md p-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                      <DollarSign className="h-5 w-5" />
                      <span>Admin Login</span>
                    </Link>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Button className="bg-brand-600 hover:bg-brand-700">Get Started</Button>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>ShiftMaster</SheetTitle>
                    <SheetDescription>Workforce management made simple</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 flex flex-col space-y-4">
                    <a href="#features" className="px-2 py-3 text-lg" onClick={() => setIsMenuOpen(false)}>Features</a>
                    <a href="#pricing" className="px-2 py-3 text-lg" onClick={() => setIsMenuOpen(false)}>Pricing</a>
                    <a href="#" className="px-2 py-3 text-lg" onClick={() => setIsMenuOpen(false)}>About Us</a>
                    <a href="#" className="px-2 py-3 text-lg" onClick={() => setIsMenuOpen(false)}>Contact</a>
                    
                    <div className="border-t border-border pt-4 mt-4">
                      <p className="text-sm font-medium mb-2">Login As</p>
                      <div className="grid gap-2">
                        <Link to="/login" className="flex items-center space-x-2 rounded-md p-2 hover:bg-accent transition-colors" onClick={() => setIsMenuOpen(false)}>
                          <Users className="h-5 w-5" />
                          <span>Employee</span>
                        </Link>
                        <Link to="/login?type=admin" className="flex items-center space-x-2 rounded-md p-2 hover:bg-accent transition-colors" onClick={() => setIsMenuOpen(false)}>
                          <DollarSign className="h-5 w-5" />
                          <span>Admin</span>
                        </Link>
                      </div>
                    </div>
                    
                    <Button className="mt-4 w-full bg-brand-600 hover:bg-brand-700">Get Started</Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.span 
                className="inline-block px-3 py-1 mb-6 text-xs font-semibold bg-brand-100 text-brand-800 rounded-full"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Advanced Workforce Management
              </motion.span>
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Next-Gen Shift <br className="hidden lg:block" /> 
                <span className="text-brand-600">Scheduling</span> <br className="hidden lg:block" />
                That Works For Everyone
              </motion.h1>
              <motion.p 
                className="text-lg text-gray-700 mb-8 max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                ShiftMaster combines smart scheduling algorithms with intuitive design to create the perfect schedule for your team, while automating payroll management.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button size="lg" className="bg-brand-600 hover:bg-brand-700">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="border-brand-200 text-brand-700 hover:bg-brand-50">
                  View Demo
                </Button>
              </motion.div>
              <motion.div 
                className="mt-8 flex items-center gap-2 text-sm text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No credit card required for trial</span>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 to-purple-600 rounded-lg opacity-75 blur"></div>
                <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2300&q=80" 
                    alt="ShiftMaster Dashboard Preview" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-400 rounded-full mix-blend-multiply opacity-10 animate-pulse"></div>
          <div className="absolute top-1/3 -left-24 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply opacity-10 animate-pulse"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features, <span className="text-brand-600">Built for Teams</span></h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ShiftMaster solves the most complex scheduling challenges while keeping the human experience at the center.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: <Calendar className="h-10 w-10 text-brand-600" />,
                title: "Smart Scheduling",
                description: "Intuitive algorithms that analyze employee preferences and business demands to create optimal shift assignments."
              },
              {
                icon: <Clock className="h-10 w-10 text-brand-600" />,
                title: "Time Tracking",
                description: "Accurate attendance records with geolocation verification and biometric options for reliable timekeeping."
              },
              {
                icon: <Users className="h-10 w-10 text-brand-600" />,
                title: "Team Management",
                description: "Manage employee profiles, skills, certifications, and availability all in one centralized location."
              },
              {
                icon: <DollarSign className="h-10 w-10 text-brand-600" />,
                title: "Payroll Integration",
                description: "Seamlessly export time data to your payroll system, with automatic calculation of regular and overtime hours."
              },
              {
                icon: <Calendar className="h-10 w-10 text-brand-600" />,
                title: "Forecasting Tools",
                description: "Scheduling tools that predict busy periods and staffing needs based on historical data and external factors."
              },
              {
                icon: <CheckCircle className="h-10 w-10 text-brand-600" />,
                title: "Compliance Automation",
                description: "Built-in rules engine that ensures schedules comply with labor laws, union agreements, and company policies."
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                variants={fadeInUp}
              >
                <div className="bg-brand-50 p-3 rounded-lg inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* New Preview Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Preview Our <span className="text-brand-600">Dashboard</span></h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the power of ShiftMaster with our interactive dashboard preview.
            </p>
          </motion.div>

          <motion.div 
            className="relative rounded-xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=2070&q=80" 
              alt="Dashboard Preview" 
              className="w-full h-auto"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-20">
              <h3 className="text-2xl font-bold mb-2">Streamlined Workforce Management</h3>
              <p className="text-white/90 mb-4">Monitor, manage, and optimize your team's performance in real-time.</p>
              <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, <span className="text-brand-600">Transparent Pricing</span></h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your business needs. All plans include core features with no hidden costs.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                name: "Starter",
                price: "29",
                description: "Perfect for small teams just getting started",
                features: [
                  "Up to 15 employees",
                  "Basic scheduling",
                  "Time tracking",
                  "Mobile app access",
                  "Email support"
                ],
                cta: "Start Free Trial",
                popular: false
              },
              {
                name: "Professional",
                price: "79",
                description: "Advanced features for growing businesses",
                features: [
                  "Up to 50 employees",
                  "Advanced scheduling",
                  "Time tracking with geolocation",
                  "Payroll integration",
                  "Shift swapping",
                  "Priority support"
                ],
                cta: "Start Free Trial",
                popular: true
              },
              {
                name: "Enterprise",
                price: "199",
                description: "Custom solutions for large organizations",
                features: [
                  "Unlimited employees",
                  "Advanced scheduling",
                  "Custom integrations",
                  "Advanced reporting",
                  "Dedicated account manager",
                  "24/7 premium support"
                ],
                cta: "Contact Sales",
                popular: false
              }
            ].map((plan, index) => (
              <motion.div 
                key={index} 
                className={`rounded-xl overflow-hidden ${plan.popular ? 'ring-2 ring-brand-600 scale-105' : 'border border-gray-200'}`}
                variants={fadeInUp}
              >
                <Card>
                  {plan.popular && (
                    <div className="bg-brand-600 text-white text-center py-1 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className={`text-center ${plan.popular ? 'bg-brand-50' : ''}`}>
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="mt-4 flex items-baseline justify-center">
                      <span className="text-4xl font-bold tracking-tight text-gray-900">${plan.price}</span>
                      <span className="ml-1 text-xl font-semibold text-gray-500">/mo</span>
                    </div>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-brand-600 hover:bg-brand-700' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by <span className="text-brand-600">Businesses Worldwide</span></h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our customers have to say about how ShiftMaster has transformed their workforce management.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                quote: "ShiftMaster's scheduling has reduced our management time by 70% while improving employee satisfaction. It's been a game changer for our retail operation.",
                author: "Sarah Johnson",
                role: "Operations Manager, Retail Chain"
              },
              {
                quote: "The payroll integration is seamless. We've eliminated timesheet errors and our payroll processing time has been cut in half.",
                author: "Michael Chen",
                role: "Finance Director, Healthcare Services"
              },
              {
                quote: "Our staff loves the mobile app for shift swapping and checking their schedule. Communication has improved and no-shows have decreased significantly.",
                author: "Emma Rodriguez",
                role: "HR Director, Hospitality Group"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-gray-50 p-8 rounded-xl border border-gray-100"
                variants={fadeInUp}
              >
                <div className="flex mb-6">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-medium text-gray-900">{testimonial.author}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-600">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            className="flex flex-col lg:flex-row items-center justify-between gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="lg:w-2/3">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to transform your workforce management?</h2>
              <p className="text-xl text-white/80 max-w-2xl">
                Join thousands of businesses already using ShiftMaster to save time, reduce costs, and create happier teams.
              </p>
            </div>
            <div className="lg:w-1/3 flex justify-center lg:justify-end">
              <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-100">
                Start Your Free Trial
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-white text-brand-600 p-1 rounded">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold text-white">ShiftMaster</span>
              </div>
              <p className="text-gray-400 mb-4">
                Next-generation workforce management for modern teams.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Webinars</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <p className="text-gray-400 text-sm text-center">
              &copy; {new Date().getFullYear()} ShiftMaster. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
