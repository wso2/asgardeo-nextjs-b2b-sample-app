import Custom500Component from "../components/common/Custom500Component/ServerError";
import { signOut } from "next-auth/react";

export default function Custom500() {
  const goBack = async (): Promise<void> => await signOut({ callbackUrl: "/" });

  return <Custom500Component goBack={goBack} />;
}
