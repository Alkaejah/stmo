import { create } from "zustand";
import { T_Photo } from "@repo/contract";

type T_PhotoStoreState = {
  photos: T_Photo[];
  toEditPhotoIndex: number | null;
  setPhotos: (photos: T_Photo[]) => void;
  setToEditPhotoIndex: (value: number) => void;
  setDescription: (value: string) => void;
  setTags: (value: string) => void;
  setMainPhoto: (value: boolean) => void;
  removePhoto: () => void;
};

const usePhotoStore = create<T_PhotoStoreState>((set) => ({
  photos: [],
  toEditPhotoIndex: null,
  setPhotos: (photos) => set({ photos }),
  setToEditPhotoIndex: (value) => set(() => ({ toEditPhotoIndex: value })),
  setDescription: (value) =>
    set((state) => {
      if (state.toEditPhotoIndex !== null) {
        const updatedPhotos = [...state.photos];
        // @ts-ignore
        updatedPhotos[state.toEditPhotoIndex].description = value;
        return { photos: updatedPhotos };
      }
      return state;
    }),
  setTags: (value) =>
    set((state) => {
      if (state.toEditPhotoIndex !== null) {
        const updatedPhotos = [...state.photos];
        // @ts-ignore
        updatedPhotos[state.toEditPhotoIndex].tags = value;
        return { photos: updatedPhotos };
      }
      return state;
    }),
  setMainPhoto: (value) =>
    set((state) => {
      if (state.toEditPhotoIndex !== null) {
        const updatedPhotos = [...state.photos];
        // @ts-ignore
        updatedPhotos[state.toEditPhotoIndex].isMain = value;
        return { photos: updatedPhotos };
      }
      return state;
    }),
  removePhoto: () =>
    set((state) => {
      if (state.toEditPhotoIndex !== null) {
        const updatedPhotos = [...state.photos];
        // @ts-expect-error
        updatedPhotos[state.toEditPhotoIndex].isDeleted = true;
        return { photos: updatedPhotos, toEditPhotoIndex: null };
      }
      return state;
    }),
}));

export default usePhotoStore;
