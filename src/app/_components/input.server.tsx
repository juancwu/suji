import { nanoid } from "nanoid";
import { twMerge } from "tailwind-merge";

type InputProps = {
  label: string;
  describedById?: string;
} & React.HTMLProps<HTMLInputElement>;

export default function Input({
  label,
  id,
  required = false,
  className,
  ...props
}: InputProps) {
  const describedById = nanoid(8);
  const inputId = id ?? nanoid(8);
  return (
    <div>
      <div className="flex justify-between">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
        </label>
        <span className="text-sm leading-6 text-gray-500" id={describedById}>
          {required ? "Required" : "Optional"}
        </span>
      </div>
      <div className="mt-2">
        <input
          id={inputId}
          className={twMerge(
            "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
            className,
          )}
          required={required}
          {...props}
          aria-describedby={[
            describedById,
            props["aria-describedby"] ?? "",
          ].join(" ")}
        />
      </div>
    </div>
  );
}
