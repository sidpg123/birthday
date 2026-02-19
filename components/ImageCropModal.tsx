"use client";

import Cropper, { Area } from "react-easy-crop";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  image: string;
  aspect: number;
  onCancel: () => void;
  onComplete: (blob: Blob) => void;
}

export default function ImageCropModal({
  image,
  aspect,
  onCancel,
  onComplete,
}: Props) {
  const [crop, setCrop] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState<number>(1);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback(
    (_: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  async function createCroppedImage() {
    if (!croppedAreaPixels) return;

    const img = new Image();
    img.src = image;
    await img.decode();

    const canvas = document.createElement("canvas");
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(
      img,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    canvas.toBlob(
      (blob) => {
        if (blob) onComplete(blob);
      },
      "image/jpeg",
      0.9
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[90%] max-w-xl p-4 space-y-4">
        <div className="relative h-96">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={createCroppedImage}>
            Crop & Save
          </Button>
        </div>
      </div>
    </div>
  );
}
