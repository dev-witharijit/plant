import React, { useRef, useState } from 'react';
import { UploadCloud, Camera, X, Image as ImageIcon, Plus, Info, Tag } from 'lucide-react';
import { UploadedImage } from '../types/pathology';

interface ImageUploaderProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  disabled?: boolean;
}

const VIEW_TAGS = [
  'Upper leaf surface',
  'Leaf underside (abaxial)',
  'Stem / stalk lesion',
  'Whole plant habit',
  'Fruit / flower symptom',
  'Root / crown junction',
  'Close-up lesion / pest',
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Resize and optimize image to ensure high diagnostic quality without blowing payload limits
  const processFile = async (file: File): Promise<UploadedImage> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error(`File ${file.name} is not an image.`));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const rawDataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          // Scale down if dimensions exceed 1800px on longest edge to preserve sharp lesion details
          const maxDim = 1800;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({
              id: Math.random().toString(36).substring(2, 9),
              dataUrl: rawDataUrl,
              mimeType: file.type || 'image/jpeg',
              base64Data: rawDataUrl.split(',')[1],
              fileName: file.name,
              fileSize: file.size,
              partTag: VIEW_TAGS[0],
            });
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const mimeType = 'image/jpeg';
          const optimizedDataUrl = canvas.toDataURL(mimeType, 0.90);
          const base64Data = optimizedDataUrl.split(',')[1];

          resolve({
            id: Math.random().toString(36).substring(2, 9),
            dataUrl: optimizedDataUrl,
            mimeType,
            base64Data,
            fileName: file.name,
            fileSize: Math.round((base64Data.length * 3) / 4),
            partTag: VIEW_TAGS[images.length % VIEW_TAGS.length],
          });
        };
        img.onerror = () => reject(new Error(`Failed to decode image ${file.name}.`));
        img.src = rawDataUrl;
      };
      reader.onerror = () => reject(new Error(`Failed to read file ${file.name}.`));
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0 || disabled) return;
    setErrorMsg(null);

    const remainingSlots = 5 - images.length;
    if (remainingSlots <= 0) {
      setErrorMsg('Maximum of 5 images allowed per diagnostic evaluation.');
      return;
    }

    const filesToProcess = Array.from(fileList).slice(0, remainingSlots);
    if (fileList.length > remainingSlots) {
      setErrorMsg(`Only ${remainingSlots} more image(s) could be added (max 5).`);
    }

    try {
      const newImages: UploadedImage[] = [];
      for (const file of filesToProcess) {
        const processed = await processFile(file);
        newImages.push(processed);
      }
      onChange([...images, ...newImages]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error processing plant images.');
    }
  };

  const handleRemove = (id: string) => {
    if (disabled) return;
    onChange(images.filter((img) => img.id !== id));
  };

  const handleTagChange = (id: string, newTag: string) => {
    if (disabled) return;
    onChange(
      images.map((img) => (img.id === id ? { ...img, partTag: newTag } : img))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-emerald-600" />
            Plant Photographs (1–5 images)
            <span className="text-xs font-normal text-rose-500">*Required</span>
          </label>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit close-ups of lesions, undersides of leaves, and whole plant vigor.
          </p>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
            images.length > 0
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}
        >
          {images.length} / 5 photos
        </span>
      </div>

      {errorMsg && (
        <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center gap-2">
          <Info className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Upload Dropzone */}
      {images.length < 5 && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/50'
              : 'border-slate-300 hover:border-emerald-400 bg-slate-50/70 hover:bg-emerald-50/20'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={disabled}
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = '';
            }}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            disabled={disabled}
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = '';
            }}
          />

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">
                Click to browse or drag & drop plant photos
              </p>
              <p className="text-xs text-slate-500 mt-1">
                PNG, JPG, WebP, or SVG up to 10MB each
              </p>
            </div>

            <div className="flex items-center gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                Upload Photos
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={() => cameraInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-900 text-white shadow-sm transition"
              >
                <Camera className="w-3.5 h-3.5" />
                Take Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Thumbnails Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="relative group rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col"
            >
              {/* Image preview */}
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <img
                  src={img.dataUrl}
                  alt={`Plant specimen ${idx + 1}`}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-md border border-white/20">
                  Image #{idx + 1}
                </span>

                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemove(img.id)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-rose-600/90 hover:bg-rose-700 text-white transition shadow-sm"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Tag / view angle selector */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex-1 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mb-1">
                  <Tag className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>View angle / plant part:</span>
                </div>
                <select
                  value={img.partTag || VIEW_TAGS[0]}
                  disabled={disabled}
                  onChange={(e) => handleTagChange(img.id, e.target.value)}
                  className="text-xs bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                >
                  {VIEW_TAGS.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          {/* Slot for adding another if under 5 */}
          {images.length < 5 && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl p-4 flex flex-col items-center justify-center text-slate-500 hover:text-emerald-700 bg-white hover:bg-emerald-50/20 transition min-h-[140px] cursor-pointer"
            >
              <Plus className="w-6 h-6 mb-1 text-emerald-600" />
              <span className="text-xs font-medium">Add Photo ({5 - images.length} remaining)</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
