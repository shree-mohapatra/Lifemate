import Cropper from "react-easy-crop";
import { useState, useCallback } from "react";
import type { Area } from "../utils/cropImage";
import "../styles/Profile.css";

interface Props {
  image: string;
  onComplete: (pixels: Area) => void;
  onCancel: () => void;
}

export default function ImageCropper({
  image,
  onComplete,
  onCancel,
}: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState<Area | null>(
    null
  );

  const onCropComplete = useCallback(
    (_: Area, croppedAreaPixels: Area) => {
      setCroppedPixels(croppedAreaPixels);
    },
    []
  );

  return (
    <div className="crop-container">
      <div className="crop-box">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />

        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(+e.target.value)}
          className="zoom-slider"
        />

        <div className="crop-actions">
          <button
            className="btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="btn-primary"
            onClick={() =>
              croppedPixels && onComplete(croppedPixels)
            }
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
