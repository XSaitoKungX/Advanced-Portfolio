export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";
export type SkillCategory = "frontend" | "backend" | "devops" | "tools";

export interface Skill {
  name: string;
  icon: string;
  level: SkillLevel;
  category: SkillCategory;
  color: string;
}

export const skills: Skill[] = [
  // Frontend
  { name: "JavaScript", icon: "SiJavascript", level: "advanced", category: "frontend", color: "#F7DF1E" },
  { name: "TypeScript", icon: "SiTypescript", level: "advanced", category: "frontend", color: "#3178C6" },
  { name: "React", icon: "SiReact", level: "advanced", category: "frontend", color: "#61DAFB" },
  { name: "Next.js", icon: "SiNextdotjs", level: "advanced", category: "frontend", color: "#FFFFFF" },
  { name: "Tailwind CSS", icon: "SiTailwindcss", level: "advanced", category: "frontend", color: "#06B6D4" },
  { name: "HTML5", icon: "SiHtml5", level: "advanced", category: "frontend", color: "#E34F26" },
  { name: "CSS3", icon: "SiCss3", level: "advanced", category: "frontend", color: "#1572B6" },
  // Backend
  { name: "Bun", icon: "SiBun", level: "advanced", category: "backend", color: "#FBF0DF" },
  { name: "Node.js", icon: "SiNodedotjs", level: "advanced", category: "backend", color: "#339933" },
  { name: "Python", icon: "SiPython", level: "intermediate", category: "backend", color: "#3776AB" },
  { name: "Java", icon: "SiJava", level: "intermediate", category: "backend", color: "#ED8B00" },
  { name: "Prisma", icon: "SiPrisma", level: "intermediate", category: "backend", color: "#5A67D8" },
  { name: "PostgreSQL", icon: "SiPostgresql", level: "intermediate", category: "backend", color: "#4169E1" },
  { name: "MySQL", icon: "SiMysql", level: "intermediate", category: "backend", color: "#4479A1" },
  { name: "MariaDB", icon: "SiMariadb", level: "intermediate", category: "backend", color: "#003545" },
  { name: "MongoDB", icon: "SiMongodb", level: "intermediate", category: "backend", color: "#47A248" },
  { name: "Redis", icon: "SiRedis", level: "intermediate", category: "backend", color: "#DC382D" },
  // DevOps & Infrastructure
  { name: "Docker", icon: "SiDocker", level: "intermediate", category: "devops", color: "#2496ED" },
  { name: "Git", icon: "SiGit", level: "advanced", category: "devops", color: "#F05032" },
  { name: "GitHub", icon: "SiGithub", level: "advanced", category: "devops", color: "#FFFFFF" },
  { name: "Linux", icon: "SiLinux", level: "intermediate", category: "devops", color: "#FCC624" },
  { name: "Nginx", icon: "SiNginx", level: "intermediate", category: "devops", color: "#009639" },
  { name: "Vercel", icon: "SiVercel", level: "advanced", category: "devops", color: "#FFFFFF" },
  // Tools
  { name: "Windsurf", icon: "SiWindsurf", level: "advanced", category: "tools", color: "#00B4D8" },
  { name: "IntelliJ IDEA", icon: "SiIntellijidea", level: "intermediate", category: "tools", color: "#FE315D" },
  { name: "VS Code", icon: "SiVisualstudiocode", level: "advanced", category: "tools", color: "#007ACC" },
  { name: "Figma", icon: "SiFigma", level: "intermediate", category: "tools", color: "#F24E1E" },
];
