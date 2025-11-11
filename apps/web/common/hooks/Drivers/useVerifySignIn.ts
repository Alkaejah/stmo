// import { useQuery } from "@tanstack/react-query";
// import { useParams } from "next/navigation";
// import { ApiService } from "@/common/services/api";
// import { API_URL_DRIVERS, THREE_MINUTES } from "@/common/constants";
// import useDriverSessionStore from "@/common/store/useDriverSessionStore";

// export type T_VerifySignIn = { email: string; type: string };

// export async function verifySignIn(props: T_VerifySignIn) {
//   const apiService = new ApiService();
//   return await apiService.get(`${API_URL_DRIVERS}/auth/verify-sign-in`, props);
// }

// function useVerifySignIn() {
//   const session = useDriverSessionStore((state) => state);
//   const params = useParams();
//   const query = useQuery({
//     queryKey: ["sign-in"],
//     queryFn: () =>
//       verifySignIn({
//         type: params.type as string,
//         email: session.email || "",
//       }),
//     enabled: !!params.type,
//     staleTime: THREE_MINUTES,
//   });
//   return query;
// }

// export default useVerifySignIn;
