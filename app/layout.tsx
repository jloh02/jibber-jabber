import "./globals.css";
import { Inter } from "next/font/google";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import CredentialContextProvider from "./lib/credentialContext";
config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Jibber Jabber",
  description:
    "A chat application to message friends across Riot Games. This project is NOT affiliated with Riot Games",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CredentialContextProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </CredentialContextProvider>
  );
}
