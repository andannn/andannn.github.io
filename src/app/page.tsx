// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { routing } from '../i18n/routing';

export default function RootRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        let userLang: string;
        const browserLanguage = navigator.language.split("-")[0]
        if (browserLanguage == "en" || browserLanguage == "ja" || browserLanguage == "zh") {
            userLang = browserLanguage
        } else {
            userLang = routing.defaultLocale
        }

        router.replace(`/${userLang}`);
    }, [router]);

    return <p>Redirecting...</p>;
}
