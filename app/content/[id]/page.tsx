import Link from "next/link";
import type { Metadata } from "next";
import { webBaseUrl } from "../../../src/urls";
import OpenInAppButton from "../../../src/OpenInAppButton";

type ContentPageProps = {
  params: { id: string };
};
...
  return (
    <main className="page">
      <section className="hero">
        <span className="eyebrow">Conteúdo</span>
        <h1>{contentId}</h1>
        <p>Esse link abre direto no app. Caso não tenha o app instalado, você será redirecionado para a loja.</p>
        <div className="hero-actions">
          <OpenInAppButton className="button" deepLink={`meer://content/${encodedId}`}>
            Abrir no app
          </OpenInAppButton>
          <Link className="button secondary" href="/">
            Voltar para o inicio
          </Link>
        </div>
      </section>

      <section className="cards">
        <div className="card">
          <h3>Explore mais</h3>
          <p>Descubra dicas e tendencias dos brechos da sua cidade.</p>
        </div>
        <div className="card">
          <h3>Compartilhe</h3>
          <p>Envie este conteudo para quem ama garimpar.</p>
        </div>
      </section>

      <footer className="footer">Guia Brechó • {prettyBaseUrl}</footer>
    </main>
  );
}
