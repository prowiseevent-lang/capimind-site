'use client';

import { Course } from '@/lib/courses';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Brain,
  BarChart3,
  Shield,
  Rocket,
  Workflow,
  TrendingUp,
  Users,
  Zap,
  Code,
  Lightbulb,
  UserPlus,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useState } from 'react';
import { submitToSheet } from '@/lib/submit-to-sheet';

const iconMap: Record<string, React.ElementType> = {
  Brain,
  BarChart3,
  Shield,
  Rocket,
  Workflow,
  TrendingUp,
  Users,
  Zap,
  Code,
  Lightbulb,
};

interface EnrollmentDialogProps {
  course: Course | null;
  open: boolean;
  onClose: () => void;
}

export function EnrollmentDialog({ course, open, onClose }: EnrollmentDialogProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!course) return null;
  const Icon = iconMap[course.icon] || Brain;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await submitToSheet('/api/enroll', 'inscription', {
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      course: course.title,
      message: formData.message,
      courseId: course.id,
      courseTitle: course.title,
      destination: 'contact@capimind.com',
    });

    if (result.ok) {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        setSuccess(false);
        setFormData({ fullName: '', email: '', phone: '', company: '', message: '' });
        onClose();
      }, 2500);
    } else {
      setError(result.message || 'Erreur lors de l\'inscription. Veuillez réessayer.');
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSuccess(false);
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {success ? (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-center">Demande d'inscription bien reçue !</h3>
            <p className="text-muted-foreground text-center">
              Vous recevrez une confirmation pour la formation &laquo; {course.title} &raquo;.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${course.color}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="block">Inscription</span>
                  <span className="text-sm font-normal text-muted-foreground">{course.title}</span>
                </div>
              </DialogTitle>
            </DialogHeader>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm mt-2">
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet *</Label>
                <Input
                  id="fullName"
                  placeholder="Votre nom complet"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+212 6XX XXX XXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Entreprise</Label>
                <Input
                  id="company"
                  placeholder="Nom de votre entreprise (optionnel)"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Input
                  id="message"
                  placeholder="Votre message (optionnel)"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <div className="p-3 rounded-xl bg-muted/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Formation</span>
                  <span className="font-semibold">{course.title}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Investissement</span>
                  <span className="font-semibold">{course.price}</span>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className={`w-full bg-gradient-to-r ${course.color} text-white border-0 shadow-lg hover:shadow-xl transition-all`}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <UserPlus className="h-5 w-5 mr-2" />
                )}
                {loading ? 'Inscription en cours...' : "Confirmer l'inscription"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
