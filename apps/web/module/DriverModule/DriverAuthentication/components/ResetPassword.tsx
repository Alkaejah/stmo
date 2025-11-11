"use client";
import { Button } from "@/common/components/shadcn/ui/button";
import { Input } from "@/common/components/shadcn/ui/input";
import { Typography } from "@/common/components/ui/Typography";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import useVerifyForgotPassword from "@/common/hooks/Drivers/useVerifyForgotPassword";
import { EncryptionService } from "@repo/services";
import { LucideEye, LucideEyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface IResetPassword {
  driverControlNumber: string;
  newPassword: string;
  confirmPassword?: string;
}

const encryptionService = new EncryptionService("password");

const ResetPassword = () => {
  const [controlNumber, setControlNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const { mutate: resetPassword, isPending: isPendingReset } =
    useVerifyForgotPassword();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IResetPassword>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedControlNumber = localStorage.getItem("controlNumber");
      setControlNumber(storedControlNumber);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible((prev) => !prev);
  };

  const onSubmit = (formData: IResetPassword) => {
    const { newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const encryptedPassword = encryptionService.encrypt(newPassword);

    resetPassword(
      {
        driverControlNumber: controlNumber as string,
        newPassword: encryptedPassword,
      },
      {
        onSuccess: (data: any) => {
          if (!data.error && !isPendingReset) {
            toast.success("Password reset successful!");

            // ✅ Remove old stored credentials and update with the new password
            localStorage.setItem("rememberedPassword", encryptedPassword);

            setTimeout(() => {
              router.push(`/`);
            }, 2000);

            reset({
              newPassword: "",
              confirmPassword: "",
            });
          } else {
            toast.error(data.message || "Failed to reset password.");
          }
        },
        onError: (err: any) => {
          toast.error(String(err));
        },
      },
    );
  };

  if (!controlNumber) return null;

  return (
    <WidthWrapper width="full">
      <div className="bg-[url('/Aerial_Shot.png')] bg-cover bg-center w-full min-h-screen flex justify-center items-center">
        <div className="sm:p-2 md:p-8 w-full flex justify-center">
          <div className="bg-primary bg-opacity-80 rounded-lg w-11/12 md:w-3/4 lg:w-3/4 xl:w-3/4 max-w-6xl mx-auto min-h-[90vh] sm:px-8 md:px-32 shadow-lg flex flex-col justify-center">
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 md:p-10 lg:p-12 w-full max-w-2xl mx-auto">
              <Typography className="text-2xl lg:text-3xl text-center font-bold text-black mb-6">
                Reset password
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-bold mb-2 mt-2">
                        Driver Control Number
                      </label>
                      <Input
                        readOnly
                        type="text"
                        className="w-full"
                        value={controlNumber || ""}
                        disabled
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        required
                        type={isPasswordVisible ? "text" : "password"}
                        {...register("newPassword", {
                          required: "Password is required!",
                        })}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {isPasswordVisible ? (
                          <LucideEye size={20} />
                        ) : (
                          <LucideEyeOff size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Input
                        type={isConfirmPasswordVisible ? "text" : "password"}
                        {...register("confirmPassword", {
                          required: "Confirm Password is required!",
                        })}
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {isConfirmPasswordVisible ? (
                          <LucideEye size={20} />
                        ) : (
                          <LucideEyeOff size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row sm:justify-between lg:justify-end gap-4">
                  <Button
                    type="submit"
                    className="w-full sm:w-32 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    disabled={isPendingReset}
                  >
                    {isPendingReset ? "Submitting..." : "Reset Password"}
                  </Button>
                  <Button
                    type="button"
                    className="w-full sm:w-32 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    onClick={() => router.push("/")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </WidthWrapper>
  );
};

export default ResetPassword;
