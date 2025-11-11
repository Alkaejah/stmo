"use client";
import { Button } from "@/common/components/shadcn/ui/button";
import { Input } from "@/common/components/shadcn/ui/input";
import { Typography } from "@/common/components/ui/Typography";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import AddViolationModal from "./modal/AddViolationModal";
import useAddTicket from "@/common/hooks/Enforcers/useAddTicket";
import { E_Payment_Status, E_Ticket_Status, T_Ticket } from "@repo/contract";
import { useRouter } from "next/navigation";
import { watch } from "fs";
interface IViolation {
  violationId?: string; // For regular violations
  code?: string; // Only for "Other Violations" (Code 31)
  description?: string; // Only for "Other Violations" (User input)
  penaltyId: string;
}

const index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<T_Ticket>();
  const { mutateAsync: addTicket } = useAddTicket();
  const [selectedViolations, setSelectedViolations] = useState<any[]>([]);
  const router = useRouter();
  const handleSaveViolations = (violations: any[]) => {
    console.log("✅ Received violations from modal:", violations); // Debug log
    setSelectedViolations(violations);
  };
  useEffect(() => {
    console.log("🔥 Updated selectedViolations in parent:", selectedViolations);
  }, [selectedViolations]);

  const onSubmit = async (formData: T_Ticket) => {
    console.log("🔥 onSubmit called!");
    console.log("🚀 Form Data:", formData);
    console.log("📌 Violations before submit:", selectedViolations);

    if (selectedViolations.length === 0) {
      toast.error("No violations added. Please add at least one.");
      return;
    }
    const formattedViolations: IViolation[] = selectedViolations.map((v) => {
      if (v.code === "31") {
        return {
          code: "31",
          description: v.description, // User input for "Other Violations"
          penaltyId: v.penaltyId,
        };
      }
      return {
        violationId: v.violationId, // Normal violations
        penaltyId: v.penaltyId,
      };
    });

    console.log("🔥 Final Violations to Send:", formattedViolations);

    const payload = {
      licenseNumber: String(formData.licenseNumber),
      plateNumber: String(formData.plateNumber),
      driverControlNumber: String(formData.driverControlNumber),
      violations: formattedViolations, // Ensure type matches
      address: String(formData.address),
      proof: [],
      ticketStatus: E_Ticket_Status.Pending,
      paymentStatus: E_Payment_Status.Pending,
    };

    try {
      //@ts-ignore
      const response = await addTicket(payload);

      if (response?.error) {
        toast.error("Failed to create ticket.");
      } else {
        toast.success("Ticket successfully created!");
        setSelectedViolations([]);
        const ticketId = response?.item?._id;
        if (ticketId) {
          router.push(`/officer/add-ticket-photos?ticketId=${ticketId}`);
        } else {
          toast.error("Ticket ID not found.");
        }
      }
    } catch (error) {
      console.error("🚨 Error sending ticket to database:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <WidthWrapper width="full">
      <div className="bg-[url('/Aerial_Shot.png')] bg-cover bg-center w-full min-h-screen flex justify-center items-center">
        <div className="sm:p-2 md:p-8 w-full flex justify-center">
          <div className="bg-primary bg-opacity-80 rounded-lg w-11/12 md:w-3/4 lg:w-3/4 xl:w-3/4 max-w-3xl mx-auto min-h-[90vh] sm:px-8 md:px-32 shadow-lg flex flex-col justify-center">
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 md:p-10 lg:p-12 w-full max-w-2xl mx-auto">
              <div className="text-center mb-2">
                <Typography variant="h3">TANGGAPAN NG PUNUMBAYAN</Typography>
                <Typography variant="h5">SINILOAN, LAGUNA</Typography>
              </div>

              <Typography className="text-2xl lg:text-3xl text-center font-bold text-black mb-6">
                CITATION TICKET
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <div className="mb-4 w-full">
                  <label
                    htmlFor="username"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    License Number
                  </label>
                  <Input
                    type="text"
                    id="username"
                    className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    {...register("licenseNumber", {
                      // required: "You need to fill up this form",
                    })}
                    placeholder="Enter License Number (optional)"
                  />
                </div>
                <div className="mb-4 w-full">
                  <label
                    htmlFor="username"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Plate Number
                  </label>
                  <Input
                    type="text"
                    id="username"
                    className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    {...register("plateNumber", {
                      // required: "You need to fill up this form",
                    })}
                    placeholder="Enter Plate Number (optional)"
                  />
                </div>
                <div className="mb-4 w-full">
                  <label
                    htmlFor="username"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Driver Control Number
                  </label>
                  <Input
                    type="text"
                    id="username"
                    className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    {...register("driverControlNumber", {
                      required: "You need to fill up this form",
                    })}
                    placeholder="Enter Driver Control Number"
                  />
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => router.push("/officer/ticket-history")}
                    className="w-full bg-secondary hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Ticket History
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => {
                      const dcn = watch("driverControlNumber");
                      if (!dcn || dcn.trim() === "") {
                        toast.error(
                          "Please provide a valid Driver Control Number",
                        );
                        return;
                      }
                      setIsModalOpen(true);
                    }}
                    className="w-full bg-secondary hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Add Violation
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-secondary hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Next
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <AddViolationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveViolations}
          driverControlNumber={watch("driverControlNumber")}
        />
      </div>
    </WidthWrapper>
  );
};

export default index;
