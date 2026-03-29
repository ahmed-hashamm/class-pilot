import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onChange?: (e: { target: { name: string; value: string } }) => void;
  name: string;
  label?: string;
  options?: { label: string; value: string | number }[];
  children?: React.ReactNode;
  className?: string;
  placeholder?: string;
}

const Select = ({
  value: controlledValue,
  defaultValue,
  onChange,
  name,
  options,
  children,
  className,
  placeholder = "Select option...",
}: SelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Parse options from children if not provided via props
  const allOptions = React.useMemo(() => {
    if (options) return options;
    const parsed: { label: string; value: string | number }[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && (child.type === "option" || (child.type as any).displayName === "Option")) {
        const props = child.props as any;
        parsed.push({
          label: props.children as string,
          value: props.value,
        });
      }
    });
    return parsed;
  }, [options, children]);

  const selectedOption = allOptions.find((opt) => String(opt.value) === String(value));

  const handleSelect = (val: string | number) => {
    const stringVal = String(val);
    if (controlledValue === undefined) {
      setInternalValue(stringVal);
    }
    onChange?.({ target: { name, value: stringVal } });
    setIsOpen(false);
  };

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-xl border border-border bg-white px-4 py-2 text-[13px]",
          "font-medium text-navy transition-all duration-200 outline-none",
          "hover:border-navy/30 focus:border-navy focus:ring-4 focus:ring-navy/5",
          isOpen && "border-navy ring-4 ring-navy/5 shadow-sm"
        )}
      >
        <span className={cn("truncate", !selectedOption && "text-navy/40")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "text-navy/40 transition-transform duration-300 ease-in-out shrink-0 ml-2",
            isOpen && "rotate-180 text-navy"
          )}
        />
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-[100] w-full min-w-[160px] overflow-hidden rounded-xl border border-border bg-white p-1.5 shadow-xl"
          >
            <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
              {allOptions.length === 0 ? (
                <div className="px-3 py-2 text-[13px] text-navy/40 italic">
                  No options available
                </div>
              ) : (
                allOptions.map((opt) => {
                  const isSelected = String(opt.value) === String(value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[13px] transition-colors",
                        "hover:bg-secondary cursor-pointer border-none",
                        isSelected ? "bg-secondary text-navy font-bold" : "text-navy/70"
                      )}
                    >
                      <span className="truncate">{opt.label}</span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                        >
                          <Check size={14} className="text-navy shrink-0" />
                        </motion.div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden select for form participation */}
      <select
        name={name}
        value={value}
        onChange={() => {}} // Controlled by button
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      >
        <option value="">{placeholder}</option>
        {allOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

Select.displayName = "Select";

export { Select };
