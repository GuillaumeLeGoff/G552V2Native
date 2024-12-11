import { useState } from "react";
import MediaService from "~/services/media.service";
import { useFolderStore } from "~/store/folderStore";
import { Media } from "~/types/Media";
import { catchError } from "~/utils/catchError";

export const useMedia = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setFolder, folder, sortFolder } = useFolderStore();

  const uploadMedia = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    const [error, uploadedMedia] = await catchError(
      MediaService.uploadMedia(formData)
    );
    if (error) {
      console.log("error", error.message, error.status, error.data);
    } else {
      const sortedMedia = await sortMedia(sortFolder, [
        ...media,
        uploadedMedia,
      ]);
      setMedia(sortedMedia);
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
    }
  };
  const fetchAllMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      const allMedia = await MediaService.getAllMedia();
      const sortedMedia = await sortMedia(sortFolder, allMedia);
      setMedia(sortedMedia);
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
      const sortedMedia = await sortMedia(sortFolder, folderMedia);
      setMedia(sortedMedia);
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

  const sortMedia = async (
    sort: "aToZ" | "zToA" | "dateNew" | "dateOld",
    media: Media[]
  ) => {
    return media.sort((a, b) => {
      switch (sort) {
        case "aToZ":
          return a.original_file_name.localeCompare(b.original_file_name);
        case "zToA":
          return b.original_file_name.localeCompare(a.original_file_name);
        case "dateNew":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "dateOld":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        default:
          return 0;
      }
    });
  };

  return {
    media,
    loading,
    error,
    uploadMedia,
    fetchAllMedia,
    fetchMediaById,
    fetchMediaByFolderId,
    sortMedia,
  };
};
