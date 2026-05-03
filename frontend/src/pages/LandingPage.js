import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Book, 
  Clock, 
  LayoutDashboard, 
  CreditCard, 
  UserCheck, 
  Search, 
  Library,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3
} from "lucide-react";
import BrandLogo from "../components/BrandLogo";

// --- Reusable Components ---

const Section = ({ children, className = "" }) => (
  <section className={`py-20 px-6 max-w-7xl mx-auto ${className}`}>
    {children}
  </section>
);

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="glass-card flex flex-col items-start gap-4"
    style={{ height: '100%' }}
  >
    <div className="p-3 rounded-xl" style={{ background: 'rgba(255, 75, 75, 0.1)', border: '1px solid rgba(255, 75, 75, 0.2)' }}>
      <Icon size={24} color="var(--primary)" />
    </div>
    <h3 className="text-xl font-bold mt-2 leading-tight">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const Step = ({ number, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="flex gap-6 items-start"
  >
    <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg" 
         style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-maroon))', color: 'white' }}>
      {number}
    </div>
    <div>
      <h4 className="text-xl font-bold mb-2">{title}</h4>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

// --- Main Page ---

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white selection:bg-red-500/30 overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/5 py-4 px-8 flex justify-between items-center max-w-[100vw]">
        <div className="flex items-center gap-3 group cursor-pointer">
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="bg-gradient-to-br from-[#FF4B4B] to-[#8B1E3F] p-1.5 rounded-xl shadow-[0_0_20px_rgba(255,75,75,0.2)]"
          >
            <BrandLogo size={28} />
          </motion.div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-red-400 group-hover:to-red-500 transition-all duration-300">
            LibNova
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate("/login")}
            className="text-gray-400 hover:text-white transition-colors text-sm font-semibold uppercase tracking-wider"
          >
            Login
          </button>
          <button 
            onClick={() => navigate("/login")}
            className="btn btn-primary text-xs"
            style={{ padding: '0.6rem 1.2rem' }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <Section className="text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full border border-red-500/20 bg-red-500/5 text-red-400 text-[10px] font-bold uppercase tracking-widest mb-6">
              The Future of Library Management
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1]">
              Next-Gen <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B4B] to-[#8B1E3F]">
                LibNova System
              </span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Smart, efficient, and modern way to manage your library. Streamline cataloging, 
              issuing, and user tracking with our enterprise-grade SaaS solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => navigate("/login")}
                className="btn btn-primary w-full sm:w-auto px-10 py-4"
              >
                Get Started Now <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => navigate("/login")}
                className="btn btn-secondary w-full sm:w-auto px-10 py-4"
              >
                Admin Login
              </button>
            </div>
          </motion.div>
        </Section>
      </div>

      {/* Features Section */}
      <Section id="features">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Platform Features</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Everything you need to run a modern library in one unified, cloud-ready platform.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={Book}
            title="Book Management"
            description="Complete control over your collection. Add, edit, and categorize books with metadata tracking."
            delay={0.1}
          />
          <FeatureCard 
            icon={Zap}
            title="Issue & Return System"
            description="Ultra-fast check-in and check-out process with automatic date tracking and validation."
            delay={0.2}
          />
          <FeatureCard 
            icon={BarChart3}
            title="Real-time Dashboard"
            description="Interactive analytics showing inventory levels, issue trends, and user activity at a glance."
            delay={0.3}
          />
          <FeatureCard 
            icon={CreditCard}
            title="Fine Calculation"
            description="Automated late-fee generation based on custom policies with a integrated payment ledger."
            delay={0.4}
          />
          <FeatureCard 
            icon={UserCheck}
            title="User Tracking"
            description="Monitor student and faculty reading habits and manage active borrowing records effortlessly."
            delay={0.5}
          />
          <FeatureCard 
            icon={Search}
            title="Advanced Search"
            description="Powerfully filter through thousands of records by title, author, category, or status."
            delay={0.6}
          />
        </div>
      </Section>

      {/* Dashboard Preview Section */}
      <div className="bg-[#141414]/50 py-24">
        <Section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Powerful Admin <br />
                <span className="text-red-500">Analytics Interface</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Experience a command center that works for you. Our dashboard provides real-time 
                visualizations using Chart.js to help you make data-driven library decisions.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-green-500" size={20} />
                  <span className="font-medium">Enterprise Security & JWT Auth</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-green-500" size={20} />
                  <span className="font-medium">Role-Based Access Control</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-green-500" size={20} />
                  <span className="font-medium">Instant CSV/Excel Reports</span>
                </div>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-red-600/20 rounded-2xl blur-3xl group-hover:bg-red-600/30 transition-all pointer-events-none" />
              <div className="glass-card p-2 rounded-2xl relative bg-[#1A1A1A]">
                <div className="rounded-xl overflow-hidden border border-white/5 shadow-2xl">
                  {/* Mock Dashboard UI */}
                  <div className="bg-[#0D0D0D] p-6 space-y-6">
                    <div className="flex gap-4">
                      <div className="h-24 flex-1 bg-red-500/5 border border-red-500/20 rounded-xl" />
                      <div className="h-24 flex-1 bg-white/5 border border-white/10 rounded-xl" />
                      <div className="h-24 flex-1 bg-white/5 border border-white/10 rounded-xl" />
                    </div>
                    <div className="h-64 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                      <BarChart3 size={48} className="text-white/10" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Section>
      </div>

      {/* How it Works Section */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-4xl font-bold mb-10">Streamlined Workflow</h2>
            <div className="space-y-12">
              <Step 
                number="01" 
                title="Catalog Your Collection" 
                description="Easily import or manually add books with full metadata, covers, and volume tracking." 
                delay={0.1}
              />
              <Step 
                number="02" 
                title="Issue to Users" 
                description="Assign books to students or faculty members with one click. Automatic due date calculation." 
                delay={0.2}
              />
              <Step 
                number="03" 
                title="Track & Optimize" 
                description="Monitor overdue returns, process fines, and analyze library usage trends through the dashboard." 
                delay={0.3}
              />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-md">
              <div className="absolute inset-0 bg-red-600/10 rounded-full blur-[100px]" />
              <div className="relative z-10 glass-card aspect-square rounded-full flex items-center justify-center border-2 border-red-500/20">
                <div className="text-center">
                  <Library size={80} color="var(--primary)" className="mx-auto mb-4" />
                  <p className="font-bold text-2xl uppercase tracking-tighter">Unified Hub</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <div className="relative py-24 border-y border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,75,75,0.08),transparent_70%)]" />
        <Section className="text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Modernize Your Library?</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
            Join forward-thinking colleges using our system to provide a better 
            experience for staff and students alike.
          </p>
          <button 
            onClick={() => navigate("/login")}
            className="btn btn-primary px-12 py-5 text-lg"
          >
            Start Managing Today <ArrowRight size={20} />
          </button>
        </Section>
      </div>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <BrandLogo size={24} />
            <span className="font-bold tracking-tight">LibNova v2.0</span>
          </div>
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} College Library Management System. Crafted for Excellence.
          </div>
          <div className="flex gap-6 text-gray-500 text-sm">
            <a href="#" className="hover:text-red-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-red-400 transition-colors">Support</a>
            <a href="#" className="hover:text-red-400 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>

      <style>{`
        /* Custom Tailwind Utilities if not available */
        .glass-card {
          background: rgba(26, 26, 26, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          border-radius: 1.25rem;
        }
        
        @media (min-width: 1024px) {
          .glass-card:hover {
            border-color: rgba(255, 75, 75, 0.3);
            background: rgba(30, 30, 30, 0.9);
            transform: translateY(-8px);
            box-shadow: 0 30px 60px -15px rgba(255, 75, 75, 0.15);
          }
        }

        .btn-primary {
          background: linear-gradient(135deg, #FF4B4B, #8B1E3F);
          color: white;
          border: none;
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          filter: brightness(1.1);
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -5px rgba(255, 75, 75, 0.4);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: white;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
