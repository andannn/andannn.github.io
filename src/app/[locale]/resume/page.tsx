import ExperienceCard from "../components/ExperienceCard";
import Section from "../components/Section";
import SkillsSection from "../components/SkillsSection";
import ProjectCard from "../components/ProjectCard";
import LanguageSection from "../components/LanguageSection";
import ContactSection from "../components/ContactSection";
import HeaderSection from "../components/HeaderSection";
import { routing } from "@/src/i18n/routing";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Resume",
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function ResumesPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const resumeData = await import(
        `@/src/lib/resume/resumedata_${locale}.ts`
    ).then((mod) => mod.default as ResumeData);
    const t = await getTranslations({ locale: locale });

    return (
        <main className="max-w-5xl mx-auto p-8 bg-white">
            <HeaderSection
                name={resumeData.name}
                title={resumeData.title}
                summary={resumeData.summary}
                avatarUrl="/images/avatar.webp"
            />

            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 xl:gap-8">
                <aside className="lg:w-1/3 space-y-2">
                    <Section title={t("ResumePage.contact")}>
                        <ContactSection contact={resumeData.contact} />
                    </Section>

                    <Section title={t("ResumePage.skills")}>
                        <SkillsSection skills={resumeData.skills} />
                    </Section>

                    <Section title={t("ResumePage.languages")}>
                        <LanguageSection languages={resumeData.languages ?? []} />
                    </Section>
                </aside>

                <main className="lg:w-2/3 space-y-2">
                    <Section title={t("ResumePage.experience")}>
                        {resumeData.experience.map((exp, idx) => (
                            <ExperienceCard experience={exp} isTimeline={true} key={idx} />
                        ))}
                    </Section>

                    <Section title={t("ResumePage.projects")}>
                        {resumeData.personalProjects?.map((p, idx) => (
                            <ProjectCard key={idx} project={p}></ProjectCard>
                        ))}
                    </Section>
                </main>
            </div>
        </main>
    )
}
