import { routing } from '@/src/i18n/routing';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Redircting",
};


export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html>
            <body className="dark:bg-slate-800">
                {children}
            </body>
        </html>
    );
}