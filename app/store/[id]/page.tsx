import Link from "next/link";
import type { Metadata } from "next";
import { webBaseUrl } from "../../../src/urls";
import OpenInAppButton from "../../../src/OpenInAppButton";

type StorePageProps = {
  params: { id: string };
};

export function generateMetadata({ params }: StorePageProps): Metadata {
  return {
    title: "Guia Brechó - Loja",
    description: "Abra o Guia Brechó para ver esta loja."
  };
}

export default function StorePage({ params }: StorePageProps) {
  const storeId = decodeURIComponent(params.id);
  const encodedId = encodeURIComponent(storeId);
  const prettyBaseUrl = webBaseUrl.replace(/^https?:\/\//, "");

  return (
    <main className="page">
      <section className="hero">
        <p>Esse link abre direto no app. Caso não tenha o app instalado, você será redirecionado para a loja.</p>
        <div className="hero-actions">
          <OpenInAppButton className="button" deepLink={`meer://store/${encodedId}`}>
            Abrir no app
          </OpenInAppButton>
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
