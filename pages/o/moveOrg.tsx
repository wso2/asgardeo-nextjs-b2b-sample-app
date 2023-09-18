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

import { GetServerSidePropsContext } from "next";
import { redirect } from "../../utils/authorization-config-util/authorization-config-util";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (session) {
    if (session.expires || session.error) {
      return redirect("/500");
    } else {
      const orgId = session.orgId;
      const orgName = session.orgName;

      return {
        props: { orgId, orgName },
      };
    }
  } else {
    return redirect("/404");
  }
}

interface MoveOrgProps {
  orgId: string;
}

/**
 *
 * @param prop - orgId
 *
 * @returns Interface to call organization switch function
 */
export default function MoveOrg(props: MoveOrgProps) {
  const { orgId } = props;

  const router = useRouter();

  if (typeof window !== "undefined") {
    router.push(`/o/${orgId}`);
  }
}
