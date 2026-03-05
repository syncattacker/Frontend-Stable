import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import Providers from "@/providers";
import { SocketProvider } from "@/sockets/SocketProvider";

export const metadata = {
  title: "gopwnit",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=roundo@300,400&f[]=outfit@200,300&display=swap"
        />
      </head>
      <body>
        <Providers>
          <SocketProvider>{children}</SocketProvider>
          <Toaster position="bottom-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
