import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useUpdateProfileMutation } from "../redux/api/userApiSlice";


const UpdateProfile = () => {

  const { userInfo } = useSelector((state) => (state.auth))
  const navigate = useNavigate()

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    walletKey: [],
  });

  const user = userInfo.data.user;

  const [walletKeyInput, setWalletKeyInput] = useState("");
  const [updateProfile, { isLoading, error }] = useUpdateProfileMutation();

  console.log("userinfo", userInfo);
  // console.log(userInfo.data.user.walletKey)

  useEffect(() => {
    if (userInfo) {
      setFormData({
        fullname: userInfo.data.user.fullname || "",
        email: userInfo.data.user.email || "",
        walletKey: userInfo.data.user.walletKey || [],
      });
    }
  }, [userInfo]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const addWalletKey = (e) => {
  //   e.preventDefault();
  //   if (walletKeyInput.trim() && !formData.walletKey.includes(walletKeyInput.trim())) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       walletKey: [...prev.walletKey, walletKeyInput.trim()],
  //     }));
  //     setWalletKeyInput("");
  //   }
  // };

  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Submitting Data:", formData); // Debugging step

      await updateProfile({
        fullname: formData.fullname,
        email: formData.email,
      }).unwrap();

      navigate("/"); // Navigate after successful update
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <div className=" p-8 rounded-xl shadow-lg max-w-lg w-full bg-[#2b2b2b]">
        <h2 className="text-2xl font-bold  mb-6 text-center">
          Update Profile
        </h2>
        {error && <p className="text-red-600 text-center mb-4">{error?.data?.message || "Something went wrong"}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-32 h-32 rounded-full border-4 border-[#36a1b6] shadow-lg mb-6"
              />
            ) : (
              <div className="w-32 h-32 flex items-center justify-center rounded-full bg-blue-500 text-white text-4xl font-bold mb-6">
                Hi 👋 {user.username}
              </div>
            )}
            <h3 className="text-3xl font-bold  mb-2">              Hi ! {user.username}
            </h3>

          </div>
          
          <div>
            <label htmlFor="fullname" className="block font-semibold ">
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg mt-1 focus:outline-none focus:border-[#004d40]"
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-semibold ">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg mt-1 focus:outline-none focus:border-[#004d40]"
            />
          </div>



          <button
            type="submit"
            className="w-full p-3  text-white rounded-lg uppercase font-semibold hover:bg-[#2f8a9d] bg-[#36a1b6] transition"
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
