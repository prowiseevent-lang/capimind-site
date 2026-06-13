'use client';

import { useState, useEffect } from 'react';
import { courses, Course } from '@/lib/courses';
import { CourseCard } from '@/components/course-card';
import { CourseDetailDialog } from '@/components/course-detail-dialog';
import { EnrollmentDialog } from '@/components/enrollment-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Award,
  BookOpen,
  Star,
  ArrowRight,
  Play,
  Search,
  Sparkles,
  Target,
  Clock,
  Shield,
  Menu,
  X,
  Heart,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

export default function Home() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.audience.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.modules.some((m) => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setDetailOpen(true);
  };

  const handleEnroll = (course: Course) => {
    setDetailOpen(false);
    setSelectedCourse(course);
    setEnrollOpen(true);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-border/50' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/images/logo.jpg"
                alt="CapiMind Logo"
                className="h-12 w-auto object-contain"
              />
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => scrollTo('courses')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Formations
              </button>
              <button onClick={() => scrollTo('features')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pourquoi nous
              </button>
              <button onClick={() => scrollTo('testimonials')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Témoignages
              </button>
              <button onClick={() => scrollTo('contact')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0"
                onClick={() => scrollTo('courses')}
              >
                S&apos;inscrire
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2 border-t border-border/50 pt-4">
              <button onClick={() => scrollTo('courses')} className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                Formations
              </button>
              <button onClick={() => scrollTo('features')} className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                Pourquoi nous
              </button>
              <button onClick={() => scrollTo('testimonials')} className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                Témoignages
              </button>
              <button onClick={() => scrollTo('contact')} className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                Contact
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-background" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-200/30 dark:bg-emerald-800/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200/30 dark:bg-teal-800/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Plateforme #1 au Maroc
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Investissez dans{' '}
                <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                  votre avenir
                </span>{' '}
                avec nos formations
              </h1>

              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Découvrez nos 10 formations premium en IA, data, cybersécurité, business et plus encore. 
                Des programmes conçus pour les professionnels qui veulent se démarquer.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all text-base"
                  onClick={() => scrollTo('courses')}
                >
                  Explorer les formations
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="text-base gap-2">
                  <Play className="h-5 w-5" />
                  Voir la démo
                </Button>
              </div>

              {/* Stats in hero */}
              <div className="grid grid-cols-3 gap-6 pt-4">
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">10+</p>
                  <p className="text-sm text-muted-foreground">Formations</p>
                </div>
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">8K+</p>
                  <p className="text-sm text-muted-foreground">Étudiants</p>
                </div>
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">4.8</p>
                  <p className="text-sm text-muted-foreground">Note moyenne</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/hero-banner.png"
                  alt="E-learning platform"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent" />
              </div>

              {/* Floating cards */}
              <div className="absolute -left-6 top-1/4 bg-card p-3 rounded-xl shadow-lg border border-border/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Star className="h-5 w-5 text-white fill-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold">4.8/5</p>
                  <p className="text-xs text-muted-foreground">Satisfaction</p>
                </div>
              </div>

              <div className="absolute -right-4 bottom-1/4 bg-card p-3 rounded-xl shadow-lg border border-border/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold">8 603</p>
                  <p className="text-xs text-muted-foreground">Apprennants</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80V20C240 60 480 0 720 30C960 60 1200 10 1440 40V80H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Trusted By / Logos */}
      <section className="py-12 border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground mb-6">Ils nous font confiance</p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-60">
            {['OCP Group', 'Maroc Telecom', 'Attijariwafa Bank', 'BMCE Bank', 'RAM', 'CIH Bank'].map((name) => (
              <span key={name} className="text-lg font-bold text-muted-foreground/60 tracking-wider">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">Nos Formations</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              10 formations pour{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                transformer votre carrière
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Des programmes conçus par des experts, pour des professionnels ambitieux.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une formation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 rounded-xl"
              />
            </div>
          </div>

          {/* Course Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onSelect={handleSelectCourse}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">Aucune formation trouvée pour &laquo; {searchQuery} &raquo;</p>
              <Button variant="outline" className="mt-4" onClick={() => setSearchQuery('')}>
                Effacer la recherche
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">Pourquoi CapiMind</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ce qui nous{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                distingue
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Une approche innovante et pratique pour garantir votre succès.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: 'Formation sur mesure',
                description: 'Des programmes adaptés à votre niveau et vos objectifs professionnels, avec un suivi personnalisé.',
                color: 'from-emerald-500 to-teal-600',
              },
              {
                icon: Users,
                title: 'Experts praticiens',
                description: 'Nos formateurs sont des experts du marché avec une expérience terrain vérifiée de +10 ans.',
                color: 'from-amber-500 to-orange-600',
              },
              {
                icon: Award,
                title: 'Certification reconnue',
                description: 'Obtenez une certification valorisée par les entreprises du Maroc et de l\'international.',
                color: 'from-violet-500 to-purple-600',
              },
              {
                icon: Clock,
                title: 'Flexibilité totale',
                description: 'Apprenez à votre rythme avec nos formats en ligne, hybrides ou en présentiel.',
                color: 'from-sky-500 to-cyan-600',
              },
              {
                icon: Shield,
                title: 'Garantie satisfaction',
                description: 'Satisfait ou remboursé. Nous croyons en la qualité de nos formations à 100%.',
                color: 'from-rose-500 to-pink-600',
              },
              {
                icon: BookOpen,
                title: 'Ressources incluses',
                description: 'Accès à vie aux supports de cours, exercices pratiques et communauté d\'alumni.',
                color: 'from-green-500 to-emerald-600',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">Témoignages</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ce que disent nos{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                apprennants
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Youssef El Amrani',
                role: 'CEO, TechMaroc',
                text: 'La formation IA pour Décideurs a transformé notre vision stratégique. Nous avons automatisé 40% de nos processus en 3 mois.',
                rating: 5,
                course: 'IA pour Décideurs',
              },
              {
                name: 'Fatima Zahra Bennani',
                role: 'Data Analyst, OCP',
                text: 'La formation Data Analytics m\'a permis de passer de simple analyste à lead BI. Power BI n\'a plus de secrets pour moi.',
                rating: 5,
                course: 'Data Analytics & BI',
              },
              {
                name: 'Ahmed Tazi',
                role: 'CTO, StartupCasablanca',
                text: 'La formation Cybersécurité est la meilleure investissement que nous ayons fait. Nos systèmes sont maintenant conformes aux standards internationaux.',
                rating: 5,
                course: 'Cybersécurité',
              },
              {
                name: 'Salma Idrissi',
                role: 'Entrepreneure',
                text: 'Grâce à la formation Création d\'Entreprise, j\'ai lancé mon business en 2 mois avec un modèle viable. Les formateurs sont exceptionnels.',
                rating: 5,
                course: 'Création d\'Entreprise',
              },
              {
                name: 'Karim Oujdi',
                role: 'Manager, Banque Populaire',
                text: 'La formation Leadership à distance m\'a donné les outils pour manager mon équipe hybride efficacement. Résultats visibles immédiatement.',
                rating: 5,
                course: 'Leadership & Management',
              },
              {
                name: 'Nadia Fassi',
                role: 'Développeuse, Freelance',
                text: 'La formation Programmation m\'a ouvert les portes du cloud computing. J\'ai triplé mes revenus en 6 mois grâce aux compétences acquises.',
                rating: 5,
                course: 'Programmation & Développement',
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-card border border-border/50 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="mt-3 text-xs">
                  {testimonial.course}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Prêt à transformer votre carrière ?
          </h2>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto mb-8">
            Rejoignez plus de 8 000 professionnels qui ont déjà boosté leur carrière grâce à nos formations. 
            Votre succès commence ici.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-emerald-700 hover:bg-white/90 shadow-lg text-base"
              onClick={() => scrollTo('courses')}
            >
              Voir les formations
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 text-base"
              onClick={() => scrollTo('contact')}
            >
              Nous contacter
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">Contact</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Une question ?{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                Parlons-en
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Notre équipe est là pour vous accompagner dans votre parcours de formation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-muted-foreground text-sm">contact@capimind.com</p>
                  <p className="text-muted-foreground text-sm">support@capimind.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Téléphone</h3>
                  <p className="text-muted-foreground text-sm">+212 5XX-XXXXXX</p>
                  <p className="text-muted-foreground text-sm">Lun-Ven: 9h-18h</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Adresse</h3>
                  <p className="text-muted-foreground text-sm">Boulevard Mohammed V</p>
                  <p className="text-muted-foreground text-sm">Casablanca, Maroc</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                fetch('/api/contact', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    subject: formData.get('subject'),
                    message: formData.get('message'),
                  }),
                }).then(() => {
                  form.reset();
                });
              }}
            >
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nom</label>
                <Input id="name" name="name" placeholder="Votre nom" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" name="email" type="email" placeholder="votre@email.com" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Sujet</label>
                <Input id="subject" name="subject" placeholder="Sujet de votre message" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Votre message..."
                  required
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0"
              >
                Envoyer le message
                <Mail className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-card border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <img
                  src="/images/logo.jpg"
                  alt="CapiMind Logo"
                  className="h-14 w-auto object-contain"
                />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Designed for Exceptional Minds. La plateforme de formation premium pour les professionnels ambitieux au Maroc et en Afrique.
              </p>
            </div>

            {/* Formations */}
            <div>
              <h4 className="font-semibold mb-4">Formations</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {courses.slice(0, 5).map((c) => (
                  <li key={c.id} className="hover:text-foreground cursor-pointer transition-colors" onClick={() => handleSelectCourse(c)}>
                    {c.title}
                  </li>
                ))}
              </ul>
            </div>

            {/* Plus */}
            <div>
              <h4 className="font-semibold mb-4">Plus</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {courses.slice(5).map((c) => (
                  <li key={c.id} className="hover:text-foreground cursor-pointer transition-colors" onClick={() => handleSelectCourse(c)}>
                    {c.title}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  contact@capimind.com
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  +212 5XX-XXXXXX
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" />
                  Casablanca, Maroc
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CapiMind. Tous droits réservés.
            </p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              Fait avec <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 mx-0.5" /> au Maroc
            </div>
          </div>
        </div>
      </footer>

      {/* Dialogs */}
      <CourseDetailDialog
        course={selectedCourse}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onEnroll={handleEnroll}
      />
      <EnrollmentDialog
        course={selectedCourse}
        open={enrollOpen}
        onClose={() => setEnrollOpen(false)}
      />
    </div>
  );
}
