"use client"

import Image from "next/image"
import { X, ZoomIn } from "lucide-react"
import { ImageComparison } from "@/components/ImageComparison"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

export type GalleryLightboxImage = {
  type: "image"
  src: string
  alt: string
  title?: string
}

export type GalleryLightboxComparison = {
  type: "comparison"
  title: string
  subtitle: string
  before: { src: string; alt: string }
  after: { src: string; alt: string }
}

export type GalleryLightboxItem = GalleryLightboxImage | GalleryLightboxComparison

type GalleryLightboxProps = {
  item: GalleryLightboxItem | null
  onClose: () => void
}

export function GalleryLightbox({ item, onClose }: GalleryLightboxProps) {
  return (
    <Dialog open={item !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="fixed inset-0 z-50 flex h-[100dvh] max-h-[100dvh] w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 bg-slate-950/98 p-0 shadow-none md:hidden"
        aria-describedby={undefined}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-800 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <DialogTitle className="text-sm font-semibold text-white line-clamp-1 pr-3">
            {item?.type === "comparison" ? item.title : item?.title ?? "Gallery photo"}
          </DialogTitle>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition-colors hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-center px-4 py-4">
          {item?.type === "image" && (
            <div className="relative mx-auto w-full max-h-[min(72dvh,640px)] aspect-[4/3]">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          )}

          {item?.type === "comparison" && (
            <div className="mx-auto w-full max-w-lg">
              <ImageComparison
                beforeImage={item.before.src}
                afterImage={item.after.src}
                altBefore={item.before.alt}
                altAfter={item.after.alt}
                className="aspect-[4/3] shadow-2xl"
              />
            </div>
          )}
        </div>

        {item && (
          <DialogDescription asChild>
            <p className="shrink-0 border-t border-slate-800 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-xs leading-relaxed text-slate-400">
              {item.type === "comparison" ? item.subtitle : item.alt}
            </p>
          </DialogDescription>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function GalleryExpandButton({
  label,
  onClick,
  className,
}: {
  label: string
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        className ??
        "absolute bottom-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-slate-950/80 text-white shadow-lg backdrop-blur-sm transition-transform active:scale-95 md:hidden"
      }
      aria-label={label}
    >
      <ZoomIn className="h-4 w-4" />
    </button>
  )
}
