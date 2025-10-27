import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changePassword,
  clearChangePasswordState,
} from "../redux/slices/changePasswordSlice";
import Breadcrumbs from "../components/Breadcrumbs";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const { loading, successMessage, error } = useSelector(
    (state) => state.changePassword
  );

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.currentPassword)
      newErrors.currentPassword = "Current password is required";

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const project_id = localStorage.getItem("site_id");
    const payload = new FormData();
    payload.append("current_password", formData.currentPassword);
    payload.append("new_password", formData.newPassword);
    payload.append("new_password_confirmation", formData.confirmPassword);
    if (project_id) payload.append("project_id", project_id);

    const result = await dispatch(changePassword(payload));

    if (changePassword.fulfilled.match(result)) {
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setErrors({});
    }
  };

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearChangePasswordState());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  return (
    <div className="max-w-md mx-auto p-4 rounded-xl shadow-lg">
      <Breadcrumbs />

      {/* Success & Error Messages */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center">
          <XCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
          <div key={field}>
            <label
              htmlFor={field}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {field === "currentPassword"
                ? "Current Password"
                : field === "newPassword"
                  ? "New Password"
                  : "Confirm New Password"}
            </label>
            <div className="relative">
              <input
                type={showPasswords[field === "currentPassword"
                  ? "current"
                  : field === "newPassword"
                    ? "new"
                    : "confirm"]
                  ? "text"
                  : "password"}
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${errors[field]
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
                  }`}
                placeholder={
                  field === "currentPassword"
                    ? "Enter current password"
                    : field === "newPassword"
                      ? "Enter new password"
                      : "Confirm new password"
                }
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-600"
                onClick={() =>
                  togglePasswordVisibility(
                    field === "currentPassword"
                      ? "current"
                      : field === "newPassword"
                        ? "new"
                        : "confirm"
                  )
                }
              >
                {showPasswords[
                  field === "currentPassword"
                    ? "current"
                    : field === "newPassword"
                      ? "new"
                      : "confirm"
                ] ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors[field] && (
              <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Changing Password...
            </>
          ) : (
            "Change Password"
          )}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
