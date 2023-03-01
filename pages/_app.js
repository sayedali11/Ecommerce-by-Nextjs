import { SessionProvider, useSession } from "next-auth/react";
import { StoreProvider } from "@/context/Store";
import { useRouter } from "next/router";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css";

function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        <PayPalScriptProvider deferLoading={true}>
          <ThemeProvider attribute="class">
            {Component.auth ? (
              <Auth>
                <Component {...pageProps} />
              </Auth>
            ) : (
              <Component {...pageProps} />
            )}
          </ThemeProvider>
        </PayPalScriptProvider>
      </StoreProvider>
    </SessionProvider>
  );
}

function Auth({ children }) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/unauthorized?message=login required");
    },
  });
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return children;
}
export default App;
