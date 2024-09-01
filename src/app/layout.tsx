import "./globals.css";
import { Inter } from "next/font/google";
import { WalletProvider } from "@/components/providers/SolanaWalletProvider";
import { Notifier } from "@/components/ux/Notifier";
import { getSession } from "@/lib/session";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { SolanaProvider } from "@/components/providers/SolanaProvider";
import { Metadata } from "next";
import { Navbar } from "@/components/navbar/Navbar";
import { StellarProvider } from "@/components/providers/StellarProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Origin",
  description: "Every commit counts",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en" className={inter.className}>
      <body>
        <WalletProvider>
          <Notifier>
            <SessionProvider session={session}>
              <SolanaProvider>
                <StellarProvider>
                  <Navbar />
                  <div className="p-24">{children}</div>
                </StellarProvider>
              </SolanaProvider>
            </SessionProvider>
          </Notifier>
        </WalletProvider>
      </body>
    </html>
  );
}
