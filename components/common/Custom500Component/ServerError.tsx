import Image from "next/image";
import React, { MouseEventHandler } from "react";
import { Button, Stack } from "rsuite";
import errorImage from "../../../images/500.svg";

export interface Custom500ComponentProps {
  goBack: MouseEventHandler<HTMLElement>;
}

function ServerError(prop: Custom500ComponentProps) {
  const { goBack } = prop;

  return (
    <Stack
      className={"errorMainContent"}
      spacing={50}
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Image src={errorImage} width={500} alt="404 image" />

      <Stack
        spacing={25}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <p className={"p"}>
          <b>It looks like you have been inactive for a long time.</b>
          <br />
          When you click on <i>Go back</i>, we will try to recover the session
          if it exists.
          <br />
          If you don&apos;t have an active session, you will be redirected to
          the login page.
        </p>
        <Button size="lg" appearance="ghost" onClick={goBack}>
          Go Back
        </Button>
      </Stack>
    </Stack>
  );
}

export default ServerError;
