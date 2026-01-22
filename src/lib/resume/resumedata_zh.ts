export const resumeData_zh: ResumeData = {
    name: "X XX",
    title: "Android / Flutter 应用程序开发工程师",
    summary:
        "基于 Android (Kotlin) 与 Flutter 的双重开发经验，致力于根据项目特性选择最佳技术栈与架构设计。不仅关注功能实现，更引入多模块架构（Multi-module），重视构建能够支撑长期迭代的“高可维护性代码”。持续追踪 Kotlin Multiplatform (KMP) 等前沿技术动态，旨在通过稳健且灵活的开发方式，为团队和产品的品质提升做出贡献。",
    contact: {
        email: "jqn296763005@gmail.com",
        phone: "xxx-xxxx-xxxx",
        github: "https://github.com/andannn",
        website: "https://andannn.github.io/",
        location: "日本"
    },
    experience: [
        {
            title: "株式会社 HighThink Japan (原信华信)",
            postion: "APSE (应用程序系统工程师)",
            startDate: "2023-08",
            endDate: "Present",
            description:
                "参与拥有 9,000 万会员规模的“dPoint Club”应用的 Flutter 迁移项目。虽在开发后期阶段加入，但迅速掌握现有规格并负责核心功能的实现。",
            projects: [
                {
                    name: "d Point App Flutter 迁移项目",
                    link: "https://play.google.com/store/apps/details?id=com.nttdocomo.android.dpoint",
                    teamSize: "50",
                    role: "开发担当",
                    startDate: "2023-08",
                    endDate: "Present",
                    description: [
                        "负责将现有的原生应用（Android/Java, iOS/Obj-C）迁移至 Flutter 跨平台架构的大型项目。",
                        "大规模团队开发推进：在 50 人规模的项目中，尽管于后期加入，但迅速理解现有代码与业务逻辑，高效完成了 UI 模块的开发任务。",
                        "负责 Flutter 版本更新的技术调研：针对库的兼容性验证、废弃 API 的修正、以及渲染引擎变更（Impeller）带来的影响进行事前调查与特定，确保了大规模应用在版本升级过程中的安全性与稳定性。"
                    ],
                    techStack: ["iOS", "Dart/Flutter", "Kotlin/Android"]
                }
            ]
        },
        {
            title: "东软集团 (大连)",
            postion: "Android 应用开发工程师",
            startDate: "2020-08",
            endDate: "2023-08",
            description:
                "从事面向全球市场的旗舰智能手机（Sony Xperia）原生相机及视频编辑应用的开发。发挥在 Kotlin 现代化 Android 开发方面的优势，在从零开发的新应用中主导引入 Jetpack Compose，为减少开发工时与提升可维护性做出了贡献。",
            projects: [
                {
                    name: "Xperia 专用相机应用《Photography Pro》开发",
                    link: "https://www.sony.jp/xperia/myxperia/app/photography-pro/?srsltid=AfmBOooH7otyA0OruoAZZLPt0Psz7tLIbrG21LD54owI4-6u9yZvEBzJ",
                    role: "实装担当",
                    teamSize: "10",
                    startDate: "2020-08",
                    endDate: "2023-01",
                    description: [
                        "负责 Xperia 旗舰机型的高端相机应用开发。",
                        "光学变焦控制实装：实现了适配 85-125mm 光学变焦镜头的 UI 及变焦控制逻辑。基于硬件规格实现了严密的相机参数同步处理。",
                        "UI/UX 优化：负责 Xperia 1 V 引入的 Pro 模式纵横界面切换功能。构建了与加速度传感器联动的布局动态变更处理，显著提升了作为相机的操作体验。"
                    ],
                    techStack: ["Android", "Kotlin/Java", "Jetpack AndroidX"]
                },
                {
                    name: "Xperia 视频编辑应用《Video Creator》开发",
                    link: "https://play.google.com/store/apps/details?id=jp.co.sony.mc.videoeditor",
                    role: "设计与开发担当",
                    teamSize: "6",
                    startDate: "2023-01",
                    endDate: "2023-08",
                    description: [
                        "参与视频编辑应用的从零构建与发布。",
                        "Jetpack Compose 的提案与引入：针对工期短且人员少的挑战，提议采用 Jetpack Compose 以提高 UI 构建效率。成功减少了样板代码，提升了整体开发速度。",
                        "混合架构设计：设计并实现了“因地制宜”的架构，对需要复杂手势操作和高性能表现的“编辑时间轴”部分沿用传统的 View 系统，而设置与菜单画面则采用 Compose 实现。"
                    ],
                    techStack: ["Compose Android", "Kotlin/Java", "Jetpack AndroidX"]
                }
            ]
        },
        {
            title: "哈尔滨工业大学",
            postion: "自动化专业",
            startDate: "2016-09",
            endDate: "2020-06",
            description: "图像定位与识别的研究",
            projects: []
        }
    ],
    personalProjects: [
        {
            title: "Flutter 应用程序开发",
            description:
                "利用跨平台技术“Flutter”的高效率与表现力，开发具有实用价值的应用程序。",
            projects: [
                {
                    name: "AniFlow - 非官方 AniList 客户端",
                    link: "https://github.com/andannn/aniflow",
                    description: [
                        "利用 AniList API 开发的动画观看记录与管理应用。完全遵循 Material Design 3 规范，通过 Dynamic Color 和 Hero 动画实现了流畅的 UX。",
                        "实现了结合 GraphQL 高效数据获取与 Drift (SQLite) 本地缓存的“离线优先（Offline-First）”设计。状态管理采用 BLoC，构建了稳健的数据流。"
                    ],
                    techStack: ["Flutter", "Dart", "Clean Architecture", "GraphQL", "Bloc", "Drift (SQLite)"]
                }
            ]
        },
        {
            title: "Kotlin Multiplatform (KMP) 技术研究",
            description:
                "在深化 Android 原生开发能力的同时，实践基于 Kotlin Multiplatform (KMP) 和 Compose Multiplatform (CMP) 的代码共享技术。",
            projects: [
                {
                    name: "Melodify - KMP/CMP 音乐播放器",
                    link: "https://github.com/andannn/Melodify",
                    description: [
                        "旨在不受制约地应用并验证最新技术栈与架构模式的项目。",
                        "实现了平台特有功能与跨平台层的高度协同，例如对 Android 的 Media3 和 iOS 的 AVPlayer 进行了统一封装与调用。"
                    ],
                    techStack: ["Kotlin Multiplatform", "Compose Multiplatform", "Circuit", "Koin", "Media3", "Room"]
                },
                {
                    name: "AozoraBooks - Compose 制青空文库阅读器",
                    link: "https://github.com/andannn/AozoraBooks",
                    description: [
                        "旨在完整体验 Android 及 iOS 双平台的应用商店发布流程，以及发布后持续的生产环境运维（Production Maintenance）的项目。",
                        "技术层面，独自实现了 Compose 标准库难以处理的“纵向排版（竖排）”和“注音（Ruby）”渲染引擎，确保了作为电子书阅读器的实用性。",
                        "重点在于构建和运维交付周期（Delivery Cycle），涵盖 CI/CD 自动构建及应用商店审核应对等环节。"
                    ],
                    techStack: ["Compose Multiplatform", "Kotlin Multiplatform", "Canvas API", "GitHub Actions", "Room"]
                },
                {
                    name: "AniflowKMP - 逻辑共享 & 原生 UI",
                    link: "https://github.com/andannn/AniflowKMP",
                    description: [
                        "用于验证和比较 KMP“逻辑共享 + 原生 UI”架构实用性的项目。",
                        "数据层与领域层统一使用 Kotlin Multiplatform 以提升可维护性，UI 层则分别采用 Jetpack Compose (Android) 和 SwiftUI (iOS)，追求各操作系统下极致优化的用户体验（UX）。",
                    ],
                    techStack: ["Kotlin Multiplatform", "Jetpack Compose", "SwiftUI", "Ktor", "SqlDelight/Room"]
                }
            ]
        }
    ],
    skills: [
        {
            title: "平台",
            contents: ["Android", "Flutter", "Kotlin Multiplatform"]
        },
        {
            title: "开发语言",
            contents: ["Java", "Kotlin", "Dart", "Swift (基础)"]
        },
        {
            title: "构建工具",
            contents: ["Gradle", "Jenkins", "GitHub Actions", "Gerrit", "Jira"]
        }
    ],
    languages: ["中文 (母语)", "日语 (N1・商务水平)"]
};

export default resumeData_zh;