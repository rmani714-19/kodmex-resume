export const appConfig = {
  app: {
    name: "Kodmex Resume Builder",
    version: "5.0.0",
    goal: "Create professional resumes with live preview and exact template-based PDF and DOCX export.",
    features: [
      "dynamicForm",
      "atsScoring",
      "resumeUpload",
      "autoGenerate",
      "validation",
      "resumeCoach",
      "githubImport",
      "linkedinImport",
      "inlinePreview",
      "templateSwitching",
      "pdfDownload",
      "docxDownload",
      "livePreview"
    ]
  },
  project: {
    name: "Kodmex Resume Builder",
    type: "fullstack",
    architecture: "client-server",
    techStack: {
      frontend: "React + Vite + Tailwind CSS",
      backend: "Node.js + Express",
      state: "Zustand",
      http: "Axios"
    }
  },
  backend: {
    server: "Express",
    port: 5001,
    routes: {
      atsScore: "/api/atsScore",
      uploadResume: "/api/uploadResume",
      generateResume: "/api/generateResume",
      githubProjects: "/api/githubProjects"
    }
  },
  resumeUpload: {
    formats: ["pdf", "docx"],
    maxSizeMB: 5
  },
  github: {
    maxProjects: 6
  },
  linkedin: {
    mode: "mock-api-ready"
  },
  ui: {
    maxWidth: "900px",
    theme: "minimal-light",
    colors: {
      primary: "#2563EB",
      background: "#F8FAFC",
      surface: "#FFFFFF",
      text: "#111827",
      border: "#E5E7EB"
    }
  },
  resumeTips: {
    summary: [
      "Write 2-3 lines aligned to your target role and business impact.",
      "Mention strongest technical strengths and the type of problems you solve.",
      "Avoid generic phrases like hardworking, sincere, or team player without proof."
    ],
    experience: [
      "Each experience should include measurable impact, not only responsibilities.",
      "Project bullets should mention tools, frameworks, technologies, and business outcomes.",
      "Start bullets with action verbs such as Developed, Built, Led, Improved, Optimized."
    ],
    projects: [
      "Projects should explain what was built, how it was built, and why it mattered.",
      "Always include tools and frameworks for ATS depth.",
      "Add GitHub or live links whenever available."
    ]
  },
  formSchema: {
    sections: [
      {
        id: "personal",
        title: "Personal Info",
        type: "fields",
        fields: [
          { key: "fullName", label: "Full Name", type: "text", required: true, placeholder: "John Doe" },
          { key: "email", label: "Email", type: "email", required: true, placeholder: "john@email.com" },
          { key: "phone", label: "Phone", type: "tel", required: true, placeholder: "9876543210" },
          { key: "location", label: "Location", type: "text", placeholder: "Chennai, India" },
          { key: "role", label: "Target Role", type: "text", required: true, placeholder: "Backend Developer" },
          { key: "linkedin", label: "LinkedIn", type: "url", placeholder: "https://linkedin.com/in/username" },
          { key: "github", label: "GitHub", type: "url", placeholder: "https://github.com/username" }
        ]
      },
      {
        id: "summary",
        title: "Summary",
        type: "textarea",
        key: "summary",
        placeholder: "Optional. Leave blank to auto-generate."
      },
      {
        id: "experience",
        title: "Experience",
        type: "custom"
      },
      {
        id: "projects",
        title: "Projects",
        type: "custom"
      },
      {
        id: "skills",
        title: "Skills",
        type: "custom"
      },
      {
        id: "education",
        title: "Education",
        type: "repeatable",
        itemLabel: "Education Entry",
        fields: [
          { key: "degree", label: "Degree", type: "text", required: true },
          { key: "institution", label: "Institution", type: "text", required: true },
          { key: "location", label: "Location", type: "text" },
          { key: "startDate", label: "Start Date", type: "text", placeholder: "2019" },
          { key: "endDate", label: "End Date", type: "text", placeholder: "2023" },
          { key: "score", label: "Score / CGPA", type: "text", placeholder: "8.4 CGPA" }
        ]
      },
      {
        id: "awards",
        title: "Awards & Achievements",
        type: "repeatable",
        itemLabel: "Award",
        fields: [
          { key: "title", label: "Title", type: "text", required: true },
          { key: "description", label: "Description", type: "textarea", required: true },
          { key: "year", label: "Year", type: "text", required: true }
        ]
      },
      {
        id: "certifications",
        title: "Certifications",
        type: "repeatable",
        itemLabel: "Certification",
        fields: [
          { key: "name", label: "Name", type: "text", required: true },
          { key: "issuer", label: "Issuer", type: "text", required: true },
          { key: "year", label: "Year", type: "text" },
          { key: "credentialId", label: "Credential ID", type: "text" },
          { key: "link", label: "Credential Link", type: "url" }
        ]
      },
      {
        id: "externalLinks",
        title: "External Links",
        type: "repeatable",
        itemLabel: "Link",
        fields: [
          { key: "label", label: "Label", type: "text", required: true },
          { key: "url", label: "URL", type: "url", required: true }
        ]
      }
    ]
  },
  atsEngine: {
    weights: {
      keywords: 35,
      actionVerbs: 15,
      metrics: 15,
      sections: 15,
      projectDepth: 10,
      validation: 10
    },
    rules: {
      actionVerbs: ["developed", "built", "led", "designed", "implemented", "optimized", "launched", "delivered"],
      metricsRegex: "(\\d+%|\\d+\\+|\\d+|increase|reduced|improved|saved|grew)",
      requiredSections: ["personal", "summary", "experience", "skills", "education"],
      minimumSkills: 5,
      minimumDescriptionWords: 10
    }
  },
  roleProfiles: {
    "Backend Developer": {
      skillGroups: [
        { group: "Languages", items: ["Java", "SQL"] },
        { group: "Frameworks", items: ["Spring Boot", "Hibernate"] },
        { group: "Tools", items: ["Git", "Docker", "Postman"] },
        { group: "Platforms", items: ["AWS", "MySQL"] }
      ],
      projectTemplate: {
        projectName: "Distributed Order Service",
        description: "Built backend services for order workflows, service communication, and production monitoring with measurable reliability improvements.",
        toolsUsed: ["Git", "Docker", "Postman"],
        frameworksUsed: ["Spring Boot", "JUnit"],
        technologies: ["Java", "MySQL", "REST API"],
        githubLink: "",
        impact: "Improved response time by 30% and reduced operational failures in release cycles."
      },
      summarySnippet: "Builds scalable backend services, APIs, and production-ready integrations.",
      experienceBullets: [
        "Developed scalable APIs improving response time by 30% across high-traffic services.",
        "Optimized backend workflows reducing production issue turnaround time by 25%.",
        "Implemented secure integrations and deployment improvements that increased release reliability."
      ]
    },
    "Full Stack Developer": {
      skillGroups: [
        { group: "Languages", items: ["JavaScript", "TypeScript"] },
        { group: "Frameworks", items: ["React", "Node.js", "Express"] },
        { group: "Tools", items: ["Git", "Docker", "Figma"] },
        { group: "Platforms", items: ["MongoDB", "Vercel", "AWS"] }
      ],
      projectTemplate: {
        projectName: "Customer Operations Dashboard",
        description: "Designed and built a full-stack workflow dashboard with analytics, collaboration, and faster operational actions.",
        toolsUsed: ["Git", "Docker", "Postman"],
        frameworksUsed: ["React", "Express"],
        technologies: ["TypeScript", "Node.js", "MongoDB"],
        githubLink: "",
        impact: "Reduced manual support effort by 35% and improved user completion rates."
      },
      summarySnippet: "Builds responsive product experiences across frontend, backend, and operational workflows.",
      experienceBullets: [
        "Built end-to-end product features that improved task completion by 28%.",
        "Developed reusable UI and backend modules that reduced delivery time across releases.",
        "Optimized application performance and developer workflows to improve maintainability."
      ]
    },
    "Data Analyst": {
      skillGroups: [
        { group: "Analytics", items: ["SQL", "Excel", "Python"] },
        { group: "Visualization", items: ["Power BI", "Tableau"] },
        { group: "Tools", items: ["Jupyter", "Git"] }
      ],
      projectTemplate: {
        projectName: "Revenue Performance Dashboard",
        description: "Created KPI dashboards and clean reporting datasets for leadership decision-making across multiple business units.",
        toolsUsed: ["Excel", "Git"],
        frameworksUsed: ["Pandas", "NumPy"],
        technologies: ["SQL", "Python", "Power BI"],
        githubLink: "",
        impact: "Improved reporting turnaround time by 40% and increased data accuracy for stakeholders."
      },
      summarySnippet: "Turns operational data into reporting, analysis, and business-ready insights.",
      experienceBullets: [
        "Developed dashboards and reports that reduced reporting turnaround time by 40%.",
        "Built clean SQL models and automation workflows improving reporting accuracy.",
        "Generated insights that helped teams prioritize high-value operational improvements."
      ]
    },
    "Java Developer": {
      skillGroups: [
        { group: "Languages", items: ["Java", "SQL"] },
        { group: "Frameworks", items: ["Spring Boot", "JUnit"] },
        { group: "Tools", items: ["Git", "Maven", "Postman"] },
        { group: "Platforms", items: ["MySQL", "Docker"] }
      ],
      projectTemplate: {
        projectName: "E-commerce API Platform",
        description: "Built and documented Java APIs for catalog, checkout, and order management with production-ready validation and testing.",
        toolsUsed: ["Git", "Maven", "Postman"],
        frameworksUsed: ["Spring Boot", "JUnit"],
        technologies: ["Java", "REST API", "MySQL"],
        githubLink: "",
        impact: "Improved checkout service performance by 30% and reduced debugging effort through stronger testing."
      },
      summarySnippet: "Builds Java services, APIs, and maintainable backend modules with measurable performance gains.",
      experienceBullets: [
        "Developed REST APIs improving service performance by 30% across key user flows.",
        "Built backend modules that reduced maintenance effort and improved test coverage.",
        "Optimized data access patterns for reliability and faster production response."
      ]
    }
  },
  sampleResumes: [
    {
      id: "backend-senior",
      label: "Senior Backend",
      data: {
        personal: {
          fullName: "Arun Sharma",
          email: "arun@gmail.com",
          phone: "9123456789",
          location: "Chennai, India",
          role: "Backend Developer",
          linkedin: "https://linkedin.com/in/arunsharma",
          github: "https://github.com/arunsharma"
        },
        summary:
          "Backend Developer with 5+ years of experience building scalable APIs, microservices, and operationally reliable systems. Strong in Java, Spring Boot, AWS, and performance optimization for production workloads.",
        experience: [
          {
            company: "XYZ Tech",
            designation: "Senior Backend Developer",
            location: "Bengaluru",
            startDate: "2021",
            endDate: "",
            isCurrent: true,
            projects: [
              {
                projectName: "Payments Gateway Platform",
                description: "Developed scalable payment APIs and reconciliation services for high-volume transaction workflows.",
                toolsUsed: ["Git", "Docker", "Postman"],
                frameworksUsed: ["Spring Boot", "JUnit"],
                technologies: ["Java", "MySQL", "Kafka"],
                githubLink: "",
                impact: "Improved payment response time by 32% and reduced failed transactions by 18%."
              }
            ]
          }
        ],
        projects: [
          {
            name: "Developer Metrics Portal",
            description: "Built an internal engineering dashboard for release analytics and service health tracking.",
            toolsUsed: ["Git", "Docker"],
            frameworksUsed: ["React", "Express"],
            technologies: ["Node.js", "React", "PostgreSQL"],
            githubLink: "https://github.com/example/dev-metrics",
            liveLink: "",
            impact: "Reduced manual release reporting time by 50%."
          }
        ],
        skills: [
          { group: "Languages", items: ["Java", "SQL"] },
          { group: "Frameworks", items: ["Spring Boot", "JUnit", "Hibernate"] },
          { group: "Tools", items: ["Git", "Docker", "Postman"] },
          { group: "Platforms", items: ["AWS", "Kafka", "MySQL"] }
        ],
        education: [
          {
            degree: "B.E Computer Engineering",
            institution: "XYZ University",
            location: "Chennai",
            startDate: "2015",
            endDate: "2019",
            score: "8.2 CGPA"
          }
        ],
        awards: [
          {
            title: "Quarterly Engineering Excellence Award",
            description: "Recognized for improving core payments stability and release reliability.",
            year: "2023"
          }
        ],
        certifications: [
          {
            name: "AWS Certified Developer",
            issuer: "Amazon Web Services",
            year: "2022",
            credentialId: "AWS-DEV-1234",
            link: ""
          }
        ],
        externalLinks: [
          { label: "LinkedIn", url: "https://linkedin.com/in/arunsharma" },
          { label: "GitHub", url: "https://github.com/arunsharma" }
        ]
      }
    }
  ]
};
