import React, { useEffect, useRef, useState } from 'react';
import { Mail, MapPin, Phone, Server, Shield, Cloud, Terminal, Award, ExternalLink, Code, CheckCircle, XCircle, Cpu, Zap, Activity } from 'lucide-react';

/**
 * Paul Attah - The "Daylight Architect" Portfolio
 * Final Security Update: Key removed from source code, relying solely on Environment Variables.
 */

const CloudSimulation = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    document.head.appendChild(script);

    script.onload = () => {
      const THREE = window.THREE;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(12, 12, 12);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      mountRef.current.appendChild(renderer.domElement);

      const mainColor = 0x68A893;
      const group = new THREE.Group();
      scene.add(group);

      const meshMat = new THREE.MeshBasicMaterial({ 
        color: mainColor, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.3 
      });

      const cloudGroup = new THREE.Group();
      const sphereGeom = new THREE.SphereGeometry(0.8, 12, 12);
      for(let i=0; i<4; i++) {
        const p = new THREE.Mesh(sphereGeom, meshMat);
        p.position.set(Math.sin(i)*0.8, Math.cos(i)*0.2, i*0.4);
        cloudGroup.add(p);
      }
      cloudGroup.position.set(4, 4, -2);
      group.add(cloudGroup);

      const dbGeom = new THREE.CylinderGeometry(0.8, 0.8, 1.2, 16);
      const db = new THREE.Mesh(dbGeom, meshMat);
      db.position.set(0, -1, 0);
      group.add(db);

      const createMobile = (x, z, rot) => {
        const mobile = new THREE.Group();
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.8), meshMat);
        const screen = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.02, 0.7), new THREE.MeshBasicMaterial({ color: mainColor, transparent: true, opacity: 0.5 }));
        screen.position.y = 0.03;
        mobile.add(body, screen);
        mobile.position.set(x, -1.2, z);
        mobile.rotation.y = rot;
        return mobile;
      };

      const createWifiNode = (x, z) => {
        const tower = new THREE.Group();
        const base = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1, 0.3), meshMat);
        const top = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), meshMat);
        top.position.y = 0.6;
        tower.add(base, top);
        tower.position.set(x, -0.8, z);
        const pulses = [];
        for(let i=0; i<3; i++) {
          const ring = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.25, 32), new THREE.MeshBasicMaterial({ color: mainColor, transparent: true, opacity: 0.2, side: THREE.DoubleSide }));
          ring.rotation.x = Math.PI / 2;
          ring.position.y = 0.6;
          tower.add(ring);
          pulses.push(ring);
        }
        tower.userData = { pulses };
        return tower;
      };

      const phone1 = createMobile(-2, 4, Math.PI / 6);
      const phone2 = createMobile(1, 4.5, -Math.PI / 4);
      const wifi = createWifiNode(-4, -1);
      const terminal = new THREE.Group();
      terminal.add(new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.8), meshMat));
      terminal.add(new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.05), meshMat));
      terminal.children[1].position.set(0, 0.4, -0.4);
      terminal.position.set(-3, -1.2, 2);
      
      group.add(phone1, phone2, wifi, terminal);

      const lineMat = new THREE.LineBasicMaterial({ color: mainColor, transparent: true, opacity: 0.1 });
      const drawLine = (p1, p2) => {
        const geom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
        scene.add(new THREE.Line(geom, lineMat));
      };
      
      const cloudOrigin = new THREE.Vector3(4, 3, -2);
      const dbTop = new THREE.Vector3(0, 0, 0);
      drawLine(cloudOrigin, dbTop);
      drawLine(dbTop, phone1.position);
      drawLine(dbTop, phone2.position);
      drawLine(dbTop, wifi.position);
      drawLine(dbTop, terminal.position);

      const packets = [];
      const packetGeom = new THREE.SphereGeometry(0.06, 8, 8);
      const packetMat = new THREE.MeshBasicMaterial({ color: mainColor });

      const nodes = [phone1.position, phone2.position, wifi.position, terminal.position];
      nodes.forEach(node => {
        const p = new THREE.Mesh(packetGeom, packetMat);
        p.userData = { start: node, end: dbTop, progress: Math.random() };
        packets.push(p);
        group.add(p);
      });

      const animate = () => {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.001;
        cloudGroup.position.y = 4 + Math.sin(time) * 0.2;
        
        wifi.userData.pulses.forEach((p, i) => {
          p.scale.setScalar(p.scale.x + 0.01);
          p.material.opacity -= 0.003;
          if(p.scale.x > 3) { p.scale.setScalar(1); p.material.opacity = 0.2; }
        });

        packets.forEach(p => {
          p.userData.progress += 0.004;
          if (p.userData.progress > 1) p.userData.progress = 0;
          p.position.lerpVectors(p.userData.start, p.userData.end, p.userData.progress);
        });

        group.rotation.y += 0.001;
        renderer.render(scene, camera);
      };

      animate();
      const handleResize = () => {
        if (!mountRef.current) return;
        const newWidth = mountRef.current.clientWidth;
        const newHeight = mountRef.current.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      };
    };
  }, []);

  return (
    <div ref={mountRef} className="w-full h-full min-h-[500px] relative overflow-hidden bg-gradient-to-br from-[#1A202C] to-[#2D3748]">
      <div className="absolute top-8 left-8 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#68A893] animate-ping" />
          <div className="text-[10px] uppercase tracking-[0.4em] text-[#68A893] font-bold">NETWORK_LIVE</div>
        </div>
        <div className="w-24 h-[1px] bg-[#68A893]/30" />
      </div>
      <div className="absolute bottom-8 right-8 text-[9px] font-mono text-[#68A893]/40 leading-relaxed text-right">
        UPLINK: ACTIVE<br/>
        WIFI_NODE_01: BROADCASTING<br/>
        MOBILE_HANDSHAKE: OK
      </div>
    </div>
  );
};

const App = () => {
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const aiRef = useRef(null);
  const experienceRef = useRef(null);
  const projectsRef = useRef(null);
  const certsRef = useRef(null);

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

        gsap.from(".hero-element", {
          y: 40, opacity: 0, duration: 1.2, stagger: 0.15, ease: "power3.out"
        });

        gsap.to(".hero-avatar", {
          y: 15, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut"
        });

        gsap.to(".circle-ring", {
          scale: 1.05, opacity: 0.3, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut", stagger: 0.5
        });

        [aboutRef.current, aiRef.current, experienceRef.current, projectsRef.current, certsRef.current].forEach((sec) => {
          if (sec) {
            gsap.from(sec, {
              scrollTrigger: { trigger: sec, start: "top 80%" },
              y: 50, opacity: 0, duration: 1, ease: "power3.out"
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
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          // Senior Practice: Rely strictly on Environment Variables.
          // Fallback removed for maximum security.
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          from_name: "Portfolio Contact Form",
          subject: `Portfolio Message from ${formData.name}`,
          ...formData,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else setSubmitStatus('error');
    } catch { setSubmitStatus('error'); }
    finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  return (
    <div className="bg-[#FDFDFD] text-[#2D3748] font-sans overflow-x-hidden selection:bg-[#68A893] selection:text-white">
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <div className="flex gap-6 text-gray-500">
            <a href="https://www.linkedin.com/in/attah-paul-8a1678159/" target="_blank" rel="noreferrer" className="hover:text-[#68A893] transition-colors"><LinkedinIcon size={20} /></a>
            <a href="https://github.com/paulo91-bit" target="_blank" rel="noreferrer" className="hover:text-[#68A893] transition-colors"><GithubIcon size={20} /></a>
          </div>
          <a href="#contact" className="flex items-center gap-2 text-sm font-semibold tracking-wider text-gray-500 hover:text-[#68A893] transition-colors uppercase">
            <Mail size={16} /> Get In Touch
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section ref={heroRef} className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          {[300, 500, 700, 900].map(size => (
            <div key={size} className="circle-ring absolute rounded-full border border-gray-200" style={{ width: size, height: size }} />
          ))}
        </div>
        <div className="relative z-10 flex flex-col items-center hero-element">
          <div className="hero-avatar relative mb-8 group">
            <div className="absolute inset-0 bg-[#68A893] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 animate-pulse" />
            <img src="https://github.com/paulo91-bit.png" alt="Paul Attah" className="relative w-32 h-32 rounded-full grayscale hover:grayscale-0 transition-all duration-700 object-cover shadow-2xl border-4 border-white" />
          </div>
          <h2 className="text-xs md:text-sm tracking-[0.4em] text-gray-400 uppercase font-semibold mb-4 text-center">Senior Cloud & DevOps Engineer</h2>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 tracking-tight mb-8 font-mono">Paul_Attah<span className="text-[#68A893]">.tf</span><span className="animate-pulse font-light">_</span></h1>
          <div className="flex gap-8 text-xs tracking-widest uppercase text-gray-400 font-semibold mt-4 flex-wrap justify-center">
            {['about', 'ai-hub', 'experience', 'skills', 'certifications', 'projects'].map(link => <a key={link} href={`#${link}`} className="hover:text-[#68A893] transition-colors whitespace-nowrap">{link.replace('-', ' ')}</a>)}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" ref={aboutRef} className="py-24 px-8 max-w-6xl mx-auto">
        <h3 className="text-center text-sm tracking-[0.5em] text-gray-400 uppercase font-semibold mb-20">A B O U T</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="bg-[#1A202C] rounded-[2.5rem] overflow-hidden shadow-2xl aspect-square md:aspect-auto md:min-h-[500px] flex items-center justify-center border border-gray-800 relative group">
            <CloudSimulation />
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-8 text-gray-800 tracking-tight leading-tight">Architecting <span className="text-[#68A893]">Resilience</span> Across the Cloud</h2>
            <div className="text-gray-500 leading-relaxed space-y-6 text-lg">
              <p>Hey. I am a Senior Cloud & Infrastructure Engineer based in Lagos, Nigeria. I specialize in architecting, deploying, and maintaining scalable, high-availability IT infrastructures across hybrid environments.</p>
              <p>With a strong foundation in <span className="font-semibold text-gray-700 underline decoration-[#68A893]/30 decoration-4 underline-offset-4">Terraform, Kubernetes, and Multi-Cloud architectures</span>, I bridge the gap between development and operations.</p>
              <p>The isometric simulation you see here represents the interconnected nature of modern cloud ecosystems. I ensure every packet reaches its destination with zero latency and absolute security.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI & AUTOMATION SECTION */}
      <section id="ai-hub" ref={aiRef} className="py-32 px-8 bg-[#1A202C] text-white overflow-hidden relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <h3 className="text-center text-sm tracking-[0.5em] text-[#68A893] uppercase font-semibold mb-20">A I & A U T O M A T I O N</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-[#68A893]/20 text-[#68A893] px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase">
                <Cpu size={14} /> Agentic Infrastructure
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Beyond Automation: <span className="text-[#68A893]">Autonomous Systems.</span></h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                I build intelligent agents that move beyond static scripts. By integrating Large Language Models and semantic search into infrastructure pipelines, I create systems that can self-heal, auto-generate documentation, and predict scaling requirements before they happen.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-800/40 p-6 rounded-2xl border border-gray-700/50">
                  <Zap className="text-[#68A893] mb-4" size={24} />
                  <h4 className="font-bold mb-2">Self-Healing Agents</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Autonomous agents that monitor logs and execute remediation scripts in real-time.</p>
                </div>
                <div className="bg-gray-800/40 p-6 rounded-2xl border border-gray-700/50">
                  <Activity className="text-[#68A893] mb-4" size={24} />
                  <h4 className="font-bold mb-2">Semantic Ops</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Using pgvector and LLMs to query complex infrastructure documentation naturally.</p>
                </div>
              </div>
            </div>
            <div className="bg-[#2D3748]/30 p-8 rounded-[2.5rem] border border-gray-700/50 backdrop-blur-md relative h-[500px]">
               <AiAgentVisualizer />
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section id="experience" ref={experienceRef} className="py-32 px-8 bg-gray-50/50 border-y border-gray-100 relative">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-center text-sm tracking-[0.5em] text-gray-400 uppercase font-semibold mb-20">E X P E R I E N C E</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            <ExperienceCard 
              title="Senior Cloud Infrastructure Eng." 
              company="Enbros Technologies" 
              date="JAN 2024 - PRESENT" 
              icons={[<Cloud size={16}/>, <Terminal size={16}/>, <Shield size={16}/>]} 
              bullets={["Designed scalable multi-cloud infrastructure (Azure, AWS, GCP).", "Standardized IaC pipelines using Terraform.", "Configured secure network segments and VPN tunnels."]} 
            />
            <ExperienceCard 
              title="Infrastructure & Platform Lead" 
              company="NdaraAI" 
              date="JAN 2024 - DEC 2024" 
              icons={[<Server size={16}/>, <Terminal size={16}/>]} 
              bullets={["Architected resilient virtualization clusters using Proxmox.", "Authored custom Bash and Python scripts for disaster recovery.", "Engineered secure perimeters with Nginx reverse proxies."]} 
            />
            <ExperienceCard 
              title="IT Systems Administrator" 
              company="ValueGate Consulting" 
              date="JAN 2020 - JAN 2024" 
              icons={[<Shield size={16}/>, <Server size={16}/>]} 
              bullets={["Administered corporate IT including Windows Server and AD.", "Maintained seamless network connectivity via routing/switching.", "Developed SOPs for server hardening."]} 
            />
          </div>
        </div>
      </section>

      <section id="skills" className="py-24 px-8 max-w-6xl mx-auto"><h3 className="text-center text-sm tracking-[0.5em] text-gray-400 uppercase font-semibold mb-16">S K I L L S & T E L E M E T R Y</h3><div className="grid grid-cols-1 lg:grid-cols-2 gap-8"><DiagnosticShufflerLight /><NeuralStreamLight /></div></section>

      <section id="certifications" ref={certsRef} className="py-24 bg-gray-50/50 border-y border-gray-100 relative"><h3 className="text-center text-sm tracking-[0.5em] text-gray-400 uppercase font-semibold mb-16">C E R T I F I C A T I O N S</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto px-8"><CertCard title="Google Certified Associate Cloud Engineer" issuer="Google Cloud" /><CertCard title="Azure Developer Associate (AZ-204)" issuer="Microsoft" /><CertCard title="Microsoft Sentinel Ninja Training" issuer="Microsoft Security" /><CertCard title="McKinsey Forward Program Graduate" issuer="McKinsey & Company" /></div></section>

      <section id="projects" ref={projectsRef} className="py-24 px-8 max-w-6xl mx-auto"><h3 className="text-center text-sm tracking-[0.5em] text-gray-400 uppercase font-semibold mb-16">P R O J E C T S</h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"><ProjectCard title="sql-ai-semantic-search" description="AI-powered semantic search engine using PostgreSQL (pgvector) and OpenAI Embeddings." tech={['Python', 'PostgreSQL', 'OpenAI']} link="https://github.com/paulo91-bit/sql-ai-semantic-search" /><ProjectCard title="maigie" description="An AI-powered study companion designed to help students organize learning and track progress." tech={['TypeScript', 'React', 'AI']} link="https://github.com/paulo91-bit/maigie" /><ProjectCard title="product_backend_devops" description="IaC and CI/CD pipeline demonstrations for automated backend deployments and scaling." tech={['Python', 'Terraform', 'CI/CD']} link="https://github.com/paulo91-bit/product_backend_devops" /></div></section>

      <section id="contact" className="py-32 px-8 bg-gray-50"><h3 className="text-center text-sm tracking-[0.5em] text-gray-400 uppercase font-semibold mb-12">C O N T A C T</h3><div className="max-w-2xl mx-auto text-center mb-16"><h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-10">I have got just what you need. <span className="text-[#68A893] underline decoration-2 underline-offset-8">Lets talk.</span></h2><div className="space-y-4 text-gray-600 flex flex-col items-center"><div className="flex items-center gap-4"><Phone size={20} className="text-[#68A893]"/> +234 806 008 7078</div><div className="flex items-center gap-4"><Mail size={20} className="text-[#68A893]"/> attahattah37@gmail.com</div><div className="flex items-center gap-4"><MapPin size={20} className="text-[#68A893]"/> Lagos, Nigeria</div></div></div>
        <form onSubmit={handleEmailSubmit} className="max-w-2xl mx-auto space-y-4 relative"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><input type="text" placeholder="Name" required disabled={isSubmitting} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-200/60 text-gray-800 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#68A893] transition-all disabled:opacity-50" /><input type="email" placeholder="Email" required disabled={isSubmitting} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-200/60 text-gray-800 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#68A893] transition-all disabled:opacity-50" /></div><input type="text" placeholder="Subject" required disabled={isSubmitting} value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full bg-gray-200/60 text-gray-800 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#68A893] transition-all disabled:opacity-50" /><textarea placeholder="Message" rows={5} required disabled={isSubmitting} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-gray-200/60 text-gray-800 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#68A893] transition-all resize-none disabled:opacity-50" /><button type="submit" disabled={isSubmitting} className="w-full bg-[#68A893] hover:bg-[#578E7C] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#68A893]/30 disabled:opacity-70 flex justify-center items-center">{isSubmitting ? 'Transmitting...' : 'Submit'}</button>{submitStatus === 'success' && <div className="absolute -bottom-12 left-0 right-0 text-center text-green-600 font-semibold">Message delivered.</div>}{submitStatus === 'error' && <div className="absolute -bottom-12 left-0 right-0 text-center text-red-500 font-semibold">Failed to send. Try again.</div>}</form>
      </section>

      <footer className="py-8 text-center text-gray-400 text-sm bg-white border-t border-gray-100">Paul Attah © 2026. Built with React & Tailwind.</footer>
    </div>
  );
};

const AiAgentVisualizer = () => {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Log_Analyzer", status: "Active", progress: 85 },
    { id: 2, name: "Security_Audit", status: "Scanning", progress: 42 },
    { id: 3, name: "Auto_Scaler", status: "Idle", progress: 0 }
  ]);
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev => prev.map(t => {
        if (t.name === "Auto_Scaler" && Math.random() > 0.8) return { ...t, status: "Executing", progress: 10 };
        if (t.status === "Executing") {
           const nextProgress = t.progress + 15;
           return nextProgress >= 100 ? { ...t, status: "Idle", progress: 0 } : { ...t, progress: nextProgress };
        }
        return { ...t, progress: (t.progress + Math.random() * 2) % 100 };
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="h-full flex flex-col justify-between font-mono">
      <div className="flex justify-between items-start">
        <div><div className="text-[#68A893] text-xs mb-1">AGENT_REGISTRY_STATUS</div><div className="text-2xl font-bold text-white">NODE_01_AI</div></div>
        <div className="bg-[#68A893]/10 text-[#68A893] p-3 rounded-xl border border-[#68A893]/20"><Cpu className="animate-pulse" size={20} /></div>
      </div>
      <div className="space-y-6 my-12">
        {tasks.map(task => (
          <div key={task.id} className="space-y-2">
            <div className="flex justify-between text-[10px] tracking-widest text-gray-400"><span>{task.name}</span><span className={task.status === 'Executing' ? 'text-green-400' : ''}>{task.status}</span></div>
            <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-[#68A893] transition-all duration-500 ease-out" style={{ width: `${task.progress}%` }} /></div>
          </div>
        ))}
      </div>
      <div className="bg-black/40 p-4 rounded-xl border border-gray-700 text-[10px] text-gray-500 space-y-1"><div>&gt; Loading semantic_embeddings...</div><div>&gt; Initializing agent_handshake...</div><div>&gt; System stable. AI_AGENTS_READY.</div></div>
    </div>
  );
};

const ExperienceCard = ({ title, company, date, icons, bullets }) => (
  <div className="w-full max-w-[380px] bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-[#68A893]/10 transition-all duration-300">
    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100">
      <Server size={24} className="text-[#68A893]"/>
    </div>
    <h4 className="text-xl font-bold text-gray-800 mb-1">{title}</h4>
    <h5 className="text-[#68A893] font-semibold mb-4">{company}</h5>
    <div className="flex gap-3 mb-6 text-gray-400">
      {icons.map((icon, i) => (
        <span key={i} className="bg-gray-50 p-2 rounded-lg border border-gray-100 flex items-center justify-center">{icon}</span>
      ))}
    </div>
    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-2 inline-block">{date}</div>
    <ul className="space-y-4 text-sm text-gray-500">
      {bullets.map((b, i) => (
        <li key={i} className="flex gap-3 items-start">
          <div className="w-1.5 h-1.5 rounded-full bg-[#68A893] mt-1.5 shrink-0" />
          <span className="leading-relaxed">{b}</span>
        </li>
      ))}
    </ul>
  </div>
);

const LinkedinIcon = ({ size = 20 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>);
const GithubIcon = ({ size = 20 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path><path d="M9 18c-4.5 1.6-5-2.5-7-3"></path></svg>);
const CertCard = ({ title, issuer }) => (<div className="flex items-center gap-6 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"><div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 flex-shrink-0"><Award size={20} className="text-[#68A893]" /></div><div><h4 className="text-gray-800 font-bold text-sm md:text-base">{title}</h4><p className="text-[#68A893] text-xs font-semibold uppercase tracking-wider mt-1">{issuer}</p></div></div>);
const ProjectCard = ({ title, description, tech, link }) => (<div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full"><div className="flex justify-between items-start mb-6"><div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100"><Code size={20} className="text-[#68A893]"/></div><a href={link} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#68A893] transition-colors"><ExternalLink size={20} /></a></div><h4 className="text-xl font-bold text-gray-800 mb-3">{title}</h4><p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">{description}</p><div className="flex flex-wrap gap-2 mt-auto">{tech.map((t, i) => <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-[#68A893] bg-[#68A893]/10 px-3 py-1 rounded-full">{t}</span>)}</div></div>);

const DiagnosticShufflerLight = () => {
  const [labels, setLabels] = useState(["AWS Architecture", "Terraform IaC", "Zero-Trust IAM"]);
  useEffect(() => { const timer = setInterval(() => { setLabels(prev => { const next = [...prev]; const last = next.pop(); next.unshift(last); return next; }); }, 3000); return () => clearInterval(timer); }, []);
  return (<div className="relative h-[300px] bg-white rounded-[2rem] p-8 overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between"><div className="flex justify-between items-start text-gray-400"><Cloud size={20} /><span className="text-[10px] tracking-widest uppercase font-bold">Skill Shuffler</span></div><div className="relative flex-1 flex flex-col items-center justify-center mt-8">{labels.map((label, i) => (<div key={label} className="absolute bg-gray-50 border border-gray-100 rounded-2xl p-6 w-full max-w-[240px] shadow-sm transition-all duration-[800ms]" style={{ transform: `translateY(${(i - 1) * 40}px) scale(${1 - i * 0.1})`, zIndex: 10 - i, opacity: 1 - i * 0.3 }}><div className="text-gray-800 font-bold text-sm text-center">{label}</div><div className="h-1 w-8 bg-[#68A893] mx-auto mt-3 rounded-full" /></div>))}</div></div>);
};
const NeuralStreamLight = () => {
  const [text, setText] = useState("");
  const messages = ["Provisioning GCP nodes...", "Executing terraform apply...", "Scaling Kubernetes pods...", "Hardening security policies..."];
  const [msgIndex, setMsgIndex] = useState(0);
  useEffect(() => { let charIndex = 0; const type = () => { const currentMsg = messages[msgIndex]; if (charIndex < currentMsg.length) { setText(currentMsg.substring(0, charIndex + 1)); charIndex++; setTimeout(type, 50); } else { setTimeout(() => { setMsgIndex((msgIndex + 1) % messages.length); charIndex = 0; }, 2000); } }; type(); }, [msgIndex]);
  return (
    <div className="h-[300px] bg-[#1A202C] rounded-[2rem] p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
      <div className="flex justify-between items-start text-gray-500"><Terminal size={20} /><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /><span className="text-[10px] uppercase font-bold tracking-widest">Live Terminal</span></div></div>
      <div className="font-mono text-green-400 text-sm mt-8"><span className="text-gray-500 mr-2">paulo@root:~$</span>{text}<span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse" /></div>
      <div className="space-y-1 font-mono text-[10px] text-gray-600 mt-auto"><div>[OK] INIT_INFRASTRUCTURE</div><div>[OK] SECRETS_LOADED</div><div>[PENDING] AWAITING_COMMAND</div></div>
    </div>
  );
};

export default App;