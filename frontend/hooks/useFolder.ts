import { useCallback, useEffect } from "react";
import { FolderService } from "~/services/folder.service";
import { MediaService } from "~/services/media.service";
import { useFolderStore } from "~/store/folderStore";
import { Folder } from "~/types/Folder";
import { Media } from "~/types/Media";
import { catchError } from "~/utils/catchError";

const assignFolderType = (folder: Folder): Folder => ({
  ...folder,
  type: "folder",
  subFolders: folder.subFolders
    ? folder.subFolders.map(assignFolderType)
    : undefined,
  media: folder.media ? folder.media.map(assignMediaType) : undefined,
});

const assignMediaType = (media: Media): Media => ({
  ...media,
  type: media.type,
});

export const useFolder = () => {
  const { folder, setFolder, selectedItems, setSelectItems } = useFolderStore();

  const getRootFolder = async () => {

    const [error, rootFolder] = await catchError(FolderService.getRoot());
    if (error) {

    } else if (rootFolder) {
      const typedFolder = assignFolderType(rootFolder); // Assignation du type
      setFolder(typedFolder);
    }
  };

  const getFolderById = useCallback(
    async (folderId: number | null) => {
      const [error, folder] = await catchError(FolderService.getFolderById(folderId));
      if (error) {

      } else if (folder) {
        const typedFolder = assignFolderType(folder); // Assignation du type
        setFolder(typedFolder);
      }
    },
    [setFolder]
  );

  const createFolder = useCallback(
    async (folderName: string, parent_id: number | null) => {
      const [error, newFolder] = await catchError(FolderService.createFolder(folderName, parent_id));
      if (error) {

      } else if (folder && newFolder) {
        const typedFolder = assignFolderType(newFolder); 
        const updatedSubFolders = [...(folder.subFolders || []), typedFolder];
        setFolder({ ...folder, subFolders: updatedSubFolders });
      }
    },
    [folder, setFolder]
  );

  const handleItemFolderPress = (item: Folder) => {
    console.log("item", folder);
    getFolderById(item.id);
  };

  const handleItemMediaPress = (item: Media) => {
    console.log("item", item);
  };

  const handleItemSelect = (item: Folder | Media) => {
    console.log("item", selectedItems);
    if (selectedItems.some((f) => f.id === item.id && f.type === item.type)) {
      setSelectItems(
        selectedItems.filter((f) => !(f.id === item.id && f.type === item.type))
      );
    } else {
      setSelectItems([...selectedItems, item]);
    }
  };

  const handleBack = () => {
    getFolderById(folder?.parent_id || null);
  };

  const deleteItems = async (selectedItems: (Folder | Media)[]) => {
    const folderIds: number[] = [];
    const mediaIds: number[] = [];

    selectedItems.forEach((item) => {
      if ("subFolders" in item) {
        folderIds.push(item.id);
      } else {
        mediaIds.push(item.id);
      }
    });

    if (folderIds.length > 0) {
      console.log(folderIds);
      const [error] = await catchError(FolderService.deleteFolders(folderIds));
      if (error) {

      }
    }

    if (mediaIds.length > 0) {
      console.log(mediaIds);
      const [error] = await catchError(MediaService.deleteMedia(mediaIds));
      if (error) {

      }
    }
    if (folder) {
      const updatedSubFolders =
        folder.subFolders?.filter(
          (f) =>
            !selectedItems.some(
              (item) => "subFolders" in item && item.id === f.id
            )
        ) || [];

      const updatedMedia =
        folder.media?.filter(
          (m) =>
            !selectedItems.some(
              (item) => !("subFolders" in item) && item.id === m.id
            )
        ) || [];

      setFolder({
        ...folder,
        subFolders: updatedSubFolders,
        media: updatedMedia,
      });
    }

    setSelectItems([]);
  };


  return {
    folder,
    setFolder,
    createFolder,
    setSelectItems,
    selectedItems,
    handleItemFolderPress,
    handleItemMediaPress,
    handleItemSelect,
    deleteItems,
    handleBack,
    getRootFolder,
  };
};
