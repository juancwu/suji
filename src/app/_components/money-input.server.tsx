import { nanoid } from "nanoid";
import { twMerge } from "tailwind-merge";

type MoneyInputProps = {
  label: string;
  unit: string;
  sign: string;
} & Omit<React.HTMLProps<HTMLInputElement>, "type">;

export default function MoneyInput({
  unit,
  sign,
  label,
  id,
  className,
  required,
  ...props
}: MoneyInputProps) {
  const inputId = id ?? nanoid(8);
  const describedById = nanoid(8);
  const describedByIdRequired = nanoid(8);
  return (
    <div>
      <div className="flex justify-between">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
        </label>
        <span
          className="text-sm leading-6 text-gray-500"
          id={describedByIdRequired}
        >
          {required ? "Required" : "Optional"}
        </span>
      </div>
      <div className="relative mt-2 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">{sign}</span>
        </div>
        <input
          type="text"
          id={inputId}
          className={twMerge(
            "block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
            className,
          )}
          required={required}
          {...props}
          aria-describedby={[
            describedByIdRequired,
            describedById,
            props["aria-describedby"] ?? "",
          ].join(" ")}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-500 sm:text-sm" id={describedById}>
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
}
