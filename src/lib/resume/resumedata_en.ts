export const resumeData_en: ResumeData = {
    name: "X XX",
    title: "Cross-Platform Engineer Specializing in Android",
    summary:
        "Experienced software engineer specializing in Android (Kotlin) and Flutter, with a track record ranging from large-scale app migrations to greenfield development. I provide optimal technology selection and architectural design tailored to project requirements. I have a strong commitment to 'highly maintainable code,' with extensive practice in Clean Architecture and Unidirectional Data Flow (UDF). Currently, I am researching the fusion of logic sharing and native UI using Kotlin Multiplatform (KMP) to explore next-generation mobile development workflows.",
    contact: {
        email: "jqn296763005@gmail.com",
        phone: "xxx-xxxx-xxxx",
        github: "https://github.com/andannn",
        website: "https://andannn.github.io/",
        location: "Japan"
    },
    experience: [
        {
            title: "HiThink Japan",
            position: "Application System Engineer",
            startDate: "2023-08",
            endDate: "Present",
            description: "Responsible for cross-platform migration using Flutter and feature implementation for a large-scale mobile service. Contributed to the stable progression of the project through rapid specification understanding and reliable implementation.",
            projects: [
                {
                    name: "d Point App Flutter Migration Project",
                    link: "https://play.google.com/store/apps/details?id=com.nttdocomo.android.dpoint",
                    teamSize: "Team Size: 50",
                    role: "Detailed Design, Implementation",
                    startDate: "2023-08",
                    endDate: "Present",
                    description: [
                        "A large-scale migration project revitalizing existing native apps (Android/Java, iOS/Obj-C) to Flutter.",
                        "**Immediate Impact & Rapid Onboarding:** Despite joining in the later phases, quickly mastered the extensive legacy code and specifications. Successfully delivered complex UI modules without delays, contributing to the project schedule.",
                        "**Technical Risk Mitigation:** Proactively investigated compatibility issues and rendering impacts (Impeller) associated with Flutter version updates. Identified and resolved potential issues beforehand, ensuring a safe update process for a large-scale application."
                    ],
                    techStack: ["Dart/Flutter", "Kotlin/Android", "iOS/Swift"]
                }
            ]
        },
        {
            title: "Neusoft Group (Dalian)",
            position: "Android App Engineer",
            startDate: "2020-08",
            endDate: "2023-08",
            description:
                "Responsible for Android app implementation for smartphone manufacturers. Beyond feature implementation, proposed and championed the adoption of Jetpack Compose, contributing to the efficiency and modernization of UI development.",
            projects: [
                {
                    name: "Xperia 'Photography Pro' Development",
                    link: "https://www.sony.jp/xperia/myxperia/app/photography-pro/?srsltid=AfmBOooH7otyA0OruoAZZLPt0Psz7tLIbrG21LD54owI4-6u9yZvEBzJ",
                    role: "Implementation, Testing",
                    teamSize: "Team Size: 10",
                    startDate: "2020-08",
                    endDate: "2023-01",
                    description: [
                        "**Quality Assurance & Maintenance:** Handled bug fixes and improvements for existing features. Rapidly identified and resolved reported issues, contributing to the stability of a commercial-grade application.",
                        "**UI/UX Feature Implementation:** Implemented the vertical/horizontal UI switching for the 'Pro Mode' on Xperia 1 V. Conducted refactoring of complex legacy code prior to feature addition, achieving a smooth release with minimized bugs."
                    ],
                    techStack: ["Android", "Kotlin/Java", "Jetpack AndroidX"]
                },
                {
                    name: "Xperia 'Video Creator' Development",
                    link: "https://play.google.com/store/apps/details?id=jp.co.sony.mc.videoeditor",
                    role: "Detailed Design, Implementation",
                    teamSize: "Team Size: 6",
                    startDate: "2023-01",
                    endDate: "2023-08",
                    description: [
                        "**Jetpack Compose Proposal & Adoption:** Proposed the adoption of Jetpack Compose to address tight deadlines and a small team size. Reduced boilerplate code and improved development efficiency.",
                        "**Hybrid Architecture Design:** Designed and implemented an architecture that uses the traditional View system for the performance-critical 'Editing Timeline' and Compose for settings/menus, optimizing for the specific characteristics of each framework."
                    ],
                    techStack: ["Jetpack Compose", "Kotlin", "Jetpack AndroidX"]
                }
            ]
        },
        {
            title: "Harbin Institute of Technology",
            position: "Automation Major",
            startDate: "2016-09",
            endDate: "2020-06",
            description: "Research on Image Positioning and Recognition",
            projects: []
        }
    ],
    personalProjects: [
        {
            title: "Flutter Application Development",
            description:
                "Developed practical applications leveraging the efficiency and expressiveness of the cross-platform framework 'Flutter'.",
            projects: [
                {
                    name: "AniFlow - Unofficial AniList Client",
                    link: "https://github.com/andannn/aniflow",
                    description: [
                        "Designed and implemented 'Offline-First' synchronization logic using GraphQL for data fetching and SQLite, assuming network instability.",
                        "Built a reactive UDF (Unidirectional Data Flow) where DB updates automatically propagate to the UI by combining Drift's Stream monitoring with BLoC."
                    ],
                    techStack: ["Flutter", "Dart", "GraphQL", "Bloc", "Drift (SQLite)"]
                }
            ]
        },
        {
            title: "Kotlin Multiplatform (KMP) Research",
            description:
                "Practicing code sharing technologies using Kotlin Multiplatform (KMP) and Compose Multiplatform (CMP).",
            projects: [
                {
                    name: "Melodify - KMP/CMP Music Player",
                    link: "https://github.com/andannn/Melodify",
                    description: [
                        "A project focused on verifying interoperability and implementation patterns when accessing platform-specific APIs directly from KMP.",
                        "Achieved advanced integration of platform-specific features and the cross-platform layer, such as unified handling of Android's Media3 and iOS's AVPlayer."
                    ],
                    techStack: ["Kotlin Multiplatform", "Compose Multiplatform", "Koin", "Media3", "AVPlayer", "Room"]
                },
                {
                    name: "AozoraBooks - Compose Aozora Bunko Reader",
                    link: "https://github.com/andannn/AozoraBooks",
                    description: [
                        "A project aiming to experience the full lifecycle from store release on both Android and iOS platforms to continuous maintenance.",
                        "Constructed custom text rendering logic using low-level APIs to achieve 'Vertical Writing and Ruby (Furigana)' layout, which is not supported by standard Compose."
                    ],
                    techStack: ["Compose Multiplatform", "Kotlin Multiplatform", "Canvas API", "GitHub Actions", "Room"]
                },
                {
                    name: "AniflowKMP - Logic Sharing & Native UI",
                    link: "https://github.com/andannn/AniflowKMP",
                    description: [
                        "A project to verify and compare the practicality of the 'Logic Sharing + Native UI' architecture in KMP.",
                        "Unified Data and Domain layers with Kotlin Multiplatform for high maintainability, while adopting Jetpack Compose (Android) and SwiftUI (iOS) for the UI layer to pursue UX fully optimized for each OS."
                    ],
                    techStack: ["Kotlin Multiplatform", "Jetpack Compose", "SwiftUI", "Ktor", "SqlDelight"]
                }
            ]
        }
    ],
    skills: [
        {
            title: "Languages",
            contents: ["Kotlin", "Dart", "Java", "Swift (Basic)"]
        },
        {
            title: "Frameworks & Libraries",
            contents: [
                "Android",
                "Jetpack Compose",
                "Flutter",
                "Kotlin Multiplatform (KMP)"
            ]
        },
        {
            title: "Tools & CI/CD",
            contents: ["Gradle", "GitHub Actions", "Jenkins", "Gerrit", "Jira", "Android Studio"]
        }
    ],
    languages: ["Chinese (Native)", "Japanese (N1 - Business Level)"]
};

export default resumeData_en;