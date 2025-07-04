import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Ces polices sont importées au niveau du serveur
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Les métadonnées doivent être exportées d'un composant serveur
export const metadata: Metadata = {
  title: "TechStore - Votre boutique informatique",
  description: "Découvrez notre sélection de produits informatiques : téléphones, accessoires, PC et composants.",
};

// Import du ClientLayout à partir d'un fichier séparé
import ClientLayout from './client-layout';
import { AuthProvider } from './context/AuthContext';

// Composant principal de layout (côté serveur)
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
