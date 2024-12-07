"use client";

import React, { useState, useEffect } from "react";
import Sidebar2 from "../components/Sidebar2";
import Header from "../components/Header";
import { getProfile, updateAccount, getOwnProfile } from "../services/authService";
import { updateOwnAccount } from "../services/userProfile";
const EditProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"account" | "profile">("account"); // Toggle between tabs
  const [profileSettings, setProfileSettings] = useState({
    lastName: "",
    firstName: "",
    middleInitial: "",
    address: "",
    dateOfBirth: "",
    sex: "",
    contactNumber: "",
    contactPerson: "",
    contactPersonNumber: "",
  });

  const [accountSettings, setAccountSettings] = useState({
    username: "",
    email: "",
    password: "",
    newPassword: "",
  });

  const [selectedImage, setSelectedImage] = useState<string | ArrayBuffer | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        // Fetch account data
        const accountData = await getProfile();
        setAccountSettings({
          username: accountData.username,
          email: accountData.email,
          password: "",
          newPassword: "",
        });

        // Fetch profile data
        const profileData = await getOwnProfile();
        setProfileSettings({
          lastName: profileData.profile.last_name || "",
          firstName: profileData.profile.first_name || "",
          middleInitial: profileData.profile.middle_initial || "",
          address: profileData.profile.address || "",
          dateOfBirth: profileData.profile.date_of_birth || "",
          sex: profileData.profile.sex || "",
          contactNumber: profileData.profile.contact_number || "",
          contactPerson: profileData.profile.contact_person || "",
          contactPersonNumber: profileData.profile.contact_person_number || "",
        });

        setSelectedImage(profileData.profile.user_profile_image || null);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        alert("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleProfileChange = (field: string, value: string) => {
    setProfileSettings({ ...profileSettings, [field]: value });
  };

  const handleAccountChange = (field: string, value: string) => {
    setAccountSettings({ ...accountSettings, [field]: value });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);

      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("user_profile_image", file);
        await updateOwnAccount({ user_profile_image: file });
        alert("Profile image updated successfully!");
      } catch (error) {
        console.error("Error updating profile image:", error);
        alert("Failed to update profile image.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmitAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateAccount({
        username: accountSettings.username,
        email: accountSettings.email,
        password: accountSettings.newPassword,
      });
      alert("Account updated successfully!");
    } catch (error) {
      console.error("Error updating account settings:", error);
      alert("Failed to update account settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Use the current state `profileSettings` for the payload
      await updateOwnAccount({
        lastName: profileSettings.lastName,
        firstName: profileSettings.firstName,
        middleInitial: profileSettings.middleInitial,
        address: profileSettings.address,
        dateOfBirth: profileSettings.dateOfBirth,
        sex: profileSettings.sex,
        contactNumber: profileSettings.contactNumber,
        contactPerson: profileSettings.contactPerson,
        contactPersonNumber: profileSettings.contactPersonNumber,
      });
      alert("Profile settings updated successfully!");
    } catch (error) {
      console.error("Error updating profile settings:", error);
      alert("Failed to update profile settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-screen flex flex-row bg-white">
      <Sidebar2 />
      <section className="right w-full bg-slate-200 overflow-y-hidden">
        <Header title="Edit Profile" />
        <div className="content flex flex-col h-full p-10">
          {loading && <p className="text-center">Loading...</p>}
          <div className="bg-white rounded-lg shadow-lg w-full p-6">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-6">
              <button
                className={`px-4 py-2 mr-4 ${
                  activeTab === "account" ? "bg-blue-600 text-white" : "bg-gray-200"
                } rounded-md`}
                onClick={() => setActiveTab("account")}
              >
                Account Settings
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === "profile" ? "bg-blue-600 text-white" : "bg-gray-200"
                } rounded-md`}
                onClick={() => setActiveTab("profile")}
              >
                Profile Settings
              </button>
            </div>

            {/* Account Settings Form */}
            {activeTab === "account" && (
              <form className="space-y-6" onSubmit={handleSubmitAccount}>
                <h2 className="text-lg font-semibold">Account Settings</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label>Username</label>
                    <input
                      type="text"
                      value={accountSettings.username}
                      onChange={(e) => handleAccountChange("username", e.target.value)}
                      className="block w-full mt-1 px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label>Email</label>
                    <input
                      type="email"
                      value={accountSettings.email}
                      onChange={(e) => handleAccountChange("email", e.target.value)}
                      className="block w-full mt-1 px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label>New Password</label>
                    <input
                      type="password"
                      value={accountSettings.newPassword}
                      onChange={(e) => handleAccountChange("newPassword", e.target.value)}
                      className="block w-full mt-1 px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md mt-4"
                >
                  Save Account Settings
                </button>
              </form>
            )}

            {/* Profile Settings Form */}
            {activeTab === "profile" && (
              <form className="space-y-6" onSubmit={handleSubmitProfile}>
                <h2 className="text-lg font-semibold">Profile Settings</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Last Name", field: "lastName" },
                    { label: "First Name", field: "firstName" },
                    { label: "Middle Initial", field: "middleInitial" },
                    { label: "Address", field: "address" },
                    { label: "Date of Birth", field: "dateOfBirth", type: "date" },
                    { label: "Sex", field: "sex" },
                    { label: "Contact Number", field: "contactNumber" },
                    { label: "Contact Person", field: "contactPerson" },
                    { label: "Contact Person Number", field: "contactPersonNumber" },
                  ].map(({ label, field, type = "text" }) => (
                    <div key={field}>
                      <label>{label}</label>
                      <input
                        type={type}
                        value={profileSettings[field as keyof typeof profileSettings] || ""}
                        onChange={(e) => handleProfileChange(field, e.target.value)}
                        className="block w-full mt-1 px-3 py-2 border rounded-md"
                      />
                    </div>
                  ))}
                  <div>
                    <label>Profile Photo</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    {selectedImage && (
                      <img
                        src={selectedImage as string}
                        alt="Profile"
                        className="mt-2 rounded-md"
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                      />
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md mt-4"
                >
                  Save Profile Settings
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </section>
  );
};

export default EditProfile;
