import { set } from "lodash";
import { useState } from "react";
import { PlaylistMediaService } from "~/services/playlistMedia.service";
import { usePlaylistStore } from "~/store/playlistStore";
import { Media } from "~/types/Media";
import { PlaylistMedia } from "~/types/PlaylistMedia";
import { catchError } from "~/utils/catchError";

export const usePlaylistsMedias = () => {
  const [selectedPlaylistMedias, setSelectedPlaylistMedias] = useState<
    PlaylistMedia[]
  >([]);
  const { playlist, setPlaylist } = usePlaylistStore();

  function handlePressPlaylistMedia(item: PlaylistMedia) {
    if (selectedPlaylistMedias.some((media) => media.id === item.id)) {
      setSelectedPlaylistMedias(
        selectedPlaylistMedias.filter((media) => media.id !== item.id)
      );
    } else {
      setSelectedPlaylistMedias([...selectedPlaylistMedias, item]);
    }
  }

  async function deleteSelectedPlaylistMedias() {
    const [error, data] = await catchError(
      PlaylistMediaService.deletePlaylistMedias(
        selectedPlaylistMedias.map((media) => media.id)
      )
    );
    if (error) {
      console.log(error);
    } else {
      if (playlist?.id !== undefined) {
        const updatedMedias = (playlist.medias || []).filter(
          (media) =>
            !selectedPlaylistMedias.some((selected) => selected.id === media.id)
        );
        setPlaylist({ ...playlist, medias: updatedMedias });
      }
      setSelectedPlaylistMedias([]);
    }
  }

  return {
    selectedPlaylistMedias,
    setSelectedPlaylistMedias,
    handlePressPlaylistMedia,
    deleteSelectedPlaylistMedias,
  };
};
