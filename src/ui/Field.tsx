import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { WarningCircle } from "@phosphor-icons/react";

interface FieldChromeProps {
  label: string;
  helper?: string;
  error?: string;
  id: string;
}

function FieldChrome({ label, helper, error, id, children }: FieldChromeProps & { children: ReactNode }) {
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-small font-medium text-ink">
        {label}
      </label>
      {children}
      {helper && !error && (
        <p id={helperId} className="text-small text-ink-3">
          {helper}
        </p>
      )}
      {error && (
        <p id={errorId} className="flex items-center gap-1 text-small text-kumkum">
          <WarningCircle size={14} weight="bold" />
          {error}
        </p>
      )}
    </div>
  );
}

export interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helper?: string;
  error?: string;
}

export function Field({ label, helper, error, id: idProp, className = "", ...rest }: FieldProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldChrome label={label} helper={helper} error={error} id={id}>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
        className={`h-10 rounded-control border bg-surface px-3 text-body text-ink outline-none placeholder:text-ink-3 focus-visible:border-indigo ${
          error ? "border-kumkum" : "border-line-strong"
        } ${className}`}
        {...rest}
      />
    </FieldChrome>
  );
}

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helper?: string;
  error?: string;
}

export function TextArea({ label, helper, error, id: idProp, className = "", ...rest }: TextAreaProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldChrome label={label} helper={helper} error={error} id={id}>
      <textarea
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
        className={`min-h-24 rounded-control border bg-surface px-3 py-2 text-body text-ink outline-none placeholder:text-ink-3 focus-visible:border-indigo ${
          error ? "border-kumkum" : "border-line-strong"
        } ${className}`}
        {...rest}
      />
    </FieldChrome>
  );
}
