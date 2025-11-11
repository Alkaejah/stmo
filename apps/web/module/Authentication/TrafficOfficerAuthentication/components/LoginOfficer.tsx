"use client";
import { Button } from "@/common/components/shadcn/ui/button";
import { Input } from "@/common/components/shadcn/ui/input";
import { Typography } from "@/common/components/ui/Typography";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { EncryptionService } from "@repo/services/";
import { T_Back_Officers } from "@repo/contract";
import { LucideEye, LucideEyeOff } from "lucide-react";
import useBackOfficerLogin from "@/common/hooks/BackOffice/useBackOfficerLogin";

const encryptionService = new EncryptionService("backOfficePassword");

const LoginOfficer = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [rememberMe, setRememberMe] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { mutateAsync: loginOfficer, isPending: isLoginPending } =
    useBackOfficerLogin();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<T_Back_Officers>();

  useEffect(() => {
    setIsClient(true);

    if (typeof window !== "undefined") {
      const storedUsername = localStorage.getItem("rememberedUsername");
      const storedEncryptedPassword =
        localStorage.getItem("rememberedPassword");

      if (storedUsername && storedEncryptedPassword) {
        try {
          const decryptedPassword = encryptionService.decrypt(
            storedEncryptedPassword,
          );

          if (typeof decryptedPassword === "string") {
            setValue("username", storedUsername);
            setValue("password", decryptedPassword);
            setRememberMe(true);
          } else {
            throw new Error("Decryption did not return a string");
          }
        } catch (error) {
          console.error("Decryption failed:", error);
          localStorage.removeItem("rememberedPassword");
        }
      }
    }
  }, [setValue]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const onSubmit = async (formData: T_Back_Officers) => {
    if (rememberMe) {
      localStorage.setItem("rememberedUsername", formData.username);
      localStorage.setItem(
        "rememberedPassword",
        encryptionService.encrypt(formData.password),
      );
    } else {
      localStorage.removeItem("rememberedUsername");
      localStorage.removeItem("rememberedPassword");
    }

    const callBackReq = {
      onSuccess: (data: any) => {
        if (!data.error && !isLoginPending) {
          if (data.action && data.action.link) {
            queryClient.invalidateQueries({ queryKey: ["session-officers"] });
            router.push(data.action.link);
          }
        } else {
          toast.error(String(data.message));
        }
      },
      onError: (err: any) => {
        toast.error(String(err));
      },
    };

    await loginOfficer(
      {
        username: formData.username,
        password: encryptionService.encrypt(formData.password),
      },
      callBackReq,
    );
  };

  if (!isClient) return null;

  return (
    <div className="relative w-full min-h-screen flex justify-center items-center bg-cover bg-center bg-[url('/Aerial_Shot.png')] px-4 sm:px-6 md:px-8 lg:px-6">
      <div className="relative z-10 w-full max-w-full min-h-[90vh] bg-primary bg-opacity-50 shadow-2xl rounded-xl flex flex-col justify-center items-center p-6 sm:p-10 md:p-12 lg:p-14">
        <div className="flex justify-center text-center mb-4">
          <Image
            src="/etravio.png"
            alt="Logo"
            width={800}
            height={800}
            className="object-fit w-fit h-28"
          />
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 md:p-10 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-lg mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="mb-6 text-center">
              <Typography
                variant="h3"
                fontWeight="bold"
                className="text-lg sm:text-xl md:text-2xl text-gray-800"
              >
                LOGIN TO YOUR ACCOUNT
              </Typography>
            </div>
            <div className="mb-4 w-full">
              <label
                htmlFor="username"
                className="block text-gray-700 font-bold mb-2 text-sm sm:text-base"
              >
                Username
              </label>
              <Input
                type="text"
                id="username"
                className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("username", {
                  required: "You need to fill up this form",
                })}
                placeholder="Enter Username"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base">
                Password
              </label>
              <div className="relative">
                <Input
                  type={isPasswordVisible ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required!",
                  })}
                  placeholder="Enter Password"
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
            <div className="flex justify-between items-center mt-4">
              <div>
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="mr-2 leading-tight"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label
                  htmlFor="rememberMe"
                  className="text-gray-700 text-sm sm:text-base"
                >
                  Remember this device
                </label>
              </div>

              <Link href={`/stmo/officers/reset-password-control-number`}>
                <Typography
                  fontWeight="semiBold"
                  className="text-gray-700 hover:text-gray-500 text-sm sm:text-base"
                >
                  Forgot Password?
                </Typography>
              </Link>
            </div>
            <div className="sm:flex items-center justify-between mt-4">
              <Button
                type="submit"
                size="lg"
                className="w-full bg-secondary hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginOfficer;
