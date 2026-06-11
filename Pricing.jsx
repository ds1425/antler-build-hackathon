import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Lock, Sparkles, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const FREE_FEATURES = [
  "Career archetype (The Builder, Strategist, etc.)",
  "Your personal purpose statement",
  "Career clarity score",
  "1 preview career pathway (blurred)",
];

const PRO_FEATURES = [
  "Everything in Free",
  "All 3 personalised career pathways",
  "Skills gap analysis for each pathway",
  "Entry-level jobs & learning roadmap per pathway",
  "Top skills profile",
  "Next action plan (3 steps)",
  "Watch-out blind spots",
  "Job matches from our live listings",
  "Unlimited re-generation",
];

export default function Pricing() {
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    // In production this would connect to a payment provider.
    // For now, mark the user as pro directly.
    await base44.auth.updateMe({ plan: "pro" });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-bold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">NorthStar</Link>
          <Link to="/dashboard"><Button variant="ghost" size="sm">Back to Dashboard</Button></Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-20">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" /> Unlock Your Full Career Map
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            You've seen your archetype.<br />
            <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              Now unlock everything.
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Your free profile shows your career archetype and purpose. Upgrade once to unlock your full personalised career roadmap.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="bg-card border border-border/50 rounded-2xl p-8">
            <div className="mb-6">
              <h2 className="font-heading text-xl font-semibold mb-1">Free</h2>
              <div className="text-3xl font-display font-bold">$0</div>
              <p className="text-sm text-muted-foreground mt-1">Your starting point</p>
            </div>
            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full" disabled>Current Plan</Button>
          </motion.div>

          {/* Pro */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="bg-gradient-to-br from-primary/5 to-violet-500/5 border-2 border-primary/40 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" /> Most Popular
              </span>
            </div>
            <div className="mb-6">
              <h2 className="font-heading text-xl font-semibold mb-1">Pro</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold">$29</span>
                <span className="text-muted-foreground text-sm">one-time</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Full career map, forever</p>
            </div>
            <ul className="space-y-3 mb-8">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full bg-primary hover:bg-primary/90 h-11 shadow-lg shadow-primary/20" onClick={handleUpgrade}>
              Unlock Full Career Map <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-3">One-time payment · No subscription</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
