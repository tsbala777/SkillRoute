import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles, 
  Globe, 
  Smartphone, 
  Brain, 
  BarChart3, 
  Cloud, 
  Shield, 
  Settings, 
  Gamepad2, 
  Link2, 
  Radio, 
  Palette, 
  Code2,
  Compass
} from 'lucide-react';

// Predefined options
const EDUCATION_LEVELS = [
  'High School',
  'Associate Degree',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'PhD',
  'Bootcamp',
  'Self-Taught',
  'Other'
];

const SKILL_OPTIONS = [
  // Programming Languages
  { name: 'JavaScript', category: 'Languages' },
  { name: 'Python', category: 'Languages' },
  { name: 'Java', category: 'Languages' },
  { name: 'TypeScript', category: 'Languages' },
  { name: 'C++', category: 'Languages' },
  { name: 'C#', category: 'Languages' },
  { name: 'Go', category: 'Languages' },
  { name: 'Rust', category: 'Languages' },
  { name: 'PHP', category: 'Languages' },
  { name: 'Ruby', category: 'Languages' },
  { name: 'Swift', category: 'Languages' },
  { name: 'Kotlin', category: 'Languages' },
  
  // Frontend
  { name: 'React', category: 'Frontend' },
  { name: 'Vue.js', category: 'Frontend' },
  { name: 'Angular', category: 'Frontend' },
  { name: 'Svelte', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'HTML/CSS', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  
  // Backend
  { name: 'Node.js', category: 'Backend' },
  { name: 'Django', category: 'Backend' },
  { name: 'Flask', category: 'Backend' },
  { name: 'Spring Boot', category: 'Backend' },
  { name: 'Express.js', category: 'Backend' },
  { name: 'FastAPI', category: 'Backend' },
  { name: '.NET', category: 'Backend' },
  
  // Database
  { name: 'SQL', category: 'Database' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'MySQL', category: 'Database' },
  { name: 'Redis', category: 'Database' },
  { name: 'Firebase', category: 'Database' },
  
  // Cloud & DevOps
  { name: 'AWS', category: 'Cloud/DevOps' },
  { name: 'Azure', category: 'Cloud/DevOps' },
  { name: 'GCP', category: 'Cloud/DevOps' },
  { name: 'Docker', category: 'Cloud/DevOps' },
  { name: 'Kubernetes', category: 'Cloud/DevOps' },
  { name: 'CI/CD', category: 'Cloud/DevOps' },
  { name: 'Git', category: 'Cloud/DevOps' },
  
  // Data & AI
  { name: 'Machine Learning', category: 'Data/AI' },
  { name: 'TensorFlow', category: 'Data/AI' },
  { name: 'PyTorch', category: 'Data/AI' },
  { name: 'Data Analysis', category: 'Data/AI' },
  { name: 'Pandas', category: 'Data/AI' },
  { name: 'NumPy', category: 'Data/AI' },
];

const DOMAIN_OPTIONS = [
  { name: 'Web Development', trending: true, icon: Globe },
  { name: 'Mobile Development', trending: true, icon: Smartphone },
  { name: 'AI/Machine Learning', trending: true, icon: Brain },
  { name: 'Data Science', trending: true, icon: BarChart3 },
  { name: 'Cloud Computing', trending: true, icon: Cloud },
  { name: 'Cybersecurity', trending: false, icon: Shield },
  { name: 'DevOps', trending: true, icon: Settings },
  { name: 'Game Development', trending: false, icon: Gamepad2 },
  { name: 'Blockchain', trending: false, icon: Link2 },
  { name: 'IoT', trending: false, icon: Radio },
  { name: 'UI/UX Design', trending: false, icon: Palette },
  { name: 'Full Stack Development', trending: true, icon: Code2 },
];

const ProfileSetup = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    education: '',
    skills: [],
    interests: [],
    goals: '',
    experience: ''
  });
  const [customSkill, setCustomSkill] = useState('');
  const [customInterest, setCustomInterest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const steps = [
    { title: 'Basic Info', description: 'Tell us about yourself' },
    { title: 'Skills', description: 'What do you know?' },
    { title: 'Interests', description: 'What excites you?' },
    { title: 'Goals', description: 'Where are you headed?' },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleSkill = (skillName) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skillName)
        ? prev.skills.filter(s => s !== skillName)
        : [...prev.skills, skillName]
    }));
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, customSkill.trim()]
      }));
      setCustomSkill('');
    }
  };

  const toggleInterest = (interestName) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestName)
        ? prev.interests.filter(i => i !== interestName)
        : [...prev.interests, interestName]
    }));
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !formData.interests.includes(customInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, customInterest.trim()]
      }));
      setCustomInterest('');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Please sign in to save your profile');
        navigate('/signin');
        return;
      }

      const idToken = await user.getIdToken();
      
      // Convert arrays to comma-separated strings for backend
      const profileData = {
        name: formData.name,
        education: formData.education,
        skills: formData.skills.join(', '),
        interests: formData.interests.join(', '),
        goals: formData.goals,
        experience: formData.experience || ''
      };
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      await axios.post(
        `${API_URL}/api/students/profile`,
        profileData,
        {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.name.trim() && formData.education;
      case 1:
        return formData.skills.length > 0;
      case 2:
        return formData.interests.length > 0;
      case 3:
        return formData.goals.trim();
      default:
        return false;
    }
  };

  // Group skills by category
  const skillsByCategory = SKILL_OPTIONS.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill.name);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-3 sm:p-4 md:p-6">
      {/* App Header */}
      <div className="mb-6 sm:mb-8 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-200">
            <Compass className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">SkillRoute</h1>
        </div>
        <p className="text-gray-500 text-xs sm:text-sm font-medium">Your personalized learning journey</p>
      </div>

      <div className="w-full max-w-4xl">
        {/* Progress indicator */}
        <div className="mb-3 sm:mb-4 md:mb-6">
          <div className="flex items-center w-full">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 text-sm sm:text-base ${
                      index === currentStep
                        ? 'bg-black text-white shadow-lg'
                        : index < currentStep
                        ? 'bg-black text-white'
                        : 'bg-white text-gray-400 border-2 border-gray-200'
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`text-xs sm:text-sm font-bold mt-2 whitespace-nowrap transition-colors ${
                    index === currentStep 
                      ? 'text-black' 
                      : index < currentStep
                      ? 'text-gray-900'
                      : 'text-gray-400'
                  }`}>{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="h-0.5 flex-1 mx-2 sm:mx-3 bg-gray-200 rounded" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <Card className="shadow-xl border border-gray-200 bg-white">
          <CardHeader className="p-4 sm:p-5 md:p-6 border-b border-gray-100">
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base font-semibold text-gray-500 mt-1">
              {steps[currentStep].description}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 md:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 sm:space-y-4"
              >
                {/* Step 0: Basic Info */}
                {currentStep === 0 && (
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-sm sm:text-base font-bold text-gray-900">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1.5 bg-white border-gray-200 focus:border-black focus:ring-black"
                      />
                    </div>

                    <div>
                      <Label htmlFor="education" className="text-sm sm:text-base font-bold text-gray-900">Education Level</Label>
                      <Select value={formData.education} onValueChange={(value) => setFormData({ ...formData, education: value })}>
                        <SelectTrigger className="mt-1.5 bg-white border-gray-200 focus:border-black focus:ring-black">
                          <SelectValue placeholder="Select your education level" />
                        </SelectTrigger>
                        <SelectContent>
                          {EDUCATION_LEVELS.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Step 1: Skills */}
                {currentStep === 1 && (
                  <div className="space-y-4 sm:space-y-5">
                    {Object.entries(skillsByCategory).map(([category, skills]) => (
                      <div key={category}>
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">{category}</h3>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {skills.map((skill) => (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => toggleSkill(skill)}
                              className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                                formData.skills.includes(skill)
                                  ? 'bg-black text-white shadow-md'
                                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-black border border-gray-200'
                              }`}
                            >
                              {skill}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="pt-2 border-t border-gray-100">
                      <Label className="text-sm sm:text-base font-bold text-gray-900">Add Custom Skill</Label>
                      <div className="flex gap-2 mt-1.5">
                        <Input
                          placeholder="Type a skill..."
                          value={customSkill}
                          onChange={(e) => setCustomSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
                          className="bg-white border-gray-200 focus:border-black"
                        />
                        <Button onClick={addCustomSkill} type="button" className="bg-black hover:bg-gray-800 text-white">Add</Button>
                      </div>
                    </div>

                    {formData.skills.length > 0 && (
                      <div className="pt-3 border-t border-gray-100 bg-gray-50 rounded-xl p-3">
                        <p className="text-xs sm:text-sm font-bold text-gray-900 mb-2">Selected Skills ({formData.skills.length})</p>
                        <div className="flex flex-wrap gap-1.5">
                          {formData.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-1 bg-black text-white rounded-full text-xs sm:text-sm font-semibold shadow-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Interests */}
                {currentStep === 2 && (
                  <div className="space-y-4 sm:space-y-5">
                    <div>
                      <div className="flex items-center gap-2 mb-2.5">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide">Trending Domains</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-2.5">
                        {DOMAIN_OPTIONS.filter(d => d.trending).map((domain) => {
                          const IconComponent = domain.icon;
                          return (
                            <button
                              key={domain.name}
                              type="button"
                              onClick={() => toggleInterest(domain.name)}
                              className={`p-2.5 sm:p-3.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 border-2 ${
                                formData.interests.includes(domain.name)
                                  ? 'border-black bg-gray-50 shadow-md'
                                  : 'border-gray-200 hover:border-gray-400 bg-white hover:shadow-sm'
                              }`}
                            >
                              <IconComponent className={`w-6 h-6 sm:w-7 sm:h-7 mb-1 mx-auto ${formData.interests.includes(domain.name) ? 'text-black' : 'text-gray-600'}`} />
                              <div className="text-center leading-tight">{domain.name}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-2.5 uppercase tracking-wide">Other Domains</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-2.5">
                        {DOMAIN_OPTIONS.filter(d => !d.trending).map((domain) => {
                          const IconComponent = domain.icon;
                          return (
                            <button
                              key={domain.name}
                              type="button"
                              onClick={() => toggleInterest(domain.name)}
                              className={`p-2.5 sm:p-3.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 border-2 ${
                                formData.interests.includes(domain.name)
                                  ? 'border-black bg-gray-50 shadow-md'
                                  : 'border-gray-200 hover:border-gray-400 bg-white hover:shadow-sm'
                              }`}
                            >
                              <IconComponent className={`w-6 h-6 sm:w-7 sm:h-7 mb-1 mx-auto ${formData.interests.includes(domain.name) ? 'text-black' : 'text-gray-600'}`} />
                              <div className="text-center leading-tight">{domain.name}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <Label className="text-sm sm:text-base font-bold text-gray-900">Add Custom Interest</Label>
                      <div className="flex gap-2 mt-1.5">
                        <Input
                          placeholder="Type an interest..."
                          value={customInterest}
                          onChange={(e) => setCustomInterest(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
                          className="bg-white border-gray-200 focus:border-black"
                        />
                        <Button onClick={addCustomInterest} type="button" className="bg-black hover:bg-gray-800 text-white">Add</Button>
                      </div>
                    </div>

                    {formData.interests.length > 0 && (
                      <div className="pt-3 border-t border-gray-100 bg-gray-50 rounded-xl p-3">
                        <p className="text-xs sm:text-sm font-bold text-gray-900 mb-2">Selected Interests ({formData.interests.length})</p>
                        <div className="flex flex-wrap gap-1.5">
                          {formData.interests.map((interest) => (
                            <span
                              key={interest}
                              className="px-2.5 py-1 bg-black text-white rounded-full text-xs sm:text-sm font-semibold shadow-sm"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Goals */}
                {currentStep === 3 && (
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <Label htmlFor="goals" className="text-sm sm:text-base font-bold text-gray-900">Career Goals</Label>
                      <Textarea
                        id="goals"
                        placeholder="What are your career goals? Where do you want to be in 2-3 years?"
                        value={formData.goals}
                        onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                        className="mt-1.5 min-h-[100px] sm:min-h-[120px] bg-white border-gray-200 focus:border-black focus:ring-black"
                      />
                    </div>

                    <div>
                      <Label htmlFor="experience" className="text-sm sm:text-base font-bold text-gray-900">Experience (Optional)</Label>
                      <Textarea
                        id="experience"
                        placeholder="Tell us about your relevant experience, projects, or achievements..."
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        className="mt-1.5 min-h-[100px] sm:min-h-[120px] bg-white border-gray-200 focus:border-black focus:ring-black"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex justify-between gap-2 sm:gap-3 mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                type="button"
                className="text-xs sm:text-sm px-3 sm:px-4 border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  type="button"
                  className="bg-black hover:bg-gray-800 text-white text-xs sm:text-sm px-3 sm:px-4 shadow-md"
                >
                  Next
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed() || isSubmitting}
                  type="button"
                  className="bg-black hover:bg-gray-800 text-white text-xs sm:text-sm px-3 sm:px-4 shadow-md"
                >
                  <span className="hidden sm:inline">{isSubmitting ? 'Saving...' : 'Complete Setup'}</span>
                  <span className="sm:hidden">{isSubmitting ? 'Saving...' : 'Complete'}</span>
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;
