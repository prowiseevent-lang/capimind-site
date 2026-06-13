'use client';

import { useState } from 'react';
import { Course } from '@/lib/courses';
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
  ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
}

export function CourseCard({ course, onSelect }: CourseCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const Icon = iconMap[course.icon] || Brain;

  return (
    <div
      className="group relative bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer hover:-translate-y-1"
      onClick={() => onSelect(course)}
    >
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${course.color} transition-opacity duration-500 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="h-16 w-16 text-white/80" />
          </div>
        )}
        <img
          src={course.image}
          alt={course.title}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Number Badge */}
        <div className="absolute top-3 left-3">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br ${course.color} text-white text-sm font-bold shadow-lg`}>
            {course.number}
          </div>
        </div>

        {/* Level Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-foreground backdrop-blur-sm text-xs font-medium">
            {course.level}
          </Badge>
        </div>

        {/* Title on Image */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-bold text-lg leading-tight drop-shadow-lg">{course.title}</h3>
          <p className="text-white/80 text-sm mt-0.5">{course.subtitle}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Audience */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {course.audience.map((a) => (
            <span key={a} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {a}
            </span>
          ))}
        </div>

        {/* Modules Preview */}
        <div className="space-y-1.5 mb-4">
          {course.modules.slice(0, 3).map((mod, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${course.color} shrink-0`} />
              <span className="truncate">{mod.title}</span>
            </div>
          ))}
          {course.modules.length > 3 && (
            <div className="text-xs text-muted-foreground/60 pl-3.5">
              +{course.modules.length - 3} autres modules
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 pt-3 border-t border-border/50">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-foreground">{course.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <UsersRound className="h-3.5 w-3.5" />
            <span>{course.students.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">À partir de</span>
            <p className="font-bold text-foreground text-sm">{course.price.split('–')[0].trim()} MAD</p>
          </div>
          <Button
            size="sm"
            className={`bg-gradient-to-r ${course.color} text-white border-0 shadow-md hover:shadow-lg transition-all`}
          >
            Voir détails
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
