import { useMutation } from "@tanstack/react-query";
import { T_Photo } from "@repo/contract";
import { ApiService } from "@/common/services/api";
import { API_URL_DRIVERS } from "@/common/constants";

export async function addDriverBreederProfilePicture(
  driverId: string | undefined,
  props: T_Photo,
) {
  const formData = new FormData();
  formData.append("file", props.file as File);
  formData.append("isMain", String(props.isMain));
  formData.append("description", props.description);
  formData.append("tags", props.tags);
  const apiService = new ApiService();
  return await apiService.post(
    `${API_URL_DRIVERS}/auth/personal-info/${driverId}/profile-picture`,
    formData,
    true, // raw form data
    true, // remove content type
  );
}

function useAddDriverBreederProfilePicture(driverId: string | undefined) {
  const query = useMutation({
    mutationFn: (props: T_Photo) =>
      addDriverBreederProfilePicture(driverId, props),
  });
  return query;
}
export default useAddDriverBreederProfilePicture;
