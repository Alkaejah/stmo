import { API_URL_ADMIN_MODULE } from "@/common/constants";
import { useMutation } from "@tanstack/react-query";
import { ApiService } from "@/common/services/api";
import { T_Violation_Category } from "@repo/contract";

export async function addViolationCategory(props: T_Violation_Category) {
  const apiService = new ApiService();
  return await apiService.post(
    `${API_URL_ADMIN_MODULE}/settings/violation-category`,
    props,
  );
}

function useAddViolationCategory() {
  const query = useMutation({
    mutationFn: (props: T_Violation_Category) => addViolationCategory(props),
  });
  return query;
}

export default useAddViolationCategory;
