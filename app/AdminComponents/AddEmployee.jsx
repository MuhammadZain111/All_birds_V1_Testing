"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddEmployee() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    department: "",
    departmentRole: "",
    address: "",
    accountStatus: "",
    permissions: [],
    joiningDate: "",
  });

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({ email: "", password: "" });

  // Handle input + select changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle checkbox permissions
  const handlePermissionChange = (permission) => {
    setForm((prev) => {
      const exists = prev.permissions.includes(permission);

      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((p) => p !== permission)
          : [...prev.permissions, permission],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email || !emailRegex.test(form.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email",
      }));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      console.log(" Data Sent Succesfully ........   ");

      const data = await res.json();

      if (res.ok) {
        router.push("/superadmin");
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen p-4 bg-white">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-black text-white px-6 py-6">
          <h1 className="text-xl font-bold">Create Employee Account</h1>
          <p className="text-gray-300 mt-2">
            Add a new employee who can manage the ecommerce store.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="border p-3 rounded-xl text-black"
          />

          {/* Username */}
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="border p-3 rounded-xl text-black"
          />

          {/* Email */}
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-3 rounded-xl text-black"
          />

          {/* Phone */}
          <input
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="border p-3 rounded-xl text-black"
          />

          {/* Password */}
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            className="border p-3 rounded-xl text-black"
          />

          {/* Department */}
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="border p-3 rounded-xl text-black"
          >
            <option value="">Select Department</option>
            <option value="product">Product Management</option>
            <option value="order">Order Management</option>
            <option value="support">Customer Support</option>
            <option value="inventory">Inventory</option>
          </select>

          {/* Role */}
          <select
            name="departmentRole"
            value={form.departmentRole}
            onChange={handleChange}
            className="border p-3 rounded-xl text-black"
          >
            <option value="">Select Role</option>
            <option value="manager">Store Manager</option>
            <option value="product_manager">Product Manager</option>
            <option value="support">Support Agent</option>
            <option value="inventory">Inventory Manager</option>
          </select>

          {/* Address */}
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows="4"
            placeholder="Address"
            className="border p-3 rounded-xl text-black md:col-span-2"
          />

          {/* Permissions */}
          <div className="md:col-span-2 grid grid-cols-2 gap-3">
            {[
              "Add Products",
              "Edit Products",
              "Delete Products",
              "Manage Orders",
              "Manage Customers",
              "View Reports",
            ].map((permission) => (
              <label key={permission} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.permissions.includes(permission)}
                  onChange={() => handlePermissionChange(permission)}
                />
                {permission}
              </label>
            ))}
          </div>

          {/* Joining Date */}
          <input
            type="date"
            name="joiningDate"
            value={form.joiningDate}
            onChange={handleChange}
            className="border p-3 rounded-xl text-black"
          />

          
/
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded-xl md:col-span-2"
          >
            {loading ? "Creating..." : "Create Employee"}
          </button>
        </form>
      </div>
    </div>
  );
}
