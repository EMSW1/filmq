import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

import StepGenre from '@/components/discover/StepGenre';
import StepCast from '@/components/discover/StepCast';
import StepTimeEra from '@/components/discover/StepTimeEra';
import StepDuration from '@/components/discover/StepDuration';
import StepSocial from '@/components/discover/StepSocial';
import StepLanguage from '@/components/discover/StepLanguage';

const STEPS = ['Genre', 'Cast', 'Era', 'Duration', 'Social', 'Language'];

export default function Discover() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [filters, setFilters] = useState({
    genres: [],
    cast: '',
    yearRange: '',
    duration: '',
    social: '',
    languages: [],
  });

  const progress = ((step + 1) / STEPS.length) * 100;

  const canProceed = () => {
    if (step === 0) return filters.genres.length > 0;
    if (step === 2) return !!filters.yearRange;
    if (step === 3) return !!filters.duration;
    if (step === 4) return !!filters.social;
    return true; // cast and language are optional
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      // Store filters and go to results
      localStorage.setItem('filmq_filters', JSON.stringify(filters));
      navigate('/results');
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 0: return <StepGenre selected={filters.genres} onChange={(v) => setFilters({...filters, genres: v})} />;
      case 1: return <StepCast value={filters.cast} onChange={(v) => setFilters({...filters, cast: v})} />;
      case 2: return <StepTimeEra value={filters.yearRange} onChange={(v) => setFilters({...filters, yearRange: v})} />;
      case 3: return <StepDuration value={filters.duration} onChange={(v) => setFilters({...filters, duration: v})} />;
      case 4: return <StepSocial value={filters.social} onChange={(v) => setFilters({...filters, social: v})} />;
      case 5: return <StepLanguage selected={filters.languages} onChange={(v) => setFilters({...filters, languages: v})} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen p-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl font-black">
            <span className="gold-gradient">FilmQ</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Step {step + 1} of {STEPS.length}</p>
        </div>
        <div className="flex gap-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Progress */}
      <Progress value={progress} className="h-1 mb-8 bg-muted" />

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.25 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3 mt-8 pb-4">
        {step > 0 && (
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex-1 h-12 rounded-xl border-white/10 bg-transparent text-foreground hover:bg-muted"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-heading font-bold hover:bg-primary/90 disabled:opacity-30"
        >
          {step === STEPS.length - 1 ? (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Find Movies
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}