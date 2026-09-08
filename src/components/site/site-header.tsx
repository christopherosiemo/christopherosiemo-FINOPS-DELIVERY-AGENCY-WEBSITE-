import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link className="wordmark" href="/" aria-label="Cloud Margin Recovery home">
          CMR
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="primary-nav">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/#main-content">Approach</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
