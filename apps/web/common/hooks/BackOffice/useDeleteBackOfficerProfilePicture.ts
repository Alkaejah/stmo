import { API_URL_BACKOFFICE } from "@/common/constants";
import { useMutation } from "@tanstack/react-query";
import { T_Photo } from "@repo/contract";
import { ApiService } from "@/common/services/api";

export async function deleteBackOfficerProfilePicture(
  backOfficerId: string | undefined,
  props: T_Photo,
) {
  const apiService = new ApiService();
  return await apiService.delete(
    `${API_URL_BACKOFFICE}/auth/personal-info/${backOfficerId}/profile-picture/${props._id}`,
    {},
  );
}

function useDeleteBackOfficerProfilePicture(backOfficerId: string | undefined) {
  const query = useMutation({
    mutationFn: (props: T_Photo) =>
      deleteBackOfficerProfilePicture(backOfficerId, props),
  });
  return query;
}
export default useDeleteBackOfficerProfilePicture;
