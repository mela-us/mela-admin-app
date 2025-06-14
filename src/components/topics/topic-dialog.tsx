import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Upload, X } from "lucide-react";

interface Topic {
  topicId: string;
  name: string;
  imageUrl: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (topic: any) => void
  title: string;
  confirmText: string;
  initialData?: Topic | null;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const VALID_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export default function TopicDialog({
  open,
  onOpenChange,
  onSave,
  title,
  confirmText,
  initialData,
}: Props) {
  const [formData, setFormData] = useState({
    name: "",
    selectedImage: null as File | null,
    selectedFileName: "",
    previewUrl: "",
  });
  const [isValidName, setIsValidName] = useState(false);
  const [isValidImage, setIsValidImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with initialData or reset
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        selectedImage: null,
        previewUrl: initialData.imageUrl,
        selectedFileName: initialData.imageUrl.split("/").pop() || "image.jpg",
      });
    } else {
      resetForm();
    }
  }, [initialData/*, open*/]);

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (formData.previewUrl) URL.revokeObjectURL(formData.previewUrl);
    };
  }, [formData.previewUrl]);

  // Validate form
  useEffect(() => {
    const isNameValid = formData.name.trim().length > 0;
    setIsValidName(isNameValid);
  }, [formData.name]);

  // Validate form
  useEffect(() => {
    const isImageValid = !!formData.previewUrl || !!formData.selectedImage;
    setIsValidImage(isImageValid);
  }, [formData.previewUrl, formData.selectedImage]);

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      selectedImage: null,
      selectedFileName: "",
      previewUrl: "",
    });
    setError(null);
  }, []);

  const handleImageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > MAX_FILE_SIZE) {
      setError("File is too large! Please select a file smaller than 5MB.");
      return;
    }

    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, GIF, or WebP).");
      return;
    }

    setError(null);
    const newPreviewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      selectedImage: file,
      selectedFileName: file.name,
      previewUrl: newPreviewUrl,
    }));
  }, []);

  const handleSave = useCallback(() => {
    const topicData = {
      name: formData.name,
      ...(formData.selectedImage != null && {
        file: formData.selectedImage,
        filename: formData.selectedFileName,
      }),
      ...(initialData && {
        topicId: initialData.topicId,
      }),
    };

    onSave(topicData);
    onOpenChange(false);
    resetForm();
  }, [
    isValidName,
    isValidImage,
    formData,
    initialData,
    onSave,
    resetForm,
    onOpenChange,
  ]);

  const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
  }, []);

  const removeImage = useCallback(() => {
    if (formData.previewUrl) URL.revokeObjectURL(formData.previewUrl);
    setFormData(prev => ({
      ...prev,
      selectedImage: null,
      selectedFileName: "",
      previewUrl: "",
    }));
  }, [formData.previewUrl]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">{title}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Topic Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="Enter topic name"
              className="h-10 focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="image" className="text-sm font-medium">Topic Image</Label>

            <div className="flex flex-col items-center">
              {formData.previewUrl ? (
                <div className="relative w-full h-64 mb-3 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={formData.previewUrl}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 w-8 h-8 bg-white text-gray-700 hover:text-white rounded-full"
                    onClick={removeImage}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={triggerFileInput}
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <Upload size={36} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload an image</p>
                  <p className="text-xs text-gray-500 mt-1">JPEG, PNG, GIF or WebP (max. 5MB)</p>
                </div>
              )}

              <Input
                ref={fileInputRef}
                id="image"
                type="file"
                accept={VALID_IMAGE_TYPES.join(",")}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {error && (
              <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {formData.selectedFileName && !error && (
              <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Selected: {formData.selectedFileName}
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-3 mt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={(initialData && !isValidName) || (!initialData && (!isValidImage || !isValidName))}
            className="flex-1 h-10"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
