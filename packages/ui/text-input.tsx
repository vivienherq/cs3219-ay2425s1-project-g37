function Label({ ...props }: React.ComponentPropsWithoutRef<"label">) {
  return <label className="flex flex-col gap-1.5" {...props} />;
}

function Input({ ...props }: React.ComponentPropsWithoutRef<"input">) {
  return (
    <input
      className="border-main-800 bg-main-800 placeholder:text-main-600 focus-within:border-main-500 w-full rounded-none border px-4 py-2 outline-none"
      {...props}
    />
  );
}

export function TextInput({
  label,
  helpText,
  value,
  onValueChange,
  ...props
}: {
  label: string;
  helpText?: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
} & React.ComponentPropsWithoutRef<"input">) {
  return (
    <Label htmlFor={props.id}>
      <span className="text-main-400 text-xs uppercase tracking-wider">{label}</span>
      <Input {...props} value={value} onChange={e => onValueChange(e.currentTarget.value)} />
      {helpText ? <div className="text-main-400 text-sm">{helpText}</div> : null}
    </Label>
  );
}
