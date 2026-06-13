'use client';

import { Course } from '@/lib/courses';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Star,
  Clock,
  UsersRound,
  BookOpen,
  Target,
  CheckCircle2,
  Phone,
  Mail,
  UserPlus,
} from 'lucide-react';
import { useState } from 'react';

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

interface CourseDetailDialogProps {
  course: Course | null;
  open: boolean;
  onClose: () => void;
  onEnroll: (course: Course) => void;
}

export function CourseDetailDialog({ course, open, onClose, onEnroll }: CourseDetailDialogProps) {
  if (!course) return null;
  const Icon = iconMap[course.icon] || Brain;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header Image */}
        <div className="relative h-56 sm:h-64 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${course.color}`} />
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Close button area */}
          <div className="absolute top-4 right-4 z-10" />

          {/* Content over image */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-3 mb-2">
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm border-0">
                Formation #{course.number}
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">{course.title}</h2>
            <p className="text-white/80 text-lg">{course.subtitle}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="flex flex-col items-center p-3 rounded-xl bg-muted/50">
              <Star className="h-5 w-5 text-amber-500 mb-1" />
              <span className="font-bold text-lg">{course.rating}</span>
              <span className="text-xs text-muted-foreground">Note</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl bg-muted/50">
              <UsersRound className="h-5 w-5 text-primary mb-1" />
              <span className="font-bold text-lg">{course.students.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">Étudiants</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl bg-muted/50">
              <Clock className="h-5 w-5 text-primary mb-1" />
              <span className="font-bold text-lg">{course.duration}</span>
              <span className="text-xs text-muted-foreground">Durée</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl bg-muted/50">
              <BookOpen className="h-5 w-5 text-primary mb-1" />
              <span className="font-bold text-lg">{course.modules.length}</span>
              <span className="text-xs text-muted-foreground">Modules</span>
            </div>
          </div>

          {/* Public cible */}
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-primary" />
              Public cible
            </h3>
            <div className="flex flex-wrap gap-2">
              {course.audience.map((a) => (
                <Badge key={a} variant="outline" className="text-sm py-1 px-3">
                  {a}
                </Badge>
              ))}
            </div>
          </div>

          {/* Modules */}
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-primary" />
              Programme de la formation
            </h3>
            <div className="space-y-3">
              {course.modules.map((mod, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div className={`flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br ${course.color} text-white text-sm font-bold shrink-0 mt-0.5`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{mod.title}</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">{mod.description}</p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Demand note */}
          {course.demandNote && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm text-emerald-800 dark:text-emerald-200 flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                {course.demandNote}
              </p>
            </div>
          )}

          {/* Price & CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
            <div>
              <span className="text-sm text-muted-foreground">Investissement formation</span>
              <p className="text-2xl font-bold text-foreground">{course.price}</p>
            </div>
            <Button
              size="lg"
              className={`bg-gradient-to-r ${course.color} text-white border-0 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto`}
              onClick={() => onEnroll(course)}
            >
              <UserPlus className="h-5 w-5 mr-2" />
              S&apos;inscrire maintenant
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
