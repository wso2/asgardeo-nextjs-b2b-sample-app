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
