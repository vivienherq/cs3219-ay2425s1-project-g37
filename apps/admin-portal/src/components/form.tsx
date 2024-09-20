function Label({ ...props }: React.ComponentPropsWithoutRef<"label">) {
  return <label className="flex flex-col gap-1.5" {...props} />;
}

function Input({ ...props }: React.ComponentPropsWithoutRef<"input">) {
  return (
    <input
      className="w-full rounded-none border border-neutral-800 bg-neutral-800 px-4 py-2 outline-none placeholder:text-neutral-600 focus-within:border-neutral-500"
      {...props}
    />
  );
}

export function FormControl({
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
      <span className="text-xs uppercase tracking-wider text-neutral-400">{label}</span>
      <Input {...props} value={value} onChange={e => onValueChange(e.currentTarget.value)} />
      {helpText ? <div className="text-sm text-neutral-400">{helpText}</div> : null}
    </Label>
  );
}
