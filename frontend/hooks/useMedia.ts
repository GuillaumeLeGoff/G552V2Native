import { useState } from "react";
import MediaService from "~/services/media.service";
import { Media } from "~/types/Media";
import { useFolder } from "./useFolder";
import { Folder } from "~/types/Folder";
import { useFolderStore } from "~/store/folderStore";

export const useMedia = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const {setFolder, folder} = useFolderStore();



 const uploadMedia = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const uploadedMedia = await MediaService.uploadMedia(formData);
      console.log("uploadedMedia", uploadedMedia);
      setMedia((prevMedia) => [...prevMedia, uploadedMedia]);    
      if (folder) {
        const updatedFolder = {
          ...folder,
          media: folder.media ? [...folder.media, uploadedMedia] : [uploadedMedia],
        };
        setFolder(updatedFolder);
      }

    } catch (err) {
      if (err instanceof Error) {
        console.log("err", err);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };
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

  const updateMedia = async (mediaId: number, updateData: any) => {
    setLoading(true);
    setError(null);
    try {
      const updatedMedia = await MediaService.updateMedia(mediaId, updateData);
      setMedia((prevMedia) =>
        prevMedia.map((media) => (media.id === mediaId ? updatedMedia : media))
      );
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

  const deleteMedia = async (mediaId: number) => {
    setLoading(true);
    setError(null);
    try {
      await MediaService.deleteMedia(mediaId);
      setMedia((prevMedia) =>
        prevMedia.filter((media) => media.id !== mediaId)
      );
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
    updateMedia,
    deleteMedia,
  };
};
