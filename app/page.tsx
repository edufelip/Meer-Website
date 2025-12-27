import Link from "next/link";
import { webBaseUrl } from "../src/urls";

export default function HomePage() {
  const prettyBaseUrl = webBaseUrl.replace(/^https?:\/\//, "");

  return (
    <main className="page">
      <section className="hero">
        <span className="eyebrow">Guia Brecho</span>
        <h1>Seu mapa vivo de brechos cheios de historias.</h1>
        <p>
          Explore achados unicos, salve seus favoritos e compartilhe lojas
          especiais com quem ama garimpar.
        </p>
        <div className="hero-actions">
          <a className="button" href="meer://home">
            Abrir no app
          </a>
          <Link className="button secondary" href="/store/exemplo">
            Ver exemplo de loja
          </Link>
        </div>
      </section>

      <section className="cards">
        <div className="card">
          <h3>Descubra perto de voce</h3>
          <p>Encontre brechos e conteudos com base na sua localizacao.</p>
        </div>
        <div className="card">
          <h3>Compartilhe em segundos</h3>
          <p>Links de loja abrem direto no app, com fallback elegante no web.</p>
        </div>
        <div className="card">
          <h3>Favoritos que nao se perdem</h3>
          <p>Salve o que voce ama e volte quando quiser.</p>
        </div>
      </section>

      <footer className="footer">Guia Brecho • {prettyBaseUrl}</footer>
    </main>
  );
}
