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
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs">
            Read the Specification
          </Link>
        </div>
      </div>
    </header>
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
        <div className="container" style={{ padding: '2rem 0' }}>
          <div className="row">
            <div className="col col--4">
              <h3>Plain Text Markup</h3>
              <p>
                Write screenplays in any text editor using simple, intuitive syntax designed for
                Arabic writing.
              </p>
            </div>
            <div className="col col--4">
              <h3>RTL Native</h3>
              <p>
                Built from the ground up for right-to-left text. Arabic scene headings, character
                names, and transitions.
              </p>
            </div>
            <div className="col col--4">
              <h3>PDF Export</h3>
              <p>
                Generate professionally formatted screenplay PDFs with proper Arabic fonts and RTL
                layout.
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
