export interface Experience {
  id: string;
  role: { de: string; en: string };
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: { de: string; en: string };
  technologies: string[];
  type: "work" | "education" | "freelance" | "personal";
}

export const experiences: Experience[] = [
  {
    id: "1",
    role: {
      de: 'Erste Schritte - Inspiration durch "Scorpion"',
      en: 'First Steps - Inspired by "Scorpion"',
    },
    company: "Selbststudium",
    startDate: "2018-01",
    endDate: "2018-12",
    description: {
      de: 'Die US-Serie "Scorpion" - basierend auf dem echten Team um Walter O\'Brien - hat mich als 13-Jähriger fasziniert und war der direkte Auslöser dafür, dass ich anfing zu programmieren. Ich wollte verstehen, wie Computer und Software wirklich funktionieren. Mein erstes "Hello World" in Python war der Anfang von allem.',
      en: 'The US TV show "Scorpion" - based on the real-life team around Walter O\'Brien - fascinated me at age 13 and was the direct trigger that got me into programming. I wanted to understand how computers and software actually work. My first "Hello World" in Python was where it all began.',
    },
    technologies: ["Python"],
    type: "personal",
  },
  {
    id: "2",
    role: {
      de: "Python-Grundlagen & erste Discord Bots",
      en: "Python Basics & First Discord Bots",
    },
    company: "Selbststudium",
    startDate: "2019-01",
    endDate: "2020-12",
    description: {
      de: "Ich vertiefte meine Python-Kenntnisse durch Online-Kurse und begann, erste Discord-Bots mit discord.py zu bauen – hauptsächlich über Tutorials. Parallel dazu experimentierte ich mit kleinen Spielprojekten in Unity und einem Snake-Klon. Im Rahmen eines Python-Kurses beschäftigte ich mich außerdem mit Minecraft-Agents und einfacher Spielelogik.",
      en: "I deepened my Python knowledge through online courses and started building my first Discord bots with discord.py – mostly following tutorials. At the same time, I experimented with small game projects in Unity and a Snake clone. Through a Python course, I also worked with Minecraft Agents and basic game logic.",
    },
    technologies: ["Python", "discord.py", "Unity", "C#"],
    type: "personal",
  },
  {
    id: "3",
    role: {
      de: "JavaScript, Node.js & erweiterte Discord-Entwicklung",
      en: "JavaScript, Node.js & Advanced Discord Development",
    },
    company: "Selbststudium",
    startDate: "2021-01",
    endDate: "2022-06",
    description: {
      de: "Der Wechsel zu JavaScript und Node.js öffnete neue Möglichkeiten. Ich baute komplexere Discord-Bots mit discord.js, experimentierte mit Web-Entwicklung und begann, mich für HTML, CSS und einfache Backends zu interessieren. Auch Minecraft-Mods und -Plugins gehörten zu dieser Phase der breiten Erkundung.",
      en: "Switching to JavaScript and Node.js opened new doors. I built more complex Discord bots with discord.js, experimented with web development and started getting interested in HTML, CSS and simple backends. Minecraft mods and plugins were also part of this phase of broad exploration.",
    },
    technologies: ["JavaScript", "Node.js", "discord.js", "HTML", "CSS", "Java"],
    type: "personal",
  },
  {
    id: "4",
    role: {
      de: "Berufsschule BBS2 – Elektrotechnik & Systemintegration",
      en: "Vocational School BBS2 – Electrical Engineering & System Integration",
    },
    company: "BBS2",
    location: "Deutschland",
    startDate: "2022-08",
    endDate: "2023-07",
    description: {
      de: "Ein Jahr Berufsschule mit Schwerpunkt auf Elektrotechnik und Systemintegration. Erste strukturierte Berührungspunkte mit C++ und Elektronik-Grundlagen. Diese Zeit hat mein technisches Gesamtverständnis deutlich geschärft – von Schaltkreisen bis hin zu systemnaher Programmierung.",
      en: "One year of vocational school focused on electrical engineering and system integration. First structured exposure to C++ and electronics fundamentals. This period significantly sharpened my overall technical understanding – from circuits to low-level programming.",
    },
    technologies: ["C++", "Electronics", "System Integration"],
    type: "education",
  },
  {
    id: "5",
    role: {
      de: "Moderne Web-Entwicklung – React, Next.js & eigene Projekte",
      en: "Modern Web Development – React, Next.js & Personal Projects",
    },
    company: "Selbststudium & Eigenprojekte",
    startDate: "2023-01",
    endDate: "2024-07",
    description: {
      de: "Ab 18 Jahren fokussierte ich mich zunehmend auf moderne Web-Technologien. React und Next.js wurden zu meinen primären Werkzeugen. Ich legte großen Wert auf sauberes UI/UX-Design und entwickelte parallel meinen Discord-Bot Astra, der mittlerweile in über 90 Servern aktiv ist.",
      en: "From age 18 onward, I focused increasingly on modern web technologies. React and Next.js became my primary tools. I placed a strong emphasis on clean UI/UX design and simultaneously developed my Discord bot Astra, which is now active in over 90 servers.",
    },
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL"],
    type: "personal",
  },
  {
    id: "6",
    role: {
      de: "Berufsschule BBS1 – Teamprojekt: Souls-like Game",
      en: "Vocational School BBS1 – Team Project: Souls-like Game",
    },
    company: "BBS1",
    location: "Deutschland",
    startDate: "2024-08",
    description: {
      de: "Im Rahmen meiner Ausbildung an der BBS1 arbeite ich mit einem Team an einem Souls-like Spiel in der Godot Engine mit C++ Erweiterungen. Das Projekt schult Teamarbeit, Architekturentscheidungen und den Umgang mit einer neuen Technologie unter realen Projektbedingungen.",
      en: "As part of my apprenticeship at BBS1, I'm working with a team on a Souls-like game in the Godot Engine with C++ extensions. The project builds skills in teamwork, architecture decisions and working with a new technology under real project conditions.",
    },
    technologies: ["Godot", "GDScript", "C++"],
    type: "education",
  },
  {
    id: "7",
    role: {
      de: "Ausbildung – Fachinformatiker für Anwendungsentwicklung",
      en: "Apprenticeship – IT Specialist for Application Development",
    },
    company: "Leuphana Universität",
    location: "Lüneburg, Deutschland",
    startDate: "2024-08",
    description: {
      de: "Formale Ausbildung zum Fachinformatiker für Anwendungsentwicklung an der Leuphana Universität. Voraussichtlicher Abschluss 2027. Hier verbinde ich mein autodidaktisch aufgebautes Wissen mit strukturierter beruflicher Ausbildung und arbeite an realen Projekten im professionellen Umfeld.",
      en: "Formal apprenticeship as an IT specialist for application development at Leuphana University. Expected graduation in 2027. Here I combine my self-taught knowledge with structured professional training and work on real projects in a professional environment.",
    },
    technologies: ["Java", "JavaScript", "TypeScript", "SQL", "Git"],
    type: "work",
  },
];
