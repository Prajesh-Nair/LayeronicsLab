type ProductColorPickerProps = {
  colors: string[];
  value: string;
  onChange: (color: string) => void;
  size?: "sm" | "md";
  className?: string;
};

export function ProductColorPicker({ colors, value, onChange, size = "md", className = "" }: ProductColorPickerProps) {
  const swatch =
    size === "sm"
      ? "w-6 h-6 sm:w-8 sm:h-8 border-2"
      : "w-[42px] h-[42px] border-2";

  return (
    <div className={`flex flex-wrap gap-1.5 sm:gap-2 ${className}`} role="listbox" aria-label="Print color">
      {colors.map((c) => {
        const selected = value === c;
        return (
          <button
            key={c}
            type="button"
            role="option"
            aria-selected={selected}
            aria-label={`Color ${c}`}
            onClick={() => onChange(c)}
            className={`${swatch} rounded-full transition-smooth ${
              selected ? "border-primary scale-105 shadow-card ring-2 ring-primary/30" : "border-border hover:scale-105"
            }`}
            style={{ background: c }}
          />
        );
      })}
    </div>
  );
}
