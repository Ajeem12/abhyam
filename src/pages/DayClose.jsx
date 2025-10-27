import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Breadcrumbs from "../components/Breadcrumbs";
import {
  fetchDayClosingStock,
  submitDayClosing,
  updateConsumeValue,
  clearDayCloseState,
} from "../redux/slices/dayCloseSlice";
import { fetchCurrentDayStock } from "../redux/slices/currentDayStockSlice";
import { toast, ToastContainer } from "react-toastify";

const DayClose = () => {
  const dispatch = useDispatch();

  // Select all needed state in one selector to reduce re-renders
  const {
    dayCloseItems,
    dayCloseLoading,
    dayCloseError,
    dayCloseSuccessMessage,
    currentDayStock,
    currentDayLoading,
  } = useSelector(
    (state) => ({
      dayCloseItems: state.dayClose.items,
      dayCloseLoading: state.dayClose.loading,
      dayCloseError: state.dayClose.error,
      dayCloseSuccessMessage: state.dayClose.successMessage,
      currentDayStock: state.currentDayStock.currentDayStock,
      currentDayLoading: state.currentDayStock.loading,
    }),
    shallowEqual
  );

  const [localItems, setLocalItems] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [closingDate, setClosingDate] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  // Initialize projectId and closingDate, fetch current day stock
  useEffect(() => {
    const storedProjectId = localStorage.getItem("site_id");
    if (storedProjectId) {
      setProjectId(storedProjectId);
      dispatch(fetchCurrentDayStock(storedProjectId));
    } else {
      console.error("project_id not found in localStorage");
    }

    const today = new Date().toISOString().split("T")[0];
    setClosingDate(today);

    return () => {
      dispatch(clearDayCloseState());
    };
  }, [dispatch]);

  // Fetch day closing stock only if currentDayStock exists and check_exist !== "exist"
  useEffect(() => {
    if (projectId && currentDayStock && currentDayStock.check_exist !== "exist") {
      dispatch(fetchDayClosingStock(projectId));
    }
  }, [dispatch, projectId, currentDayStock]);

  // Sync localItems with Redux dayCloseItems
  useEffect(() => {
    if (dayCloseItems && dayCloseItems.length > 0) {
      // Initialize balance if not present
      const initializedItems = dayCloseItems.map((item) => ({
        ...item,
        consume: item.consume ?? 0,
        balance: item.stock - (item.consume ?? 0),
      }));
      setLocalItems(initializedItems);
      setValidationErrors({});
    }
  }, [dayCloseItems]);

  // Handler to update consume value with validation
  const handleConsumeChange = useCallback(
    (material_id, value) => {
      const consumeValue = Math.max(0, Math.min(parseInt(value) || 0, Number.MAX_SAFE_INTEGER));

      setLocalItems((prevItems) =>
        prevItems.map((item) =>
          item.material_id === material_id
            ? {
              ...item,
              consume: consumeValue,
              balance: item.stock - consumeValue,
            }
            : item
        )
      );
      // Clear validation error for this field immediately
      setValidationErrors((prev) => {
        if (!prev[material_id]) return prev;
        const newErrors = { ...prev };
        delete newErrors[material_id];
        return newErrors;
      });
      // Update Redux state
      dispatch(updateConsumeValue({ material_id, consume: consumeValue }));
    },
    [dispatch]
  );

  const handleDateChange = useCallback((e) => {
    setClosingDate(e.target.value);
  }, []);

  // Validate form inputs
  const validateForm = useCallback(() => {
    const errors = {};
    let isValid = true;

    localItems.forEach(({ material_id, consume, stock }) => {
      if (consume > stock) {
        errors[material_id] = `Consume cannot exceed available stock (${stock})`;
        isValid = false;
      }
      if (consume < 0) {
        errors[material_id] = "Consume cannot be negative";
        isValid = false;
      }
    });
    setValidationErrors(errors);
    return isValid;
  }, [localItems]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (!closingDate) {
        toast.error("Please select a closing date");
        return;
      }


      // Get current time
      const now = new Date();
      const currentHour = now.getHours();

      // Check if it's before 6 PM (18:00)
      if (currentHour < 18) {
        toast.error("You cannot close the day before 6:00 PM.");
        return;
      }

      if (!validateForm()) {
        toast.error("Please fix the validation errors before submitting");
        return;
      }

      const material_data = localItems.map(({ material_id, consume, stock }) => ({
        material_id,
        stock_close: consume,
        stock,
      }));

      dispatch(
        submitDayClosing({
          project_id: projectId,
          closing_date: closingDate,
          material_data,
        })
      );
    },
    [closingDate, localItems, projectId, validateForm, dispatch]
  );


  useEffect(() => {
    if (dayCloseSuccessMessage && projectId) {
      dispatch(fetchCurrentDayStock(projectId));
    }
  }, [dayCloseSuccessMessage, projectId, dispatch]);

  // Memoized render of table rows to avoid re-renders unless localItems or validationErrors change
  const materialRows = useMemo(() => {
    if (!localItems.length) {
      return (
        <tr>
          <td colSpan="4" className="p-3 text-center text-gray-500 text-sm">
            No materials data available
          </td>
        </tr>
      );
    }

    return localItems.map((item) => (
      <tr key={item.material_id} className="hover:bg-gray-50 border-b">
        <td className="p-2 text-sm font-medium text-gray-900">{item.material_name}</td>
        <td className="p-2 text-sm text-gray-500">{item.stock}</td>
        <td className="p-2 text-sm">
          <input
            type="number"
            min="0"
            max={item.stock}
            value={item.consume}
            onChange={(e) => handleConsumeChange(item.material_id, e.target.value)}
            className={`w-full max-w-20 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors[item.material_id] ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            disabled={dayCloseLoading}
          />
          {validationErrors[item.material_id] && (
            <span className="text-red-500 text-xs mt-1">{validationErrors[item.material_id]}</span>
          )}
        </td>
        <td className="p-2 text-sm font-medium text-gray-900">
          {item.balance >= 0 ? (
            item.balance
          ) : (
            <span className="text-red-500">{item.balance}</span>
          )}
        </td>
      </tr>
    ));
  }, [localItems, validationErrors, handleConsumeChange, dayCloseLoading]);

  // Loading states
  if (currentDayLoading) {
    return (
      <div className="w-full bg-white p-4">
        <Breadcrumbs />
        <div className="text-center py-8">Loading current day stock...</div>
      </div>
    );
  }

  if (!currentDayStock) {
    return (
      <div className="w-full bg-white p-4">
        <Breadcrumbs />
        <div className="text-center py-8 text-red-500">Failed to load current day stock.</div>
      </div>
    );
  }

  // If day is already closed, show read-only view
  if (currentDayStock.check_exist === "exist") {
    return (
      <div className="w-full bg-white p-4">
        <Breadcrumbs />
        <p>Date: {new Date().toLocaleDateString()}</p>


        <table className="w-full bg-white border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left text-xs font-medium text-gray-500 uppercase p-2 border-b">
                Material
              </th>
              <th className="text-center text-xs font-medium text-gray-500 uppercase p-2 border-b">
                Opening Stock
              </th>
              <th className="text-center text-xs font-medium text-gray-500 uppercase p-2 border-b">
                Closing Stock
              </th>
              <th className="text-center text-xs font-medium text-gray-500 uppercase p-2 border-b">
                Balenced Stock
              </th>
            </tr>
          </thead>
          <tbody>
            {currentDayStock.data && currentDayStock.data.length > 0 ? (
              currentDayStock.data.map(({ material_id, material_name, stock, todays_closing }) => (
                <tr key={material_id} className="hover:bg-gray-50 border-b">
                  <td className="p-2 text-sm font-medium text-gray-900">{material_name}</td>
                  <td className="p-2 text-sm text-gray-500 text-center">{stock}</td>
                  <td className="p-2 text-sm text-gray-500 text-center">{todays_closing}</td>
                  <td className="p-2 text-sm text-gray-500 text-center">  {stock - todays_closing}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="p-3 text-center text-gray-500 text-sm">
                  No materials data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // Show errors if any
  if (dayCloseError) {
    return (
      <div className="w-full bg-white p-4">
        <Breadcrumbs />
        <div className="text-center py-8 text-red-500">Error: {dayCloseError}</div>
      </div>
    );
  }

  // Show success message
  if (dayCloseSuccessMessage) {
    return (
      <div className="w-full bg-white p-4">
        <Breadcrumbs />
        <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-3 text-center text-sm">
          {dayCloseSuccessMessage}
        </div>
      </div>
    );
  }



  // Show loading when fetching day close items
  if (dayCloseLoading && localItems.length === 0) {
    return (
      <div className="w-full bg-white p-4">
        <Breadcrumbs />
        <div className="text-center py-8">Loading materials...</div>
      </div>
    );
  }
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="w-full bg-white p-2 mb-20">
        <div className="mb-3">
          <Breadcrumbs />
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-3 text-center">Day Close</h1>
        <form onSubmit={handleSubmit} className="w-full" noValidate>
          {/* Closing Date Input */}
          <div className="mb-4 flex justify-center">
            <div className="w-full max-w-md">
              <label htmlFor="closingDate" className="block text-sm font-medium text-gray-700 mb-1">
                Closing Date *
              </label>
              <input
                id="closingDate"
                type="date"
                value={closingDate}
                onChange={handleDateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                readOnly
                disabled={dayCloseLoading}
              />
            </div>
          </div>

          <div className="w-full overflow-hidden">
            <table className="w-full bg-white border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase p-2 border-b">
                    Material
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase p-2 border-b">
                    Opening Stock
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase p-2 border-b">
                    Consume
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase p-2 border-b">
                    Closing Stock
                  </th>
                </tr>
              </thead>
              <tbody>{materialRows}</tbody>
            </table>
          </div>
          {localItems.length > 0 && (
            <div className="mt-4 flex justify-center">
              <button
                type="submit"
                disabled={dayCloseLoading}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 disabled:bg-blue-400"
              >
                {dayCloseLoading ? "Submitting..." : "Submit Day Close"}
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default React.memo(DayClose);

