import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";

const QUESTIONS = [
  {
    id: "main_goal",
    question: "What brings you here today?",
    subtitle: "Be honest — there's no wrong answer.",
    type: "single",
    options: [
      { value: "first_job", label: "I need to find my first job", emoji: "🚀" },
      { value: "career_clarity", label: "I'm lost and need direction", emoji: "🧭" },
      { value: "changing_direction", label: "I want to change career paths", emoji: "🔄" },
      { value: "internship", label: "I'm looking for an internship", emoji: "🎓" },
      { value: "choosing_degree", label: "I haven't chosen my degree yet", emoji: "📚" },
    ],
  },
  {
    id: "work_style",
    question: "When you're in your zone, what does that look like?",
    subtitle: "Pick the one that feels most like you.",
    type: "single",
    options: [
      { value: "analytical", label: "Digging into data, spotting patterns, solving puzzles", emoji: "🔍" },
      { value: "creative", label: "Designing things, telling stories, making ideas visual", emoji: "🎨" },
      { value: "people-focused", label: "Helping people, coaching, having real conversations", emoji: "🤝" },
      { value: "technical", label: "Building things — code, systems, products", emoji: "⚙️" },
      { value: "entrepreneurial", label: "Starting something new, experimenting, taking risks", emoji: "⚡" },
      { value: "operational", label: "Organising chaos, creating order, executing plans", emoji: "📋" },
    ],
  },
  {
    id: "energisers",
    question: "Which of these would you secretly love to do all day?",
    subtitle: "Choose everything that applies.",
    type: "multi",
    options: [
      { value: "debate_ideas", label: "Debate big ideas with smart people", emoji: "💬" },
      { value: "build_product", label: "Build something from scratch", emoji: "🔨" },
      { value: "help_someone", label: "Help someone solve a real problem", emoji: "💡" },
      { value: "research_deep", label: "Go deep on a topic no one else cares about", emoji: "🔬" },
      { value: "present_pitch", label: "Present or pitch to a room", emoji: "🎤" },
      { value: "write_create", label: "Write, design, or create content", emoji: "✍️" },
      { value: "lead_team", label: "Lead a team toward a goal", emoji: "🎯" },
      { value: "crunch_numbers", label: "Turn messy data into clear insights", emoji: "📊" },
    ],
  },
  {
    id: "problems_care_about",
    question: "What kind of problems genuinely bother you?",
    subtitle: "The stuff that keeps you up at night or sparks a rant.",
    type: "multi",
    options: [
      { value: "inequality", label: "People not getting fair opportunities", emoji: "⚖️" },
      { value: "inefficiency", label: "Broken systems that waste everyone's time", emoji: "🔧" },
      { value: "misinformation", label: "Misinformation and bad decisions made from bad data", emoji: "📰" },
      { value: "climate", label: "The planet being destroyed", emoji: "🌍" },
      { value: "mental_health", label: "People struggling mentally and emotionally", emoji: "🧠" },
      { value: "education", label: "Young people not reaching their potential", emoji: "🎓" },
      { value: "security", label: "Privacy, safety, and trust being eroded", emoji: "🛡️" },
      { value: "poverty", label: "Financial stress and economic exclusion", emoji: "💸" },
    ],
  },
  {
    id: "preferred_environment",
    question: "What kind of world do you want to work in?",
    subtitle: "Your ideal environment — not just what's practical.",
    type: "single",
    options: [
      { value: "startup", label: "Scrappy startup — fast, messy, high-energy", emoji: "🔥" },
      { value: "corporate", label: "Big company — structure, scale, resources", emoji: "🏢" },
      { value: "social_impact", label: "Mission-driven org — purpose over profit", emoji: "🌱" },
      { value: "research", label: "Research or academia — explore the unknown", emoji: "🔭" },
      { value: "government", label: "Public sector — shape policy and systems", emoji: "🏛️" },
      { value: "freelance", label: "On my own terms — freelance or founder", emoji: "🦅" },
    ],
  },
  {
    id: "top_skills",
    question: "What are people likely to ask you for help with?",
    subtitle: "These are your real skills — the ones others notice.",
    type: "multi",
    options: [
      { value: "communication", label: "Explaining things clearly", emoji: "🗣️" },
      { value: "problem_solving", label: "Figuring out what's wrong and fixing it", emoji: "🛠️" },
      { value: "creativity", label: "Coming up with original ideas", emoji: "💭" },
      { value: "leadership", label: "Getting people on board and moving", emoji: "🧭" },
      { value: "data_analysis", label: "Making sense of numbers", emoji: "📈" },
      { value: "empathy", label: "Understanding how people feel", emoji: "❤️" },
      { value: "organisation", label: "Keeping everything on track", emoji: "🗂️" },
      { value: "research", label: "Finding information others miss", emoji: "🔍" },
      { value: "coding", label: "Writing code or building tech", emoji: "💻" },
      { value: "sales", label: "Persuading and selling ideas", emoji: "✨" },
    ],
  },
  {
    id: "curious_industries",
    question: "Which industries secretly fascinate you?",
    subtitle: "Don't overthink — pick what sparks something.",
    type: "multi",
    options: [
      { value: "tech", label: "Technology & AI", emoji: "🤖" },
      { value: "finance", label: "Finance & Investment", emoji: "💹" },
      { value: "healthcare", label: "Health & Medicine", emoji: "🏥" },
      { value: "education", label: "Education & Learning", emoji: "📚" },
      { value: "creative", label: "Media, Design & Entertainment", emoji: "🎬" },
      { value: "sustainability", label: "Climate & Environment", emoji: "🌿" },
      { value: "government", label: "Policy & Government", emoji: "🏛️" },
      { value: "consulting", label: "Strategy & Consulting", emoji: "♟️" },
      { value: "law", label: "Law & Justice", emoji: "⚖️" },
      { value: "entrepreneurship", label: "Startups & Entrepreneurship", emoji: "🚀" },
    ],
  },
  {
    id: "education_level",
    question: "Where are you in your learning journey?",
    subtitle: "Just so we can tailor your career map.",
    type: "single",
    options: [
      { value: "high_school", label: "Still in school / high school", emoji: "🏫" },
      { value: "bachelors", label: "Studying for my degree", emoji: "🎓" },
      { value: "diploma", label: "Completed a diploma or certificate", emoji: "📜" },
      { value: "bachelors_done", label: "Finished my bachelor's degree", emoji: "✅" },
      { value: "masters", label: "Postgrad / Master's level", emoji: "🏅" },
      { value: "self_taught", label: "Mostly self-taught", emoji: "⚡" },
    ],
  },
];

function OptionCard({ option, selected, onClick, multi }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all duration-150 ${
        selected
          ? "border-primary bg-primary/8 shadow-sm"
          : "border-border/60 bg-card hover:border-primary/40 hover:bg-muted/40"
      }`}
    >
      <span className="text-2xl flex-shrink-0">{option.emoji}</span>
      <span className={`text-sm font-medium leading-snug ${selected ? "text-primary" : "text-foreground"}`}>
        {option.label}
      </span>
      {multi && (
        <span className={`ml-auto w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          selected ? "bg-primary border-primary" : "border-border"
        }`}>
          {selected && <span className="text-white text-xs">✓</span>}
        </span>
      )}
    </motion.button>
  );
}

export default function Quiz() {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});

  const q = QUESTIONS[currentQ];
  const isLast = currentQ === QUESTIONS.length - 1;
  const progress = ((currentQ + 1) / QUESTIONS.length) * 100;

  const toggle = (qId, value, multi) => {
    setAnswers((prev) => {
      if (multi) {
        const current = prev[qId] || [];
        return {
          ...prev,
          [qId]: current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value],
        };
      }
      return { ...prev, [qId]: value };
    });
  };

  const isSelected = (qId, value) => {
    const ans = answers[qId];
    if (Array.isArray(ans)) return ans.includes(value);
    return ans === value;
  };

  const canProceed = () => {
    const ans = answers[q.id];
    if (q.type === "multi") return Array.isArray(ans) && ans.length > 0;
    return !!ans;
  };

  const handleNext = () => {
    if (isLast) {
      handleSubmit();
    } else {
      setCurrentQ((c) => c + 1);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    const ans = answers;

    // Map multi-select arrays to strings for the schema
    const energisersArr = ans.energisers || [];
    const problemsArr = ans.problems_care_about || [];
    const skillsArr = ans.top_skills || [];
    const industriesArr = ans.curious_industries || [];

    await base44.entities.QuestionnaireResponse.create({
      full_name: name,
      education_level: ans.education_level || "bachelors",
      main_goal: ans.main_goal,
      work_style: ans.work_style,
      preferred_environment: ans.preferred_environment,
      energisers: energisersArr.join(", "),
      problems_care_about: problemsArr.join(", "),
      top_skills: skillsArr,
      curious_industries: industriesArr,
      confidence_level: 5,
      status: "completed",
    });

    navigate("/resume");
  };

  // Name screen
  if (!nameSubmitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-3xl mx-auto px-6 h-16 flex items-center">
            <Link to="/" className="font-display text-xl font-bold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              NorthStar
            </Link>
          </div>
        </nav>
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md text-center"
          >
            <div className="text-5xl mb-6">👋</div>
            <h1 className="font-display text-3xl font-bold mb-3">Before we begin...</h1>
            <p className="text-muted-foreground mb-8 text-lg">What should we call you?</p>
            <Input
              autoFocus
              placeholder="Your first name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && name.trim() && setNameSubmitted(true)}
              className="text-center text-lg h-14 rounded-xl mb-4"
            />
            <Button
              onClick={() => setNameSubmitted(true)}
              disabled={!name.trim()}
              className="w-full h-12 rounded-xl text-base font-medium"
            >
              Let's go <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-bold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
            NorthStar
          </Link>
          <span className="text-sm text-muted-foreground">{currentQ + 1} / {QUESTIONS.length}</span>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="mb-6 text-center">
                <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2 leading-tight">
                  {q.question}
                </h2>
                <p className="text-muted-foreground">{q.subtitle}</p>
                {q.type === "multi" && (
                  <p className="text-xs text-primary mt-1 font-medium">Select all that apply</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                {q.options.map((option) => (
                  <OptionCard
                    key={option.value}
                    option={option}
                    selected={isSelected(q.id, option.value)}
                    multi={q.type === "multi"}
                    onClick={() => {
                      toggle(q.id, option.value, q.type === "multi");
                      // Auto-advance for single select after brief delay
                      if (q.type === "single") {
                        setTimeout(() => {
                          if (!isLast) setCurrentQ((c) => c + 1);
                        }, 300);
                      }
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (currentQ === 0) setNameSubmitted(false);
                    else setCurrentQ((c) => c - 1);
                  }}
                  className="text-muted-foreground"
                >
                  Back
                </Button>

                {(q.type === "multi" || isLast) && (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed() || saving}
                    className="h-12 px-8 rounded-xl font-medium"
                  >
                    {saving ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Building your map...</>
                    ) : isLast ? (
                      <>Build my career map <ArrowRight className="ml-2 w-4 h-4" /></>
                    ) : (
                      <>Next <ArrowRight className="ml-2 w-4 h-4" /></>
                    )}
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
