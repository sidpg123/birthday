// components/ImageUploader.tsx
import { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { uploadImage } from '@/utils/cloudinary';
import { Loader2, X, Upload } from 'lucide-react';
import Image from 'next/image';

type UploadResult = {
  image: string;
  caption: string;
};

interface ImageUploaderProps {
  onUploadComplete?: (result: UploadResult) => void;
}

export default function ImageUploader({ onUploadComplete }: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check file type
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Check file size (limit to 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError('');
    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an image');
      return;
    }

    if (!caption.trim()) {
      setError('Please add a caption');
      return;
    }

    try {
      setLoading(true);
      const imageUrl = await uploadImage(file);

      onUploadComplete?.({
        image: imageUrl,
        caption: caption.trim(),
      });

      // Reset form
      setFile(null);
      setPreview(null);
      setCaption('');
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setCaption('');
    setError('');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Image Preview */}
          {preview ? (
            <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
              <Image
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-500 mt-2">Click to upload an image</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG or GIF (max 5MB)</p>
            </div>
          )}

          {/* Hidden File Input */}
          <Input
            id="file-input"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />

          {/* Caption Input */}
          <div className="space-y-2">
            <Label htmlFor="caption">Memory Caption</Label>
            <Input
              id="caption"
              placeholder="Write something about this memory..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClear} disabled={loading}>
              Clear
            </Button>
            <Button onClick={handleUpload} disabled={loading || !file}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Memory'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
