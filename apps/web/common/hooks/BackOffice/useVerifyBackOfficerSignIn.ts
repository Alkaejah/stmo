import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { ApiService } from "@/common/services/api";
import { API_URL_BACKOFFICE, THREE_MINUTES } from "@/common/constants";

export type T_VerifySignIn = { username: string; type: string };

export async function verifyBackOfficerSignIn(props: T_VerifySignIn) {
  const apiService = new ApiService();
  return await apiService.get(
    `${API_URL_BACKOFFICE}/auth/verify-sign-in`,
    props,
  );
}

function useVerifyBackOfficerSignIn() {
  const params = useParams();
  const query = useQuery({
    queryKey: ["backoffice-sign-in"],
    queryFn: () =>
      verifyBackOfficerSignIn({
        type: params.type as string,
        username: "backofficer1",
      }),
    enabled: !!params.type,
    staleTime: THREE_MINUTES,
  });
  return query;
}

export default useVerifyBackOfficerSignIn;
