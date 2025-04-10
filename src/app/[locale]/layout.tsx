import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/src/i18n/routing';
import Navbar from './components/Navbar';
import type { Metadata } from 'next';
import '../globals.css';
import { getTranslations } from 'next-intl/server';
import 'highlight.js/styles/github-dark.css';

export const metadata: Metadata = {
  title: 'Andannn',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale });

  return (
    <html lang={locale} className="dark">
      <body className="bg-gray-50 text-slate-800 dark:bg-slate-900 dark:text-white transition-colors duration-300">
        <NextIntlClientProvider locale={locale}>
          <Navbar locale={locale} title={'Andannn ' + t('HomePage.blog')} />
          <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
