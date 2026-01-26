'use client';
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { ConstructionModal } from "@/components/ui/construction-modal";
import {
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import { BrainCircuit, Globe, Lock, Code2, ArrowUpRight, Search } from "lucide-react";

import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

import { SIINVisual, MAANGVisual, AuthVisual, ConstructionVisual } from "@/components/ui/abstract-visuals";
import Image from "next/image";

export default function Home() {
  const [isFindoraModalOpen, setIsFindoraModalOpen] = useState(false);

  const items = [
    {
      title: "SIIN (Skill Inference Network)",
      description: "Agentic AI system combining Monte Carlo Tree Search with LLM reasoning. Uncovers latent developer skills from GitHub data.",
      header: (
        <div className="bg-white h-full min-h-[10rem] rounded-xl relative overflow-hidden group border border-gray-100">
             <SIINVisual />
             <div className="absolute bottom-4 left-6 z-10">
                <span className="text-3xl font-bold text-black/90">SIIN</span>
             </div>
        </div>
      ),
      icon: <BrainCircuit className="h-4 w-4 text-[#002FA7]" />,
      className: "md:col-span-2 bg-white",
      href: "https://graph-skill-infrence.vercel.app"
    },
    {
      title: "MAANG Route",
      description: "Full-stack productivity platform serving 150+ active users. Built with Next.js 14, Prisma, Postgres.",
      header: (
        <div className="bg-white h-full min-h-[8rem] rounded-xl relative overflow-hidden group border border-gray-100">
             <MAANGVisual />
        </div>
      ),
      icon: <Globe className="h-4 w-4 text-[#002FA7]" />,
      className: "md:col-span-1",
      href: "https://maangroute.dev"
    },
    {
      title: "AgenticAuthPentest",
      description: "Autonomous security framework using Google Gemini to exploit API authentication vulnerabilities.",
      header: (
        <div className="bg-[#1e1e1e] h-full min-h-[8rem] rounded-xl relative overflow-hidden group border border-gray-800">
            <AuthVisual />
        </div>
      ),
      icon: <Lock className="h-4 w-4 text-red-500" />,
      className: "md:col-span-1",
      href: "https://agentic-auth-pentest-q94c.vercel.app/"
    },
    {
      title: "Findora",
      description: "Autonomous Job Matching Platform with swipe-based discovery. (In Development)",
      header: (
          <div className="bg-[#F5F5F7] h-full min-h-[8rem] rounded-xl relative overflow-hidden group border border-gray-100">
               <ConstructionVisual />
          </div>
      ),
      icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
      className: "md:col-span-2",
      onClick: () => setIsFindoraModalOpen(true)
    },
  ];

  return (
    <main className="min-h-screen py-12 md:py-24 space-y-12">
      <ConstructionModal isOpen={isFindoraModalOpen} onClose={() => setIsFindoraModalOpen(false)} />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
            <div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">
                SHYAM.
                <br />
                <span className="text-[#002FA7]">PRODUCT ENGINEER.</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-500 max-w-2xl font-mono mb-8">
                Building autonomous agents, scalable full-stack systems, and robust AI architectures.
                </p>
                
                <div className="flex gap-4 items-center">
                    <a href="/resume/Shyam_resume.pdf" target="_blank" className="bg-[#002FA7] text-white font-bold py-3 px-6 rounded-full hover:bg-[#002FA7]/90 transition-colors flex items-center gap-2 group">
                        RESUME < ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                </div>
            </div>
            {/* Profile Photo - Swiss Integrated */}
             <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl flex-shrink-0 border-4 border-[#002FA7] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group bg-[#F5F5F7]">
                <Image 
                   src="/images/myiamge.jpeg" 
                   fill 
                   alt="Shyam Profile"
                   className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
             </div>
        </div>
      </section>

      {/* Projects Grid */}
      <BentoGrid className="max-w-7xl mx-auto">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            icon={item.icon}
            className={item.className}
            href={item.href}
            onClick={item.onClick}
          />
        ))}
      </BentoGrid>

      {/* Experience Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <Code2 className="w-8 h-8 text-[#002FA7]" /> EXPERIENCE
          </h2>
          <div className="space-y-8 border-l-2 border-gray-200 pl-8 relative">
            {experience.map((exp, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[39px] bg-[#002FA7] w-5 h-5 rounded-full border-4 border-white" />
                <h3 className="text-xl font-bold">{exp.role}</h3>
                <p className="text-gray-500 font-mono text-sm mb-2">{exp.company} • {exp.period}</p>
                <p className="text-gray-600">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-black text-white p-8 rounded-[2rem]">
          <h2 className="text-3xl font-bold mb-8">TECHNICAL SKILLS</h2>
          <div className="grid grid-cols-2 gap-8">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-[#002FA7] font-mono mb-2 uppercase text-sm tracking-wider">{category}</h3>
                <ul className="space-y-1">
                  {items.map(skill => (
                    <li key={skill} className="text-gray-300">{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      
       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#002FA7] rounded-[2rem] p-12 text-center text-white relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
           <h2 className="text-4xl md:text-6xl font-bold mb-6">LET'S BUILD SOMETHING.</h2>
           <a href="mailto:shyamrathore013@gmail.com" className="inline-flex items-center gap-2 text-xl font-mono hover:underline underline-offset-8 decoration-4 decoration-white/50">
             shyamrathore013@gmail.com <ArrowUpRight className="w-6 h-6" />
           </a>
        </div>
      </section>
    </main>
  );
}




const experience = [
  {
    role: "Product Engineer Intern",
    company: "YoLearn.ai",
    period: "Oct 2024 - Present",
    description: "Architected autonomous tool orchestration system. Engineered vector search recommendation engine serving production users.",
  },
  {
    role: "Associate System Engineer",
    company: "MAQ Software",
    period: "Aug 2024 - Oct 2024",
    description: "Automated CI/CD pipelines using Azure DevOps. Built Power BI dashboards serving 200+ enterprise users.",
  },
  {
    role: "Associate Software Engineer",
    company: "Better Software",
    period: "Jul 2024 - Aug 2024",
    description: "Developed production full-stack features using React and REST APIs.",
  }
];

const skills = {
    languages: ["TypeScript", "Python", "Java", "C++"],
    backend: ["Node.js", "FastAPI", "PostgreSQL", "Prisma"],
    ai: ["LangChain", "RAG", "Vector DBs", "LLMs"],
    devops: ["Docker", "AWS", "GitHub Actions", "CI/CD"]
};
