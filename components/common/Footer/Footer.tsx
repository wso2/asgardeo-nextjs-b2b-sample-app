import React from "react";

// Add the date.
let date: Date = new Date();
let year = date.getFullYear();

function Footer() {
  return (
    <footer className={"footer"}>
      <p>
        © {`${new Date().getFullYear()}`}
        <a href="https://wso2.com/">&nbsp; WSO2 LLC </a>
      </p>
    </footer>
  );
}

export default Footer;
