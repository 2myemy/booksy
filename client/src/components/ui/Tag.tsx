import type { ReactNode } from "react";

export function Tag({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "success" | "neutral" | "info" | "meta";
}) {
  const styles = {
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    neutral: "ring-[rgba(31,41,55,0.18)]",
    info: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    meta: "ring-[rgba(180,83,9,0.25)]",
  };

  const inlineStyle =
    tone === "meta"
      ? {
          backgroundColor: "rgba(180, 83, 9, 0.12)",
          color: "var(--honey)",
        }
      : tone === "neutral"
      ? {
          backgroundColor: "rgba(31, 41, 55, 0.06)",
          color: "rgba(31, 41, 55, 0.75)",
        }
      : undefined;

  return (
    <span
      style={inlineStyle}
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1",
        styles[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
}
