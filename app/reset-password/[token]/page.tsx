import ResetPasswordForm from "./ResetPasswordForm";
import { webBaseUrl } from "../../../src/urls";
import { getPasswordRulesLabels } from "./passwordRulesText";

export default function ResetPasswordPage({
  params
}: {
  params: { token: string };
}) {
  const token = decodeURIComponent(params.token);
  const prettyBaseUrl = webBaseUrl.replace(/^https?:\/\//, "");
  const rulesHint = getPasswordRulesLabels().join(", ");

  return (
    <main className="page">
      <section className="hero">
        <span className="eyebrow">Redefinir senha</span>
        <h1>Crie uma nova senha para sua conta.</h1>
        <p>Ela precisa ter {rulesHint}.</p>
      </section>

      <ResetPasswordForm token={token} />

      <footer className="footer">Guia Brechó • {prettyBaseUrl}</footer>
    </main>
  );
}
