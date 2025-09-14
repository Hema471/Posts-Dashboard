import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, X } from "lucide-react";

// Fix marker icons for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Market icon
const googlePin = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // nice modern red pin
  iconSize: [38, 38], // slightly bigger, scalable
  iconAnchor: [19, 38], // anchor at bottom center
  popupAnchor: [0, -35], // popup above the pin
});

// Validation schema
const RegisterSchema = Yup.object().shape({
  name: Yup.string().min(3, "Too short").required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "At least 6 chars")
    .required("Password is required"),
  phone: Yup.string().required("Phone is required"),
});

export default function RegisterPage() {
  const [location, setLocation] = useState([30.0444, 31.2357]);
  const [showMap, setShowMap] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    setLocation([lat, lng]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 px-4">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Create an Account
        </h2>

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            phone: "",
            image: null,
          }}
          validationSchema={RegisterSchema}
          onSubmit={(values) => {
            const usersJson = localStorage.getItem("registered_users");
            const users = usersJson ? JSON.parse(usersJson) : [];

            if (users?.find((u) => u.email === values.email)) {
              toast.error("Email already registered");
              return;
            }

            const newUser = {
              ...values,
              location: showMap ? location : null,
              image: values.image ? values.image : null,
            };

            users.push(newUser);
            localStorage.setItem("registered_users", JSON.stringify(users));

            toast.success("Registered — you can now login");
            navigate("/login");
          }}
        >
          {({ setFieldValue, values }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Field
                  name="name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <PhoneInput
                  country={"eg"}
                  value={values.phone}
                  onChange={(value) => setFieldValue("phone", value)}
                  enableSearch
                  inputProps={{ name: "phone", required: true }}
                  inputStyle={{
                    width: "100%",
                    backgroundColor: "transparent",
                  }}
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Image */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image (optional)
                </label>

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
                            dataUrl: reader.result, // base64 string
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-2 py-2 border rounded-lg cursor-pointer"
                  />
                )}

                {/* Preview if image selected */}
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

              {/* Toggle Map */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <input
                    type="checkbox"
                    checked={showMap}
                    onChange={() => {
                      setShowMap(!showMap);
                    }}
                  />
                  Add Location (optional)
                </label>
              </div>

              {/* Map */}
              {showMap && (
                <div className="md:col-span-2">
                  <MapContainer
                    center={[30.0444, 31.2357]}
                    zoom={6}
                    style={{
                      height: "250px",
                      width: "100%",
                      borderRadius: "12px",
                    }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {location && (
                      <Marker
                        draggable={true}
                        position={location}
                        icon={googlePin}
                        eventHandlers={{
                          dragend: handleDragEnd,
                        }}
                      />
                    )}
                  </MapContainer>
                </div>
              )}

              {/* Submit */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="cursor-pointer w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow-lg transition duration-300"
                >
                  Register
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-500 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
