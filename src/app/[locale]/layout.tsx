import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/src/i18n/routing';
import Navbar from './components/Navbar';
import type { Metadata } from "next";
import "../globals.css";
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
    title: "Andannn",
};


export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // Ensure that the incoming `locale` is valid
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    const t = await getTranslations({ locale: locale });

    return (
        <html lang={locale}>
            <body className="dark:bg-slate-800">
                <NextIntlClientProvider>
                    <Navbar locale={locale} title={'Andannn ' + t('HomePage.blog')} />
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}