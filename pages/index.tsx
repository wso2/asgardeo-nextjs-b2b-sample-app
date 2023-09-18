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

import Image from "next/image";
import Head from "next/head";
import { orgSignin } from "../utils/authorization-config-util/authorization-config-util";
import FooterComponent from "../components/common/Footer/Footer";
import { Button } from "rsuite";
import logo from "../images/asgardeo-logo-transparent.png";
import nextImage from "../images/next.svg";
import GITHUB_ICON from "../images/github.png";

export default function Home() {
  const handleLogin = () => {
    orgSignin();
  };

  return (
    <>
      <Head>
        <title>Asgardeo + Next.js B2B Sample</title>
        <meta
          name="description"
          content="Application created by create-next-app and next-auth to demostrate Asgardeo + Next.js integration"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={"App"}>
        <div className={"AppHeaderSection"}>
          <div>
            <div className={"container"}>
              <Image
                alt="react-logo"
                src={nextImage}
                width={120}
                className={"nextLogoImageLogo"}
              />
            </div>
            <div className={"headerContainer"}>
              <h1>
                Enhance your application’s IAM capabilities with
                <Image
                  alt="asgardeo-logo"
                  src={logo}
                  width={220}
                  className={"asgardeoLogoImage"}
                />
              </h1>
            </div>
            <p className={"description"}>
              This is a sample application that demostrates B2B organization
              management flow using Asgardeo and next.js
            </p>
            <div className={"buttonContainer"}>
              <Button
                appearance="primary"
                className={"btn"}
                size="md"
                onClick={() => handleLogin()}
              >
                Sign In
              </Button>
            </div>

            <div className={"containerColumn"}>
              <a href="https://github.com/ChanikaRuchini/asgardeo-b2b-nextjs-sample-app">
                <Image
                  src={GITHUB_ICON}
                  className={"linkLogoImageSmall"}
                  alt="github-logo"
                  width={35}
                />
              </a>
              <a href="https://github.com/ChanikaRuchini/asgardeo-b2b-nextjs-sample-app">
                <b>Explore the source code</b>
              </a>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </>
  );
}
