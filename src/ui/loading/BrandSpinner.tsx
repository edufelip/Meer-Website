type BrandSpinnerProps = {
  label?: string;
};

export default function BrandSpinner({ label = "Carregando conteúdo" }: BrandSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14" role="status" aria-live="polite" aria-busy>
      <span className="gb-spinner" aria-hidden />
      <span className="text-sm text-stone-500 dark:text-stone-400">{label}</span>
    </div>
  );
}
