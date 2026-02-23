import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  specSidebar: [
    {
      type: 'doc',
      id: 'index',
      label: 'Overview',
    },
    {
      type: 'doc',
      id: 'architecture',
      label: 'Architecture',
    },
    {
      type: 'category',
      label: 'Specification',
      items: ['spec/hekaya-markup-spec', 'spec/fountain-compatibility'],
    },
    {
      type: 'category',
      label: 'Examples',
      items: [
        'examples/basic-arabic',
        'examples/bilingual',
        'examples/feature-film',
        'examples/short-comedy',
        'examples/full-drama',
        'examples/full-comedy',
      ],
    },
  ],
  researchSidebar: [
    {
      type: 'category',
      label: 'Research',
      items: [
        'research/landscape',
        'research/fountain-spec',
        'research/seyaq-analysis',
        'research/rtl-challenges',
        'research/platform-comparison',
        'research/pdf-generation',
        'research/references',
      ],
    },
  ],
};

export default sidebars;
