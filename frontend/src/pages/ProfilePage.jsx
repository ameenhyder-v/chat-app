import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="card rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <h1 className="text-xl font-bold tracking-tight">Profile</h1>
              <p className="text-sm text-muted-foreground mt-1">Your profile information</p>
            </div>

            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="relative group">
                <img
                  src={selectedImg || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="size-28 sm:size-32 rounded-full object-cover ring-4 ring-border"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 bg-primary text-primary-foreground p-2.5 rounded-full cursor-pointer shadow-lg hover:scale-105 transition-transform
                    ${isUpdatingProfile ? "animate-pulse pointer-events-none opacity-80" : ""}`}
                >
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <p className="text-sm text-muted-foreground">
                {isUpdatingProfile ? "Uploading…" : "Click the camera icon to update your photo"}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-2 mb-1.5">
                  <User className="w-3.5 h-3.5" />
                  Full name
                </label>
                <p className="px-4 py-3 bg-muted rounded-xl border border-border text-sm">
                  {authUser?.fullName}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-2 mb-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  Email address
                </label>
                <p className="px-4 py-3 bg-muted rounded-xl border border-border text-sm">
                  {authUser?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-border bg-muted/30 px-6 py-4 sm:px-8 sm:py-5">
            <h2 className="text-sm font-semibold mb-3">Account</h2>
            <div className="space-y-0 text-sm">
              <div className="flex items-center justify-between py-2.5 border-b border-border">
                <span className="text-muted-foreground">Member since</span>
                <span>{authUser?.createdAt?.split("T")[0] || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground">Status</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
