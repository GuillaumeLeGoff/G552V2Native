import { useCallback, useEffect, useState } from "react";
import { FolderService } from "~/services/folder.service";
import { useFolderStore } from "~/store/folderStore";
import { Folder } from "~/types/Folder";

export const useFolder = () => {
  const {
    folders,
    setFolders,
    currentFolderId,
    setCurrentFolderId,
    selectedFolder,
    setSelectFolder,
  } = useFolderStore();

  const getFolders = useCallback(async () => {
    const folders = await FolderService.getFolders();
    console.log("folders", folders);
    setFolders(folders);

    // Définir le dossier "home" comme dossier courant
    const homeFolder = folders.find(
      (folder) => folder.name === "Home" && folder.parent_id === null
    );
    if (homeFolder) {
      setCurrentFolderId(homeFolder.id);
    }
  }, [setFolders, setCurrentFolderId]);

  const createFolder = useCallback(
    async (folderName: string, parent_id: number | null) => {
      const folder = await FolderService.createFolder(folderName, parent_id);
      setFolders([...folders, folder]);
    },
    [folders, setFolders]
  );

  const handleItemLongPress = (item: Folder) => {
    if (selectedFolder?.some((f) => f.id === item.id)) {
      setSelectFolder(selectedFolder.filter((f) => f.id !== item.id));
    } else {
      setSelectFolder([...(selectedFolder || []), item]);
    }
    console.log("item", item);
    console.log("selectedFolder", selectedFolder);
  };

  const handleItemPress = (folder: Folder) => {
    // Logique pour gérer la pression simple sur un dossier
  };

  const deleteFolders = async (selectedFolder: Folder[]) => {
    await FolderService.deleteFolders(selectedFolder.map((f) => f.id));
    setFolders(folders.filter((f) => !selectedFolder.includes(f)));
    setSelectFolder([]);
  };

  const getFolderPath = () => {
    if (!currentFolderId) return "";
    const path = [];
    let folder = folders.find((f) => f.id === currentFolderId);
    while (folder) {
      path.unshift(folder.name);
      folder = folders.find((f) => f.id === folder?.parent_id);
    }
    return path.join(" / ");
  };

  useEffect(() => {
    getFolders();
  }, [getFolders]);

  return {
    folders,
    getFolders,
    createFolder,
    currentFolderId,
    setSelectFolder,
    setCurrentFolderId,
    selectedFolder,
    handleItemPress,
    handleItemLongPress,
    deleteFolders,
    getFolderPath,
  };
};
