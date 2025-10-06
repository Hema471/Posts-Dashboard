import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, X } from "lucide-react";
import { logout } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import MapComponent from './../../components/MapComponent';

// Validation schema
const ProfileSchema = Yup.object().shape({
  name: Yup.string().min(3, "Too short").required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "At least 6 chars"),
  phone: Yup.string().required("Phone is required"),
});

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState([40.7128, -74.0060]);
  const [showMap, setShowMap] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Load current user
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const usersJson = localStorage.getItem("registered_users");
    const users = usersJson ? JSON.parse(usersJson) : [];

    const found = users?.find((u) => u.email == loggedUser?.email);
    if (found) {
      setUser(found);
      if (found?.location) {
        setLocation(found?.location);
        setShowMap(true);
      }
    }
  }, []);

  const handleDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    setLocation([lat, lng]);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-black text-2xl">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 md:p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <p className="mt-2 text-sm md:text-xl font-bold text-gray-900">
            Manage your personal information, password, and preferences
          </p>
        </div>

        <Formik
          initialValues={{
            name: user?.name || "",
            email: user?.email || "",
            password: user?.password || "",
            confirmPassword: "",
            phone: user?.phone || "",
            image: user?.image || null,
          }}
          validationSchema={ProfileSchema}
          onSubmit={(values) => {
            if (!values.confirmPassword) {
              toast.error("You must confirm password first");
              return;
            }

            if (values.password !== values.confirmPassword) {
              toast.error("Passwords do not match");
              return;
            }

            const usersJson = localStorage.getItem("registered_users");
            const users = usersJson ? JSON.parse(usersJson) : [];

            const updatedUsers = users.map((u) =>
              u.email === user.email
                ? { ...u, ...values, location: showMap ? location : null }
                : u
            );

            localStorage.setItem(
              "registered_users",
              JSON.stringify(updatedUsers)
            );
            setUser({ ...values, location: showMap ? location : null });

            toast.success("Profile updated successfully 🎉");
            dispatch(logout());
            navigate("/login");
          }}
        >
          {({ setFieldValue, values }) => (
            <Form className="space-y-8">
              {/* Personal Info */}
              <div className="bg-white rounded-2xl shadow p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <i className="ri-user-line text-purple-600"></i> Personal Info
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <Field
                      name="name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Field
                      type="email"
                      name="email"
                      disabled
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <PhoneInput
                      country={"us"}
                      value={values.phone}
                      onChange={(value) => setFieldValue("phone", value)}
                      enableSearch
                      inputProps={{ name: "phone", required: true }}
                      inputStyle={{
                        width: "100%",
                        borderRadius: "12px",
                        paddingTop: "23px",
                        paddingBottom: "23px",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Avatar */}
              <div className="bg-white rounded-2xl shadow p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <i className="ri-image-line text-green-600"></i> Profile
                  Picture
                </h2>
                <div>
                  {!values.image && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            setFieldValue("image", {
                              name: file.name,
                              dataUrl: reader.result,
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full py-3 px-4 border rounded-xl shadow-sm cursor-pointer"
                    />
                  )}
                  {values?.image && (
                    <div className="mt-4 flex items-center justify-between bg-gray-50 border rounded-xl p-3 shadow-sm">
                      {/* Left side: image + name */}
                      <div className="flex items-center gap-3">
                        <img
                          src={values.image.dataUrl}
                          alt={values.image.name}
                          className="w-16 h-16 object-cover rounded-xl border shadow"
                        />
                        <p className="text-sm font-medium text-gray-700 truncate max-w-[200px] sm:max-w-full">
                          {values.image.name}
                        </p>
                      </div>

                      {/* Right side: X Button */}
                      <button
                        type="button"
                        onClick={() => setFieldValue("image", null)}
                        className="bg-red-500 text-white rounded-full p-2 shadow hover:bg-red-600 transition cursor-pointer"
                      >
                        <X className="w-3 h-3 md:w-5 md:h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-2xl shadow p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <i className="ri-map-pin-line text-red-500"></i> Location
                </h2>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={showMap}
                    onChange={() => setShowMap(!showMap)}
                    className="rounded bg-blue-500"
                  />
                  Add / Edit Location
                </label>
                {showMap && (
                  <div className="overflow-hidden rounded-xl border">
                   <MapComponent location={location} handleDragEnd={handleDragEnd} />
                  </div>
                )}
              </div>

              {/* Security */}
              <div className="bg-white rounded-2xl shadow p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <i className="ri-lock-2-line text-blue-600"></i> Security
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Password */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="cursor-pointer absolute right-3 top-10 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <Field
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-12"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="cursor-pointer absolute right-3 top-10 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white text-lg md:text-2xl font-semibold rounded-2xl shadow-xl transform transition duration-300 cursor-pointer"
                >
                  Save All Changes
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
