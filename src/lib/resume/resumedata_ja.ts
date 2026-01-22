export const resumeData_ja: ResumeData = {
    name: "X XX",
    title: "Androidを主軸とするクロスプラットフォームエンジニア",
    summary:
        "Android (Kotlin) およびFlutterにおける、大規模アプリの移行から新規立ち上げまで幅広い開発経験を有しています。プロジェクト要件に応じた最適な技術選定とアーキテクチャ設計を提供できます。特に『保守性の高いコード』にこだわりがあり、Clean Architectureや単方向データフロー(UDF)の実践経験が豊富です。現在はKotlin Multiplatform (KMP) によるロジック共有とネイティブUIの融合を研究し、次世代のモバイル開発フローを探求しています。",
    contact: {
        email: "jqn296763005@gmail.com",
        phone: "xxx-xxxx-xxxx",
        github: "https://github.com/andannn",
        website: "https://andannn.github.io/",
        location: "日本"
    },
    experience: [
        {
            title: "株式会社ハイシンクジャパン",
            position: "APSE（アプリケーションシステムエンジニア）",
            startDate: "2023-08",
            endDate: "Present",
            description: "大規模サービスのモバイルアプリ開発案件にて、Flutterを用いたクロスプラットフォーム移行および機能実装を担当。仕様の早期把握と確実な実装により、プロジェクトの安定的な推進に貢献。",
            projects: [
                {
                    name: "dポイントアプリのFlutter移行プロジェクト",
                    link: "https://play.google.com/store/apps/details?id=com.nttdocomo.android.dpoint",
                    teamSize: "チーム規模: 50名",
                    role: "詳細設計、実装",
                    startDate: "2023-08",
                    endDate: "Present",
                    description: [
                        "既存のネイティブアプリ（Android/Java, iOS/Obj-C）をFlutterへ刷新する、大規模マイグレーション案件。",
                        "**途中参画からの即戦力化:** 後半フェーズからの参加であったが、膨大な既存コードと仕様を迅速に把握。UIモジュールの実装を遅延なく完遂し、プロジェクトの推進に貢献。",
                        "**技術的リスクの解決:** Flutterのバージョン更新に伴うライブラリの互換性や描画への影響を事前に調査。潜在的な問題を未然に特定・解消し、大規模アプリにおける安全なアップデートを実現。"],
                    techStack: ["Dart/Flutter", "Kotlin/Android", "iOS/Swift"]
                }
            ]
        },
        {
            title: "東軟グループ (大連)",
            position: "Androidアプリエンジニア",
            startDate: "2020-08",
            endDate: "2023-08",
            description:
                "スマートフォンメーカー向けの開発案件にて、Androidアプリの実装を担当。機能実装にとどまらず、Jetpack Composeの導入を提案・推進し、UI開発の効率化とモダン化に貢献。"
            ,
            projects: [
                {
                    name: "Xperia専用カメラアプリ『Photography Pro』開発",
                    link: "https://www.sony.jp/xperia/myxperia/app/photography-pro/?srsltid=AfmBOooH7otyA0OruoAZZLPt0Psz7tLIbrG21LD54owI4-6u9yZvEBzJ",
                    role: "実装、テスト",
                    teamSize: "チーム規模: 10名",
                    startDate: "2020-08",
                    endDate: "2023-01",
                    description: [
                        "**品質維持・向上:** 既存機能の改修および不具合修正を担当。報告された事象に対し迅速に原因を特定・修正し、商用アプリとしての動作安定化に貢献。",
                        "**UI/UX機能の実装:** Xperia 1V向けProモードの縦横UI切替を担当。機能追加の前に、複雑な既存コードのリファクタリングを実施。バグを最小限に抑え、スムーズなリリースを実現。"
                    ],
                    techStack: ["Android", "Kotlin/Java", "Jetpack AndroidX"]
                },
                {
                    name: "Xperia動画編集アプリ『Video Creator』開発",
                    link: "https://play.google.com/store/apps/details?id=jp.co.sony.mc.videoeditor",
                    role: "詳細設計、実装",
                    teamSize: "チーム規模: 6名",
                    startDate: "2023-01",
                    endDate: "2023-08",
                    description: [
                        "**Jetpack Composeの導入と提案:** 短納期かつ少人数体制という課題に対し、UI構築の効率化を図るためJetpack Composeの採用を提案。コード量を減らし、開発効率を向上。",
                        "**ハイブリッド構成の設計:** 複雑なジェスチャー操作やパフォーマンスが求められる「編集タイムライン」部分は従来のViewシステムを採用し、設定やメニュー画面にはComposeを採用する適材適所のアーキテクチャを設計・実装。"
                    ],
                    techStack: ["Jetpack Compose", "Kotlin", "Jetpack AndroidX"]
                }
            ]
        },
        {
            title: "ハルビン工業大学",
            position: "自動化専攻",
            startDate: "2016-09",
            endDate: "2020-06",
            description: "画像位置決めと認識の研究",
            projects: []
        }
    ],
    personalProjects: [
        {
            title: "Flutterアプリケーション開発",
            description:
                "クロスプラットフォーム技術「Flutter」の効率性と表現力を活かし、実用的なアプリケーションを開発。",
            projects: [
                {
                    name: "AniFlow - 非公式AniListクライアント",
                    link: "https://github.com/andannn/aniflow",
                    description: [
                        "ネットワーク不安定下での利用を想定し、GraphQLによるデータ取得とSQLiteを連携させた『オフラインファースト』な同期ロジックを設計・実装。",
                        "DriftのStream監視機能とBLoCを組み合わせることで、DBの更新が自動的にUIに流れてくるリアクティブなUDF（単方向データフロー）を構築。"
                    ],
                    techStack: ["Flutter", "Dart", "GraphQL", "Bloc", "Drift (SQLite)"]
                }
            ]
        },
        {
            title: "Kotlin Multiplatform (KMP) 技術の研究",
            description:
                "Kotlin Multiplatform (KMP) および Compose Multiplatform (CMP) によるコード共有技術を実践。",
            projects: [
                {
                    name: "Melodify - KMP/CMP対応 音楽プレイヤー",
                    link: "https://github.com/andannn/Melodify",
                    description: [
                        "KMPからプラットフォーム固有のAPIを直接操作する際の実装パターンや、相互運用性の検証を主眼としたプロジェクト。",
                        "AndroidのMedia3とiOSのAVPlayerを統合的に扱うなど、プラットフォーム固有機能とクロスプラットフォーム層の高度な連携を実現。"
                    ],
                    techStack: ["Kotlin Multiplatform", "Compose Multiplatform", "Koin", "Media3", "AVPlayer", "Room",]
                },
                {
                    name: "AozoraBooks - Compose製 青空文庫リーダー",
                    link: "https://github.com/andannn/AozoraBooks",
                    description: [
                        "AndroidおよびiOS両プラットフォームへのストアリリースと、公開後の継続的な保守運用を一貫して経験することを目的としたプロジェクト。",
                        "Compose標準では非対応の『縦書き・ルビ』を実現するため、低レイヤーAPIを用いた独自のテキスト描画ロジックを構築。"
                    ],
                    techStack: ["Compose Multiplatform", "Kotlin Multiplatform", "Canvas API", "GitHub Actions", "Room"]
                },
                {
                    name: "AniflowKMP - KMPロジック共有 & Native UI",
                    link: "https://github.com/andannn/AniflowKMP",
                    description: [
                        "KMPの「ロジック共有＋ネイティブUI」アーキテクチャの実用性を検証・比較するためのプロジェクト。",
                        "データ層・ドメイン層はKotlin Multiplatformで統一して保守性を高めつつ、UI層にはJetpack Compose (Android) とSwiftUI (iOS) を採用し、各OSに完全に最適化されたUXを追求。",
                    ],
                    techStack: ["Kotlin Multiplatform", "Jetpack Compose", "SwiftUI", "Ktor", "SqlDelight"]
                }
            ]
        }
    ],
    skills: [
        {
            title: "言語",
            contents: ["Kotlin", "Dart", "Java", "Swift (Basic)"]
        },
        {
            title: "フレームワーク・ライブラリ",
            contents: [
                "Android",
                "Jetpack Compose",
                "Flutter",
                "Kotlin Multiplatform (KMP)"
            ]
        },
        {
            title: "ツール・CI/CD",
            contents: ["Gradle", "GitHub Actions", "Jenkins", "Gerrit", "Jira", "Android Studio"]
        }
    ],
    languages: ["中国語（ネイティブ）", "日本語（N1・ビジネスレベル）"]
};

export default resumeData_ja;