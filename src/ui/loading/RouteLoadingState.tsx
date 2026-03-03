import PageShell from "../PageShell";
import BrandSpinner from "./BrandSpinner";

type RouteLoadingStateProps = {
  label?: string;
};

export default function RouteLoadingState({ label = "Carregando página..." }: RouteLoadingStateProps) {
  return (
    <PageShell showFooter={false}>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BrandSpinner label={label} />
      </section>
    </PageShell>
  );
}
