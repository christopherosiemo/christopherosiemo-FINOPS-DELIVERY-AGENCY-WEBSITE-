import type { ReactNode } from "react";
import { routeMetadata } from "@/config/metadata";
import styles from "./page.module.css";

export const metadata = routeMetadata("/privacy");

function PolicyList({ children }: { children: ReactNode }) {
  return <ul>{children}</ul>;
}

export default function PrivacyPage() {
  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <header className={styles.hero}>
        <div className="container">
          <p className="eyebrow">Legal</p>
          <h1>Privacy Policy</h1>
          <p className={styles.updated}>Last updated: 13 September 2026</p>
        </div>
      </header>

      <article className={`container ${styles.policy}`}>
        <section aria-label="Introduction">
          <p>This Privacy Policy explains how HKGpipi (“we”, “us” or “our”) collects, uses, stores and protects personal data.</p>
          <p>We provide cloud cost optimisation, AWS infrastructure analysis, implementation and savings verification services, including our AWS Savings Sprint, implementation engagements and post-implementation verification.</p>
          <p>We take the protection of personal data seriously and process personal data in accordance with applicable UK data protection law, including the UK General Data Protection Regulation (“UK GDPR”), the Data Protection Act 2018 and applicable Privacy and Electronic Communications Regulations (“PECR”), in each case as amended from time to time.</p>
        </section>

        <section>
          <h2>1. Who we are</h2>
          <p className={styles.identity}>HKGpipi{"\n"}Registered office: 14 Whitworth Rd, Woolwich, LONDON . SE18 3QB{"\n"}Website: hkgpipi.com</p>
          <p>For questions about this Privacy Policy or our use of personal data, contact:</p>
          <p><a href="mailto:privacy@hkgpipi.com">privacy@hkgpipi.com</a></p>
        </section>

        <section>
          <h2>2. When this Privacy Policy applies</h2>
          <p>This Privacy Policy applies when we process personal data in connection with:</p>
          <PolicyList>
            <li>visits to our website;</li><li>enquiries about our services;</li><li>prospective and existing client relationships;</li><li>meetings, calls and correspondence;</li><li>contracts, invoicing and account management;</li><li>delivery of our cloud optimisation and engineering services;</li><li>implementation and verification engagements;</li><li>marketing and business development; and</li><li>the operation, security and improvement of our business.</li>
          </PolicyList>
          <p>It does not replace any data processing agreement, services agreement or other contractual privacy terms agreed with a client.</p>
          <h3>When we process data on behalf of a client</h3>
        <p>During an engagement, we may be given access to a client&apos;s AWS environment, infrastructure, repositories, engineering tools or other systems.</p>
        <p>Where we process personal data solely on a client&apos;s documented instructions, the client generally acts as the controller, and we act as its processor.</p>
          <p>That processing is governed by the relevant services agreement, data processing agreement or other contractual terms between us and the client. Where those terms conflict with this Privacy Policy in relation to processor activities, the contractual data processing terms will apply.</p>
          <p>We may separately act as a controller for personal data we need for our own business purposes, such as client contact information, contracts, invoices, security records and business communications.</p>
        </section>

        <section>
          <h2>3. Personal data we may collect</h2>
          <p>Depending on how you interact with us, we may collect the following categories of personal data.</p>
          <h3>Identity and contact information</h3><p>This may include:</p>
          <PolicyList><li>name;</li><li>job title;</li><li>employer or organisation;</li><li>business email address;</li><li>telephone number;</li><li>business address; and</li><li>professional contact details.</li></PolicyList>
          <h3>Business and professional information</h3><p>This may include:</p>
        <PolicyList><li>your role and responsibilities;</li><li>company or team information;</li><li>information about your organisation&apos;s cloud environment;</li><li>information relevant to a potential or existing engagement; and</li><li>professional correspondence with us.</li></PolicyList>
          <h3>Contract and account information</h3><p>This may include:</p>
          <PolicyList><li>contracts and statements of work;</li><li>authorised contacts;</li><li>billing information;</li><li>payment and invoice records;</li><li>procurement information; and</li><li>records relating to the administration of our client relationship.</li></PolicyList>
          <p>We do not normally require payment card details to be provided directly to us where payment is handled through a third-party payment provider.</p>
          <h3>Communications</h3><p>We may retain communications exchanged with us through:</p>
          <PolicyList><li>email;</li><li>video or telephone calls;</li><li>website forms;</li><li>project management systems;</li><li>support channels;</li><li>messaging platforms; and</li><li>other business communication tools.</li></PolicyList>
          <h3>Website and technical information</h3><p>When you use our website, we may collect information such as:</p>
          <PolicyList><li>IP address;</li><li>browser and device information;</li><li>approximate location derived from an IP address;</li><li>pages visited;</li><li>referral information;</li><li>dates and times of visits;</li><li>cookie or similar technology identifiers; and</li><li>website security and diagnostic information.</li></PolicyList>
          <p>Where required, non-essential storage, tracking or similar technologies are used only in accordance with applicable consent requirements.</p>
        </section>

        <section>
          <h2>4. Information processed during cloud engagements</h2>
        <p>Our services require us to understand how a client&apos;s cloud infrastructure operates and where costs arise.</p>
          <p>Depending on the agreed scope, we may therefore process or be given access to information such as:</p>
          <PolicyList><li>AWS account and organisation identifiers;</li><li>billing, usage and cost-management information;</li><li>Cost Explorer or equivalent cost data;</li><li>commitments, reservations and Savings Plan information;</li><li>resource names, identifiers and tags;</li><li>infrastructure configuration and metadata;</li><li>architecture information;</li><li>infrastructure-as-code;</li><li>repository and commit metadata;</li><li>pull requests;</li><li>tickets and project records;</li><li>deployment and configuration information;</li><li>IAM usernames or other authorised-user identifiers;</li><li>engineering contact information;</li><li>operational logs provided for troubleshooting; and</li><li>other technical information necessary to identify, implement or verify cloud savings.</li></PolicyList>
          <p>Much of this information will not itself be personal data. However, technical records may become personal data where they identify or can reasonably be linked to an individual, for example through a username, email address, account identity, commit record or support ticket.</p>
          <h3>Data minimisation</h3>
        <p>We do not require access to personal data merely because it exists in a client&apos;s AWS environment.</p>
          <p>Clients should provide access appropriate to the engagement and, where practicable, use least-privilege permissions.</p>
          <p>We do not intentionally access application-level customer content or unrelated production data unless this is necessary for the agreed engagement and we have been authorised to do so.</p>
        <p>If personal data is present in systems that we access on a client&apos;s behalf, we process that information in accordance with the client&apos;s documented instructions and the applicable contractual data processing terms.</p>
        </section>

        <section>
          <h2>5. Why we use personal data</h2>
          <p>We may process personal data for the following purposes.</p>
          <h3>Responding to enquiries</h3><p>We use contact and business information to:</p>
          <PolicyList><li>respond to enquiries;</li><li>understand potential requirements;</li><li>arrange meetings;</li><li>prepare proposals; and</li><li>discuss possible engagements.</li></PolicyList>
          <p>Our lawful basis will generally be our legitimate interests in operating and developing our business. Where an individual is entering into a contract with us personally, processing may also be necessary to take steps at their request before entering into that contract.</p>
          <h3>Managing client relationships</h3><p>We use personal data to:</p>
          <PolicyList><li>establish and administer client relationships;</li><li>communicate with client personnel;</li><li>manage contracts and statements of work;</li><li>coordinate projects;</li><li>provide reports;</li><li>handle billing and payments; and</li><li>respond to client requests.</li></PolicyList>
          <p>Depending on the circumstances, we rely on legitimate interests, performance of a contract or compliance with legal obligations.</p>
          <h3>Delivering our services</h3><p>We process information where necessary to perform agreed services, which may include:</p>
          <PolicyList><li>identifying cloud savings opportunities;</li><li>assessing engineering and implementation risk;</li><li>analysing cloud commitments and utilisation;</li><li>identifying idle or inefficient resources;</li><li>reviewing architecture and infrastructure configuration;</li><li>locating relevant infrastructure-as-code;</li><li>producing implementation recommendations;</li><li>preparing or contributing to pull requests;</li><li>creating or updating engineering tickets;</li><li>making authorised configuration changes;</li><li>supporting deployment;</li><li>establishing savings baselines; and</li><li>verifying realised savings.</li></PolicyList>
          <p>When we process personal data within client-controlled systems solely to provide these services, we generally do so as a processor acting on the client&apos;s instructions.</p>
          <h3>Savings verification and outcome-based engagements</h3>
          <p>Where our engagement includes post-implementation verification or an outcome-based fee, we may process relevant cost, usage, baseline and account information for the period required to:</p>
          <PolicyList><li>measure the effect of implemented changes;</li><li>compare actual expenditure with the agreed baseline;</li><li>verify realised savings;</li><li>investigate material differences; and</li><li>calculate fees where they depend on verified savings.</li></PolicyList>
          <p>Our standard verification engagement may continue for approximately 30 days after implementation, although the exact period is governed by the applicable statement of work or contract.</p>
          <h3>Billing, tax and legal obligations</h3><p>We use relevant personal data to:</p>
          <PolicyList><li>issue and administer invoices;</li><li>maintain financial records;</li><li>comply with tax, accounting and regulatory obligations;</li><li>establish and enforce contractual rights; and</li><li>manage legal claims or disputes.</li></PolicyList>
          <p>We rely on our legal obligations and, where applicable, our legitimate interests in protecting and administering our business.</p>
          <h3>Security</h3><p>We may process personal data where necessary to:</p>
          <PolicyList><li>authenticate users;</li><li>control access to systems;</li><li>investigate suspicious activity;</li><li>protect our systems and client information;</li><li>prevent fraud or misuse;</li><li>maintain audit and security records; and</li><li>respond to security incidents.</li></PolicyList>
          <p>We generally rely on our legitimate interests in maintaining appropriate information and cyber security and, where relevant, compliance with legal obligations.</p>
          <h3>Marketing</h3>
          <p>We may use business contact information to communicate about services, insights or developments that we believe may be relevant to a recipient.</p>
          <p>Where required by law, we obtain consent before sending electronic marketing.</p>
        <p>Where consent is not legally required, we may rely on our legitimate interests in promoting our services, provided those interests are not overridden by the individual&apos;s rights and interests.</p>
          <p>You have the right to object to the use of your personal data for direct marketing at any time.</p>
          <p>Every marketing communication we send electronically will provide an appropriate method of opting out, or you may contact us at <a href="mailto:privacy@hkgpipi.com">privacy@hkgpipi.com</a>.</p>
        </section>

        <section>
          <h2>6. Where we obtain personal data</h2><p>We may obtain personal data:</p>
          <PolicyList><li>directly from you;</li><li>from your employer or organisation;</li><li>from another member of your organisation;</li><li>through our website;</li><li>during sales or procurement processes;</li><li>through meetings and correspondence;</li><li>through client-authorised systems to which we are given access;</li><li>through professional networking platforms;</li><li>from publicly available business sources; or</li><li>from service providers acting on our behalf.</li></PolicyList>
          <p>Where a client provides us with personal data relating to its personnel, customers, suppliers or other individuals, the client is responsible for ensuring it is permitted to provide that data to us for the agreed purpose.</p>
        </section>

        <section>
          <h2>7. Sharing personal data</h2>
          <p>We do not disclose personal data indiscriminately.</p>
          <p>We may share personal data with trusted third parties where reasonably necessary for the purposes described in this Privacy Policy, including:</p>
          <PolicyList><li>cloud and hosting providers;</li><li>business email and productivity providers;</li><li>collaboration and project-management platforms;</li><li>source-control and software-development platforms;</li><li>accounting and payment providers;</li><li>CRM and business administration providers;</li><li>website hosting and analytics providers;</li><li>professional advisers such as lawyers and accountants;</li><li>contractors working under appropriate confidentiality obligations; and</li><li>regulators, courts, law enforcement agencies or public authorities where disclosure is legally required.</li></PolicyList>
          <p>Service providers that process personal data on our behalf are required to handle the information appropriately and subject to applicable contractual and data protection requirements.</p>
          <p>Where we appoint a sub-processor to process client personal data, we do so in accordance with the applicable client agreement or data processing terms.</p>
          <p>A current list of material sub-processors used for client processing is available on request.</p>
          <p>We may also disclose information in connection with a merger, acquisition, financing, reorganisation or sale of all or part of our business, subject to appropriate confidentiality and data protection safeguards.</p>
        </section>

        <section>
          <h2>8. International transfers</h2>
          <p>Some of the systems and service providers used by us may process information outside the United Kingdom.</p>
          <p>Where this results in a restricted transfer of personal data, we use an appropriate transfer mechanism as required by applicable UK data protection law.</p>
          <p>Depending on the destination and recipient, this may include:</p>
          <PolicyList><li>UK adequacy regulations;</li><li>an approved UK international data transfer agreement;</li><li>an approved UK addendum to recognised standard contractual clauses; or</li><li>another legally permitted transfer mechanism.</li></PolicyList>
          <p>Where required, we also assess the circumstances of the transfer and implement supplementary safeguards.</p>
        </section>

        <section>
          <h2>9. Data security</h2>
          <p>We use technical and organisational measures designed to protect personal data against unauthorised access, disclosure, alteration, loss or destruction.</p>
          <p>Depending on the relevant system and risk, these measures may include:</p>
          <PolicyList><li>access controls;</li><li>least-privilege permissions;</li><li>multi-factor authentication;</li><li>encryption;</li><li>secure device management;</li><li>access logging;</li><li>confidentiality obligations;</li><li>secure credential management;</li><li>controlled access to client environments;</li><li>security monitoring; and</li><li>incident-management procedures.</li></PolicyList>
          <p>Access to client environments is limited to personnel who require it for the relevant engagement.</p>
          <p>No internet-based service or method of electronic storage can be guaranteed to be completely secure. We therefore continually assess our controls according to the nature of the information and the risks involved.</p>
        </section>

        <section>
          <h2>10. How long we keep personal data</h2>
          <p>We retain personal data only for as long as reasonably necessary for the purpose for which it was collected, including satisfying contractual, legal, accounting, security and reporting requirements.</p>
          <p>Retention periods vary according to the information involved.</p>
          <p>As a general approach:</p>
          <PolicyList><li>enquiry and prospective-client information is retained for a reasonable period following the last meaningful interaction;</li><li>client relationship and contractual records may be retained for the duration of the relationship and afterwards where necessary for legal, tax, accounting or contractual purposes;</li><li>accounting and transaction records are retained for applicable statutory record-keeping periods;</li><li>marketing information is retained while it remains relevant or until the individual opts out;</li><li>a minimal suppression record may be retained after an opt-out so that we can honour that preference;</li><li>security and technical logs are retained according to the relevant security and operational requirements; and</li><li>copies or exports of information created specifically for a client engagement are deleted or returned in accordance with the applicable contract, data processing terms and our internal retention procedures.</li></PolicyList>
          <p>Where our services include a defined verification period, relevant engagement information may be retained throughout that period so that we can validate savings and produce the agreed results.</p>
          <p>We may retain information for longer where reasonably required in connection with a legal dispute, regulatory requirement, investigation or other legal obligation.</p>
        </section>

        <section>
          <h2>11. Cookies and similar technologies</h2>
          <p>Our website may use cookies and other storage or access technologies that are necessary for the website to operate securely and correctly.</p>
          <p>We do not currently use non-essential analytics, advertising or tracking cookies.</p>
          <p>If we introduce non-essential cookies or similar technologies in future, we will provide appropriate information and, where required by law, obtain consent before using them.</p>
        </section>

        <section>
          <h2>12. Your rights</h2>
          <p>Depending on the circumstances and the applicable lawful basis, you may have rights in relation to your personal data, including the right to:</p>
          <PolicyList><li>request access to your personal data;</li><li>request correction of inaccurate or incomplete data;</li><li>request deletion of your personal data;</li><li>request restriction of processing;</li><li>object to certain processing;</li><li>request portability of certain personal data;</li><li>withdraw consent where processing is based on consent; and</li><li>complain to a supervisory authority.</li></PolicyList>
          <p>These rights are subject to conditions and exceptions under applicable law and do not apply in every circumstance.</p>
          <p>To exercise a right, contact <a href="mailto:privacy@hkgpipi.com">privacy@hkgpipi.com</a>.</p>
          <p>We may need to verify your identity before responding to a request.</p>
          <h3>Direct marketing</h3>
          <p>You may object to our use of your personal data for direct marketing at any time.</p>
          <p>You can do so using the unsubscribe facility in an electronic marketing communication or by contacting <a href="mailto:privacy@hkgpipi.com">privacy@hkgpipi.com</a>.</p>
          <h3>Client-controlled data</h3>
          <p>If your request relates to personal data that we process solely on behalf of one of our clients, the client is generally responsible for responding to your request as controller.</p>
          <p>If you contact us directly about such information, we may refer your request to the relevant client or otherwise assist them in accordance with our contractual and legal obligations.</p>
        </section>

        <section>
          <h2>13. Complaints</h2>
          <p>We encourage you to contact us first if you have concerns about how we use your personal data.</p>
          <p>You can contact us at:</p><p><a href="mailto:privacy@hkgpipi.com">privacy@hkgpipi.com</a></p>
          <p>You also have the right to complain to the UK Information Commissioner&apos;s Office (“ICO”).</p>
          <p>Information about raising a concern with the ICO is available at <a href="https://ico.org.uk/">ico.org.uk</a>.</p>
          <p>If you are located outside the United Kingdom, you may also have the right to contact the data protection regulator responsible for your jurisdiction.</p>
        </section>

        <section>
          <h2>14. Special category data</h2>
          <p>Our services are not designed to require health information, biometric information, information concerning racial or ethnic origin, religious beliefs, sexual orientation, political opinions or other categories of sensitive personal data.</p>
          <p>We ask clients and prospective clients not to provide this type of information unless it is genuinely necessary and appropriate safeguards have been agreed in advance.</p>
        <p>If special category personal data is incidentally present in a client-controlled environment to which we have authorised access, we will process it only in accordance with the client&apos;s instructions and the applicable contractual and legal requirements.</p>
        </section>

        <section><h2>15. Children</h2><p>Our website and services are intended for businesses and professional users.</p><p>They are not directed towards children, and we do not knowingly seek to collect personal data from children through our services.</p></section>
      <section><h2>16. Automated decision-making</h2><p>We do not use personal data to make solely automated decisions about individuals that produce legal effects or similarly significant effects.</p><p>Our cloud cost and engineering analysis may use automated tools to identify technical or financial opportunities. Recommendations affecting a client&apos;s environment remain subject to human and client review as appropriate to the engagement.</p></section>
        <section><h2>17. Third-party websites and services</h2><p>Our website or communications may contain links to third-party websites or services.</p><p>We are not responsible for the privacy practices of independent third parties. You should review their privacy information before providing them with personal data.</p></section>
        <section><h2>18. Changes to this Privacy Policy</h2><p>We may update this Privacy Policy from time to time to reflect:</p><PolicyList><li>changes to our services;</li><li>changes to our use of technology or service providers;</li><li>changes to applicable law or regulatory guidance; or</li><li>changes to our internal practices.</li></PolicyList><p>When we make material changes, we will update the “Last updated” date at the top of this policy and take any additional steps required by law.</p></section>
        <section><h2>19. Contact us</h2><p>For privacy questions, requests or complaints, contact:</p><p>HKGpipi<br />Email: <a href="mailto:privacy@hkgpipi.com">privacy@hkgpipi.com</a></p></section>
      </article>
    </main>
  );
}
