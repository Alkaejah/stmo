"use client";

import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  Pane,
  LayersControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import useGetAllTickets from "@/common/hooks/Admin/useGetAllTickets";
import { Spinner } from "@/common/components/ui/Spinner";
import "./map-override.css";
import {
  LucideBarChartHorizontal,
  LucideBuilding2,
  LucideNotepadText,
  LucideSignpost,
} from "lucide-react";
import useGetAllViolations from "@/common/hooks/Admin/useGetAllViolations";

const { BaseLayer } = LayersControl;

interface Violation {
  violationId: {
    violationCode: string;
  };
  penaltyId: {
    penaltyDescription: string;
    penalty: number;
  };
}

interface TicketData {
  latitude: number;
  longitude: number;
  count: number;
  street: string;
  barangay: string;
  violationCodes: Record<string, number>;
}

const SystemGeneratedTicketMap = () => {
  const { data: violationsData, isPending: isViolationsLoading } =
    useGetAllViolations();

  const { data, isPending } = useGetAllTickets();
  const [ticketData, setTicketData] = useState<TicketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openTooltipIndex, setOpenTooltipIndex] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    time: "",
    month: "",
    year: "",
    violationCode: "",
  });
  const mapRef = useRef<L.Map | null>(null);

  const getTimeCategory = (dateStr: string) => {
    const hour = new Date(dateStr).getHours();
    if (hour >= 8 && hour < 12) return "morning";
    if (hour >= 13 && hour < 17) return "afternoon";
    return ""; // Outside official enforcer hours
  };

  const isViolationMatch = (ticket: any, code: string) => {
    const allViolations = [...ticket.violations, ...ticket.otherViolations];
    return allViolations.some(
      (violation) => violation.violationId?.violationCode === code,
    );
  };

  useEffect(() => {
    if (!isPending && data?.items) {
      const filteredItems = data.items.filter((ticket: any) => {
        const created = new Date(ticket.createdAt);
        const ticketTime = getTimeCategory(ticket.createdAt);
        const ticketMonth = String(created.getMonth() + 1).padStart(2, "0");
        const ticketYear = String(created.getFullYear());

        return (
          (!filters.time || ticketTime === filters.time) &&
          (!filters.month || ticketMonth === filters.month) &&
          (!filters.year || ticketYear === filters.year) &&
          (!filters.violationCode ||
            isViolationMatch(ticket, filters.violationCode))
        );
      });

      const counts: Record<string, TicketData> = {};

      filteredItems.forEach((ticket: any) => {
        const lat = ticket.address?.barangay?.latitude;
        const lng = ticket.address?.barangay?.longitude;
        const street = ticket.address?.street?.street ?? "Unknown Street";
        const barangay =
          ticket.address?.barangay?.barangay ?? "Unknown Barangay";

        if (lat !== undefined && lng !== undefined) {
          const key = `${lat},${lng}`;
          if (!counts[key]) {
            counts[key] = {
              latitude: lat,
              longitude: lng,
              count: 1,
              street,
              barangay,
              violationCodes: {},
            };
          } else {
            counts[key].count += 1;
          }

          const processViolations = (violations: Violation[]) => {
            violations.forEach((violation) => {
              const code = violation.violationId?.violationCode;
              if (code && counts[key]) {
                counts[key].violationCodes[code] =
                  (counts[key].violationCodes[code] || 0) + 1;
              }
            });
          };

          processViolations(ticket.violations);
          processViolations(ticket.otherViolations);
        }
      });

      setTicketData(Object.values(counts));
      setIsLoading(false);
    }
  }, [data, isPending, filters]);

  const getColorByCount = (count: number): string => {
    if (count >= 1 && count <= 10) return "lightgreen";
    if (count >= 11 && count <= 50) return "orange";
    if (count >= 51) return "red";
    return "gray";
  };

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={filters.time}
          onChange={(e) => setFilters({ ...filters, time: e.target.value })}
          className="border rounded px-3 py-1"
        >
          <option value="">All Times</option>
          <option value="morning">Morning (8AM–12PM)</option>
          <option value="afternoon">Afternoon (1PM–5PM)</option>
        </select>

        <select
          value={filters.month}
          onChange={(e) => setFilters({ ...filters, month: e.target.value })}
          className="border rounded px-3 py-1"
        >
          <option value="">All Months</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Year"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          className="border rounded px-3 py-1 w-24"
        />

        <select
          value={filters.violationCode}
          onChange={(e) =>
            setFilters({ ...filters, violationCode: e.target.value })
          }
          className="border rounded px-3 py-1"
          disabled={isViolationsLoading}
        >
          <option value="">All Violation Codes</option>
          {violationsData?.items?.map((violation) => (
            <option key={violation._id} value={violation.violationCode}>
              {violation.violationCode}
            </option>
          ))}
        </select>
      </div>

      {/* Map */}
      <div className="h-[500px] w-full border rounded-md shadow-lg relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
            <Spinner className="w-10 h-10 text-blue-500" />
            <span className="ml-2 text-gray-700">Loading map data...</span>
          </div>
        ) : (
          <MapContainer
            ref={(map) => {
              if (map) {
                mapRef.current = map;
                map.on("click", () => setOpenTooltipIndex(null));
              }
            }}
            center={[14.438289136009482, 121.48516051168275]}
            zoom={13}
            className="h-full w-full"
          >
            <LayersControl position="topright">
              <BaseLayer checked name="Street Map">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
              </BaseLayer>
              <BaseLayer name="Satellite View">
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution="Tiles © Esri"
                />
              </BaseLayer>
            </LayersControl>

            <Pane name="customMarkerPane" style={{ zIndex: 400 }}>
              {ticketData.map((ticket, index) => {
                const radius = Math.min(8 + ticket.count * 1.5, 15);
                const color = getColorByCount(ticket.count);

                const customIcon = L.divIcon({
                  className: "custom-circle-marker",
                  html: `
                    <div style="
                      width: ${radius * 2}px;
                      height: ${radius * 2}px;
                      background-color: ${color};
                      border-radius: 50%;
                      border: 1px solid darkred;
                      font-size: 12px;
                      font-weight: bold;
                      color: white;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    ">
                      ${ticket.count}
                    </div>
                  `,
                  iconSize: [radius * 2, radius * 2],
                });

                return (
                  <Marker
                    key={index}
                    position={[ticket.latitude, ticket.longitude]}
                    icon={customIcon}
                    eventHandlers={{
                      click: (e) => {
                        e.originalEvent.stopPropagation();
                        setOpenTooltipIndex((prev) =>
                          prev === index ? null : index,
                        );
                      },
                    }}
                  >
                    {openTooltipIndex === index && (
                      <Tooltip
                        permanent
                        interactive
                        direction="top"
                        offset={[0, -10]}
                        opacity={1}
                        pane="customTooltipPane"
                        className="interactive-tooltip bg-white text-gray-800 p-2 rounded-lg shadow-lg border border-gray-200"
                      >
                        <div
                          className="max-h-[200px] overflow-y-auto select-text space-y-2 p-5 shadow-md rounded-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.nativeEvent.stopImmediatePropagation();
                          }}
                          onWheel={(e) => {
                            e.stopPropagation();
                            e.nativeEvent.stopImmediatePropagation();
                          }}
                        >
                          <p className="flex items-center gap-2">
                            <LucideBarChartHorizontal className="text-orange-400" />
                            <strong className="text-lg">
                              {ticket.count} Total Violation(s)
                            </strong>
                          </p>
                          <div className="mt-1">
                            <p className="flex items-center gap-2 mb-1">
                              <LucideSignpost className="text-orange-400" />
                              <strong>Street:</strong> {ticket.street}
                            </p>
                            <p className="flex items-center gap-2">
                              <LucideBuilding2 className="text-orange-400" />
                              <strong>Barangay:</strong> {ticket.barangay}
                            </p>
                          </div>
                          <div className="mt-2">
                            <p className="flex items-center gap-2 mb-2">
                              <LucideNotepadText className="text-orange-400" />
                              <strong className="text-sm">
                                Violation Report Breakdown:
                              </strong>
                            </p>
                            <ul className="list-disc pl-4">
                              {Object.entries(ticket.violationCodes).map(
                                ([code, count]) => (
                                  <li key={code}>
                                    <strong>{count}</strong> violator(s) were
                                    cited for Violation Code{" "}
                                    <strong className="text-orange-400">
                                      {code}
                                    </strong>
                                    .
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        </div>
                      </Tooltip>
                    )}
                  </Marker>
                );
              })}
            </Pane>

            <Pane name="customTooltipPane" style={{ zIndex: 1000 }} />
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default SystemGeneratedTicketMap;
