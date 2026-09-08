import Link from "next/link";

export default function ContactPlaceholder() {
  return (
    <main id="main-content" className="simple-page" tabIndex={-1}>
      <div className="container">
        <p className="eyebrow">Savings Sprint</p>
        <h1>Start a Savings Sprint</h1>
        <p>Contact workflow and qualification logic are TBD.</p>
        <Link href="/">Return home</Link>
      </div>
    </main>
  );
}
