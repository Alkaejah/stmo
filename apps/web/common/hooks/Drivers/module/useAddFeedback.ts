import { API_URL_DRIVER_MODULE } from "@/common/constants";
import { useMutation } from "@tanstack/react-query";
import { ApiService } from "@/common/services/api";
import { T_Feedback } from "@repo/contract";

export async function addFeedback(
  enforcerId: string | undefined,
  props: T_Feedback,
) {
  const apiService = new ApiService();
  return await apiService.post(
    `${API_URL_DRIVER_MODULE}/tickets/${enforcerId}/feedback`,
    props,
  );
}

function useAddFeedback(enforcerId: string | undefined) {
  const query = useMutation({
    mutationFn: (props: T_Feedback) => addFeedback(enforcerId, props),
  });
  return query;
}

export default useAddFeedback;
