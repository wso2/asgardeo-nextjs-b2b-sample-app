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
