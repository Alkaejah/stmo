import { useMutation } from "@tanstack/react-query";
import { T_Photo } from "@repo/contract";
import { ApiService } from "@/common/services/api";
import { API_URL_ENFORCER_MODULE } from "@/common/constants";

export async function addEnforcerSignature(
  ticketId: string | undefined,
  props: T_Photo,
) {
  const formData = new FormData();
  formData.append("file", props.file as File);
  formData.append("isMain", String(props.isMain));
  formData.append("description", props.description);
  formData.append("tags", props.tags);
  const apiService = new ApiService();
  return await apiService.post(
    `${API_URL_ENFORCER_MODULE}/tickets/tickets/citation-ticket/generated/${ticketId}/e-signature`,
    formData,
    true, // raw form data
    true, // remove content type
  );
}

function useAddEnforcerSignature(ticketId: string | undefined) {
  const query = useMutation({
    mutationFn: (props: T_Photo) => addEnforcerSignature(ticketId, props),
  });
  return query;
}
export default useAddEnforcerSignature;
