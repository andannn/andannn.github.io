type ContactInfo = {
    email: string
    phone?: string
    location: string
    github?: string
    website?: string
}

type Experience = {
    company: string
    title: string
    startDate: string
    endDate?: string
    description: string[]
    projects: Project[]
}

type Project = {
    name: string
    link?: string
    description: string[]
    role?: string
    teamSize?: int
    startDate?: string
    endDate?: string
    techStack?: string[]
}


type Skill = {
    title: string,
    contents: string[]
}

type ResumeData = {
    name: string
    title: string
    summary: string
    contact: ContactInfo
    skills: Skill[]
    languages?: string[]
    experience: Experience[]
    personalProjects?: Project[]
}