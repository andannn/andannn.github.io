export const resumeData_ja = {
    name: "X XX",
    title: "Android／Flutterアプリ開発エンジニア",
    summary:
        "Androidアプリ開発経験は約5年。Jetpack Composeの活用に精通し、Xperiaフラッグシップ機種向けカメラアプリ開発や、dポイントアプリのFlutterクロスプラットフォーム移行プロジェクトに携わる。Flutterハイブリッド開発の知見と、コード構造や保守性を重視した設計力を持つ。",
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
            title: "APSE（アプリケーションシステムエンジニア）",
            startDate: "2023-08",
            description: [
                "2023年に信華信グループ（大連）に入社し、2024年に日本法人（株式会社ハイシンクジャパン）へ転籍。同一プロジェクト（dポイントアプリ）に継続して携わる。",
                "本プロジェクトを通じてFlutterに初めて触れ、クロスプラットフォーム技術への興味を深め、自主的に学習と実践を進めている。"
            ],
            projects: [
                {
                    name: "dポイントアプリのFlutter移行プロジェクト",
                    link: "https://play.google.com/store/apps/details?id=com.nttdocomo.android.dpoint",
                    teamSize: 50,
                    role: "開発担当",
                    startDate: "2023-08",
                    description: [
                        "既存のAndroid（Java）およびiOS（Objective-C）アプリをFlutterに統合し、クロスプラットフォーム対応を実現。",
                        "プロジェクト後半フェーズで参加し、既存構成の把握とスピーディなキャッチアップを行い、UIモジュール開発を担当。",
                        "FlutterモジュールのAAR依存からソースコード依存に構成を変更する提案を行い、ビルド・デバッグ効率とチームの協業性を大幅に改善。"
                    ],
                    techStack: ["iOS", "Dart/Flutter", "Kotlin/Android"]
                }
            ]
        },
        {
            company: "東軟グループ株式会社",
            title: "Androidアプリエンジニア",
            startDate: "2020-08",
            endDate: "2023-08",
            description: [
                "初めての正社員としての職務。Androidプラットフォーム向けの開発に従事し、業界のベストプラクティスを習得。Kotlinに早期から触れ、現在最も得意とする言語となっている。"
            ],
            projects: [
                {
                    name: "Xperia専用カメラアプリ『Photography Pro』開発",
                    link: "https://www.sony.jp/xperia/myxperia/app/photography-pro/?srsltid=AfmBOooH7otyA0OruoAZZLPt0Psz7tLIbrG21LD54owI4-6u9yZvEBzJ",
                    role: "開発担当",
                    teamSize: 10,
                    startDate: "2020-08",
                    endDate: "2023-01",
                    description: [
                        "Xperiaフラッグシップモデル向けのカメラアプリ開発を担当。",
                        "85-125mmの光学ズームに対応するUIとズーム制御ロジックの実装、カメラパラメータの同期処理を担当。",
                        "Xperia 1Vで導入されたProモードの縦横切替機能の実装を担当し、回転時のレイアウト・操作性最適化を実現。"
                    ],
                    techStack: ["Android", "Kotlin/Java", "Jetpack AndroidX"]
                },
                {
                    name: "Xperia動画編集アプリ『Video Creator』開発",
                    link: "https://play.google.com/store/apps/details?id=jp.co.sony.mc.videoeditor",
                    role: "設計・開発担当",
                    teamSize: 6,
                    startDate: "2023-01",
                    endDate: "2023-08",
                    description: [
                        "Xperia 1V向けの動画編集アプリにおける編集画面を中心に開発を担当。",
                        "開発期間が短く、高難度かつ少人数の体制だったため、一部UIにJetpack Composeを提案・採用し、保守性・開発効率を向上。",
                        "メニュー領域をJetpack Composeで軽量に実装し、編集タイムラインは複雑なジェスチャー対応のため従来のViewで構築。"
                    ],
                    techStack: ["Compose Android", "Kotlin/Java", "Jetpack AndroidX"]
                }
            ]
        },
        {
            company: "ハルビン工業大学",
            title: "自動化専攻",
            startDate: "2016-09",
            endDate: "2020-06",
            description: ["画像位置決めと認識の研究"]
        }
    ],
    personalProjects: [
        {
            name: "AniFlow - 非公式AniListクライアントアプリ",
            link: "https://github.com/andannn/aniflow",
            startDate: "2023-09",
            description: [
                "Flutterで構築したクロスプラットフォーム対応のアニメ視聴管理アプリ。AniList APIを利用し、アニメ作品の検索・評価・お気に入り登録などを実装。",
                "Material Designに準拠したUIおよびダークモード対応、ページング読み込みを実装。AniList公式Webスタイルを参考。",
                "Single Source of TruthとUDFの設計原則に従い、状態管理の保守性と予測性を確保。",
                "初期はsqfliteを使用していたが、Stream API対応のためdriftに移行し、UIとのリアルタイム同期を実現。"
            ],
            techStack: ["Flutter", "Dart", "GraphQL", "Bloc", "Drift/SQLite"]
        },
        {
            name: "Melodify - ローカル音楽プレイヤーアプリ",
            link: "https://github.com/andannn/Melodify",
            startDate: "2023-02",
            description: [
                "KotlinとJetpack Composeの学習目的で開始したローカル音楽プレイヤーアプリ。複数回のリファクタリングを経て、モジュール構成と責務分離を実現。",
                "Room + Flow によるリアクティブなデータ駆動型UI構築。",
                "Kotlin Multiplatform対応のため、HiltからKoinにDIフレームワークを移行。",
                "Compose Multiplatform + Kotlin Multiplatformを導入し、iOS・Desktopへのクロスプラットフォーム対応とコード共有を実現。",
                "Google Circuitライブラリを採用し、ViewModelに依存しない状態管理を構築。"
            ],
            techStack: ["Android", "Compose Multiplatform", "Kotlin Multiplatform", "Media3"]
        }
    ],
    skills: [
        {
            title: "プラットフォーム",
            contents: ["Android", "Flutter"]
        },
        {
            title: "開発言語",
            contents: ["Java", "Kotlin", "Dart"]
        },
        {
            title: "ビルド・ツール",
            contents: ["Gradle", "Jenkins", "GitHub Actions", "Gerrit", "Jira"]
        }
    ],
    languages: ["中国語（ネイティブ）", "日本語（N1・ビジネスレベル）"]
};

export default resumeData_ja;
