import { useRef, useState } from "react";
import { ImageIcon, LoaderCircle, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { compressImage } from "@/lib/image";
import { cn } from "@/lib/utils";

const MAX_SIZE_MB = 15;

type ImageUploadProps = {
  id?: string;
  /** URL of the current image (or a local preview). */
  src?: string;
  /** Gets the picked image, already compressed to WebP. */
  onSelect: (file: File) => void;
  /** True while the parent uploads the image. */
  pending?: boolean;
  /** CSS aspect-ratio of the slot the image fills on the site, e.g. "4 / 3" */
  aspectRatio?: string;
  invalid?: boolean;
};

/** Image preview + "choose image" button. The parent decides what to do with the file (upload now or later). */
export function ImageUpload({ id, src, onSelect, pending, aspectRatio = "16 / 9", invalid }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [compressing, setCompressing] = useState(false);
  const busy = pending || compressing;

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return void toast.error("اختار ملف صورة (JPG أو PNG أو WebP)");
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return void toast.error(`الصورة أكبر من ${MAX_SIZE_MB} ميجا`);

    setCompressing(true);
    try {
      onSelect(await compressImage(file));
    } catch {
      toast.error("مش قادر أقرا الصورة دي. جرّب صورة تانية.");
    } finally {
      setCompressing(false);
    }
  }

  return (
    <div className="grid gap-3">
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border bg-muted",
          invalid && "border-destructive",
          !src && "border-dashed",
        )}
        style={{ aspectRatio }}
      >
        {src ? (
          <img src={src} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageIcon aria-hidden="true" className="size-8" />
            <span className="text-sm">مفيش صورة</span>
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 text-sm text-white">
            <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
            {pending ? "بيرفع الصورة..." : "بيجهّز الصورة..."}
          </div>
        )}
      </div>

      <Button
        id={id}
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
      >
        <Upload />
        {src ? "غيّر الصورة" : "اختار صورة"}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
    </div>
  );
}

type ImageUploadFieldProps = Omit<ImageUploadProps, "invalid"> & {
  id: string;
  label: string;
  description?: string;
};

/** An image that is saved on its own as soon as it is picked (not with the form's save button). */
export function ImageUploadField({ id, label, description, ...props }: ImageUploadFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <ImageUpload id={id} {...props} />
      <FieldDescription>{description} الصورة بتتحفظ أول ما تختارها، من غير ما تدوس «حفظ التعديلات».</FieldDescription>
    </Field>
  );
}
