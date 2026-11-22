/**
 * react-hook-form + shadcn `Field` wrappers. Every field shows its label, optional hint and validation error.
 */
import type { ComponentProps, ReactNode } from "react";
import { X } from "lucide-react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "./image-upload";

type BaseProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: ReactNode;
};

type NativeProps<E extends "input" | "textarea"> = Omit<ComponentProps<E>, "name" | "value" | "onChange" | "onBlur">;

function Hint({ description, length, max }: { description?: ReactNode; length?: number; max?: number }) {
  if (!description && !max) return null;
  return (
    <FieldDescription className="flex justify-between gap-4">
      <span>{description}</span>
      {max !== undefined && (
        <span dir="ltr" className={length !== undefined && length > max ? "text-destructive" : undefined}>
          {length}/{max}
        </span>
      )}
    </FieldDescription>
  );
}

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  counter,
  ...props
}: BaseProps<T> & NativeProps<"input"> & { counter?: number }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <Input {...props} {...field} id={field.name} value={field.value ?? ""} aria-invalid={fieldState.invalid} />
          <Hint description={description} length={String(field.value ?? "").length} max={counter} />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export function TextareaField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  counter,
  ...props
}: BaseProps<T> & NativeProps<"textarea"> & { counter?: number }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <Textarea
            rows={3}
            {...props}
            {...field}
            id={field.name}
            value={field.value ?? ""}
            aria-invalid={fieldState.invalid}
          />
          <Hint description={description} length={String(field.value ?? "").length} max={counter} />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export function NumberField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  ...props
}: BaseProps<T> & NativeProps<"input">) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <Input
            type="number"
            inputMode="numeric"
            dir="ltr"
            {...props}
            {...field}
            id={field.name}
            value={Number.isNaN(field.value) ? "" : field.value}
            onChange={(event) => field.onChange(event.target.valueAsNumber)}
            aria-invalid={fieldState.invalid}
          />
          <Hint description={description} />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export function SwitchField<T extends FieldValues>({ control, name, label, description }: BaseProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
          <FieldContent>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
          </FieldContent>
          <Switch id={field.name} checked={field.value} onCheckedChange={field.onChange} onBlur={field.onBlur} />
        </Field>
      )}
    />
  );
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  options,
}: BaseProps<T> & { options: { value: string; label: string }[] }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger id={field.name} className="w-full" aria-invalid={fieldState.invalid}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Hint description={description} />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

/** A YYYY-MM-DD date that can be cleared back to `null`. */
export function DateField<T extends FieldValues>({ control, name, label, description }: BaseProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              dir="ltr"
              id={field.name}
              className="w-fit"
              value={field.value ?? ""}
              onChange={(event) => field.onChange(event.target.value || null)}
              onBlur={field.onBlur}
              aria-invalid={fieldState.invalid}
            />
            {field.value && (
              <Button type="button" variant="ghost" size="sm" onClick={() => field.onChange(null)}>
                <X />
                شيل التاريخ
              </Button>
            )}
          </div>
          <Hint description={description} />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export function ImageField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  aspectRatio,
}: BaseProps<T> & { aspectRatio?: string }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <ImageUpload
            id={field.name}
            value={field.value}
            onChange={field.onChange}
            aspectRatio={aspectRatio}
            invalid={fieldState.invalid}
          />
          <Hint description={description} />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
