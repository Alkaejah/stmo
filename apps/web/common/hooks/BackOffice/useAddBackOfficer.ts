import { API_URL_BACKOFFICE } from "@/common/constants";
import { useMutation } from "@tanstack/react-query";
import { ApiService } from "@/common/services/api";
import { T_Add_Back_Officers } from "@repo/contract";

export async function addBackOfficer(props: T_Add_Back_Officers) {
  const apiService = new ApiService();
  return await apiService.post(
    `${API_URL_BACKOFFICE}/auth/add-backofficer`,
    props,
  );
}

function useAddBackOfficer() {
  const query = useMutation({
    mutationFn: (props: T_Add_Back_Officers) => addBackOfficer(props),
  });
  return query;
}

export default useAddBackOfficer;
