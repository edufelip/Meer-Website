import React from "react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
            <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
              ← Voltar para o início
            </Link>
        </div>

        <h1 className="text-3xl font-semibold mb-2">Privacy Policy</h1>
        <p className="text-sm text-neutral-500 mb-8">Last updated: December 2025</p>

        <section className="mb-8">
          <p className="mb-4">
            This Privacy Policy explains how Guia Brechó (&quot;the App&quot;) collects, uses, and protects your information. By
            using the App, you agree to the practices described below.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Information We Collect</h2>
          <p className="mb-4">
            The App may request access to certain device permissions in order to provide core functionality.
          </p>
          <h3 className="text-lg font-medium mb-2">Camera Permission</h3>
          <p className="mb-4">
            The App uses the device camera <strong>only for the purpose of allowing users to capture photos or videos
            within the app experience</strong>. The App does <strong>not</strong> collect, store, transmit, or share any camera data without
            your direct action. Any images or videos you capture remain solely on your device unless you choose to
            share or upload them.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
          <p className="mb-4">
            The App does not collect personal data unless explicitly provided by the user. Any information you generate
            through features such as photo or video capture is used solely to operate the intended functionality of the
            App.
          </p>
          <p className="mb-4">
            We do <strong>not</strong>:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Sell personal information</li>
            <li>Share personal information with third parties</li>
            <li>Use personal information for advertising or tracking</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Data Storage and Security</h2>
          <p className="mb-4">
            All images or videos captured with the camera remain stored locally on your device unless you decide to
            export or share them. We implement reasonable security measures to protect your information; however,
            no digital system is completely secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Third-Party Services</h2>
          <p className="mb-4">
            The App does not integrate third-party analytics, advertising platforms, or external data processors unless
            explicitly stated. The web experience may use Firebase Analytics to measure aggregated usage and improve
            performance when this feature is enabled in deployment configuration.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Children’s Privacy</h2>
          <p className="mb-4">
            The App is not designed for children under 13 and does not knowingly collect personal information from
            children.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Choices</h2>
          <p className="mb-4">
            You may revoke camera permission at any time through your device settings. Some features may stop
            functioning without this permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Changes to This Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy as needed. Any updates will be reflected within the App or on the
            distribution page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Contact</h2>
          <p className="mb-4">
            If you have questions about this Privacy Policy, you may contact us:
          </p>
          <p className="mb-4">
            Email: <a href="mailto:guiabrechoapp@gmail.com" className="text-accent hover:underline">guiabrechoapp@gmail.com</a>
          </p>
        </section>
      </div>
    </main>
  );
}
