import React, { useEffect, useRef, useState } from 'react';
import { Mail, MapPin, Phone, Server, Shield, Cloud, Terminal, Award, ExternalLink, Code, CheckCircle, XCircle } from 'lucide-react';

/**
 * Paul Attah - The "Daylight Architect" Portfolio
 * Updated: Floating Hero Animation & Secure Form
 */

const App = () => {
  const [scrolled, setScrolled] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const experienceRef = useRef(null);
  const projectsRef = useRef(null);
  const certsRef = useRef(null);

  // --- GSAP INJECTION & ANIMATIONS ---
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    const stScript = document.createElement('script');
    stScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js";
    
    document.head.appendChild(script);
    document.head.appendChild(stScript);

    script.onload = () => {
      stScript.onload = () => {
        const { gsap, ScrollTrigger } = window;
        gsap.registerPlugin(ScrollTrigger);

        // Hero Entrance
        gsap.from(".hero-element", {
          y: 40,
          opacity: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out"
        });

        // Continuous Floating Animation for Profile Picture
        gsap.to(".hero-avatar", {
          y: 15,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });

        // Concentric Circles Pulse
        gsap.to(".circle-ring", {
          scale: 1.05,
          opacity: 0.3,
          duration: 4,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          stagger: 0.5
        });

        // Section Fade-ins
        const sections = [aboutRef.current, experienceRef.current, projectsRef.current, certsRef.current];
        sections.forEach((sec) => {
          if (sec) {
            gsap.from(sec, {
              scrollTrigger: {
                trigger: sec,
                start: "top 80%",
              },
              y: 50,
              opacity: 0,
              duration: 1,
              ease: "power3.out"
            });
          }
        });
      };
    };

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "f8505eef-290b-4fb6-82ec-7524b3752e69",
          from_name: "Portfolio Contact Form",
          subject: `Portfolio Message from ${formData.name}: ${formData.subject}`,
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  return (
    <div className="bg-[#FDFDFD] text-[#2D3748] font-sans overflow-x-hidden selection:bg-[#68A893] selection:text-white">
      
      {/* TOP NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <div className="flex gap-6 text-gray-500">
            <a href="https://www.linkedin.com/in/attah-paul-8a1678159/" target="_blank" rel="noreferrer" className="hover:text-[#68A893] transition-colors"><LinkedinIcon size={20} /></a>
            <a href="#" className="hover:text-[#68A893] transition-colors"><TwitterIcon size={20} /></a>
            <a href="https://github.com/paulo91-bit" target="_blank" rel="noreferrer" className="hover:text-[#68A893] transition-colors"><GithubIcon size={20} /></a>
            <a href="#" className="hover:text-[#68A893] transition-colors"><InstagramIcon size={20} /></a>
          </div>
          <a href="#contact" className="flex items-center gap-2 text-sm font-semibold tracking-wider text-gray-500 hover:text-[#68A893] transition-colors uppercase">
            <Mail size={16} /> Get In Touch
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section ref={heroRef} className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          {[300, 500, 700, 900].map(size => (
            <div key={size} className="circle-ring absolute rounded-full border border-gray-200" style={{ width: size, height: size }} />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center hero-element">
          {/* Animated Avatar Container */}
          <div className="hero-avatar relative mb-8 group">
            <div className="absolute inset-0 bg-[#68A893] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 animate-pulse" />
            <img 
              src="https://github.com/paulo91-bit.png" 
              alt="Paul Attah" 
              className="relative w-32 h-32 rounded-full grayscale hover:grayscale-0 transition-all duration-700 object-cover shadow-2xl border-4 border-white"
            />
          </div>
          
          <h2 className="text-xs md:text-sm tracking-[0.4em] text-gray-400 uppercase font-semibold mb-4 text-center">
            Senior Cloud & DevOps Engineer
          </h2>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 tracking-tight mb-8 font-mono">
            Paul_Attah<span className="text-[#68A893]">.tf</span>
            <span className="animate-pulse font-light">_</span>
          </h1>
          
          <div className="flex gap-8 text-xs tracking-widest uppercase text-gray-400 font-semibold mt-4">
            {['about', 'experience', 'skills', 'certifications', 'projects'].map(link => (
              <a key={link} href={`#${link}`} className="hover:text-[#68A893] transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" ref={aboutRef} className="py-24 px-8 max-w-6xl mx-auto">
        <h3 className="text-center text-sm tracking-[0.5em] text-gray-400 uppercase font-semibold mb-20">A B O U T</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="rounded-3xl overflow-hidden shadow-xl aspect-square md:aspect-auto md:h-[500px]">
            <img 
              src="https://github.com/paulo91-bit.png" 
              alt="Paul Attah Profile" 
              className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-8 text-gray-800">
              Here is a <span className="text-[#68A893]">little background</span>
            </h2>
            <div className="text-gray-500 leading-relaxed space-y-6">
              <p>
                Hey. I am a Senior Cloud & Infrastructure Engineer based in Lagos, Nigeria. I specialize in architecting, deploying, and maintaining scalable, high-availability IT infrastructures across hybrid environments.
              </p>
              <p>
                With a strong foundation in <span className="font-semibold text-gray-700">Terraform, Kubernetes, and Multi-Cloud architectures (AWS, Azure, GCP)</span>, I bridge the gap between development and operations. My philosophy is simple: Eliminate "ClickOps," automate the mundane, and build systems that refuse to go down.
              </p>
              <p>
                When I'm not writing infrastructure as code or securing zero-trust networks, I'm integrating AI models to make systems smarter and more resilient.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section id="experience" ref={experienceRef} className="py-24 bg-gray-50/50 border-y border-gray-100 overflow-hidden relative">
        <h3 className="text-center text-sm tracking-[0.5em] text-gray-400 uppercase font-semibold mb-16">E X P E R I E N C E</h3>
        <div className="flex gap-8 overflow-x-auto pb-12 px-8 max-w-[100vw] snap-x snap-mandatory hide-scrollbar">
          <ExperienceCard 
            title="Senior Cloud Infrastructure Eng."
            company="Enbros Technologies"
            date="JAN 2024 - PRESENT"
            icons={[<Cloud size={16}/>, <Terminal size={16}/>, <Shield size={16}/>]}
            bullets={[
              "Designed and provisioned scalable multi-cloud and hybrid infrastructure (Azure, AWS, GCP).",
              "Standardized IaC pipelines using Terraform, eliminating configuration drift.",
              "Configured secure network segments, complex VPC peering, and VPN tunnels."
            ]}
          />
          <ExperienceCard 
            title="Infrastructure & Platform Lead"
            company="NdaraAI"
            date="JAN 2024 - DEC 2024"
            icons={[<Server size={16}/>, <Terminal size={16}/>]}
            bullets={[
              "Architected resilient virtualization clusters using Proxmox and Linux, ensuring 99.9% uptime.",
              "Authored custom Bash and Python scripts for automated disaster recovery.",
              "Engineered secure perimeters with Nginx reverse proxies and strict SSL/TLS."
            ]}
          />
          <ExperienceCard 
            title="IT Systems Administrator"
            company="ValueGate Consulting"
            date="JAN 2020 - JAN 2024"
            icons={[<Shield size={16}/>, <Server size={16}/>]}
            bullets={[
              "Administered corporate IT infrastructure including Windows Server and Active Directory.",
              "Troubleshot routing and switching issues to maintain seamless network connectivity.",
              "Developed SOPs for hardware provisioning and server hardening."
            ]}
          />
          <div className="min-w-[4vw] md:min-w-[10vw]"></div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section id="skills" className="py-24 px-8 max-w-6xl mx-auto">
        <h3 className="text-center text-sm tracking-[0.5em] text-gray-400 uppercase font-semibold mb-16">S K I L L S & T E L E M E T R Y</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DiagnosticShufflerLight />
          <NeuralStreamLight />
        </div>
      </section>

      {/* CERTIFICATIONS SECTION */}
      <section id="certifications" ref={certsRef} className="py-24 bg-gray-50/50 border-y border-gray-100 relative">
        <h3 className="text-center text-sm tracking-[0.5em] text-gray-400 uppercase font-semibold mb-16">C E R T I F I C A T I O N S</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto px-8">
          <CertCard title="Google Certified Associate Cloud Engineer" issuer="Google Cloud" />
          <CertCard title="Azure Developer Associate (AZ-204)" issuer="Microsoft" />
          <CertCard title="Microsoft Sentinel Ninja Training" issuer="Microsoft Security" />
          <CertCard title="McKinsey Forward Program Graduate" issuer="McKinsey & Company" />
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" ref={projectsRef} className="py-24 px-8 max-w-6xl mx-auto">
        <h3 className="text-center text-sm tracking-[0.5em] text-gray-400 uppercase font-semibold mb-16">P R O J E C T S</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProjectCard 
            title="sql-ai-semantic-search" 
            description="AI-powered semantic search engine using PostgreSQL (pgvector) and OpenAI Embeddings." 
            tech={['Python', 'PostgreSQL', 'OpenAI']} 
            link="https://github.com/paulo91-bit/sql-ai-semantic-search" 
          />
          <ProjectCard 
            title="maigie" 
            description="An AI-powered study companion designed to help students organize learning and track progress." 
            tech={['TypeScript', 'React', 'AI']} 
            link="https://github.com/paulo91-bit/maigie" 
          />
          <ProjectCard 
            title="product_backend_devops" 
            description="IaC and CI/CD pipeline demonstrations for automated backend deployments and scaling." 
            tech={['Python', 'Terraform', 'CI/CD']} 
            link="https://github.com/paulo91-bit/product_backend_devops" 
          />
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-32 px-8 bg-gray-50">
        <h3 className="text-center text-sm tracking-[0.5em] text-gray-400 uppercase font-semibold mb-12">C O N T A C T</h3>
        
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-10">
            I have got just what you need. <span className="text-[#68A893] underline decoration-2 underline-offset-8">Lets talk.</span>
          </h2>
          <div className="space-y-4 text-gray-600 flex flex-col items-center">
            <div className="flex items-center gap-4"><Phone size={20} className="text-[#68A893]"/> +234 806 008 7078</div>
            <div className="flex items-center gap-4"><Mail size={20} className="text-[#68A893]"/> attahattah37@gmail.com</div>
            <div className="flex items-center gap-4"><MapPin size={20} className="text-[#68A893]"/> Lagos, Nigeria</div>
          </div>
        </div>

        <form onSubmit={handleEmailSubmit} className="max-w-2xl mx-auto space-y-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Name" required disabled={isSubmitting} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-200/60 text-gray-800 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#68A893] transition-all disabled:opacity-50" />
            <input type="email" placeholder="Email" required disabled={isSubmitting} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-200/60 text-gray-800 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#68A893] transition-all disabled:opacity-50" />
          </div>
          <input type="text" placeholder="Subject" required disabled={isSubmitting} value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full bg-gray-200/60 text-gray-800 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#68A893] transition-all disabled:opacity-50" />
          <textarea placeholder="Message" rows={5} required disabled={isSubmitting} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-gray-200/60 text-gray-800 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#68A893] transition-all resize-none disabled:opacity-50" />
          <button type="submit" disabled={isSubmitting} className="w-full bg-[#68A893] hover:bg-[#578E7C] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#68A893]/30 disabled:opacity-70 flex justify-center items-center">
            {isSubmitting ? 'Transmitting...' : 'Submit'}
          </button>
          {submitStatus === 'success' && <div className="absolute -bottom-12 left-0 right-0 text-center text-green-600 font-semibold">Message delivered.</div>}
          {submitStatus === 'error' && <div className="absolute -bottom-12 left-0 right-0 text-center text-red-500 font-semibold">Failed to send. Try again.</div>}
        </form>
      </section>

      <footer className="py-8 text-center text-gray-400 text-sm bg-white border-t border-gray-100">
        Paul Attah © 2026. Built with React & Tailwind.
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

// --- ICONS ---
const GithubIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
    <path d="M9 18c-4.5 1.6-5-2.5-7-3"></path>
  </svg>
);
const LinkedinIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);
const TwitterIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 2.8 13.5 3 12c1.4.1 2.8-.2 4-1C2 9 2 6 2 6s1.5 1 3 1c-1.5-1-2.4-3-2-5 3.5 4 8.5 7 14 7 0-3 2.5-5.5 5.5-5.5.8 0 1.5.2 2.1.6.6-.6 1.4-1.2 2.4-1.6-.4 1-1.2 1.8-2 2.4z"></path>
  </svg>
);
const InstagramIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

// --- SUB COMPONENTS ---
const CertCard = ({ title, issuer }) => (
  <div className="flex items-center gap-6 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 flex-shrink-0">
      <Award size={20} className="text-[#68A893]" />
    </div>
    <div>
      <h4 className="text-gray-800 font-bold text-sm md:text-base">{title}</h4>
      <p className="text-[#68A893] text-xs font-semibold uppercase tracking-wider mt-1">{issuer}</p>
    </div>
  </div>
);
const ProjectCard = ({ title, description, tech, link }) => (
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
    <div className="flex justify-between items-start mb-6">
      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100"><Code size={20} className="text-[#68A893]"/></div>
      <a href={link} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#68A893] transition-colors"><ExternalLink size={20} /></a>
    </div>
    <h4 className="text-xl font-bold text-gray-800 mb-3">{title}</h4>
    <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">{description}</p>
    <div className="flex flex-wrap gap-2 mt-auto">
      {tech.map((t, i) => <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-[#68A893] bg-[#68A893]/10 px-3 py-1 rounded-full">{t}</span>)}
    </div>
  </div>
);
const ExperienceCard = ({ title, company, date, icons, bullets }) => (
  <div className="min-w-[320px] md:min-w-[400px] snap-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100"><Server size={24} className="text-[#68A893]"/></div>
    <h4 className="text-xl font-bold text-gray-800">{title}</h4>
    <h5 className="text-[#68A893] font-semibold mb-4">{company}</h5>
    <div className="flex gap-3 mb-6 text-gray-400">
      {icons.map((icon, i) => <span key={i} className="bg-gray-50 p-2 rounded-lg border border-gray-100">{icon}</span>)}
    </div>
    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">{date}</div>
    <ul className="space-y-3 text-sm text-gray-500">
      {bullets.map((b, i) => <li key={i} className="flex gap-3 items-start"><span className="text-[#68A893] mt-1">•</span><span className="leading-relaxed">{b}</span></li>)}
    </ul>
  </div>
);
const DiagnosticShufflerLight = () => {
  const [labels, setLabels] = useState(["AWS Architecture", "Terraform IaC", "Zero-Trust IAM"]);
  useEffect(() => {
    const timer = setInterval(() => {
      setLabels(prev => { const next = [...prev]; const last = next.pop(); next.unshift(last); return next; });
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="relative h-[300px] bg-white rounded-[2rem] p-8 overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start text-gray-400"><Cloud size={20} /><span className="text-[10px] tracking-widest uppercase font-bold">Skill Shuffler</span></div>
      <div className="relative flex-1 flex flex-col items-center justify-center mt-8">
        {labels.map((label, i) => (
          <div key={label} className="absolute bg-gray-50 border border-gray-100 rounded-2xl p-6 w-full max-w-[240px] shadow-sm transition-all duration-[800ms]" style={{ transform: `translateY(${(i - 1) * 40}px) scale(${1 - i * 0.1})`, zIndex: 10 - i, opacity: 1 - i * 0.3 }}>
            <div className="text-gray-800 font-bold text-sm text-center">{label}</div>
            <div className="h-1 w-8 bg-[#68A893] mx-auto mt-3 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};
const NeuralStreamLight = () => {
  const [text, setText] = useState("");
  const messages = ["Provisioning GCP nodes...", "Executing terraform apply...", "Scaling Kubernetes pods...", "Hardening security policies..."];
  const [msgIndex, setMsgIndex] = useState(0);
  useEffect(() => {
    let charIndex = 0;
    const type = () => {
      const currentMsg = messages[msgIndex];
      if (charIndex < currentMsg.length) { setText(currentMsg.substring(0, charIndex + 1)); charIndex++; setTimeout(type, 50); }
      else { setTimeout(() => { setMsgIndex((msgIndex + 1) % messages.length); charIndex = 0; }, 2000); }
    };
    type();
  }, [msgIndex]);
  return (
    <div className="h-[300px] bg-[#1A202C] rounded-[2rem] p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
      <div className="flex justify-between items-start text-gray-500"><Terminal size={20} /><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /><span className="text-[10px] uppercase font-bold tracking-widest">Live Terminal</span></div></div>
      <div className="font-mono text-green-400 text-sm mt-8"><span className="text-gray-500 mr-2">paulo@root:~$</span>{text}<span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse" /></div>
      <div className="space-y-1 font-mono text-[10px] text-gray-600 mt-auto"><div>[OK] INIT_INFRASTRUCTURE</div><div>[OK] SECRETS_LOADED</div><div>[PENDING] AWAITING_COMMAND</div></div>
    </div>
  );
};

export default App;