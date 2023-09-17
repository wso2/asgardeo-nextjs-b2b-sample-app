/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { Avatar } from "rsuite";
import { Panel, Stack } from "rsuite";
import Image from "next/image";
import UserGuide from "../../../images/user.png";
import Github from "../../../images/github.png";
import Docs from "../../../images/docs.png";
import { useSession } from "next-auth/react";

/**
 *
 * @returns The home interface section.
 */
export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className={"mainDiv"}>
      <div className={"getStartedSectionComponentGetStartedTextDiv"}>
        <Panel>
          <Stack direction="column" spacing={20} justifyContent="center">
            <Avatar
              circle
              size="lg"
              src="https://avatars.githubusercontent.com/u/15609339"
              alt="@hiyangguo"
              style={{ marginRight: "20px" }}
            />
            <h4>
              Hello&nbsp;
              <strong>
                {session?.user?.name.givenName} {}
                {session?.user?.name.familyName},
              </strong>
            </h4>
            <h5>
              &nbsp; Welcome to the
              <strong> {session?.orgName} </strong>organization !!
            </h5>
            <p className={"getStartedSectionComponentGetStartedTextP"}>
              From here on you can experience the basic business application use
              cases integrated with Asgardeo for B2B organization management.
            </p>
          </Stack>
        </Panel>
      </div>
      <div className={"gridView"}>
        <p>What can we do next? </p>
        <div className={"grid"}>
          <Panel bordered className={"card"}>
            <Image
              alt="github-logo"
              src={Github}
              className={"linkLogoImageSmall"}
              width={35}
            />

            <strong>Github Repository</strong>
            <p>
              Lets go through the application codebase and contribute to our
              Asgardeo React Sample application.
            </p>
            <a
              href="https://github.com/ChanikaRuchini/asgardeo-b2b-nextjs-sample-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Source
            </a>
          </Panel>
          <Panel bordered className={"card"}>
            <Image
              alt="user-guide-logo"
              src={UserGuide}
              className={"linkLogoImageSmall"}
              width={35}
            />
            <strong>User Guide</strong>
            <p>
              Check out our user guide and we will guide you to integrate your
              applications with Asgardeo.
            </p>
            <a
              href="https://docs.google.com/document/d/1-yKHQgQE3-Pj5FRoBdOLf33u1Y41QWzNd3jdR6TVhIQ/edit#heading=h.s1ioojv1wyw6"
              target="_blank"
              rel="noreferrer"
            >
              Learn More
            </a>
          </Panel>

          <Panel bordered className={"card"}>
            <Image
              alt="docs-logo"
              src={Docs}
              className={"linkLogoImageSmall"}
              width={35}
            />
            <strong>Asgardeo Docs</strong>
            <p>
              Read our Docs for the guides to provide the instructions for
              building IAM uses cases.
            </p>
            <a
              href="https://wso2.com/asgardeo/docs/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn More
            </a>
          </Panel>
        </div>
      </div>
    </div>
  );
}
