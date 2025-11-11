"use client";
import { Button } from "@/common/components/shadcn/ui/button";
import { Input } from "@/common/components/shadcn/ui/input";
import { Typography } from "@/common/components/ui/Typography";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import useUpdateBackOfficerAccountPassword from "@/common/hooks/BackOffice/useUpdateBackOfficerAccountPassword";
import { T_Back_Officer_Change_Password } from "@repo/contract";
import {
  LucideAlertCircle,
  LucideArrowLeft,
  LucideEye,
  LucideEyeOff,
  LucideRefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const UpdatePassword = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const router = useRouter();
  const { mutateAsync: updatePassword } = useUpdateBackOfficerAccountPassword();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<T_Back_Officer_Change_Password>();

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);
  const toggleNewPasswordVisibility = () =>
    setIsNewPasswordVisible((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible((prev) => !prev);

  const onSubmit = async (formData: T_Back_Officer_Change_Password) => {
    try {
      setIsLoading(true);

      if (formData.newPassword !== formData.confirmNewPassword) {
        toast.error("New password and confirm password did not match!");
        setIsLoading(false);
        return;
      }

      const response = await updatePassword(formData);

      if (response?.error) {
        toast.error(
          "Change password failed! Old password might not be correct!",
        );
      } else {
        toast.success("Change password successful!");
        setTimeout(() => {
          router.push("/stmo/officers");
        }, 2000);
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WidthWrapper width="full">
      <div className="bg-[url('/Aerial_Shot.png')] bg-cover bg-center w-full min-h-screen flex justify-center items-center">
        <div className="sm:p-2 md:p-8 w-full flex justify-center">
          <div className="bg-primary bg-opacity-80 rounded-lg w-11/12 md:w-3/4 lg:w-3/4 xl:w-3/4 max-w-6xl mx-auto min-h-[90vh] sm:p-8 md:px-32 shadow-lg flex flex-col justify-center">
            <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-xl mx-auto">
              <Typography
                variant="h2"
                className="text-center font-bold text-black mb-6"
              >
                Update Password
              </Typography>
              <div className="flex gap-1">
                <LucideAlertCircle size={11} className="mt-0.5" />
                <Typography className="text-xs italic text-gray-600 mb-4">
                  Use a mix of uppercase, lowercase, numbers, and symbols to
                  create a strong password.
                </Typography>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Input
                        required
                        type={isPasswordVisible ? "text" : "password"}
                        {...register("currentPassword", {
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
                      New Password
                    </label>
                    <div className="relative">
                      <Input
                        required
                        type={isNewPasswordVisible ? "text" : "password"}
                        {...register("newPassword", {
                          required: "Password is required!",
                        })}
                      />
                      <button
                        type="button"
                        onClick={toggleNewPasswordVisibility}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {isNewPasswordVisible ? (
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
                        required
                        type={isConfirmPasswordVisible ? "text" : "password"}
                        {...register("confirmNewPassword", {
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

                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:gap-2 md:justify-between mt-6">
                  <Button
                    variant="default"
                    size="default"
                    type="submit"
                    className="bg-secondary w-full sm:w-auto md:w-32 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Submitting..."
                    ) : (
                      <>
                        <LucideRefreshCw size={18} /> Update
                      </>
                    )}
                  </Button>
                  <Link
                    href={`/officer/dashboard`}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      type="button"
                      size="lg"
                      className="w-full md:w-32 sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
                    >
                      <LucideArrowLeft size={18} /> Back
                    </Button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </WidthWrapper>
  );
};

export default UpdatePassword;
