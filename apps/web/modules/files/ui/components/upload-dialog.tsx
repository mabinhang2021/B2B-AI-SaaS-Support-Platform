'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Button } from '@workspace/ui/components/button';
import { useState } from 'react';
import { api } from '@workspace/backend/_generated/api';
import { useAction } from 'convex/react';
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from '@workspace/ui/components/dropzone';
import { on } from 'events';

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUploaded?: () => void;
}

export const UploadDialog = ({
  open,
  onOpenChange,
  onFileUploaded,
}: UploadDialogProps) => {
  const addFile = useAction(api.private.files.addFile);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    fileName: '',
    category: '',
  });

  const handleFileDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFiles([file]);
      if (!uploadForm.fileName) {
        setUploadForm((prev) => ({ ...prev, fileName: file.name }));
      }
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    try{
        const blob = uploadedFiles[0];
        if(!blob) return;
        const filename = uploadForm.fileName || blob.name;
        await addFile({
            bytes: await blob.arrayBuffer(),
            fileName: filename,
            mimeType: blob.type || "text/plain",
        })
        onFileUploaded?.();
        handleCancel();
    }catch (error) {
      console.error('File upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  }

  const handleCancel = () => {
    setUploadedFiles([]);
    onOpenChange(false);
    setUploadForm({ fileName: '', category: '' });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            upload documents to your AI assistant's knowledge base for search
            and retrieval.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              className="w-full"
              id="category"
              value={uploadForm.category}
              onChange={(e) =>
                setUploadForm((prev) => ({ ...prev, category: e.target.value }))
              }
              placeholder="e.g., Documentation,Support,Product"
              type="text"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filename">
              Filename{' '}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              className="w-full"
              id="filename"
              value={uploadForm.fileName}
              onChange={(e) =>
                setUploadForm((prev) => ({ ...prev, fileName: e.target.value }))
              }
              placeholder="override default filename"
              type="text"
            />
          </div>
          <Dropzone
            accept={{
              'application/pdf': ['.pdf'],
              'text/csv': ['.csv'],
              'text/plain': ['.txt'],
            }}
            disabled={isUploading}
            maxFiles={1}
            src={uploadedFiles}
            onDrop={handleFileDrop}
          >
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>
        </div>
        <DialogFooter>
            <Button
                disabled={isUploading }
                variant="outline"
                onClick={handleCancel}
            >
                Cancel
            </Button>
            <Button
                onClick={handleUpload}
                disabled={isUploading || uploadedFiles.length === 0 || !uploadForm.category}
            >
                {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
