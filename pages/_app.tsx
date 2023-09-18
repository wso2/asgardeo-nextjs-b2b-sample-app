/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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
