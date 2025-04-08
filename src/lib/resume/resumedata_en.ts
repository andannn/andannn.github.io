export  const resumeData_en = {
    name: "X XX",
    title: "Android / Flutter Application Engineer",
    summary:
        "Nearly 5 years of experience in Android application development, skilled in Jetpack Compose. Led the development of camera apps for Xperia flagship models and participated in the cross-platform migration of the dPoint app to Flutter. Experienced in hybrid Flutter architecture with strong understanding of code structure, modularity, and maintainability.",
    contact: {
        email: "jqn296763005@gamil.com",
        phone: "xxx-xxxx-xxxx",
        github: "https://github.com/andannn",
        website: "https://andannn.github.io/",
        location: "Japan"
    },
    experience: [
        {
            company: "Hithink RoyalFlush Group Co., Ltd.",
            title: "Application System Engineer",
            startDate: "2023-08",
            description: [
                "Joined Hithink Group (Dalian) in 2023 and transferred to the Japan branch (Hithink Japan Co., Ltd.) in 2024, continuing to work on the same project (dPoint app).",
                "First encountered Flutter through this project, which sparked a strong interest in cross-platform development and led to continuous self-driven learning and practice."
            ],
            projects: [
                {
                    name: "dPoint Cross-platform App Migration Project",
                    link: "https://play.google.com/store/apps/details?id=com.nttdocomo.android.dpoint",
                    teamSize: 50,
                    role: "Developer",
                    startDate: "2023-08",
                    description: [
                        "Migrated the original dPoint Android (Java) and iOS (OC) apps into a unified Flutter app for cross-platform support.",
                        "Joined during the late phase of the project and quickly ramped up on existing architecture and workflows to contribute UI module implementations.",
                        "Proposed replacing AAR-based Flutter module integration with direct source dependency to improve build speed, collaboration, and debugging experience."
                    ],
                    techStack: ["iOS", "Dart/Flutter", "Kotlin/Android"]
                }
            ]
        },
        {
            company: "Neusoft Corporation",
            title: "Android Application Engineer",
            startDate: "2020-08",
            endDate: "2023-08",
            description: [
                "First full-time role, primarily involved in Android development. Gained familiarity with Android best practices and development standards. Was introduced to Kotlin early in my career, which has since become my favorite language."
            ],
            projects: [
                {
                    name: "Photography Pro – Xperia Camera App",
                    link: "https://www.sony.jp/xperia/myxperia/app/photography-pro/?srsltid=AfmBOooH7otyA0OruoAZZLPt0Psz7tLIbrG21LD54owI4-6u9yZvEBzJ",
                    role: "Developer",
                    teamSize: 10,
                    startDate: "2020-08",
                    endDate: "2023-01",
                    description: [
                        "Developed core camera UI and logic for Xperia flagship models, focusing on optical zoom control and real-time synchronization.",
                        "Implemented Pro mode orientation switching feature for Xperia 1V, enabling responsive UI adaptation based on device rotation."
                    ],
                    techStack: ["Android", "Kotlin/Java", "Jetpack AndroidX"]
                },
                {
                    name: "Video Creator – Xperia Editing App",
                    link: "https://play.google.com/store/apps/details?id=jp.co.sony.mc.videoeditor",
                    role: "Tech Design & Development",
                    teamSize: 6,
                    startDate: "2023-01",
                    endDate: "2023-08",
                    description: [
                        "Led the editing screen implementation for the Xperia 1V editing app project.",
                        "Due to tight deadlines and high complexity, proposed and adopted Jetpack Compose for part of the UI to enhance efficiency and maintainability.",
                        "Menu area was implemented with Jetpack Compose for light UI animation, while timeline editing area remained in classic View due to advanced gesture requirements."
                    ],
                    techStack: ["Compose Android", "Kotlin/Java", "Jetpack AndroidX"]
                }
            ]
        },
        {
            company: "Harbin Institute of Technology",
            title: "Major in Automation",
            startDate: "2016-09",
            endDate: "2020-06",
            description: ["Research on image positioning and recognition"]
        }
    ],
    personalProjects: [
        {
            name: "AniFlow – Unofficial AniList Mobile Client",
            link: "https://github.com/andannn/aniflow",
            startDate: "2023-09",
            description: [
                "A cross-platform anime browsing app built with Flutter, using the AniList GraphQL API to support anime search, rating, and favorites.",
                "Implements dark mode, pagination, and clean Material Design UI inspired by AniList's official web styling.",
                "Designed around Single Source of Truth and Unidirectional Data Flow principles to ensure predictable and maintainable state handling.",
                "Originally used sqflite for local caching and later migrated to drift for reactive UI synchronization via Stream API."
            ],
            techStack: ["Flutter", "Dart", "GraphQL", "Bloc", "Drift/SQLite"]
        },
        {
            name: "Melodify – Local Music Player App",
            link: "https://github.com/andannn/Melodify",
            startDate: "2023-02",
            description: [
                "A local music player app started as a Kotlin and Jetpack Compose learning project, which evolved through several refactors to adopt a modular and maintainable architecture.",
                "Implemented reactive data-driven UI using Room + Flow.",
                "Migrated from Hilt to Koin to enable Kotlin Multiplatform support.",
                "Integrated Compose Multiplatform and Kotlin Multiplatform to support Android, iOS, and Desktop with shared business logic and UI.",
                "Replaced ViewModel-based state management with Google's Circuit library for a more decoupled and clear state flow."
            ],
            techStack: ["Android", "Compose Multiplatform", "Kotlin Multiplatform", "Media3"]
        }
    ],
    skills: [
        {
            title: "Platforms",
            contents: ["Android", "Flutter"]
        },
        {
            title: "Programming Languages",
            contents: ["Java", "Kotlin", "Dart"]
        },
        {
            title: "Build & Toolchain",
            contents: ["Gradle", "Jenkins", "GitHub Actions", "Gerrit", "Jira"]
        }
    ],
    languages: ["Chinese (Native)", "Japanese (JLPT N1, Business Level)"]
};

export default resumeData_en;
