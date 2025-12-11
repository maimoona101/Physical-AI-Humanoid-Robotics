const { themes: prismThemes } = require("prism-react-renderer");

const config = {
  title: "Physical AI & Humanoid Robotics",
  tagline: "Hands-on Learning for the Hackathon",
  favicon: "img/favicon.ico",

  url: "https://example.com",
  baseUrl: "/",

  organizationName: "your-org",
  projectName: "physical-ai-book",

  onBrokenLinks: "throw",

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  presets: [
    [
      "classic",
      {
        docs: {
          path: "docs",
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"), // JS file reference
        },
        blog: false,
        theme: { customCss: require.resolve("./src/css/custom.css") },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: "Physical AI & Humanoid Robotics",
      logo: {
        alt: "Physical AI Logo",
        src: "img/ai.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Chapters",
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

module.exports = config;
