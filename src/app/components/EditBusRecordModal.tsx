"use client";

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getVehicleById, updateVehicle } from "@/app/services/vehicleService";

const EditBusRecordModal = ({ vehicle_id, onClose, onSubmit }) => {
  const [busDetails, setBusDetails] = useState({
    vehicle_id: "",
    plate_number: "",
    or_id: "",
    cr_id: "",
    engine_number: "",
    chasis_number: "",
    third_pli: "",
    third_pli_policy_no: "",
    ci: "",
    supplier: "",
  });

  const [third_pli_validity, setTPLValidity] = useState(null);
  const [ci_validity, setCIValidity] = useState(null);
  const [date_purchased, setDatePurchased] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch vehicle details when modal opens
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      if (!vehicle_id) {
        setError("Vehicle ID is required.");
        return;
      }

      try {
        const data = await getVehicleById(vehicle_id);
        setBusDetails({
          vehicle_id: data.vehicle_id || "",
          plate_number: data.plate_number || "",
          or_id: data.or_id || "",
          cr_id: data.cr_id || "",
          engine_number: data.engine_number || "",
          chasis_number: data.chasis_number || "",
          third_pli: data.third_pli || "",
          third_pli_policy_no: data.third_pli_policy_no || "",
          ci: data.ci || "",
          supplier: data.supplier || "",
        });

        setTPLValidity(
          data.third_pli_validity ? new Date(data.third_pli_validity) : null
        );
        setCIValidity(data.ci_validity ? new Date(data.ci_validity) : null);
        setDatePurchased(
          data.date_purchased ? new Date(data.date_purchased) : null
        );
      } catch (err) {
        console.error("Error fetching vehicle details:", err);
        setError("Failed to fetch vehicle details.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [vehicle_id]);

  const formatDate = (date) => {
    if (!date) return null;
    const parsedDate = new Date(date); // Convert string to Date object
    if (isNaN(parsedDate)) return null; // Handle invalid dates
    return parsedDate.toISOString().slice(0, 19).replace("T", " "); // Convert to 'YYYY-MM-DD HH:MM:SS'
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedData = {
      or_id: busDetails.or_id,
      cr_id: busDetails.cr_id,
      engine_number: busDetails.engine_number,
      chasis_number: busDetails.chasis_number,
      third_pli: busDetails.third_pli,
      third_pli_policy_no: busDetails.third_pli_policy_no,
      ci: busDetails.ci,
      supplier: busDetails.supplier,
      third_pli_validity: formatDate(third_pli_validity),
      ci_validity: formatDate(ci_validity),
      date_purchased: formatDate(date_purchased),
    };

    try {
      const updatedVehicle = await updateVehicle(vehicle_id, updatedData);
      if (onSubmit) {
        onSubmit(updatedVehicle); // Pass updated record back to parent
      }
      onClose(); // Close the modal
    } catch (err) {
      console.error("Error updating vehicle:", err);
      if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        const errorMessages = Object.values(validationErrors).flat().join("\n");
        alert(`Update failed:\n${errorMessages}`);
      } else {
        onClose();
      }
    }
  };

  if (loading) return <div>Loading bus details...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-semibold">Edit Bus Record</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4 mt-4">
          {/* Vehicle ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bus Number
            </label>
            <input
              type="text"
              name="vehicle_id"
              value={busDetails.vehicle_id}
              className="w-full px-4 py-2 border rounded-md"
              disabled
            />
          </div>

          {/* Plate Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Plate Number
            </label>
            <input
              type="text"
              name="plate_number"
              value={busDetails.plate_number}
              className="w-full px-4 py-2 border rounded-md"
              disabled
            />
          </div>

          {/* OR Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Official Receipt (OR)
            </label>
            <input
              type="text"
              name="or_id"
              value={busDetails.or_id}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* CR Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Certificate of Registration (CR)
            </label>
            <input
              type="text"
              name="cr_id"
              value={busDetails.cr_id}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Engine Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Engine Number
            </label>
            <input
              type="text"
              name="engine_number"
              value={busDetails.engine_number}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Chasis Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Chasis Number
            </label>
            <input
              type="text"
              name="chasis_number"
              value={busDetails.chasis_number}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Third Party Liability Insurance */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              3rd Party Liability Insurance
            </label>
            <input
              type="text"
              name="third_pli"
              value={busDetails.third_pli}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* 3rd Party Policy Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Policy Number
            </label>
            <input
              type="text"
              name="third_pli_policy_no"
              value={busDetails.third_pli_policy_no}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* 3rd Party Liability Insurance Validity */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              3rd Party Liability Insurance Validity
            </label>
            <input
              type="date"
              value={thirdPartyValidity}
              onChange={(e) => setThirdPartyValidity(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Comprehensive Insurance */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Comprehensive Insurance
            </label>
            <input
              type="text"
              name="ci"
              value={busDetails.ci}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Comprehensive Insurance Validity */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Comprehensive Insurance Validity
            </label>
            <input
              type="date"
              value={comprehensiveValidity}
              onChange={(e) => setComprehensiveValidity(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date Purchased */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date Purchased
            </label>
            <input
              type="date"
              value={datePurchased}
              onChange={(e) => setDatePurchased(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Supplier */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Supplier
            </label>
            <input
              type="text"
              name="supplier"
              value={busDetails.supplier}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
        </form>

        <div className="flex justify-end mt-4 space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBusRecordModal;
