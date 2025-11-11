"use client";
import { useEffect, useState } from "react";
import { LucideX } from "lucide-react";
import { Button } from "@/common/components/shadcn/ui/button";
import { Checkbox } from "@/common/components/shadcn/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/components/shadcn/ui/select";
import useGetAllViolationsFromSettings from "@/common/hooks/Enforcers/useGetAllViolationsFromSettings";
import useGetAllPenaltiesFromSettings from "@/common/hooks/Enforcers/useGetAllPenaltiesFromSettings";
import useGetViolationCounts from "@/common/hooks/Enforcers/useGetViolationCounts";
import toast from "react-hot-toast";

interface Violation {
  _id: string;
  violationCode: string;
  violationDescription: string;
  violationCategory: {
    _id: string;
    violationCategoryName: string;
  };
}

interface Penalty {
  _id: string;
  penaltyDescription: string;
  penalty: number;
}

interface GroupedViolations {
  [categoryName: string]: Violation[];
}

interface ViolationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (violations: any[]) => void;
  driverControlNumber: string;
}

const ViolationModal = ({
  isOpen,
  onClose,
  onSave,
  driverControlNumber,
}: ViolationModalProps) => {
  const { data: violationData, refetch: refetchViolations } =
    useGetAllViolationsFromSettings();
  const { data: penaltyData, refetch: refetchPenalties } =
    useGetAllPenaltiesFromSettings();
  const { mutateAsync: fetchViolationCount } = useGetViolationCounts();

  const [violationsByCategory, setViolationsByCategory] =
    useState<GroupedViolations>({});
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [selectedViolations, setSelectedViolations] = useState<
    Record<
      string,
      { penaltyId: string; violationCode: string; customDescription?: string }
    >
  >({});
  const [otherViolationEntries, setOtherViolationEntries] = useState<
    { description: string; penaltyId: string }[]
  >([]);
  const [currentDescription, setCurrentDescription] = useState<string>("");
  const [currentPenaltyId, setCurrentPenaltyId] = useState<string>("");

  const otherViolationId = Object.keys(violationsByCategory).reduce(
    (acc, category) => {
      const violation = violationsByCategory[category]?.find(
        (v) => v.violationCode === "31",
      );
      return violation ? violation._id : acc;
    },
    "",
  );

  useEffect(() => {
    if (isOpen) {
      refetchViolations().then(({ data }) => {
        if (data?.items) {
          const violations: Violation[] = data.items as Violation[];
          const groupedViolations: GroupedViolations = {};

          violations.forEach((violation) => {
            const category = violation.violationCategory.violationCategoryName;
            if (!groupedViolations[category]) {
              groupedViolations[category] = [];
            }
            groupedViolations[category].push(violation);
          });

          setViolationsByCategory(groupedViolations);
        }
      });

      refetchPenalties().then(({ data }) => {
        if (data?.items) {
          setPenalties(data.items as Penalty[]);
        }
      });
    }
  }, [isOpen, refetchViolations, refetchPenalties]);

  const handleCheckboxChange = async (
    violationId: string,
    violationCode: string,
  ) => {
    setSelectedViolations((prev) => {
      const updated = { ...prev };
      if (updated[violationId]) {
        delete updated[violationId];
      } else {
        updated[violationId] = {
          penaltyId: "",
          violationCode,
          customDescription: violationCode === "31" ? "" : undefined,
        };
      }
      return updated;
    });

    if (violationCode !== "31" && driverControlNumber) {
      try {
        const response = await fetchViolationCount({
          driverControlNumber,
          violationId,
        });

        const penaltyId = response?.extendedItem?.penaltyId;

        if (penaltyId) {
          setSelectedViolations((prev) => {
            const existing = prev[violationId];

            if (!existing || !existing.violationCode) {
              return prev; // or optionally throw an error/toast
            }

            return {
              ...prev,
              [violationId]: {
                ...existing,
                penaltyId: penaltyId.toString(), // ensure it's string
              },
            };
          });
        }
      } catch (error) {
        toast.error("Failed to auto-assign penalty.");
      }
    }
  };

  const handleAddOtherViolation = () => {
    if (!currentDescription || !currentPenaltyId) {
      toast.error("Please enter a description and select a penalty.");
      return;
    }

    setOtherViolationEntries((prev) => [
      ...prev,
      { description: currentDescription, penaltyId: currentPenaltyId },
    ]);

    setCurrentDescription("");
    setCurrentPenaltyId("");
  };

  const storeViolations = () => {
    const violationsArray = Object.keys(selectedViolations)
      .map((violationId) => {
        const violation = selectedViolations[violationId];

        if (violationId === otherViolationId) {
          return otherViolationEntries.map((entry) => ({
            code: "31",
            description: entry.description,
            penaltyId: entry.penaltyId,
          }));
        }

        return {
          violationId,
          violationCode: violation?.violationCode,
          penaltyId: violation?.penaltyId,
        };
      })
      .flat();

    if (violationsArray.length === 0) {
      toast.error("Select at least one violation.");
      return;
    }

    onSave(violationsArray);
    onClose();
    toast.success("Violations saved.");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg max-h-[80vh] overflow-y-auto border-4 border-blue-500">
        <div
          className="flex justify-end cursor-pointer hover:text-gray-500"
          onClick={onClose}
        >
          <LucideX />
        </div>

        <h2 className="text-lg font-bold text-center mb-4 text-black">
          VIOLATIONS
        </h2>
        <div className="space-y-6">
          {Object.keys(violationsByCategory).map((category) => (
            <div key={category}>
              <h3 className="font-bold text-black mt-3 mb-2">{category}</h3>
              {violationsByCategory[category]?.map((violation) => (
                <div key={violation._id} className="flex flex-col mb-4">
                  <div className="flex items-start gap-2">
                    <Checkbox
                      checked={!!selectedViolations[violation._id]}
                      onCheckedChange={() =>
                        handleCheckboxChange(
                          violation._id,
                          violation.violationCode,
                        )
                      }
                    />
                    <span className="text-black">
                      <span className="text-red-500 font-bold">
                        {violation.violationCode}
                      </span>{" "}
                      {violation.violationCode === "31"
                        ? "IBA PA"
                        : violation.violationDescription}
                    </span>
                    {violation.violationCode === "31" &&
                      selectedViolations[violation._id] && (
                        <input
                          type="text"
                          placeholder="Enter other violation..."
                          className="border-b border-gray-400 focus:outline-none px-2 flex-1"
                          value={currentDescription}
                          onChange={(e) =>
                            setCurrentDescription(e.target.value)
                          }
                        />
                      )}
                  </div>

                  {violation.violationCode !== "31" &&
                    selectedViolations[violation._id] && (
                      <div className="mt-2 w-full">
                        <Select
                          onValueChange={(val) =>
                            setSelectedViolations((prev) => {
                              const existing = prev[violation._id];

                              if (!existing || !existing.violationCode) {
                                return prev; // Don’t update if base info is missing
                              }

                              return {
                                ...prev,
                                [violation._id]: {
                                  ...existing,
                                  penaltyId: val,
                                },
                              };
                            })
                          }
                          value={
                            selectedViolations[violation._id]?.penaltyId || ""
                          }
                          disabled={
                            !!selectedViolations[violation._id]?.penaltyId
                          }
                        >
                          <SelectTrigger className="w-full border rounded bg-gray-200">
                            <SelectValue placeholder="Select Penalty" />
                          </SelectTrigger>
                          <SelectContent className="w-full max-w-[var(--radix-select-trigger-width)] overflow-y-auto max-h-60">
                            {penalties.map((penalty) => (
                              <SelectItem
                                key={penalty._id}
                                value={penalty._id}
                                className="whitespace-normal"
                              >
                                {penalty.penaltyDescription} - {penalty.penalty}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                  {violation.violationCode === "31" &&
                    selectedViolations[violation._id] && (
                      <div className="mt-2 w-full">
                        <div className="flex gap-2">
                          <Select
                            onValueChange={(val) => setCurrentPenaltyId(val)}
                            value={currentPenaltyId}
                          >
                            <SelectTrigger className="flex-1 border rounded bg-gray-200">
                              <SelectValue placeholder="Select Penalty" />
                            </SelectTrigger>
                            <SelectContent className="w-full max-w-[var(--radix-select-trigger-width)] overflow-y-auto max-h-60">
                              {penalties.map((penalty) => (
                                <SelectItem
                                  key={penalty._id}
                                  value={penalty._id}
                                  className="whitespace-normal"
                                >
                                  {penalty.penaltyDescription} -{" "}
                                  {penalty.penalty}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            onClick={handleAddOtherViolation}
                            className="bg-blue-500"
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    )}

                  {violation.violationCode === "31" &&
                    otherViolationEntries.length > 0 && (
                      <div className="mt-2">
                        <h4 className="font-bold">Other Violations:</h4>
                        {otherViolationEntries.map((entry, index) => {
                          const penaltyDetails = penalties.find(
                            (p) => p._id === entry.penaltyId,
                          );
                          return (
                            <div key={index} className="mb-2 text-sm">
                              <div className="font-semibold text-red-500">
                                31{" "}
                                <span className="text-black">
                                  {entry.description}
                                </span>
                              </div>
                              {penaltyDetails && (
                                <div>
                                  {penaltyDetails.penaltyDescription}
                                  {penaltyDetails.penalty !== 0
                                    ? ` - ₱${penaltyDetails.penalty}.00`
                                    : ""}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <Button className="w-full bg-blue-500 mt-4" onClick={storeViolations}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default ViolationModal;
