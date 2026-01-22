export const resumeData_zh: ResumeData = {
    name: "X XX",
    title: "以 Android 为核心的跨平台工程师",
    summary:
        "在 Android (Kotlin) 和 Flutter 领域拥有丰富的开发经验，涵盖从大规模应用迁移到从零构建新产品的全过程。能够根据项目需求提供最佳的技术选型和架构设计。特别注重“高可维护性代码”，在 Clean Architecture 和单向数据流 (UDF) 方面有丰富的实践经验。目前致力于研究通过 Kotlin Multiplatform (KMP) 实现逻辑共享与原生 UI 的融合，探索下一代移动端开发流程。",
    contact: {
        email: "jqn296763005@gmail.com",
        phone: "xxx-xxxx-xxxx",
        github: "https://github.com/andannn",
        website: "https://andannn.github.io/",
        location: "日本"
    },
    experience: [
        {
            title: "HiThink Japan",
            position: "APSE (应用程序系统工程师)",
            startDate: "2023-08",
            endDate: "Present",
            description: "负责大规模移动端服务的 Flutter 跨平台迁移及功能开发。通过快速掌握业务需求和扎实的代码实现，为项目的稳定推进做出了贡献。",
            projects: [
                {
                    name: "d Point App Flutter 迁移项目",
                    link: "https://play.google.com/store/apps/details?id=com.nttdocomo.android.dpoint",
                    teamSize: "团队规模: 50人",
                    role: "详细设计、开发",
                    startDate: "2023-08",
                    endDate: "Present",
                    description: [
                        "将现有原生应用 (Android/Java, iOS/Obj-C) 重构为 Flutter 跨平台架构的大规模迁移项目。",
                        "**中途加入并快速形成战力:** 虽在项目后期加入，但迅速掌握了庞大的现有代码库和规格说明。无延误地完成了复杂 UI 模块的开发，有力保障了项目进度。",
                        "**技术风险化解:** 提前调研 Flutter 版本更新带来的库兼容性及渲染引擎 (Impeller) 影响。预先识别并消除了潜在隐患，确保了大规模应用的安全升级。"
                    ],
                    techStack: ["Dart/Flutter", "Kotlin/Android", "iOS/Swift"]
                }
            ]
        },
        {
            title: "东软集团 (大连)",
            position: "Android 应用工程师",
            startDate: "2020-08",
            endDate: "2023-08",
            description:
                "负责智能手机厂商的 Android 应用开发。不仅完成了功能实现，更主动提案并推动了 Jetpack Compose 的引入，为 UI 开发效率的提升和技术现代化做出了贡献。",
            projects: [
                {
                    name: "Xperia 专用相机应用『Photography Pro』开发",
                    link: "https://www.sony.jp/xperia/myxperia/app/photography-pro/?srsltid=AfmBOooH7otyA0OruoAZZLPt0Psz7tLIbrG21LD54owI4-6u9yZvEBzJ",
                    role: "开发、测试",
                    teamSize: "团队规模: 10人",
                    startDate: "2020-08",
                    endDate: "2023-01",
                    description: [
                        "**质量维护与提升:** 负责现有功能的改进及 Bug 修复。针对报告的问题迅速定位并修复，为商用级应用的运行稳定性做出贡献。",
                        "**UI/UX 功能开发:** 负责 Xperia 1 V Pro 模式下的横竖屏 UI 切换功能。在添加新功能前，对复杂的遗留代码进行了重构，通过夯实基础实现了低 Bug 率的平滑发布。"
                    ],
                    techStack: ["Android", "Kotlin/Java", "Jetpack AndroidX"]
                },
                {
                    name: "Xperia 视频编辑应用『Video Creator』开发",
                    link: "https://play.google.com/store/apps/details?id=jp.co.sony.mc.videoeditor",
                    role: "详细设计、开发",
                    teamSize: "团队规模: 6人",
                    startDate: "2023-01",
                    endDate: "2023-08",
                    description: [
                        "**Jetpack Compose 的提案与导入:** 针对工期紧、人数少的挑战，提议引入 Jetpack Compose 以提高 UI 构建效率。成功减少了样板代码，提升了开发速度。",
                        "**混合架构设计:** 设计并实现了因地制宜的混合架构：对性能要求极高的“编辑时间轴”部分采用传统 View 系统，而设置和菜单页面采用 Compose，兼顾了性能与开发效率。"
                    ],
                    techStack: ["Jetpack Compose", "Kotlin", "Jetpack AndroidX"]
                }
            ]
        },
        {
            title: "哈尔滨工业大学",
            position: "自动化专业",
            startDate: "2016-09",
            endDate: "2020-06",
            description: "图像定位与识别研究",
            projects: []
        }
    ],
    personalProjects: [
        {
            title: "Flutter 应用程序开发",
            description:
                "利用跨平台技术 Flutter 的高效性和表现力，开发具有实用价值的应用程序。",
            projects: [
                {
                    name: "AniFlow - 非官方 AniList 客户端",
                    link: "https://github.com/andannn/aniflow",
                    description: [
                        "设计并实现了基于 GraphQL 和 SQLite 的“离线优先”同步逻辑，确保在网络不稳定环境下依然可用。",
                        "结合 Drift 的 Stream 监听功能与 BLoC，构建了数据库更新自动流向 UI 的响应式 UDF (单向数据流) 架构。"
                    ],
                    techStack: ["Flutter", "Dart", "GraphQL", "Bloc", "Drift (SQLite)"]
                }
            ]
        },
        {
            title: "Kotlin Multiplatform (KMP) 技术研究",
            description:
                "实践基于 Kotlin Multiplatform (KMP) 和 Compose Multiplatform (CMP) 的代码共享技术。",
            projects: [
                {
                    name: "Melodify - KMP/CMP 音乐播放器",
                    link: "https://github.com/andannn/Melodify",
                    description: [
                        "重点验证从 KMP 直接操作各平台原生 API 时的实现模式及互操作性。",
                        "实现了 Android Media3 和 iOS AVPlayer 的统一封装，达成了平台特有功能与跨平台层的高度协作。"
                    ],
                    techStack: ["Kotlin Multiplatform", "Compose Multiplatform", "Koin", "Media3", "AVPlayer", "Room"]
                },
                {
                    name: "AozoraBooks - Compose 制青空文库阅读器",
                    link: "https://github.com/andannn/AozoraBooks",
                    description: [
                        "旨在完整体验从 Android/iOS 双平台应用商店发布到上线后持续维护的全过程。",
                        "为实现 Compose 标准库不支持的“竖排文本与注音 (Ruby)”，利用底层 Canvas API 构建了自定义文本绘制逻辑。"
                    ],
                    techStack: ["Compose Multiplatform", "Kotlin Multiplatform", "Canvas API", "GitHub Actions", "Room"]
                },
                {
                    name: "AniflowKMP - KMP 逻辑共享 & 原生 UI",
                    link: "https://github.com/andannn/AniflowKMP",
                    description: [
                        "旨在验证“KMP 逻辑共享 + 原生 UI”架构实用性的对比项目。",
                        "数据层与领域层使用 Kotlin Multiplatform 统一以提高可维护性，UI 层分别采用 Jetpack Compose (Android) 和 SwiftUI (iOS)，追求各平台极致的原生 UX 体验。"
                    ],
                    techStack: ["Kotlin Multiplatform", "Jetpack Compose", "SwiftUI", "Ktor", "SqlDelight"]
                }
            ]
        }
    ],
    skills: [
        {
            title: "编程语言",
            contents: ["Kotlin", "Dart", "Java", "Swift (Basic)"]
        },
        {
            title: "框架与库",
            contents: [
                "Android",
                "Jetpack Compose",
                "Flutter",
                "Kotlin Multiplatform (KMP)"
            ]
        },
        {
            title: "工具与 CI/CD",
            contents: ["Gradle", "GitHub Actions", "Jenkins", "Gerrit", "Jira", "Android Studio"]
        }
    ],
    languages: ["中文 (母语)", "日语 (N1·商务水平)"]
};

export default resumeData_zh;