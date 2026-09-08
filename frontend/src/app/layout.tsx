import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from '@/components/Navigation';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClarifAI | AI Decision Explainer for Loan/Scholarship Approval",
  description: "Explainable AI + fairness consideration",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{ __html: `tailwind.config = { darkMode: "class", theme: { extend: { "colors": { "on-primary-fixed": "#0f0069", "on-primary": "#ffffff", "on-tertiary-container": "#7ef1c2", "on-tertiary": "#ffffff", "on-error-container": "#93000a", "on-surface-variant": "#464555", "on-background": "#161b2d", "tertiary": "#00533b", "surface-variant": "#dee1fb", "tertiary-fixed": "#86f8c9", "on-tertiary-fixed-variant": "#00513a", "secondary-fixed-dim": "#c5c0ff", "on-primary-container": "#dad7ff", "surface-container-low": "#f3f2ff", "on-secondary-container": "#33288d", "surface": "#fbf8ff", "on-error": "#ffffff", "on-tertiary-fixed": "#002115", "surface-tint": "#4d44e3", "primary-fixed": "#e2dfff", "on-secondary-fixed-variant": "#41379b", "surface-container": "#ececff", "on-secondary-fixed": "#140067", "inverse-primary": "#c3c0ff", "surface-container-lowest": "#ffffff", "secondary": "#5951b4", "on-primary-fixed-variant": "#3323cc", "surface-bright": "#fbf8ff", "inverse-on-surface": "#f0efff", "primary-container": "#4f46e5", "background": "#fbf8ff", "inverse-surface": "#2b2f43", "on-secondary": "#ffffff", "surface-dim": "#d6d8f2", "surface-container-high": "#e4e7ff", "surface-container-highest": "#dee1fb", "tertiary-container": "#006e4f", "primary-fixed-dim": "#c3c0ff", "on-surface": "#161b2d", "outline": "#777587", "error-container": "#ffdad6", "secondary-fixed": "#e4dfff", "error": "#ba1a1a", "outline-variant": "#c7c4d8", "secondary-container": "#9f97ff", "tertiary-fixed-dim": "#68dbae", "primary": "#3525cd" }, "borderRadius": { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" }, "spacing": { "space-3xl": "4rem", "space-2xs": "0.25rem", "space-md": "1rem", "space-sm": "0.75rem", "space-lg": "1.5rem", "max-content-width": "1200px", "container-padding-tablet": "1.5rem", "container-padding-desktop": "2.5rem", "space-xs": "0.5rem", "container-padding-mobile": "1rem", "space-2xl": "3rem", "space-xl": "2rem" }, "fontFamily": { "body-md": [ "Inter" ], "label-lg": [ "Inter" ], "body-lg": [ "Inter" ], "headline-lg-mobile": [ "Manrope" ], "headline-sm": [ "Manrope" ], "display-hero-mobile": [ "Manrope" ], "label-md": [ "Inter" ], "code-metric": [ "Inter" ], "headline-lg": [ "Manrope" ], "display-hero": [ "Manrope" ], "body-sm": [ "Inter" ], "headline-md": [ "Manrope" ], "label-caps": [ "Inter" ] }, "fontSize": { "body-md": [ "14px", { "lineHeight": "22px", "letterSpacing": "0em", "fontWeight": "400" } ], "label-lg": [ "14px", { "lineHeight": "20px", "letterSpacing": "0.01em", "fontWeight": "600" } ], "body-lg": [ "16px", { "lineHeight": "26px", "letterSpacing": "-0.005em", "fontWeight": "400" } ], "headline-lg-mobile": [ "24px", { "lineHeight": "32px", "letterSpacing": "-0.015em", "fontWeight": "700" } ], "headline-sm": [ "18px", { "lineHeight": "26px", "letterSpacing": "-0.01em", "fontWeight": "600" } ], "display-hero-mobile": [ "32px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "800" } ], "label-md": [ "12px", { "lineHeight": "16px", "letterSpacing": "0.02em", "fontWeight": "600" } ], "code-metric": [ "13px", { "lineHeight": "18px", "letterSpacing": "-0.01em", "fontWeight": "500" } ], "headline-lg": [ "32px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700" } ], "display-hero": [ "48px", { "lineHeight": "56px", "letterSpacing": "-0.03em", "fontWeight": "800" } ], "body-sm": [ "12px", { "lineHeight": "18px", "letterSpacing": "0.005em", "fontWeight": "400" } ], "headline-md": [ "24px", { "lineHeight": "32px", "letterSpacing": "-0.015em", "fontWeight": "700" } ], "label-caps": [ "11px", { "lineHeight": "14px", "letterSpacing": "0.06em", "fontWeight": "700" } ] } } } }` }} />
      </head>
      <body className="min-h-full flex flex-col">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
