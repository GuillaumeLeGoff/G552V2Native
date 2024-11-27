import { useState } from "react";
import MediaService from "~/services/media.service";
import { useFolderStore } from "~/store/folderStore";
import { Media } from "~/types/Media";
import { catchError } from '~/utils/catchError';

export const useMedia = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setFolder, folder } = useFolderStore();

  const uploadMedia = async (formData: FormData) => {
    setLoading(true);
    setError(null);

      const [error, uploadedMedia] = await catchError(
        MediaService.uploadMedia(formData)
      );
      if (error) {
        console.log("error", error.message, error.status, error.data);
      } else {
        setMedia((prevMedia) => [...prevMedia, uploadedMedia]);
        if (folder) {
        const updatedFolder = {
          ...folder,
          media: folder.media
            ? [...folder.media, uploadedMedia]
            : [uploadedMedia],
        };
        setFolder(updatedFolder);
      }
   
      setLoading(false);
    
  };
}
  const fetchAllMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      const allMedia = await MediaService.getAllMedia();
      setMedia(allMedia);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMediaById = async (mediaId: number) => {
    setLoading(true);
    setError(null);
    try {
      const mediaItem = await MediaService.getMediaById(mediaId);
      setMedia([mediaItem]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMediaByFolderId = async (folderId: number) => {
    setLoading(true);
    setError(null);
    try {
      const folderMedia = await MediaService.getMediaByFolderId(folderId);
      setMedia(folderMedia);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    media,
    loading,
    error,
    uploadMedia,
    fetchAllMedia,
    fetchMediaById,
    fetchMediaByFolderId,
  };
};
