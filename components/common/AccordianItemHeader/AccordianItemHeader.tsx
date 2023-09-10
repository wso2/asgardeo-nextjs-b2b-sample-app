import { random_rgba } from "../../../utils/util-common/common";
import Image from "next/image";
import { Avatar, Stack } from "rsuite";

interface AccordianItemHeaderProps {
  title: string;
  description: string;
  imageSrc?: string;
}

/**
 *
 * @param prop - `title`, `description`, `imageSrc`
 *
 * @returns header componet for items in an accordian
 */
function AccordianItemHeader(prop: AccordianItemHeaderProps) {
  const { title, description, imageSrc } = prop;

  return (
    <Stack>
      <Stack spacing={20}>
        <Avatar
          size="lg"
          alt="IDP image"
          style={
            imageSrc
              ? { background: "rgba(255,0,0,0)" }
              : { background: `${random_rgba()}` }
          }
        >
          <>
            {imageSrc ? (
              <Image src={imageSrc} alt="idp image" width={50} />
            ) : null}
            {title ? title.charAt(0) : null}
          </>
        </Avatar>
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="stretch"
        >
          <h5>{title}</h5>
          <p>{description ? description : ""}</p>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default AccordianItemHeader;
