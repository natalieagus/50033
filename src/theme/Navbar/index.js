import React from "react";
import NavbarLayout from "@theme/Navbar/Layout";
import NavbarContent from "@theme/Navbar/Content";
export default function Navbar({ customClassName }) {
  return (
    <NavbarLayout customClassName={customClassName}>
      <NavbarContent />
    </NavbarLayout>
  );
}
