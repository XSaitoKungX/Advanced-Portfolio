export type SkillCategory = "frontend" | "backend" | "devops" | "tools";

export interface Skill {
  name: string;
  icon: string;
  category: SkillCategory;
  color: string;
}

export const skills: Skill[] = [
  // Frontend
  { name: "JavaScript", icon: "SiJavascript", category: "frontend", color: "#F7DF1E" },
  { name: "TypeScript", icon: "SiTypescript", category: "frontend", color: "#3178C6" },
  { name: "React", icon: "SiReact", category: "frontend", color: "#61DAFB" },
  { name: "Next.js", icon: "SiNextdotjs", category: "frontend", color: "#FFFFFF" },
  { name: "Tailwind CSS", icon: "SiTailwindcss", category: "frontend", color: "#06B6D4" },
  { name: "HTML5", icon: "SiHtml5", category: "frontend", color: "#E34F26" },
  { name: "CSS3", icon: "SiCss", category: "frontend", color: "#1572B6" },
  // Backend
  { name: "Bun", icon: "SiBun", category: "backend", color: "#FBF0DF" },
  { name: "Node.js", icon: "SiNodedotjs", category: "backend", color: "#339933" },
  { name: "Python", icon: "SiPython", category: "backend", color: "#3776AB" },
  { name: "Java", icon: "SiOpenjdk", category: "backend", color: "#ED8B00" },
  { name: "Prisma", icon: "SiPrisma", category: "backend", color: "#5A67D8" },
  { name: "PostgreSQL", icon: "SiPostgresql", category: "backend", color: "#4169E1" },
  { name: "MySQL", icon: "SiMysql", category: "backend", color: "#4479A1" },
  { name: "MariaDB", icon: "SiMariadb", category: "backend", color: "#003545" },
  { name: "MongoDB", icon: "SiMongodb", category: "backend", color: "#47A248" },
  { name: "Redis", icon: "SiRedis", category: "backend", color: "#DC382D" },
  // DevOps & Infrastructure
  { name: "Docker", icon: "SiDocker", category: "devops", color: "#2496ED" },
  { name: "Git", icon: "SiGit", category: "devops", color: "#F05032" },
  { name: "GitHub", icon: "SiGithub", category: "devops", color: "#FFFFFF" },
  { name: "Linux", icon: "SiLinux", category: "devops", color: "#FCC624" },
  { name: "Nginx", icon: "SiNginx", category: "devops", color: "#009639" },
  { name: "Vercel", icon: "SiVercel", category: "devops", color: "#FFFFFF" },
  // Tools
  { name: "Windsurf", icon: "SiWindsurf", category: "tools", color: "#00B4D8" },
  { name: "IntelliJ IDEA", icon: "SiIntellijidea", category: "tools", color: "#FE315D" },
  { name: "VS Code", icon: "SiVscodium", category: "tools", color: "#007ACC" },
  { name: "Figma", icon: "SiFigma", category: "tools", color: "#F24E1E" },
];
