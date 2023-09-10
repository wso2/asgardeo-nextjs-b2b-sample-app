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
