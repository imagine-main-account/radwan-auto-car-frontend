import { useRef } from "react";
import { ImageIcon, LoaderCircle, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { compressImage } from "@/lib/image";
import { cn } from "@/lib/utils";
import { useUploadImage } from "@/services/uploads";

const MAX_SIZE_MB = 15;

type ImageUploadProps = {
  id?: string;
  value: string;
  onChange: (url: string) => void;
  /** CSS aspect-ratio of the slot the image fills on the site, e.g. "4 / 3" */
  aspectRatio?: string;
  invalid?: boolean;
};

export function ImageUpload({ id, value, onChange, aspectRatio = "16 / 9", invalid }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadImage();

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return void toast.error("اختار ملف صورة (JPG أو PNG أو WebP)");
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return void toast.error(`الصورة أكبر من ${MAX_SIZE_MB} ميجا`);

    try {
      const { url } = await upload.mutateAsync(await compressImage(file));
      onChange(url);
    } catch {
      /* the global mutation handler already showed a toast */
    }
  }

  return (
    <div className="grid gap-3">
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border bg-muted",
          invalid && "border-destructive",
          !value && "border-dashed",
        )}
        style={{ aspectRatio }}
      >
        {value ? (
          <img src={value} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageIcon aria-hidden="true" className="size-8" />
            <span className="text-sm">مفيش صورة</span>
          </div>
        )}
        {upload.isPending && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 text-sm text-white">
            <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
            بيرفع الصورة...
          </div>
        )}
      </div>

      <Button
        id={id}
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        disabled={upload.isPending}
        onClick={() => inputRef.current?.click()}
      >
        <Upload />
        {value ? "غيّر الصورة" : "اختار صورة"}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
    </div>
  );
}
