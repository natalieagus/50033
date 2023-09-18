// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/duotoneDark");
const math = require("remark-math");
const katex = require("rehype-katex");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Game Development and Design",
  tagline: "The best way to learn programming is by playing videogames",
  url: "https://natalieagus.github.io",
  baseUrl: "/50033/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "natalieagus", // Usually your GitHub org/user name.
  projectName: "50033", // Usually your repo name.

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          remarkPlugins: [math],
          rehypePlugins: [katex],
          sidebarPath: require.resolve("./sidebars.js"),
          routeBasePath: "docs",
          admonitions: {
            tag: ":::",
            keywords: [
              "info",
              "success",
              "danger",
              "note",
              "tip",
              "warning",
              "important",
              "caution",
              "keyword",
              "think",
              "author",
              "playtest",
            ],
          },
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  plugins: [
    // [
    //   "@docusaurus/plugin-content-docs",
    //   {
    //     id: "psets",
    //     path: "psets",
    //     routeBasePath: "psets",
    //     sidebarPath: require.resolve("./sidebars.js"),
    //   },
    // ],
    async function myPlugin(context, options) {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require("tailwindcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "resources",
        path: "resources",
        routeBasePath: "resources",
        sidebarPath: require.resolve("./sidebars.js"),
        admonitions: {
          tag: ":::",
          keywords: [
            "info",
            "success",
            "danger",
            "note",
            "tip",
            "warning",
            "important",
            "caution",
            "keyword",
            "think",
            "author",
            "playtest",
          ],
        },
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "about",
        path: "about",
        routeBasePath: "about",
        sidebarPath: require.resolve("./sidebars.js"),
        sidebarCollapsed: false,
        admonitions: {
          tag: ":::",
          keywords: [
            "info",
            "success",
            "danger",
            "note",
            "tip",
            "warning",
            "important",
            "caution",
            "keyword",
            "think",
            "author",
            "playtest",
          ],
        },
      },
    ],
  ],
  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        // docsRouteBasePath: ["psets", "projects", "docs", "about"],
        docsRouteBasePath: ["resources", "docs", "about"],
      },
    ],
    [
      "docusaurus-live-brython",
      {
        brython_src:
          "https://cdn.jsdelivr.net/npm/brython@3.9.5/brython.min.js", // default
        brython_stdlib_src:
          "https://cdn.jsdelivr.net/npm/brython@3.9.5/brython_stdlib.js", // default
      },
    ],
    "@docusaurus/theme-mermaid",
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      mermaid: {
        options: {
          fontSize: 24,
        },
      },
      colorMode: {
        // only want to have dark theme here
        defaultMode: "dark",
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      landingPage: {
        emoji: "🎮",
        subjectCode: "50.033",
        title: "Game Development and Design",
        titleShort: "GDD",
        tagline: "The best way to learn programming is to play videogames",
      },
      navbar: {
        hideOnScroll: true,
        title: "50.033",
        logo: {
          alt: "DDW Logo",
          src: "img/home-logo.svg",
        },
        items: [
          {
            type: "search",
            position: "right",
          },
          {
            to: "/about/intro",
            label: "About",
            position: "left",
            activeBaseRegex: `/about/`,
          },
          {
            type: "doc",
            docId: "syllabus",
            position: "left",
            label: "Lab Docs",
          },
          {
            to: "/resources/intro",
            label: "Resources",
            position: "left",
            activeBaseRegex: `/resources/`,
          },
          // {
          //   to: "/psets/intro",
          //   label: "Psets",
          //   position: "left",
          //   activeBaseRegex: `/psets/`,
          // },
          // {
          //   to: "/roadmap",
          //   label: "Roadmap",
          //   position: "left",
          // },
          {
            href: "https://github.com/natalieagus/50033",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        // style: "dark",
        links: [
          {
            title: "Course Materials",
            items: [
              {
                label: "Lab Documentation",
                to: "/docs/syllabus",
              },
              // {
              //   label: "Problem Sets",
              //   to: "/psets/intro",
              // },
              {
                label: "Resources",
                to: "/resources/intro",
              },
            ],
          },
          {
            title: "Contribute",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/natalieagus/50033",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} 50.033 Game Design and Development`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["csharp"],
      },
    }),
  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      crossorigin: "anonymous",
    },
  ],

  markdown: {
    mermaid: true,
  },
};

module.exports = config;
