import { API_URL_BACKOFFICE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { IBackOfficer } from "@/common/types/global";
import { useMutation } from "@tanstack/react-query";

//TODO: create separate zod type for this

export async function backOfficerLogin(props: IBackOfficer) {
  const apiService = new ApiService();
  return await apiService.post(`${API_URL_BACKOFFICE}/auth/login`, props);
}
function useBackOfficerLogin() {
  const query = useMutation({
    mutationFn: (props: IBackOfficer) => backOfficerLogin(props),
  });
  return query;
}

export default useBackOfficerLogin;
