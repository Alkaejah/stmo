import { API_URL_BACKOFFICE } from "@/common/constants";
import { useMutation } from "@tanstack/react-query";
import { ApiService } from "@/common/services/api";
import { T_Back_Officer_Register } from "@repo/contract";

export async function backOfficerRegister(props: T_Back_Officer_Register) {
  const apiService = new ApiService();
  return await apiService.post(`${API_URL_BACKOFFICE}/auth/register`, props);
}

function useBackOfficerRegister() {
  const query = useMutation({
    mutationFn: (props: T_Back_Officer_Register) => backOfficerRegister(props),
  });
  return query;
}

export default useBackOfficerRegister;
