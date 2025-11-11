import { API_URL_ADMIN_MODULE } from "@/common/constants";
import { useMutation } from "@tanstack/react-query";
import { ApiService } from "@/common/services/api";
import { T_Violation_Address } from "@repo/contract";

export async function addViolationAddress(props: T_Violation_Address) {
  const apiService = new ApiService();
  return await apiService.post(
    `${API_URL_ADMIN_MODULE}/settings/violation-address`,
    props,
  );
}

function useAddViolationAddress() {
  const query = useMutation({
    mutationFn: (props: T_Violation_Address) => addViolationAddress(props),
  });
  return query;
}

export default useAddViolationAddress;
