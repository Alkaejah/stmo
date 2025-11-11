import { API_URL_DRIVERS } from "@/common/constants";
import { useMutation } from "@tanstack/react-query";
import { T_Photo } from "@repo/contract";
import { ApiService } from "@/common/services/api";

export async function deleteDriverProfilePicture(
  driverId: string | undefined,
  props: T_Photo,
) {
  const apiService = new ApiService();
  return await apiService.delete(
    `${API_URL_DRIVERS}/auth/personal-info/${driverId}/profile-picture/${props._id}`,
    {},
  );
}

function useDeleteDriverProfilePicture(driverId: string | undefined) {
  const query = useMutation({
    mutationFn: (props: T_Photo) => deleteDriverProfilePicture(driverId, props),
  });
  return query;
}
export default useDeleteDriverProfilePicture;
