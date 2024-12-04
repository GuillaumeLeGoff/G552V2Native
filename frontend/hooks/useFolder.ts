import { useCallback, useEffect } from "react";
import { FolderService } from "~/services/folder.service";
import { MediaService } from "~/services/media.service";
import { useFolderStore } from "~/store/folderStore";
import { Folder } from "~/types/Folder";
import { Media } from "~/types/Media";
import { catchError } from "~/utils/catchError";

export const useFolder = () => {
  const { folder, setFolder, selectedFolder, setSelectFolder, sortFolder, setSortFolder } =
    useFolderStore();
  const getRootFolder = async () => {
    const [error, rootFolder] = await catchError(FolderService.getRoot());
    if (error) {
    } else if (rootFolder) {
      setFolder(rootFolder);
    }
  };
  const getFolderById = useCallback(
    async (folderId: number | null) => {
      const [error, folder] = await catchError(
        FolderService.getFolderById(folderId)
      );
      if (error) {
      } else if (folder) {
        setFolder(folder);
      }
    },
    [setFolder]
  );
  const createFolder = useCallback(
    
    async (folderName: string, parent_id: number | null) => {
       console.log("newFolder", folder?.path);
      const [error, newFolder] = await catchError(
        FolderService.createFolder(folderName, parent_id)
      );
      console.log("newFolder", newFolder);
      if (error) {
      } else if (folder && newFolder) {
        const updatedSubFolders = [...(folder.subFolders || []), newFolder];
        setFolder({ ...folder, subFolders: updatedSubFolders , path: folder.path });
        console.log("newFolder", folder.path);
      }
    },
    
    [folder, setFolder]
  );


  // Delete items (folder or media)
  const deleteItems = async (selectedItems: (Folder | Media)[]) => {
    const folderIds: number[] = [];
    const mediaIds: number[] = [];

    selectedItems.forEach((item) => {
      if ("type" in item) {
        mediaIds.push(item.id);
      } else {
        folderIds.push(item.id);
      }
    });

    if (folderIds.length > 0) {
      const [error] = await catchError(FolderService.deleteFolders(folderIds));
      if (error) {
      }
    }

    if (mediaIds.length > 0) {
      const [error] = await catchError(MediaService.deleteMedia(mediaIds));
      if (error) {
      }
    }
    if (folder) {
      const updatedSubFolders =
        folder.subFolders?.filter(
          (folder: Folder) =>
            !selectedItems.some(
              (item: Folder | Media) => "name" in item && item.id === folder.id
            )
        ) || [];

      const updatedMedia =
        folder.media?.filter(
          (media: Media) =>
            !selectedItems.some(
              (item: Folder | Media) =>
                item.id === media.id
            )
        ) || [];

      setFolder({
        ...folder,
        subFolders: updatedSubFolders,
        media: updatedMedia,
      });
    }

    setSelectFolder([]);
  };

  // Handle the press on a media
  const handleMediaPress = (item: Media) => {
  
  };

  // Select folder and media
  const handleSelect = (item: Folder | Media) => {
    if (selectedFolder.some((f: Folder | Media) => f.id === item.id)) {
      setSelectFolder(
        selectedFolder.filter((f: Folder | Media) => f.id !== item.id)
      );
    } else {
      setSelectFolder([...selectedFolder, item]);
    }
  };

  // Handle the back button
  const handleBack = () => {
    getFolderById(folder?.parent_id || null);
  };

  useEffect(() => {
    getRootFolder();
  }, []);

  return {
    folder,
    setFolder,
    createFolder,
    setSelectFolder,
    getFolderById,
    selectedFolder,
    handleMediaPress,
    handleSelect,
    deleteItems,
    handleBack,
    getRootFolder,
    sortFolder,
    setSortFolder,
  };
};
