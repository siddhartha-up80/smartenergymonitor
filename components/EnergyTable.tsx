import React, { useState, useEffect } from "react";

type DataItem = {
  _id: string;
  time: string;
  voltage: string;
  current: string;
  power: string;
  energy: string;
};

export default function EnergyTable() {
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<DataItem[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const rowsPerPage = 10;
  const [voltagedata, setVoltageData] = useState<any>("");
  const [powerData, setPowerData] = useState<any>("");

  const formatIndianTime = (isoString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: "Asia/Kolkata",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    return new Date(isoString).toLocaleString("en-IN", options);
  };

  const fetchData = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/getlatestdata?page=${page}&limit=${rowsPerPage}`
      );
      const json = await res.json();

      console.log("Fetched data:", json); // Debugging line

      setData(json.items || json);
      setTotalPages(json.totalPages || 1);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setIsLoading(false);
    }
  };

  const fetchVoltageData = async () => {
    try {
      const res = await fetch(`/api/voltage`);
      const json = await res.json();
      setVoltageData(json);
    } catch (error) {
      console.error("Error fetching voltage data:", error);
    }
  };
  const fetchPowerData = async () => {
    try {
      const res = await fetch(`/api/power`);
      const json = await res.json();
      setPowerData(json);
    } catch (error) {
      console.error("Error fetching power data:", error);
    }
  };

  useEffect(() => {
    fetchData(page);
    fetchVoltageData();
    fetchPowerData();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  console.log(voltagedata);

  return (
    <div className="p-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <div className="spinner">Loading...</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Voltage
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Current
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Power
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Energy
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatIndianTime(item.time)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.voltage}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.current}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.power}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.energy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-center mt-4">
        <nav
          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination"
        >
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                page === index + 1
                  ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
