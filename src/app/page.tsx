import Link from "next/link";

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="hero" aria-labelledby="page-title">
        <div className="container hero__content">
          <p className="eyebrow">Cloud Margin Recovery</p>
          <h1 id="page-title">Turn AWS waste into verified savings.</h1>
          <p className="hero__summary">
            We turn AWS savings opportunities into verified reductions on your bill.
          </p>
          <Link className="primary-action" href="/contact">
            Start a Savings Sprint
          </Link>
        </div>
      </section>
    </main>
  );
}
