import { use, useState ,useEffect} from "react";
import { useRegisterMutation } from "../redux/api/userApiSlice.js";
import { useNavigate } from 'react-router-dom'
import Loader from "../components/Loader.jsx";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
function Register() {


  const [fullname, setFullName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [walletKey, setwalletKey] = useState("");
  const [image, setImage] = useState("");
  const [skillInput, setSkillInput] = useState("");

  const [register, { isLoading, error }] = useRegisterMutation();
  const navigate = useNavigate()
  const {userInfo} = useSelector((state)=>(state.auth))
  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);


  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    // formData.append("walletKey", walletKey);
    formData.append("avatar", image); // 'image' matches Multer field name


    try {
      const result = await register(formData).unwrap(); // Call RTK Query mutation
      console.log("Response:", result);
      if (result) {
        toast.success("user register successFully! ✅");
        navigate('/')
      }
    } catch (error) {
      let errorMessage = "register failed! ❌";

      if (error?.data) {

        const isHtml = typeof error.data === "string" && error.data.includes("<html");

        if (isHtml) {

          const match = error.data.match(/Error:\s(.*?)<br>/);
          if (match) {
            errorMessage = match[1];
          }
        } else if (error.data.message) {
          errorMessage = error.data.message;
        }
      }

      toast.error(errorMessage, { position: "top-right" });
      console.error("Upload failed:", error);
    }
  };



  return (
    <div className="min-h-screen flex flex-col md:flex-row justify-center items-center gap-10 md:gap-20 p-4">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-[#2b2b2b] rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">REGISTER</h2>
  
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullname" className="block font-semibold text-white">Full Name</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={fullname}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Enter your Full Name"
              className="w-full p-3 border rounded-lg mt-1 focus:outline-none border-gray-700 bg-black text-white"
            />
          </div>
  
          <div>
            <label htmlFor="username" className="block font-semibold text-white">User Name</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
              placeholder="Enter your User Name"
              className="w-full p-3 border rounded-lg mt-1 focus:outline-none border-gray-700 bg-black text-white"
            />
          </div>
  
          <div>
            <label htmlFor="email" className="block font-semibold text-white">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your Email"
              className="w-full p-3 border rounded-lg mt-1 focus:outline-none border-gray-700 bg-black text-white"
            />
          </div>
  
          <div>
            <label htmlFor="password" className="block font-semibold text-white">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your Password"
              className="w-full p-3 border rounded-lg mt-1 focus:outline-none border-gray-700 bg-black text-white"
            />
          </div>
  
          <div>
            <label htmlFor="profilePicture" className="block font-semibold text-white">Profile Picture</label>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              onChange={handleFileChange}
              className="w-full p-3 border rounded-lg mt-1 focus:outline-none border-gray-700 bg-black text-white"
            />
          </div>
  
          <p className="mt-4 text-white text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-[#36a1b6] font-semibold hover:underline">
              Login
            </Link>
          </p>
  
          <button
            type="submit"
            className="w-full p-3 hover:bg-[#2f8a9d] bg-[#36a1b6] text-white rounded-lg uppercase font-semibold transition"
          >
            Register
          </button>
        </form>
  
        {isLoading && <Loader />}
      </div>
    </div>
  );
  
};

export default Register;

















