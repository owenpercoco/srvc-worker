import React, { useRef, useState } from 'react';
import { Button, IconButton } from '@mui/material';
import Image from 'next/image';
import DeleteIcon from '@mui/icons-material/Delete';
import type { PutBlobResult } from '@vercel/blob';

interface ImageUploaderProps {
  imageUrl?: string;
  onImageUpload: (url: string) => void;
  onImageDelete: () => void; // New callback for image deletion
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ imageUrl, onImageUpload, onImageDelete }) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  const handleImageUpload = async () => {
    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    const file = inputFileRef.current.files[0];
    setUploading(true);

    try {
      const response = await fetch(`/api/files?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });
      const newBlob = (await response.json()) as PutBlobResult;
      setBlob(newBlob);
      setUploading(false);

      if (newBlob.url) {
        onImageUpload(newBlob.url);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      setUploading(false);
    }
  };

  const handleImageDelete = () => {
    setBlob(null); // Clear the blob state
    onImageDelete(); // Trigger the delete callback
  };

  return (
    <div className="image-uploader">
      <input
        type="file"
        ref={inputFileRef}
        disabled={uploading}
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />
      <Button
        onClick={() => inputFileRef.current?.click()}
        disabled={uploading}
        variant="contained"
        component="span"
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </Button>
      {(blob?.url || imageUrl) && (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Image
            src={blob?.url || imageUrl!}
            alt="Product Image"
            width={250}
            height={250}
            objectFit="cover"
          />
          <IconButton
            onClick={handleImageDelete}
            style={{
              position: 'absolute',
              top: 5,
              right: 5,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
