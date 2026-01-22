export const resumeData_en: ResumeData = {
    name: "X XX",
    title: "Android / Flutter Application Engineer",
    summary:
        "Building upon extensive development experience in both Android (Kotlin) and Flutter, I prioritize selecting optimal technologies and architectural designs tailored to project characteristics. Beyond feature implementation, I emphasize writing 'highly maintainable code' by adopting multi-module architectures to withstand long-term operation. I continuously strive to master the latest trends, such as KMP, aiming to contribute to team and product quality through robust yet flexible development.",
    contact: {
        email: "jqn296763005@gmail.com",
        phone: "xxx-xxxx-xxxx",
        github: "https://github.com/andannn",
        website: "https://andannn.github.io/",
        location: "Japan"
    },
    experience: [
        {
            title: "Hi-Think Japan",
            postion: "APSE (Application System Engineer)",
            startDate: "2023-08",
            endDate: "Present",
            description:
                "Participated in the Flutter migration project for the 'd Point Club' app, which boasts 90 million members. Although joining in the later phase, I quickly grasped the specifications and took charge of implementation.",
            projects: [
                {
                    name: "d Point App Flutter Migration Project",
                    link: "https://play.google.com/store/apps/details?id=com.nttdocomo.android.dpoint",
                    teamSize: "50",
                    role: "Developer",
                    startDate: "2023-08",
                    endDate: "Present",
                    description: [
                        "A large-scale project migrating existing native apps (Android/Java, iOS/Obj-C) to a cross-platform configuration using Flutter.",
                        "Large-scale Team Development: In a 50-person project, quickly caught up with existing code and specifications despite joining late, and successfully implemented UI modules.",
                        "Technical Investigation for Flutter Updates: Conducted impact analysis for library compatibility, deprecated API fixes, and rendering engine changes (Impeller), ensuring safe execution of update operations for the large-scale application."
                    ],
                    techStack: ["iOS", "Dart/Flutter", "Kotlin/Android"]
                }
            ]
        },
        {
            title: "Neusoft Group (Dalian)",
            postion: "Android Application Engineer",
            startDate: "2020-08",
            endDate: "2023-08",
            description:
                "Engaged in the development of genuine camera and video editing apps for global flagship smartphones (Sony Xperia). Leveraged strong expertise in modern Android development using Kotlin to propose and lead the adoption of Jetpack Compose in new app development, contributing to reduced development man-hours and improved maintainability.",
            projects: [
                {
                    name: "Xperia Camera App 'Photography Pro' Development",
                    link: "https://www.sony.jp/xperia/myxperia/app/photography-pro/?srsltid=AfmBOooH7otyA0OruoAZZLPt0Psz7tLIbrG21LD54owI4-6u9yZvEBzJ",
                    role: "Implementation Lead",
                    teamSize: "10",
                    startDate: "2020-08",
                    endDate: "2023-01",
                    description: [
                        "Developed the high-end camera application for Xperia flagship models.",
                        "Optical Zoom Control: Implemented UI and logic for 85-125mm optical zoom lenses. Achieved strict camera parameter synchronization based on hardware specifications.",
                        "UI/UX Optimization: Implemented the portrait/landscape interface switching feature for 'Pro Mode' introduced in Xperia 1 V. Built dynamic layout changes linked to the accelerometer to enhance operability."
                    ],
                    techStack: ["Android", "Kotlin/Java", "Jetpack AndroidX"]
                },
                {
                    name: "Xperia Video Editor 'Video Creator' Development",
                    link: "https://play.google.com/store/apps/details?id=jp.co.sony.mc.videoeditor",
                    role: "Design & Development",
                    teamSize: "6",
                    startDate: "2023-01",
                    endDate: "2023-08",
                    description: [
                        "Participated in the launch of a new video editing application.",
                        "Jetpack Compose Proposal & Adoption: Proposed Compose to improve UI construction efficiency for a project with short deadlines and a small team. Reduced boilerplate code and accelerated development speed.",
                        "Hybrid Architecture Design: Designed and implemented a 'right tool for the right job' architecture, using the traditional View system for the 'Timeline' area requiring complex gesture handling and performance, while using Compose for settings and menus."
                    ],
                    techStack: ["Compose Android", "Kotlin/Java", "Jetpack AndroidX"]
                }
            ]
        },
        {
            title: "Harbin Institute of Technology",
            postion: "Automation",
            startDate: "2016-09",
            endDate: "2020-06",
            description: "Research on image positioning and recognition",
            projects: []
        }
    ],
    personalProjects: [
        {
            title: "Flutter Application Development",
            description:
                "Additionally, actively tracking the latest framework trends (Master Channel) through experimental projects to anticipate future technical trends.",
            projects: [
                {
                    name: "AniFlow - Unofficial AniList Client",
                    link: "https://github.com/andannn/aniflow",
                    description: [
                        "An anime tracking and management app utilizing the AniList API. Fully compliant with Material Design 3, achieving a fluid UX using Dynamic Color and Hero animations.",
                        "Implemented an 'Offline-First' design combining efficient data fetching via GraphQL with local caching via Drift (SQLite). Adopted BLoC for strict state management to build robust data flow."
                    ],
                    techStack: ["Flutter", "Dart", "Clean Architecture", "GraphQL", "Bloc", "Drift (SQLite)"]
                }
            ]
        },
        {
            title: "Kotlin Multiplatform (KMP) Research",
            description:
                "In addition to deepening Android Native skills, practicing code sharing technologies using Kotlin Multiplatform (KMP) and Compose Multiplatform (CMP).",
            projects: [
                {
                    name: "Melodify - KMP/CMP Music Player",
                    link: "https://github.com/andannn/Melodify",
                    description: [
                        "A project aimed at applying and verifying the latest tech stacks and architectural patterns without constraints.",
                        "Achieved high-level coordination between platform-specific features and the cross-platform layer, such as integrally handling Android's Media3 and iOS's AVPlayer."
                    ],
                    techStack: ["Kotlin Multiplatform", "Compose Multiplatform", "Koin", "Media3", "Room"]
                },
                {
                    name: "AozoraBooks - Compose Aozora Bunko Reader",
                    link: "https://github.com/andannn/AozoraBooks",
                    description: [
                        "A project aiming to experience the full cycle of store release and continuous production maintenance for both Android and iOS platforms.",
                        "Technically, achieved practicality as an e-book viewer by custom-implementing 'vertical writing' (Tategaki) and 'Ruby' rendering, which are difficult with standard Compose.",
                        "Focused on building and operating the delivery cycle, including automated builds via CI/CD and handling store review processes."
                    ],
                    techStack: ["Compose Multiplatform", "Kotlin Multiplatform", "Canvas API", "GitHub Actions", "Room"]
                },
                {
                    name: "AniflowKMP - Shared Logic & Native UI",
                    link: "https://github.com/andannn/AniflowKMP",
                    description: [
                        "A project to verify and compare the practicality of the KMP 'Shared Logic + Native UI' architecture.",
                        "Unified Data and Domain layers with Kotlin Multiplatform to enhance maintainability, while adopting Jetpack Compose (Android) and SwiftUI (iOS) for the UI layer to pursue UX fully optimized for each OS.",
                    ],
                    techStack: ["Kotlin Multiplatform", "Jetpack Compose", "SwiftUI", "Ktor", "SqlDelight/Room"]
                }
            ]
        }
    ],
    skills: [
        {
            title: "Platforms",
            contents: ["Android", "Flutter", "Kotlin Multiplatform"]
        },
        {
            title: "Languages",
            contents: ["Java", "Kotlin", "Dart", "Swift (Basic)"]
        },
        {
            title: "Build Tools",
            contents: ["Gradle", "Jenkins", "GitHub Actions", "Gerrit", "Jira"]
        }
    ],
    languages: ["Chinese (Native)", "Japanese (JLPT N1 - Business Level)"]
};

export default resumeData_en;