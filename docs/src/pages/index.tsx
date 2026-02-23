import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs">
            Get Started
          </Link>
          <Link
            className="button button--outline button--lg"
            to="https://github.com/michaelkmalak/hekaya"
          >
            GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

function ScreenplaySample() {
  return (
    <section className={styles.sampleSection}>
      <div className="container">
        <div className="row">
          <div className={clsx('col col--5', styles.sampleDescription)}>
            <Heading as="h2">Write screenplays in plain text</Heading>
            <p>
              Use any text editor. No proprietary software needed. Hekaya syntax is designed to feel
              natural for writing in Egyptian Arabic.
            </p>
            <p>
              Character names use <code>@</code> for first introduction, then auto-detect. Scene
              headings use Arabic keywords like <code>داخلي</code> and <code>خارجي</code>.
            </p>
            <Link to="/docs/examples/full-drama">See full sample screenplay &rarr;</Link>
          </div>
          <div className="col col--7">
            <pre className={styles.sampleCode} dir="rtl">
              {`العنوان: آخر أيام الصيف
المؤلف: سمير عبدالحميد

داخلي - قهوة بلدي - نهار

سمير قاعد لوحده في ركن القهوة،
بيبص على فنجان القهوة اللي قدامه.

@سمير
(لنفسه)
كل يوم نفس المنظر.. نفس الناس.. نفس القهوة.

@حسن
(بفرحة)
يا سمير! أنا قاعد أدور عليك من الصبح!

@سمير
(من غير ما يبص)
وأنا قاعد أستنى حد يدور عليا.`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    title: 'RTL Native',
    description:
      'Built from the ground up for right-to-left text. Arabic scene headings, character names, transitions, and bidirectional text handling.',
  },
  {
    title: 'Fountain Compatible',
    description:
      'Extends the Fountain specification. Existing .fountain files parse correctly — add Arabic features incrementally.',
  },
  {
    title: 'PDF Export',
    description:
      'Generate professionally formatted screenplay PDFs with proper Arabic fonts, RTL layout, and industry-standard margins.',
  },
  {
    title: 'Zero Dependencies',
    description:
      'The core parser has no dependencies. Lightweight, fast, and easy to embed in any JavaScript or TypeScript project.',
  },
  {
    title: 'Character Registry',
    description:
      'Introduce characters with @ once, then the parser auto-detects them. No need for UPPERCASE — Arabic has no case.',
  },
  {
    title: 'CLI Tool',
    description:
      'Parse, render, export, validate, and convert screenplays from the command line. Supports JSON, HTML, and PDF output.',
  },
];

function Features() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {features.map(({ title, description }) => (
            <div key={title} className={clsx('col col--4', styles.featureItem)}>
              <Heading as="h3">{title}</Heading>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Packages() {
  return (
    <section className={styles.packages}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Packages
        </Heading>
        <div className="row">
          {[
            {
              name: '@hekaya/parser',
              desc: 'Core markup parser (zero dependencies)',
            },
            {
              name: '@hekaya/renderer',
              desc: 'HTML renderer with RTL-aware screenplay CSS',
            },
            { name: '@hekaya/pdf', desc: 'PDF generator with Arabic font support' },
            { name: '@hekaya/cli', desc: 'Command-line tool' },
          ].map(({ name, desc }) => (
            <div key={name} className={clsx('col col--3', styles.packageCard)}>
              <code>{name}</code>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Home"
      description="Hekaya - Screenplay markup for Egyptian and Arabic-speaking screenwriters"
    >
      <HomepageHeader />
      <main>
        <ScreenplaySample />
        <Features />
        <Packages />
      </main>
    </Layout>
  );
}
