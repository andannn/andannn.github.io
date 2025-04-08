export const resumeData_zh: ResumeData = {
    name: "X XX",
    title: "Android / Flutter Application Engineer",
    summary: "拥有近5年Android应用开发经验，熟悉Jetpack Compose组件。曾主导Xperia旗舰机型App开发，参与dポイント跨平台重构项目，熟悉Flutter混合开发架构。具有良好的代码结构意识与项目适应能力，擅长跨平台客户端开发与工程结构优化。",
    contact: {
        email: "jqn296763005@gamil.com",
        phone: "xxx-xxxx-xxxx",
        github: "https://github.com/andannn",
        website: "https://andannn.github.io/",
        location: "日本"
    },
    experience: [
        {
            company: "信華信技術股份有限公司",
            title: "应用系统工程师",
            startDate: "2023-08",
            description: [
                "2023年入职信華信集团(大连)，2024年调动至日本（株式会社ハイシンクジャパン），继续参与同一项目dPoint App开发。",
                "首次接触Flutter，逐步建立对跨平台技术的兴趣，并积极投入学习与实践。"
            ],
            projects: [
                {
                    name: "dPoint双端App迁移Flutter项目",
                    link: "https://play.google.com/store/apps/details?id=com.nttdocomo.android.dpoint",
                    teamSize: 50,
                    role: "开发",
                    description: [
                        "将dポイント原生Android（Java）与iOS（OC）项目统一迁移至Flutter，实现跨平台开发。",
                        "项目后期加入dポイント应用的Flutter化重构团队。在项目架构已定、开发进度紧张的情况下，快速熟悉既有代码与流程，该经历锻炼了我在复杂项目的快速适应与问题分析能力。",
                        "提案将最开始的module集成改为以源码依赖主工程，简化了构建流程、加快了开发迭代速度，并提升了调试与模块协作效率。该结构调整对团队整体开发效率带来了显著提升。"
                    ],
                    startDate: "2023-08",
                    techStack: [
                        "iOS",
                        "Dart/Flutter",
                        "Kotlin/Android",
                    ],
                },
            ],
        },
        {
            company: "东软集团股份有限公司",
            title: "Android 开发工程师",
            startDate: "2020-08",
            endDate: "2023-08",
            description: [
                "第一份正式工作，主要参与Android平台开发，逐步掌握Android开发规范与业界最佳实践。尤其是在我还是一个编程小白的时候就接触到了Kotlin，它也因此成为了我最喜欢的语言。"
            ],
            projects: [
                {
                    name: "Xperia专用的Photo App Photography Pro开发",
                    link: "https://www.sony.jp/xperia/myxperia/app/photography-pro/?srsltid=AfmBOooH7otyA0OruoAZZLPt0Psz7tLIbrG21LD54owI4-6u9yZvEBzJ",
                    role: "开发",
                    teamSize: 10,
                    description: [
                        "担当Xperia旗舰机型的连续光学变焦功能适配与UI实现，支持85-125mm物理焦段的实时变焦控制，优化焦距平滑过渡与相机参数同步。",
                        "担当Xperia 1V旗舰机导入的Pro模式横竖屏切换功能，实现UI在拍摄方向变更时的自适应布局与交互优化。",
                    ],
                    startDate: "2020-08",
                    endDate: "2023-01",
                    techStack: ["Android", "Kotlin/Java", "Jetpack Androidx"],
                },
                {
                    name: "动画编辑App Video Creator开发",
                    link: "https://play.google.com/store/apps/details?id=jp.co.sony.mc.videoeditor",
                    role: "技术设计+开发",
                    teamSize: 6,
                    description: [
                        "面向Xperia 1V旗舰机型的动画编辑App，主要负责编辑画面的开发。",
                        "由于项目工期紧、难度高、开发人员有限，主动提出采用 Jetpack Compose 实现部分 UI，以提升开发效率与可维护性。",
                        "为提升开发效率与 UI 表现，Menu 区域使用 Jetpack Compose 编写，轻量实现动画与交互；而编辑轴部分因交互复杂，采用传统 View 实现，支持多点手势与时间轴动态展示。",
                    ],
                    startDate: "2023-01",
                    endDate: "2023-08",
                    techStack: ["Compose Android", "Kotlin/Java", "Jetpack Androidx"],
                }
            ],
        },
        {
            company: "哈尔滨工业大学",
            title: "自动化专业",
            startDate: "2016-09",
            endDate: "2020-06",
            description: ["图像定位与识别研究"],
            projects: [],
        }
    ],
    personalProjects: [
        {
            name: "AniFlow- 面向 [AniList](https://anilist.co) 的非官方移动客户端",
            link: "https://github.com/andannn/aniflow",
            description: [
                "使用 Flutter 构建的跨平台番剧浏览应用，基于 AniList API 实现作品查询、搜索、收藏等功能。",
                "支持深色模式、分页加载与简洁的 Material Design UI，整体设计风格参考 AniList 官方网页。",
                "项目遵循 Single Source of Truth（状态唯一来源）与 UDF（单向数据流）架构原则，提升了状态管理的可维护性与可预测性。",
                "初期使用 sqflite 实现本地缓存，后期迁移至 drift 数据库，借助其内建的 Stream API 支持，实现数据变化自动通知 UI，提升了响应式架构的简洁性与一致性。"
            ],
            startDate: "2023-09",
            techStack: ["Flutter", "Dart", "GraphQL", "Bloc", "Drift/Sqlite3"]
        },
        {
            name: "Melodify- 本地音乐播放器项目",
            link: "https://github.com/andannn/Melodify",
            description: [
                "本项目最初为学习 Kotlin 与 Jetpack Compose 而创建，随着理解的深入，项目经历了多次重构，逐步实现结构模块化与职责分离，显著提升了整体的可维护性与可扩展性。",
                "数据层引入 Room 数据库，并结合其 Flow API 实现数据变化自动通知 UI，构建响应式的数据驱动架构。",
                "为引入 Kotlin Multiplatform，将原有的依赖注入框架 Hilt（Dagger）迁移至支持多平台的 Koin。",
                "全面引入 Kotlin Multiplatform + Compose Multiplatform，拓展支持 iOS 与 Desktop 平台，实现业务逻辑与 UI 的代码共享，提升了跨平台开发效率。",
                "用 Jetpack Compose 生态中的Circuit库，替换官方 ViewModel 状态管理方案，以实现更清晰的状态流转与界面解耦。虽然该库尚未广泛普及，但其状态管理模型契合我对可维护性与架构清晰度的追求。"
            ],
            startDate: "2023-02",
            techStack: ["Android", "Compose Multiplatform", "Kotlin Multiplatform", "Media3"]
        },
    ],
    skills: [
        {
            title: "平台",
            contents: [
                "Android",
                "Flutter",
            ]
        },
        {
            title: "编程语言",
            contents: [
                "Java",
                "Kotlin",
                "Dart",
            ]
        },
        {
            title: "构建与工具链",
            contents: [
                "Gradle",
                "Jenkins",
                "Github Actions",
                "Gerrit",
                "Jira",
            ]
        },
    ],
    languages: [
        "中文（母语/Native）",
        "日语（N1，商务流利）"
    ]
}

export default resumeData_zh;