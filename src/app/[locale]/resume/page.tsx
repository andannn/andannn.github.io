import ExperienceCard from "../components/ExperienceCard";
import Section from "../components/Section";
import SkillsSection from "../components/SkillsSection";
import ProjectCard from "../components/ProjectCard";
import LanguageSection from "../components/LanguageSection";
import ContactSection from "../components/ContactSection";
import HeaderSection from "../components/HeaderSection";
import { routing } from "@/src/i18n/routing";
import { getLocale, getTranslations } from "next-intl/server";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function ResumesPage() {
    const locale = await getLocale();
    const resumeData = await import(
        `@/src/lib/resume/resumedata_${locale}.ts`
    ).then((mod) => mod.default as ResumeData);
    const t = await getTranslations("ResumePage")

    return (
        <main className="max-w-5xl mx-auto p-8 bg-white">
            <HeaderSection
                name={resumeData.name}
                title={resumeData.title}
                summary={resumeData.summary}
                avatarUrl="/images/avatar.jpeg"
            />

            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 xl:gap-8">
                <aside className="lg:w-1/3 space-y-2">
                    <Section title={t("contact")}>
                        <ContactSection contact={resumeData.contact} />
                    </Section>

                    <Section title={t("skills")}>
                        <SkillsSection skills={resumeData.skills} />
                    </Section>

                    <Section title={t("languages")}>
                        <LanguageSection languages={resumeData.languages ?? []} />
                    </Section>
                </aside>

                <main className="lg:w-2/3 space-y-2">
                    <Section title={t("experience")}>
                        {resumeData.experience.map((exp, idx) => (
                            <ExperienceCard experience={exp} isTimeline={true} key={idx} />
                        ))}
                    </Section>

                    <Section title={t("projects")}>
                        {resumeData.personalProjects?.map((p, idx) => (
                            <ProjectCard key={idx} project={p}></ProjectCard>
                        ))}
                    </Section>
                </main>
            </div>
        </main>
    )
}
