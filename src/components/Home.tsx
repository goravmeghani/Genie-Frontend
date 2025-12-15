import React, { useRef, useState } from "react";
import { motion, MotionConfig, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Sparkles } from "lucide-react";
import FloatingSparkles from "./FloatingSparkles";
import GlowOrbs from "./GlowOrbs";
import AuroraGradient from "./AuroraGradient";
import MagneticButton from "./MagneticButton";
import ShimmerBorder from "./ShimmerBorder";
import OAuthButtons from "./OAuthButtons";
import Logo from "./Logo";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { usePricing } from "../hooks/usePricing";

interface HomeProps {}

const sectionStyle: React.CSSProperties = {
  background: "rgba(15, 23, 42, 0.75)",
  backdropFilter: "blur(16px)",
  border: "1px solid rgba(99, 102, 241, 0.2)",
  boxShadow:
    "0 0 0 1px rgba(99, 102, 241, 0.1), 0 12px 36px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
};

const Home: React.FC<HomeProps> = () => {
  const [contact, setContact] = useState({ name: "", email: "", message: "" });
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { pricing } = usePricing();
  const pricingLabel = pricing?.monthly_price_label ?? "Premium plan";
  const pricingDescription =
    pricing?.description ??
    "Harness the power of AI to assist with your software development needs.";

  // Debug logging
  console.log('Home component - user:', user, 'loading:', loading);

  const handleLaunchGenie = () => {
    if (user) {
      console.log('🚀 Launching Genie for authenticated user...')
      navigate('/dashboard');
    } else {
      console.log('👤 No user, OAuth buttons will handle authentication')
      // This will be handled by OAuth buttons
    }
  };

  const handleContact = () => {
    console.log("Contact:", contact);
    alert("Message sent! (Demo)");
    setContact({ name: "", email: "", message: "" });
  };

  const heroRef = useRef<HTMLDivElement | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 20, mass: 0.6 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 20, mass: 0.6 });
  const parallaxSmall = useTransform([smoothX, smoothY], ([x, y]) => `translate3d(${x * -0.02}px, ${y * -0.02}px, 0)`);
  const parallaxMedium = useTransform([smoothX, smoothY], ([x, y]) => `translate3d(${x * -0.04}px, ${y * -0.04}px, 0)`);
  const parallaxLarge = useTransform([smoothX, smoothY], ([x, y]) => `translate3d(${x * 0.06}px, ${y * 0.06}px, 0)`);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left - rect.width / 2;
    const cy = e.clientY - rect.top - rect.height / 2;
    mouseX.set(cx);
    mouseY.set(cy);
  };

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
      <div className="min-h-screen bg-gray-900 text-white relative">
        <AuroraGradient />
        <GlowOrbs />
        <FloatingSparkles count={22} className="z-0" />
        
        {/* Top Nav */}
        <motion.nav
          className="fixed top-0 left-0 right-0 z-40"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mx-auto max-w-6xl px-4">
            <div
              className="mt-4 mb-4 flex items-center justify-between rounded-2xl px-4 py-3"
              style={sectionStyle}
            >
              <div className="flex items-center gap-3">
                <Logo size="md" />
                <motion.div 
                  className="font-bold text-2xl text-white"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Genie
                  </span>
                </motion.div>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <a href="#about" className="px-3 py-2 rounded-xl text-gray-300 hover:text-white transition-colors">About</a>
                <a href="#contact" className="px-3 py-2 rounded-xl text-gray-300 hover:text-white transition-colors">Contact</a>
                <a href="#signup" className="px-3 py-2 rounded-xl text-gray-300 hover:text-white transition-colors">Sign up</a>
                {user?.role === "admin" && (
                  <button
                    type="button"
                    onClick={() => navigate("/admin")}
                    className="px-3 py-2 rounded-xl border border-cyan-400/40 text-cyan-300 hover:text-white transition-colors"
                  >
                    Admin
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                {user ? (
                  <>
                    <Button onClick={handleLaunchGenie} className="rounded-xl">
                      Launch Genie
                    </Button>
                    <Button
                      variant="ghost"
                      className="rounded-xl text-sm"
                      onClick={async () => {
                        await signOut();
                        navigate("/");
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <OAuthButtons variant="compact" onSuccess={handleLaunchGenie} />
                )}
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Hero (matches provided design) */}
        <section className="pt-32 md:pt-40">
          <div className="mx-auto max-w-6xl px-4">
            <motion.div
              ref={heroRef}
              onMouseMove={handleMouseMove}
              className="relative overflow-hidden rounded-3xl px-6 md:px-10 py-12 md:py-16"
              style={sectionStyle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Subtle star field */}
              <motion.div className="pointer-events-none absolute inset-0 opacity-50" style={{ transform: parallaxSmall }}>
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      left: `${(i * 37) % 100}%`,
                      top: `${(i * 53) % 100}%`,
                      width: 2 + (i % 3) * 1,
                      height: 2 + (i % 3) * 1,
                      background: "rgba(148, 163, 184, 0.35)",
                      boxShadow: "0 0 6px rgba(148,163,184,0.6)",
                    }}
                  />
                ))}
              </motion.div>

              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Left copy */}
                <motion.div className="text-left" style={{ transform: parallaxMedium }}>
                  <div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20">
                    <Sparkles className="h-4 w-4 text-indigo-300" />
                  </div>
                  <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
                    <span className="block">Your AI Genie for</span>
                    <span className="block">Code, Docs &</span>
                    <span className="block">Deployment</span>
                  </h1>
                  <p className="mt-5 text-gray-300 max-w-xl">
                    {pricingDescription}
                    <span className="mt-2 block text-cyan-300 font-semibold">
                      {pricingLabel}
                    </span>
                  </p>
                  <div className="mt-8">
                    {user ? (
                      <MagneticButton>
                        <Button className="h-12 px-6 rounded-2xl font-semibold"
                          style={{
                            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                            boxShadow: "0 10px 24px rgba(99,102,241,0.35)",
                          }}
                          onClick={handleLaunchGenie}
                        >
                          Launch Genie
                        </Button>
                      </MagneticButton>
                    ) : (
                      <div>
                        <OAuthButtons onSuccess={handleLaunchGenie} />
                      </div>
                    )}
                  </div>
                </motion.div>

              </div>
            </motion.div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="pt-12 md:pt-16">
          <div className="mx-auto max-w-6xl px-4">
            <motion.div
              className="rounded-3xl p-6 md:p-8"
              style={sectionStyle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold">About Genie</h2>
              <p className="mt-3 text-gray-300 leading-relaxed">
                Genie accelerates your workflow with interactive chat, instant UI previews, and
                smart scaffolding for modern web projects. Upgrade anytime for{" "}
                <span className="text-cyan-300 font-semibold">{pricingLabel}</span> to unlock
                premium automation: {pricingDescription}
              </p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Rapid prototyping", "Beautiful UI", "Seamless previews"].map((item, idx) => (
                  <motion.div
                    key={item}
                    className="rounded-2xl p-5 bg-slate-800/40 transform-gpu"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: 0.05 * idx }}
                    whileHover={{ y: -6, rotateX: 2, rotateY: -2, boxShadow: '0 12px 32px rgba(2,132,199,0.25)' }}
                  >
                    <ShimmerBorder className="rounded-2xl">
                      <div className="font-semibold text-cyan-300">{item}</div>
                    </ShimmerBorder>
                    <div className="text-sm text-gray-400 mt-1">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do.
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="pt-12 md:pt-16">
          <div className="mx-auto max-w-6xl px-4">
            <motion.div
              className="rounded-3xl p-6 md:p-8"
              style={sectionStyle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold">Contact</h2>
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div whileHover={{ scale: 1.01 }} className="transform-gpu">
                  <Input
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  placeholder="Your name"
                  className="h-12 rounded-xl"
                />
                </motion.div>
                <motion.div whileHover={{ scale: 1.01 }} className="transform-gpu">
                  <Input
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  placeholder="Email"
                  className="h-12 rounded-xl"
                />
                </motion.div>
                <motion.textarea
                  value={contact.message}
                  onChange={(e) => setContact({ ...contact, message: e.target.value })}
                  placeholder="Message"
                  className="md:col-span-2 min-h-[120px] rounded-xl bg-slate-900/60 border border-slate-700/50 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
                  whileHover={{ scale: 1.005 }}
                />
              </div>
              <div className="mt-4">
                <motion.div whileHover={{ scale: 1.02 }} className="inline-block transform-gpu">
                  <Button onClick={handleContact} className="rounded-xl">Send message</Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Signup */}
        <section id="signup" className="pt-12 md:pt-16 pb-16">
          <div className="mx-auto max-w-6xl px-4">
            <motion.div
              className="rounded-3xl p-6 md:p-8"
              style={sectionStyle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold">Sign up</h2>
              <p className="mt-2 text-gray-400">
                Sign up or log in with GitHub or Google to sync your projects and unlock premium for {pricingLabel}.
              </p>
              <div className="mt-5">
                {user ? (
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-3">Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}!</p>
                    <Button onClick={handleLaunchGenie} className="rounded-xl">Launch Genie</Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <OAuthButtons onSuccess={handleLaunchGenie} />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </MotionConfig>
  );
};

export default Home;
