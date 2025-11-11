import { API_URL_ADMIN_MODULE } from "@/common/constants";
import { useMutation } from "@tanstack/react-query";
import { ApiService } from "@/common/services/api";
import { T_Violation } from "@repo/contract";

export async function addViolation(props: T_Violation) {
  const apiService = new ApiService();
  return await apiService.post(
    `${API_URL_ADMIN_MODULE}/settings/violations`,
    props,
  );
}

function useAddViolation() {
  const query = useMutation({
    mutationFn: (props: T_Violation) => addViolation(props),
  });
  return query;
}

export default useAddViolation;
