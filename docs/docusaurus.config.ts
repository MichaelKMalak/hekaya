import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Hekaya (حكاية)',
  tagline: 'Screenplay markup for Egyptian and Arabic-speaking screenwriters',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://hekaya.dev',
  baseUrl: '/',

  organizationName: 'michaelkmalak',
  projectName: 'hekaya',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/michaelkmalak/hekaya/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Hekaya (حكاية)',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'specSidebar',
          position: 'left',
          label: 'Specification',
        },
        {
          type: 'docSidebar',
          sidebarId: 'researchSidebar',
          position: 'left',
          label: 'Research',
        },
        {
          href: 'https://github.com/michaelkmalak/hekaya',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Specification',
              to: '/docs/spec/hekaya-markup-spec',
            },
            {
              label: 'Architecture',
              to: '/docs/architecture',
            },
          ],
        },
        {
          title: 'Research',
          items: [
            {
              label: 'Landscape',
              to: '/docs/research/landscape',
            },
            {
              label: 'References',
              to: '/docs/research/references',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/michaelkmalak/hekaya',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Hekaya Project. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
