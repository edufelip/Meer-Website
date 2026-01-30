import React from "react";
import Link from "next/link";

export default function TermsEulaPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            ← Voltar para o início
          </Link>
        </div>

        <h1 className="text-3xl font-semibold mb-2">Terms and EULA</h1>
        <p className="text-sm text-neutral-500 mb-8">Last updated: January 30, 2026</p>

        <section className="mb-10">
          <p className="mb-4">
            These Terms and the End-User License Agreement (EULA) govern your access to and use of
            the Guia Brechó application and related services provided by Eduardo Santos. By using
            the app, you agree to these terms.
          </p>

          <h2 className="text-xl font-semibold mb-4">License</h2>
          <p className="mb-4">
            Guia Brechó is provided as-is for personal, non-commercial use. You may install and use
            the app on compatible devices you own or control. You may not copy, modify, distribute,
            sell, lease, reverse engineer, or create derivative works except where such restrictions
            are prohibited by law.
          </p>

          <h2 className="text-xl font-semibold mb-4">Acceptable Use</h2>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Do not misuse the app, interfere with its operation, or bypass security.</li>
            <li>Do not post illegal, harmful, or abusive content.</li>
            <li>Do not impersonate others or misrepresent your identity or affiliations.</li>
            <li>Respect the privacy and rights of other users.</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">User Content</h2>
          <p className="mb-4">
            You are responsible for the content you post. You retain ownership of your content while
            granting Guia Brechó a limited, non-exclusive license to host and display it as needed to
            operate the service.
          </p>

          <h2 className="text-xl font-semibold mb-4">Termination</h2>
          <p className="mb-4">
            We may suspend or terminate access to the app if you violate these terms or if the
            service is discontinued. You may stop using the app at any time.
          </p>

          <h2 className="text-xl font-semibold mb-4">Disclaimers and Limitation of Liability</h2>
          <p className="mb-4">
            The app is provided without warranties of any kind. To the maximum extent permitted by
            law, we are not liable for any indirect, incidental, or consequential damages arising
            from your use of the app.
          </p>

          <h2 className="text-xl font-semibold mb-4">Changes</h2>
          <p className="mb-4">
            These terms may be updated from time to time. Continued use of the app after changes
            means you accept the updated terms.
          </p>

          <h2 className="text-xl font-semibold mb-4">Contact</h2>
          <p className="mb-4">
            For questions about these terms, contact{" "}
            <a href="mailto:guiabrechoapp@gmail.com" className="text-accent hover:underline">
              guiabrechoapp@gmail.com
            </a>
            .
          </p>
        </section>

        <hr className="border-neutral-200 mb-10" />

        <section className="mb-2">
          <h2 className="text-2xl font-semibold mb-2">Termos e EULA (Português - BR)</h2>
          <p className="text-sm text-neutral-500 mb-6">Atualizado em: 30 de janeiro de 2026</p>

          <p className="mb-4">
            Estes Termos e o Contrato de Licença de Usuário Final (EULA) regem o acesso e o uso do
            aplicativo Guia Brechó e dos serviços relacionados fornecidos por Eduardo Santos. Ao
            usar o app, você concorda com estes termos.
          </p>

          <h3 className="text-xl font-semibold mb-4">Licença</h3>
          <p className="mb-4">
            O Guia Brechó é fornecido no estado em que se encontra para uso pessoal e não comercial.
            Você pode instalar e usar o app em dispositivos compatíveis que possui ou controla. Não
            é permitido copiar, modificar, distribuir, vender, alugar, realizar engenharia reversa ou
            criar obras derivadas, exceto quando tais restrições forem proibidas por lei.
          </p>

          <h3 className="text-xl font-semibold mb-4">Uso aceitável</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Não faça uso indevido do app, não interfira em seu funcionamento nem burle a segurança.</li>
            <li>Não publique conteúdo ilegal, prejudicial ou abusivo.</li>
            <li>Não se passe por outras pessoas nem deturpe sua identidade ou afiliações.</li>
            <li>Respeite a privacidade e os direitos de outros usuários.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-4">Conteúdo do usuário</h3>
          <p className="mb-4">
            Você é responsável pelo conteúdo que publica. Você mantém a propriedade do seu conteúdo
            enquanto concede ao Guia Brechó uma licença limitada e não exclusiva para hospedá-lo e
            exibi-lo conforme necessário para operar o serviço.
          </p>

          <h3 className="text-xl font-semibold mb-4">Rescisão</h3>
          <p className="mb-4">
            Podemos suspender ou encerrar o acesso ao app se você violar estes termos ou se o
            serviço for descontinuado. Você pode deixar de usar o app a qualquer momento.
          </p>

          <h3 className="text-xl font-semibold mb-4">Isenções e limitação de responsabilidade</h3>
          <p className="mb-4">
            O app é fornecido sem garantias de qualquer tipo. Na máxima extensão permitida por lei,
            não nos responsabilizamos por danos indiretos, incidentais ou consequenciais decorrentes
            do seu uso do app.
          </p>

          <h3 className="text-xl font-semibold mb-4">Alterações</h3>
          <p className="mb-4">
            Estes termos podem ser atualizados periodicamente. O uso contínuo do app após alterações
            significa que você aceita os termos atualizados.
          </p>

          <h3 className="text-xl font-semibold mb-4">Contato</h3>
          <p className="mb-4">
            Em caso de dúvidas sobre estes termos, entre em contato pelo e-mail{" "}
            <a href="mailto:guiabrechoapp@gmail.com" className="text-accent hover:underline">
              guiabrechoapp@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
