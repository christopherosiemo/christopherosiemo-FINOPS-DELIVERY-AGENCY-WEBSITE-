import { ActionLink } from "@/components/ui/actions";

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="hero" aria-labelledby="page-title">
        <div className="container site-grid hero__content">
          <p className="eyebrow">Cloud Margin Recovery</p>
          <h1 id="page-title">Turn AWS waste into verified savings.</h1>
          <p className="hero__summary">
            We turn AWS savings opportunities into verified reductions on your bill.
          </p>
          <ActionLink className="hero__action" href="/start">
            Start a Savings Sprint
          </ActionLink>
        </div>
      </section>
    </main>
  );
}
