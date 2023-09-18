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

import FooterComponent from "./Footer/Footer";

import { useState } from "react";
import NavBar from "./NavBar/NavBar";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps): JSX.Element {
  const [activeKeyNav, setActiveKeyNav] = useState<string | undefined>();
  const activeKeyNavSelect = (eventKey: string | undefined): void => {
    setActiveKeyNav(eventKey);
  };

  return (
    <>
      <div className={"mainDiv"}>
        <NavBar
          activeKeyNav={activeKeyNav}
          activeKeyNavSelect={activeKeyNavSelect}
        />

        <main>{children}</main>
        <FooterComponent />
      </div>
    </>
  );
}

export default Layout;
