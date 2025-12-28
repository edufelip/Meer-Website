import Link from "next/link";
import type { Metadata } from "next";
import { webBaseUrl } from "../../../src/urls";
import StoreRedirect from "./StoreRedirect";

type StorePageProps = {
  params: { id: string };
};

export function generateMetadata({ params }: StorePageProps): Metadata {
  const storeId = decodeURIComponent(params.id);
  return {
    title: `Guia Brechó - ${storeId}`,
    description: "Abra o Guia Brechó para ver detalhes desta loja."
  };
}

export default function StorePage({ params }: StorePageProps) {
  const storeId = decodeURIComponent(params.id);
  const encodedId = encodeURIComponent(storeId);
  const prettyBaseUrl = webBaseUrl.replace(/^https?:\/\//, "");

  return (
    <main className="page">
      <StoreRedirect />
      <section className="hero">
        <span className="eyebrow">Loja</span>
        <h1>{storeId}</h1>
        <p>Este link abre direto no app. Se ele nao abrir, use o botao abaixo.</p>
        <div className="hero-actions">
          <a className="button" href={`meer://store/${encodedId}`}>
            Abrir no app
          </a>
          <Link className="button secondary" href="/">
            Voltar para o inicio
          </Link>
        </div>
      </section>

      <section className="cards">
        <div className="card">
          <h3>Dicas rapidas</h3>
          <p>Salve a loja nos favoritos e compartilhe com os amigos.</p>
        </div>
        <div className="card">
          <h3>Garimpo inteligente</h3>
          <p>Explore conteudos e avaliacoes antes de visitar.</p>
        </div>
      </section>

      <footer className="footer">Guia Brechó • {prettyBaseUrl}</footer>
    </main>
  );
}
