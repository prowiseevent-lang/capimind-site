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
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  CheckCircle2,
  Lightbulb,
  Globe,
  TrendingUp,
  GraduationCap,
  Eye,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';

const WHATSAPP_URL = 'https://api.whatsapp.com/send?phone=212786249306&source=FB_Post&token=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjEyNSJ9.eyJleHAiOjE3ODE0NjY1NTAsInBob25lIjoiMjEyNzg2MjQ5MzA2IiwidGV4dCI6IkxpZW5cdTAwYTA6XG5odHRwczpcL1wvZmIubWVcLzZkY3NGcDhvSFxuXG5Cb25qb3VyXHUwMGEwISBQdWlzLWplIGVuIHNhdm9pciBwbHVzIFx1MDBlMCBjZSBzdWpldFx1MDBhMD8iLCJzb3VyY2VfdXJsIjoiaHR0cHM6XC9cL2ZiLm1lXC82ZGNzRnA4b0giLCJpY2VicmVha2VyIjoiQm9uam91clx1MDBhMCEgUHVpcy1qZSBlbiBzYXZvaXIgcGx1cyBcdTAwZTAgY2Ugc3VqZXRcdTAwYTA_IiwiYXBwIjoiZmFjZWJvb2siLCJlbnRyeV9wb2ludCI6InBvc3RfY3RhIiwiamlkIjoiMjEyNzg2MjQ5MzA2XHUwMDQwcy53aGF0c2FwcC5uZXQiLCJsaWQiOiI5NDkxNTIwMzcxOTI4Mlx1MDA0MGxpZCIsInNvdXJjZV9pZCI6IjEyMjA5NDAwMDk4MDQzNzUyNyIsImNoYXRfZHJhZnQiOjEsInNob3dfYWRfYXR0cmlidXRpb24iOjEsInNvdXJjZSI6IkZCX1Bvc3QiLCJjb250ZXh0IjoiQWZpWkFwLXB2QTNyU09seEVhOEtaRkgtamQtY0lTejkyUmNtT3BldUJnclQzLXZvVEttNmNwOHhpV0RjWTJhYVBjdUhaSEhydzk4MUNuekpweVo5Y2g4ZlkwR3RBSnlMcnREeFpLTTlqTDZWMFpFV25RM0JZSHRObnR5VDZEVk01YlZrcTg5V01HaXJtSlp6eEppSUwzNmxXWFNzMEtpbkEwR0J1QzdMTVZWd1ZxVHdjMEpNWTdzdXpmNlZ0WTJacDU0bnlfVmpZaktXRzVmbHJlQXBOaUY4R0JUWXd6QmJ4NGpMWTJzUGVtUEtHQ2tZM1c4dWJtWlllMG92TUtfd3hZSXBMSkc4TlZ6M3BqOXo4YjE1TjQyaHJacWlFaWJGUjZRbHhGNUZRTDhfdnZwZ3U4a3ZzZm5JaDNTaXExZW5Wb0VaUXBhb1ZHb0g3YW1xckxINVpJVnd5QW1SRXQxcExJZ3F0X2dmVkZYdVlWelVWWlhHRVdkamFQNmdhdzB6TFIxZUtkYURTMjFjMUhGWmxORWZ3SnQ4WW5rZWhhYjFqVEJpd0dTYTdNWWtrMGZDIn0.r6fUv68rc8kXaJNZ_o1E2ysv7rqOO6XGsZon9WX9jg2Zc4K48o2kVW_uT9pXtln01Bm1zmn9SQ1Ab0w6EVb4XQ&fbclid=IwY2xjawSak5BleHRuA2FlbQIxMQBzcnRjBmFwcF9pZBAyMjIwMzkxNzg4MjAwODkyAAEeBdg4dHzXCvg7aVAUmi3BQjwtSRU2iVvw641O3PaPQLbZXAoOCwI9oim-zsU_aem_hJ-rZ1KZj5PDmcyQINW9tg';

// Custom TikTok icon since Lucide doesn't have one
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function Home() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [emailChatOpen, setEmailChatOpen] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailForm, setEmailForm] = useState({ name: '', email: '', subject: '', message: '' });

  const faqs = [
    {
      question: 'Qu\'est-ce que CapiMind ?',
      answer: 'CapiMind est la plateforme de formation e-learning premium au Maroc, dédiée aux professionnels ambitieux qui souhaitent se former aux compétences du futur : Intelligence Artificielle, Data Analytics, Cybersécurité, Business, Leadership et plus encore. Notre mission est de démocratiser l\'accès à l\'excellence éducative en Afrique.',
    },
    {
      question: 'Quelles formations propose CapiMind ?',
      answer: 'CapiMind propose 10 formations certifiantes : IA pour Décideurs, Data Analytics & BI, Cybersécurité & Protection des Données, Création d\'Entreprise, Automatisation Business, Finance & Investissement, Leadership & Management, Productivité & Organisation Digitale, Programmation & Développement, et Compétences du Futur. Chaque formation est conçue par des experts praticiens avec une expérience terrain de +10 ans.',
    },
    {
      question: 'Les formations CapiMind sont-elles certifiantes ?',
      answer: 'Oui, toutes nos formations délivrent une certification reconnue par les entreprises au Maroc et à l\'international. Notre certification atteste des compétences acquises et est valorisée sur le marché de l\'emploi. Plus de 85% de nos diplômés constatent une progression de carrière dans les 6 mois suivant leur formation.',
    },
    {
      question: 'Comment se déroulent les formations en ligne ?',
      answer: 'Nos formations se déroulent en 3 formats : 100% en ligne (vidéos HD, exercices interactifs, projets pratiques), hybride (en ligne + sessions en présentiel), ou en présentiel à Marrakech. Chaque apprenant bénéficie d\'un mentor dédié, d\'un suivi personnalisé et d\'un accès à vie aux ressources pédagogiques.',
    },
    {
      question: 'Quel est le prix des formations CapiMind ?',
      answer: 'Nos formations commencent à partir de 2 900 MAD. Le prix varie selon la formation et le format choisi (en ligne, hybride, présentiel). Nous proposons des facilités de paiement en 3 ou 6 fois. Contactez-nous sur WhatsApp pour obtenir un devis personnalisé et connaître les offres promotionnelles en cours.',
    },
    {
      question: 'Puis-je suivre une formation tout en travaillant ?',
      answer: 'Absolument ! CapiMind est conçu pour les professionnels actifs. Nos formations sont flexibles avec des sessions le soir et le week-end. Le format en ligne vous permet d\'apprendre à votre rythme, avec une moyenne de 5 à 8 heures par semaine. Plus de 90% de nos apprenants sont des professionnels en activité.',
    },
    {
      question: 'Quelle est la garantie de satisfaction ?',
      answer: 'CapiMind offre une garantie satisfait ou remboursé. Si vous n\'êtes pas satisfait de la qualité de la formation dans les 7 premiers jours, nous vous remboursons intégralement, sans conditions. Nous croyons en l\'excellence de nos programmes et le prouvons par cette garantie.',
    },
    {
      question: 'Comment contacter CapiMind pour s\'inscrire ?',
      answer: 'Vous pouvez nous contacter par email à contact@capimind.com, par téléphone au +212 786-249306, ou directement sur WhatsApp pour une réponse rapide. Notre équipe est disponible du lundi au vendredi de 9h à 18h pour vous accompagner dans votre parcours de formation.',
    },
    {
      question: 'Les étudiants bénéficient-ils d\'une réduction sur les formations CapiMind ?',
      answer: 'Oui. CapiMind accorde une réduction de 15 % sur l\'ensemble de ses formations aux étudiants, sur présentation d\'un justificatif de scolarité ou d\'une carte étudiant en cours de validité. Cette offre vise à faciliter l\'accès à des formations de qualité et à soutenir le développement des compétences des futurs professionnels. Contactez notre équipe pour connaître les modalités d\'application de cette réduction.',
    },
    {
      question: 'Quels débouchés après une formation CapiMind ?',
      answer: 'Nos formations ouvrent les portes vers des métiers en forte demande : Data Analyst, Consultant Cybersécurité, Chef de Projet IA, Entrepreneur, Automatisation Specialist, et bien d\'autres. Nous proposons un accompagnement vers l\'emploi avec notre réseau de +200 entreprises partenaires au Maroc et en Afrique. 85% de nos diplômés trouvent un emploi ou obtiennent une promotion dans les 6 mois.',
    },
  ];

  // JSON-LD Structured Data for FAQ (SEO/GEO/AEO)
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  };

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
      {/* JSON-LD Structured Data for FAQ (GEO/AEO SEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-border/50' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-32">
            {/* Logo */}
            <div className="flex items-center shrink-0">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-lg transition-transform hover:scale-105 active:scale-100"
                aria-label="Retour en haut de la page"
              >
                <picture>
                  <source srcSet="/images/logo.webp" type="image/webp" />
                  <img
                    src="/images/logo.png"
                    alt="CapiMind Logo"
                    className="h-30 w-auto object-contain"
                    style={{ imageRendering: 'high-quality' }}
                    fetchPriority="high"
                  />
                </picture>
              </button>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => scrollTo('about')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                À propos
              </button>
              <button onClick={() => scrollTo('courses')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Formations
              </button>
              <button onClick={() => scrollTo('services')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Services
              </button>
              <button onClick={() => scrollTo('features')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pourquoi nous
              </button>
              <button onClick={() => scrollTo('faq')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </button>
              <button onClick={() => scrollTo('contact')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </button>
              <div className="flex items-center gap-1 ml-2 border-l border-border/50 pl-4">
                <a
                  href="https://web.facebook.com/capimindofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full text-muted-foreground hover:text-[#1877F2] hover:bg-[#1877F2]/10 transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://www.instagram.com/capimindofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full text-muted-foreground hover:text-[#dc2743] hover:bg-[#dc2743]/10 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://www.tiktok.com/@capimindofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/capimindofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full text-muted-foreground hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
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
              <button onClick={() => scrollTo('about')} className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                À propos
              </button>
              <button onClick={() => scrollTo('courses')} className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                Formations
              </button>
              <button onClick={() => scrollTo('services')} className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                Services
              </button>
              <button onClick={() => scrollTo('features')} className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                Pourquoi nous
              </button>
              <button onClick={() => scrollTo('faq')} className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                FAQ
              </button>
              <button onClick={() => scrollTo('contact')} className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                Contact
              </button>
              <div className="flex items-center gap-3 px-3 pt-2">
                <a
                  href="https://web.facebook.com/capimindofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-[#1877F2] hover:text-white text-muted-foreground transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://www.instagram.com/capimindofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1882] hover:text-white text-muted-foreground transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://www.tiktok.com/@capimindofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-black hover:text-white text-muted-foreground transition-all duration-300"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/capimindofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-[#0A66C2] hover:text-white text-muted-foreground transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
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
                Designed for{' '}
                <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                  Exceptional Minds
                </span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                CapiMind est la plateforme de formation premium au Maroc qui accompagne les professionnels ambitieux dans leur transformation digitale. IA, Data, Cybersécurité, Business — boostez votre carrière avec des experts.
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
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md border border-input bg-background hover:bg-[#25D366] hover:text-white hover:border-[#25D366] text-base font-medium transition-all duration-300"
                >
                  <MessageCircle className="h-5 w-5" />
                  Passer à l'action
                </a>
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
              <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5">
                <picture>
                  <source srcSet="/images/hero-banner.webp" type="image/webp" />
                  <img
                    src="/images/hero-banner.png"
                    alt="E-learning platform"
                    className="w-full h-auto object-cover"
                    style={{ imageRendering: '-webkit-optimize-contrast' }}
                    fetchPriority="high"
                  />
                </picture>
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

      {/* Trusted By / Partners */}
      <section className="py-12 border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground mb-6">Ils nous font confiance</p>
          <div className="flex justify-center">
            <img
              src="/images/trusted-by.png"
              alt="Nos partenaires de confiance : ProWise Solutions, JA14 Informatique Plus, Arabian Desert Home, Association Nationale des Métiers d'Arts et des Médias, Psyped, Sundial, Hosteen"
              className="w-full max-w-4xl h-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </div>
      </section>

      {/* À propos / Mission Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mission Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Notre Mission</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Qui est{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                CapiMind
              </span>
              {' '}?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              CapiMind est née d'une conviction forte : les talents d'Afrique et du Maroc méritent un accompagnement à la hauteur de leur ambition. Nous créons les passerelles entre le potentiel humain et les opportunités du monde digital.
            </p>
          </div>

          {/* Vision & Mission Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200/50 dark:border-emerald-800/30">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6">
                <Eye className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Notre Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                Devenir la référence en formation professionnelle en Afrique, en offrant des programmes qui transforment durablement les carrières et créent un impact économique mesurable. Nous croyons que l'éducation est le levier le plus puissant du changement.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200/50 dark:border-amber-800/30">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Notre Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                Démocratiser l'accès aux compétences du futur en proposant des formations pratiques, accessibles et certifiantes. Nous accompagnons chaque apprenant avec une pédagogie active et un suivi personnalisé vers la réussite professionnelle.
              </p>
            </div>
          </div>

          {/* Méthodologie Pédagogique */}
          <div className="mb-16">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                Notre{' '}
                <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                  Méthodologie Pédagogique
                </span>
              </h3>
              <p className="text-muted-foreground">
                Une approche en 4 piliers conçue pour garantir l'acquisition réelle des compétences et leur application immédiate en entreprise.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  icon: Lightbulb,
                  title: 'Comprendre',
                  description: 'Évaluation des besoins et définition d\'un parcours personnalisé selon votre niveau et vos objectifs.',
                  color: 'from-amber-500 to-orange-600',
                },
                {
                  step: '02',
                  icon: GraduationCap,
                  title: 'Apprendre',
                  description: 'Formation pratique avec des cas réels du marché marocain et africain, animée par des experts praticiens.',
                  color: 'from-emerald-500 to-teal-600',
                },
                {
                  step: '03',
                  icon: TrendingUp,
                  title: 'Pratiquer',
                  description: 'Projets concrets, workshops et mise en situation professionnelle pour ancrer les compétences.',
                  color: 'from-violet-500 to-purple-600',
                },
                {
                  step: '04',
                  icon: Award,
                  title: 'Certifier',
                  description: 'Obtention d\'une certification reconnue et accompagnement vers l\'emploi ou l\'entrepreneuriat.',
                  color: 'from-rose-500 to-pink-600',
                },
              ].map((item, i) => (
                <div key={i} className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-3 right-4 text-5xl font-black text-muted-foreground/10">{item.step}</div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Avantages & Opportunités */}
          <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <div className="text-center mb-10">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Avantages & Opportunités
                </h3>
                <p className="text-emerald-100 max-w-2xl mx-auto">
                  Pourquoi des milliers de professionnels choisissent CapiMind pour accélérer leur carrière.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: Globe,
                    title: 'Accès international',
                    description: 'Des certifications reconnues à l\'international qui ouvrent les portes du marché global.',
                  },
                  {
                    icon: TrendingUp,
                    title: '+85% de progression',
                    description: 'Nos apprenants constatent une progression salariale moyenne de 85% dans les 12 mois suivant la formation.',
                  },
                  {
                    icon: Users,
                    title: 'Réseau d\'alumni',
                    description: 'Rejoignez une communauté de +8 000 professionnels connectés à travers le Maroc et l\'Afrique.',
                  },
                  {
                    icon: Shield,
                    title: 'Garantie satisfaction',
                    description: 'Satisfait ou remboursé. Nous croyons en nos formations à 100% et le démontrons.',
                  },
                  {
                    icon: Clock,
                    title: 'Flexibilité totale',
                    description: 'En ligne, hybride ou en présentiel — apprenez à votre rythme, selon votre emploi du temps.',
                  },
                  {
                    icon: Sparkles,
                    title: 'Accompagnement personnalisé',
                    description: 'Un mentor dédié, un suivi individuel et un plan de carrière sur-mesure pour chaque apprenant.',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-emerald-100 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-10">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-12 px-8 rounded-lg bg-white text-emerald-700 hover:bg-white/90 font-semibold text-base shadow-lg transition-all duration-300"
                >
                  <MessageCircle className="h-5 w-5" />
                  Discutons de votre projet
                </a>
              </div>
            </div>
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

      {/* Services Section */}
      <section id="services" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">Nos Services</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Des solutions sur-mesure pour{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                chaque ambition
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Au-delà de nos formations certifiantes, CapiMind vous accompagne avec des programmes adaptés à vos besoins spécifiques.
            </p>
          </div>

          {/* Service 1: Bootcamps */}
          <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border/50 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Nos Bootcamps pour professionnels & étudiants</h3>
                <p className="text-muted-foreground text-sm">Des programmes intensifs pour monter rapidement en compétences sur les outils les plus demandés du marché.</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Gestion de Projet', desc: 'PMP, Agile, Scrum — certifications et méthodologies reconnues internationalement.' },
                { title: 'SAP - Odoo (ERP)', desc: 'Maîtrisez les ERP leaders du marché pour piloter la performance de votre entreprise.' },
                { title: 'HubSpot - Salesforce (CRM)', desc: 'Gérez efficacement votre relation client avec les CRM les plus utilisés au monde.' },
                { title: 'Bureautique Avancée', desc: 'Excel, Word, PowerPoint — devenez expert sur la suite Microsoft Office.' },
                { title: 'Business English', desc: 'Anglais professionnel et communication internationale pour réussir vos négociations.' },
                { title: "Communication Professionnelle", desc: "Développez votre aisance à l'oral, à l'écrit et en réunion." },
              ].map((item) => (
                <div key={item.title} className="bg-background rounded-xl p-4 border border-border/30 hover:border-emerald-300 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed pl-6">{item.desc}</p>
                </div>
              ))}
            </div>
            {/* Action buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 shadow-md hover:shadow-lg transition-all"
                onClick={() => scrollTo('contact')}
              >
                S'inscrire à un bootcamp
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md border border-input bg-background hover:bg-[#25D366] hover:text-white hover:border-[#25D366] text-base font-medium transition-all duration-300"
              >
                <MessageCircle className="h-5 w-5" />
                Demander le programme
              </a>
            </div>
          </div>

          {/* Service 2: Formations sur-mesure entreprises */}
          <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border/50 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Formations sur-mesure pour les entreprises</h3>
                <p className="text-muted-foreground text-sm">Des programmes conçus spécifiquement pour répondre aux besoins de votre organisation.</p>
              </div>
            </div>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Domaines d'expertise</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Management et Leadership", desc: "Gestion d'équipe, conduite du changement et développement des talents." },
                { title: "Technologie et Digital", desc: "Transformation digitale, bureautique, systèmes d'information et marketing." },
                { title: 'Commercial et Relation client', desc: 'Techniques de vente, négociation et marketing.' },
                { title: 'Conformité et Réglementation', desc: 'Hygiène, sécurité au travail et droit du travail.' },
              ].map((item) => (
                <div key={item.title} className="bg-background rounded-xl p-4 border border-border/30 hover:border-amber-300 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-amber-500 shrink-0" />
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed pl-6">{item.desc}</p>
                </div>
              ))}
            </div>
            {/* Action buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 shadow-md hover:shadow-lg transition-all"
                onClick={() => scrollTo('contact')}
              >
                Demander un devis entreprise
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md border border-input bg-background hover:bg-[#25D366] hover:text-white hover:border-[#25D366] text-base font-medium transition-all duration-300"
              >
                <MessageCircle className="h-5 w-5" />
                Parler à un conseiller
              </a>
            </div>
          </div>

          {/* Services 3 & 4: Coaching & VAE */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border/50 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Coaching Individuel sur-mesure</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Un accompagnement personnalisé pour votre développement personnel et vos soft-skills. Avancez avec un coach dédié qui vous aide à révéler votre plein potentiel.
              </p>
              <button
                onClick={() => scrollTo('contact')}
                className="inline-flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
              >
                Demander un coaching
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border/50 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Validation des Acquis de l'Expérience (VAE)</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Transformez votre expérience professionnelle en certification officielle. Notre accompagnement VAE vous guide pas à pas dans la valorisation de votre parcours.
              </p>
              <button
                onClick={() => scrollTo('contact')}
                className="inline-flex items-center gap-1 text-sm font-medium text-cyan-600 hover:text-cyan-700 transition-colors"
              >
                En savoir plus sur la VAE
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all"
                onClick={() => scrollTo('contact')}
              >
                Discuter de votre projet
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md border border-input bg-background hover:bg-[#25D366] hover:text-white hover:border-[#25D366] text-base font-medium transition-all duration-300"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
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
                name: 'Youssef Benali',
                role: 'Directeur Stratégie Digitale, ProWise Solutions',
                text: 'La formation IA pour Décideurs a transformé notre vision stratégique. Grâce à CapiMind, nous avons automatisé 40% de nos processus consultings en 3 mois. Un investissement rentabilisé dès le premier mois.',
                rating: 5,
                course: 'IA pour Décideurs',
              },
              {
                name: 'Fatima Zahra Berrada',
                role: 'Responsable Systèmes & Données, JA14 Informatique Plus',
                text: 'La formation Data Analytics a révolutionné notre approche technique. Nos rapports BI sont passés de jours à quelques heures. L\'expertise pratique des formateurs CapiMind est inégalée.',
                rating: 5,
                course: 'Data Analytics & BI',
              },
              {
                name: 'Karim Oukacha',
                role: 'Chef d\'Entreprise, Arabian Desert Home',
                text: 'La formation Création d\'Entreprise m\'a permis de structurer mon projet hôtelier à Agafay. De l\'idée au business plan viable en 8 semaines. CapiMind comprend les défis des entrepreneurs marocains.',
                rating: 5,
                course: 'Création d\'Entreprise',
              },
              {
                name: 'Nadia El Idrissi',
                role: 'Cadre Responsable Projets, Association Nationale des Métiers d\'Arts',
                text: 'La formation Automatisation Business a digitalisé nos processus associatifs. Nous gérons maintenant nos 500+ membres avec une efficacité décuplée. Merci CapiMind pour cette transformation.',
                rating: 5,
                course: 'Automatisation Business',
              },
              {
                name: 'Amine Tadlaoui',
                role: 'Directeur Technique, Psyped',
                text: 'La formation Cybersécurité a sécurisé toute notre infrastructure. En tant que startup tech, la confiance de nos clients dépend de notre sécurité. CapiMind nous a donné cet avantage concurrentiel.',
                rating: 5,
                course: 'Cybersécurité',
              },
              {
                name: 'Salma Chraibi',
                role: 'Cheffe d\'Équipe Opérations, Sundial',
                text: 'La formation Leadership & Management m\'a donné les outils pour manager mon équipe hybride de 30 personnes. Productivité +45% en 2 mois. Les formateurs partagent une expérience terrain authentique.',
                rating: 5,
                course: 'Leadership & Management',
              },
              {
                name: 'Rachid Mouline',
                role: 'Responsable Développement, Hosteen',
                text: 'La formation Programmation nous a permis de migrer notre infrastructure vers le cloud en interne. Économie de 60% sur nos coûts d\'hébergement. Les compétences acquises sont immédiatement applicables.',
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

      {/* FAQ / Q&R Section */}
      <section id="faq" className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">
              <HelpCircle className="h-3.5 w-3.5 mr-1" />
              Questions & Réponses
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Vos questions{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                fréquentes
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Tout ce que vous devez savoir sur CapiMind. Si votre question n&apos;est pas ici, contactez-nous directement.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl bg-card border border-border/50 overflow-hidden transition-all duration-300 hover:border-primary/20"
              >
                <button
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${openFaq === i ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white' : 'bg-muted text-muted-foreground'}`}>
                      <span className="text-sm font-bold">Q</span>
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base pr-2">{faq.question}</h3>
                  </div>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-5 pb-5 pl-16">
                    <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 p-6 rounded-2xl bg-card border border-border/50">
            <p className="text-muted-foreground mb-4">Vous avez d&apos;autres questions ?</p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium hover:shadow-lg transition-all duration-300"
            >
              <MessageCircle className="h-4 w-4" />
              Posez votre question sur WhatsApp
            </a>
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
                  <a href="mailto:contact@capimind.com" className="text-muted-foreground text-sm hover:text-emerald-600 transition-colors">contact@capimind.com</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Téléphone</h3>
                  <a href="tel:+212786249306" className="text-muted-foreground text-sm hover:text-emerald-600 transition-colors">+212 786-249306</a>
                  <p className="text-muted-foreground text-sm">Lun-Ven: 9h-18h</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Adresse</h3>
                  <p className="text-muted-foreground text-sm">APPT 15 IMM 12 LOT SINE</p>
                  <p className="text-muted-foreground text-sm">Avenue Allal El Fassi, Marrakech</p>
                  <p className="text-muted-foreground text-sm">40000, Maroc</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#25D366] to-emerald-600 flex items-center justify-center shrink-0">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">WhatsApp</h3>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground text-sm hover:text-[#25D366] transition-colors"
                  >
                    Discuter maintenant →
                  </a>
                  <p className="text-muted-foreground text-sm">Réponse rapide garantie</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Réseaux Sociaux</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <a
                      href="https://web.facebook.com/capimindofficial"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-[#1877F2] hover:text-white text-muted-foreground transition-all duration-300"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                    <a
                      href="https://www.instagram.com/capimindofficial"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1882] hover:text-white text-muted-foreground transition-all duration-300"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                    <a
                      href="https://www.tiktok.com/@capimindofficial"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-black hover:text-white text-muted-foreground transition-all duration-300"
                      aria-label="TikTok"
                    >
                      <TikTokIcon className="h-4 w-4" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/capimindofficial"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-[#0A66C2] hover:text-white text-muted-foreground transition-all duration-300"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </div>
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
                }).then((res) => {
                  if (res.ok) {
                    form.reset();
                    import('next/link').then(() => {});
                    const toast = document.createElement('div');
                    toast.className = 'fixed top-24 right-4 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium animate-in fade-in slide-in-from-right duration-300';
                    toast.innerHTML = '✓ Message envoyé avec succès à contact@capimind.com';
                    document.body.appendChild(toast);
                    setTimeout(() => toast.remove(), 4000);
                  }
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
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" />
                Votre message sera automatiquement transmis à contact@capimind.com
              </p>
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
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-lg transition-transform hover:scale-105 active:scale-100"
                  aria-label="Retour en haut de la page"
                >
                  <picture>
                    <source srcSet="/images/logo.webp" type="image/webp" />
                    <img
                      src="/images/logo.png"
                      alt="CapiMind Logo"
                      className="h-36 w-auto object-contain"
                      style={{ imageRendering: 'high-quality' }}
                      fetchPriority="high"
                    />
                  </picture>
                </button>
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

            {/* Contact & Réseaux Sociaux */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  <a href="mailto:contact@capimind.com" className="hover:text-emerald-600 transition-colors">contact@capimind.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  <a href="tel:+212786249306" className="hover:text-emerald-600 transition-colors">+212 786-249306</a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" />
                  Marrakech, 40000, Maroc
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] transition-colors">WhatsApp</a>
                </li>
              </ul>

              <h4 className="font-semibold mb-3 mt-6">Réseaux Sociaux</h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://web.facebook.com/capimindofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-[#1877F2] hover:text-white text-muted-foreground transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://www.instagram.com/capimindofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white text-muted-foreground transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://www.tiktok.com/@capimindofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-black hover:text-white text-muted-foreground transition-all duration-300"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/capimindofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-[#0A66C2] hover:text-white text-muted-foreground transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground">
                © 2026 CapiMind. Tous droits réservés.
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Plateforme détenue Légalement par la Sté ProWise Solutions.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <a
                  href="https://web.facebook.com/capimindofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[#1877F2] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://www.instagram.com/capimindofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[#dc2743] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://www.tiktok.com/@capimindofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/capimindofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[#0A66C2] transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                Fait avec <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 mx-0.5" /> au Maroc
              </div>
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

      {/* WhatsApp Chat Button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
        aria-label="Discuter sur WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="text-sm font-semibold hidden sm:inline group-hover:inline">
          WhatsApp
        </span>
        {/* Pulse animation */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
      </a>

      {/* Email Chatbot */}
      {emailChatOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[340px] sm:w-[380px] animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-[#EA4335] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">CapiMind Email</p>
                  <p className="text-xs text-white/80">contact@capimind.com</p>
                </div>
              </div>
              <button
                onClick={() => { setEmailChatOpen(false); setEmailSent(false); }}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 max-h-[420px] overflow-y-auto">
              {emailSent ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                  </div>
                  <p className="font-semibold text-lg mb-1">Message envoyé !</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Votre email a été transmis à contact@capimind.com
                  </p>
                  <button
                    onClick={() => { setEmailSent(false); setEmailForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="text-sm text-[#EA4335] hover:underline font-medium"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setEmailSending(true);
                    try {
                      const res = await fetch('/api/contact', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(emailForm),
                      });
                      if (res.ok) {
                        setEmailSent(true);
                      }
                    } catch {
                      // silently fail
                    }
                    setEmailSending(false);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Nom complet</label>
                    <input
                      type="text"
                      required
                      value={emailForm.name}
                      onChange={(e) => setEmailForm({ ...emailForm, name: e.target.value })}
                      placeholder="Votre nom"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#EA4335]/40 focus:border-[#EA4335] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Votre email</label>
                    <input
                      type="email"
                      required
                      value={emailForm.email}
                      onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                      placeholder="votre@email.com"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#EA4335]/40 focus:border-[#EA4335] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Sujet</label>
                    <input
                      type="text"
                      required
                      value={emailForm.subject}
                      onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                      placeholder="Objet de votre message"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#EA4335]/40 focus:border-[#EA4335] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Message</label>
                    <textarea
                      required
                      rows={3}
                      value={emailForm.message}
                      onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                      placeholder="Écrivez votre message..."
                      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#EA4335]/40 focus:border-[#EA4335] transition-all resize-none"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Envoyé à contact@capimind.com
                  </p>
                  <button
                    type="submit"
                    disabled={emailSending}
                    className="w-full bg-[#EA4335] hover:bg-[#D33426] text-white py-2.5 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {emailSending ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
                        Envoyer l&apos;email
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Email Floating Button */}
      <button
        onClick={() => { setEmailChatOpen(!emailChatOpen); setEmailSent(false); }}
        className="fixed bottom-6 right-40 sm:right-48 z-50 flex items-center gap-2 bg-[#EA4335] hover:bg-[#D33426] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
        aria-label="Envoyer un email"
      >
        <Mail className="h-6 w-6" />
        <span className="text-sm font-semibold hidden sm:inline group-hover:inline">
          Email
        </span>
        {/* Pulse animation */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
      </button>
    </div>
  );
}
