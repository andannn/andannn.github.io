import { routing } from "@/src/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export function generateMetadata() {
  return "青空読書　プライバシーポリシー"
}


export default async function LegalPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const legalData = await import(
      `@/src/lib/privacy/aozora/legalcontent_${locale}.ts`
  ).then((mod) => mod.default as LegalContent);

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 text-gray-800 bg-white">
      {/* 利用規約 / Terms of Service */}
      <section>
        <h1 className="text-3xl font-bold mb-6">{legalData.termsTitle}</h1>
        <div className="space-y-6">
          {legalData.terms.map((item, index) => (
            <section key={index}>
              <h2 className="text-xl font-semibold whitespace-pre-line">{item.title}</h2>
              <p className="whitespace-pre-line mt-1">{item.content}</p>
            </section>
          ))}
        </div>
      </section>

      {/* プライバシーポリシー / Privacy Policy */}
      <section className="mt-16">
        <h1 className="text-3xl font-bold mb-6">{legalData.privacyTitle}</h1>
        <div className="space-y-6">
          {legalData.privacy.map((item, index) => (
            <section key={index}>
              <h2 className="text-xl font-semibold whitespace-pre-line">{item.title}</h2>
              <p className="whitespace-pre-line mt-1">{item.content}</p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
