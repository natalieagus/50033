import React from "react";
import HomepageHeader from "../components/HomepageHeader";
import CustomParticles from "../components/CustomParticles";
import { useThemeConfig } from "@docusaurus/theme-common";
import LayoutProvider from "@theme/Layout/Provider";
import Navbar from "@theme/Navbar";
import Footer from "@theme/Footer";

function useLandingPageConfig() {
  return useThemeConfig().landingPage;
}

export default function Home() {
  const content = useLandingPageConfig();
  return (
    <LayoutProvider>
      <Navbar customClassName="navbar-transparent" />
      <CustomParticles id="tsparticles" />
      <HomepageHeader
        title={content.title}
        emoji={content.emoji}
        tagline={content.tagline}
      />
      <Footer />
    </LayoutProvider>
  );
}
