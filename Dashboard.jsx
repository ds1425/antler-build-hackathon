import React from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Briefcase, Zap, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import ProfileCard from "@/components/dashboard/ProfileCard";
import RecommendedPathways from "@/components/dashboard/RecommendedPathways";
import LearningTrack from "@/components/dashboard/LearningTrack";
import NextActions from "@/components/dashboard/NextActions";
import SkillsGrid from "@/components/dashboard/SkillsGrid";
import GuidanceRecommendation from "@/components/guidance/GuidanceRecommendation";
import PaywallBanner from "@/components/dashboard/PaywallBanner";
import LockedPathways from "@/components/dashboard/LockedPathways";
import LockedLearningTrack from "@/components/dashboard/LockedLearningTrack";

export default function Dashboard() {
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
  });
  const isPro = user?.plan === "pro" || user?.role === "admin";

  const { data: profiles = [], isLoading: loadingProfiles } = useQuery({
    queryKey: ["careerProfiles"],
    queryFn: () => base44.entities.CareerProfile.list("-created_date", 1),
  });

  const profile = profiles[0];

  const { data: pathways = [] } = useQuery({
    queryKey: ["pathways", profile?.id],
    queryFn: () => base44.entities.CareerPathway.filter({ career_profile_id: profile.id }),
    enabled: !!profile?.id,
  });

  const { data: jobRoles = [] } = useQuery({
    queryKey: ["jobRoles"],
    queryFn: () => base44.entities.JobRole.list("-created_date", 20),
  });

  // Match jobs to pathways by career_pathway_category
  const pathwayTitles = pathways.map((p) => p.career_title?.toLowerCase());
  const matchedJobs = jobRoles.filter((job) =>
    pathwayTitles.some((pt) =>
      (job.career_pathway_category?.toLowerCase() ?? "").includes(pt) ||
      pt.includes(job.career_pathway_category?.toLowerCase() ?? "zzz")
    )
  );
  const displayedJobs = matchedJobs.length >= 2 ? matchedJobs : jobRoles;

  if (loadingProfiles) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h2 className="font-display text-2xl font-bold mb-3">No career profile yet</h2>
          <p className="text-muted-foreground mb-6">Complete the career discovery quiz to generate your personalised career map.</p>
          <Link to="/quiz"><Button className="bg-primary hover:bg-primary/90">Start Career Quiz</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-bold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">NorthStar</Link>
          <div className="flex items-center gap-2">
            <Link to="/dashboard"><Button variant="ghost" size="sm"><LayoutDashboard className="w-4 h-4 mr-1.5" />Dashboard</Button></Link>
            <Link to="/jobs"><Button variant="ghost" size="sm"><Briefcase className="w-4 h-4 mr-1.5" />Jobs</Button></Link>
            <Link to="/simulations"><Button variant="ghost" size="sm"><Zap className="w-4 h-4 mr-1.5" />Simulations</Button></Link>
            <Button variant="ghost" size="sm" onClick={() => base44.auth.logout()}><LogOut className="w-4 h-4" /></Button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold mb-1">Your Career Map</h1>
              <p className="text-muted-foreground">{isPro ? "Here's everything we've discovered about you." : "Free preview — upgrade to unlock your full career roadmap."}</p>
            </div>
            {!isPro && (
              <Link to="/pricing">
                <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                  <Sparkles className="w-4 h-4 mr-1.5" /> Unlock Full Map — $29
                </Button>
              </Link>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            <ProfileCard profile={profile} />

            {isPro ? (
              <LearningTrack profile={profile} pathways={pathways} />
            ) : (
              <LockedLearningTrack />
            )}

            {isPro ? (
              <RecommendedPathways pathways={pathways} />
            ) : (
              <LockedPathways />
            )}

            {isPro && displayedJobs.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-xl font-semibold">Jobs Related to Your Pathways</h2>
                  <Link to="/jobs"><Button variant="ghost" size="sm">View All →</Button></Link>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {displayedJobs.slice(0, 6).map((job) => (
                    <Link key={job.id} to={`/jobs/${job.id}`} className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/30 hover:shadow-md transition-all">
                      <h3 className="font-semibold">{job.job_title}</h3>
                      <p className="text-sm text-muted-foreground">{job.company_name}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{job.industry}</span>
                        <span className="text-xs text-muted-foreground">{job.location}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {!isPro && (
              <div className="bg-gradient-to-br from-primary/10 to-violet-500/10 border border-primary/20 rounded-2xl p-8 text-center">
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-heading text-lg font-semibold mb-2">Unlock job matches too</h3>
                <p className="text-sm text-muted-foreground mb-4">See real roles matched to your pathways with fit scores and skill gap analysis.</p>
                <Link to="/pricing"><Button className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">Unlock for $29 →</Button></Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {isPro ? (
              <SkillsGrid skills={profile.top_skills} />
            ) : (
              <PaywallBanner label="Skills profile locked" />
            )}

            {isPro ? (
              <NextActions actions={profile.next_actions} />
            ) : (
              <PaywallBanner label="Next action plan locked" />
            )}

            {isPro && profile.risks_blind_spots?.length > 0 && (
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <h3 className="font-heading font-semibold mb-3">Watch Out For</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {profile.risks_blind_spots.map((r) => <li key={r} className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">⚠️</span>{r}</li>)}
                </ul>
              </div>
            )}

            <GuidanceRecommendation profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
}
