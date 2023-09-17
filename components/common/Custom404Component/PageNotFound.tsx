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

import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { Button, Stack } from "rsuite";
import errorImage from "../../../images/404.svg";

function PageNotFound() {
  const router = useRouter();
  const goBack = () => router.back();

  return (
    <Stack
      className={"errorMainContent"}
      spacing={50}
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Image src={errorImage} width={600} alt="404 image" />

      <Stack
        spacing={25}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <p className={"p"}>
          <b>The page your searching seems to be missing.</b>
          <br />
          You can go back, or contact our <u>Customer Service</u> team if you
          need any help
        </p>

        <Button size="lg" appearance="ghost" onClick={goBack}>
          Go Back
        </Button>
      </Stack>
    </Stack>
  );
}

export default PageNotFound;
