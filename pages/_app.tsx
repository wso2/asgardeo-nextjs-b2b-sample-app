import { AppProps } from "next/app";
import "rsuite/dist/rsuite.min.css";
import "./../styles/custom-theme.less";
import "./../styles/Global.css";
import { SessionProvider, useSession } from "next-auth/react";
import { NextComponentType } from "next";
import { orgSignin } from "../utils/authorization-config-util/authorization-config-util";
import { useEffect } from "react";
import Layout from "../components/common/Layout";
import { useRouter } from "next/router";

type CustomAppProps = AppProps & {
  Component: NextComponentType & { auth?: boolean };
};

export default function App({ Component, pageProps }: CustomAppProps) {
  const router = useRouter();
  return (
    <SessionProvider session={pageProps.session}>
      {Component.auth ? (
        <Auth routerQuery={router.query.id}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
}

function Auth({
  children,
  routerQuery,
}: {
  children: React.ReactNode;
  routerQuery: any;
}) {
  const { data: session, status } = useSession();
  const isUser = !!session?.user;
  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!isUser) orgSignin(routerQuery); // If not authenticated, force log in
  }, [isUser, status]);

  if (isUser) {
    return <>{children}</>;
  }

  return <div></div>;
}
