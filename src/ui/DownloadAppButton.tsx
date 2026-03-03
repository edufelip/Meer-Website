"use client";

type DownloadAppButtonProps = {
  className?: string;
  children: React.ReactNode;
};

export default function DownloadAppButton({ className, children }: DownloadAppButtonProps) {
  return (
    <a
      href="/api/download"
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
