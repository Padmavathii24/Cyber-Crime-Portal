import React from "react";
import { useNavigate,Link} from "react-router-dom";
import { FaShieldAlt, FaUserShield, FaGlobe, FaUsers } from "react-icons/fa"; // Import icons


const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Navbar */}
      <nav className="bg-white shadow-md fixed w-full top-0 z-50">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-xl font-bold">Cyber Crime Portal</h1>
          <ul className="flex space-x-6">
          <li>
        <Link to="/landing" className="cursor-pointer hover:underline">About</Link>
      </li>
      <li>
        <Link to="/track" className="cursor-pointer hover:underline">Track</Link> 
      </li>
      <li>
        <Link to="/news" className="cursor-pointer hover:underline">News</Link>
      </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        className="h-screen flex flex-col items-center justify-center text-white bg-cover bg-center"
        style={{
          backgroundImage: "url('/CyberBg.jpeg')",
        }}
      >
        <h1 className="text-5xl font-bold text-center animate-fadeIn">Cyber Crime Reporting Portal</h1>
        <p className="mt-4 text-lg text-center max-w-2xl animate-fadeIn">
          Detect, report, and track cybercrimes with our AI-powered comprehensive platform.
        </p>
        <button
          className="mt-6 bg-blue-600 text-white py-3 px-6 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
          onClick={() => navigate("/report")}
        >
          Report
        </button>
      </div>

      {/* About Us Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 animate-slideIn">About Us</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We are committed to fighting cybercrime by providing a seamless platform for reporting and tracking digital frauds.
          </p>

          {/* Icon Cards */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
            <div className="bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transform hover:-translate-y-2 transition duration-300 animate-fadeIn">
              <FaShieldAlt className="text-blue-600 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700">Secure Platform</h3>
              <p className="text-gray-600 mt-2">Your reports stay confidential and protected.</p>
            </div>

            <div className="bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transform hover:-translate-y-2 transition duration-300 animate-fadeIn delay-100">
              <FaUserShield className="text-green-600 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700">Verified Cases</h3>
              <p className="text-gray-600 mt-2">All reports are validated to prevent false claims.</p>
            </div>

            <div className="bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transform hover:-translate-y-2 transition duration-300 animate-fadeIn delay-200">
              <FaGlobe className="text-red-600 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700">Global Reach</h3>
              <p className="text-gray-600 mt-2">Helping people worldwide combat cyber threats.</p>
            </div>

            <div className="bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transform hover:-translate-y-2 transition duration-300 animate-fadeIn delay-300">
              <FaUsers className="text-purple-600 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700">Community Support</h3>
              <p className="text-gray-600 mt-2">Engage with experts and victims for guidance.</p>
            </div>
          </div>
        </div>
      </section>

    {/* Mission Statement Section */}
<section className="bg-white py-20">
  <div className="container mx-auto text-center">
    <h2 className="text-4xl font-bold text-gray-800 mb-8 animate-slideIn">Our Mission</h2>
    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
      Our goal is to create a **safer digital space** by enabling individuals to report cybercrimes quickly, track case progress, 
      and spread awareness about online threats.
    </p>

    {/* Icons Representing Core Values */}
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-12 px-6">
      <div className="flex flex-col items-center">
        <img src="/Security.jpeg" alt="Security" className="w-50 h-50 mb-6 animate-fadeIn shadow-lg rounded-lg" />
        <h3 className="text-2xl font-bold text-gray-700">Security</h3>
        <p className="text-gray-600 mt-3 text-lg">We ensure your reports are confidential and handled securely.</p>
      </div>

      <div className="flex flex-col items-center">
        <img src="/Transparency.jpeg" alt="Transparency" className="w-50 h-50 mb-6 animate-fadeIn delay-100 shadow-lg rounded-lg" />
        <h3 className="text-2xl font-bold text-gray-700">Transparency</h3>
        <p className="text-gray-600 mt-3 text-lg">Stay updated with real-time tracking and case progress.</p>
      </div>

      <div className="flex flex-col items-center">
        <img src="/Awareness.jpeg" alt="Awareness" className="w-50 h-50 mb-6 animate-fadeIn delay-200 shadow-lg rounded-lg" />
        <h3 className="text-2xl font-bold text-gray-700">Awareness</h3>
        <p className="text-gray-600 mt-3 text-lg">Educating users on cyber threats and how to stay safe.</p>
      </div>
    </div>
  </div>
</section>

{/* Cyber Crime Services Section */}
<section className="bg-gray-100 py-20">
  <div className="container mx-auto text-center">
    <h2 className="text-4xl font-bold text-gray-800 mb-10 animate-slideIn">Cyber Crime Services</h2>
    
    {/* Services Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
      
      {/* Service 1 */}
      <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center transition-transform transform hover:scale-105">
        <img src="/report-icon.jpeg" alt="Report Cyber Crimes" className="w-50 h-50 mb-6" />
        <h3 className="text-2xl font-bold text-gray-700">Report Cyber Crimes</h3>
        <p className="text-gray-600 mt-3">Easily report cybercrimes and fraudulent activities through our secure platform.</p>
      </div>

      {/* Service 2 */}
      <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center transition-transform transform hover:scale-105">
        <img src="/track-icon.jpg" alt="Track Your Case" className="w-50 h-50 mb-6" />
        <h3 className="text-2xl font-bold text-gray-700">Track Your Case</h3>
        <p className="text-gray-600 mt-3">Monitor the progress of your submitted reports in real time.</p>
      </div>

      {/* Service 3 (Updated) */}
      <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center transition-transform transform hover:scale-105">
        <img src="/safety-icon.jpeg" alt="Digital Safety Tips" className="w-50 h-50 mb-6" />
        <h3 className="text-2xl font-bold text-gray-700">Digital Safety Tips</h3>
        <p className="text-gray-600 mt-3">Learn how to protect yourself from online fraud and cyber threats.</p>
      </div>

    </div>
  </div>
</section>

{/* User Feedback Section */}
<section className="bg-gray-100 py-20">
  <div className="container mx-auto text-center">
    <h2 className="text-4xl font-bold text-gray-800 mb-10 animate-slideIn">User Feedback</h2>

    {/* Feedback Slider */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
        
      {/* Review 1 */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-xl">
        <img src="/user1.jpeg" alt="User 1" className="w-20 h-20 rounded-full mb-4" />
        <p className="text-lg font-semibold">Arun</p>
        <div className="flex text-yellow-500 my-2">⭐⭐⭐⭐⭐</div>
        <p className="text-gray-600">"This platform made it super easy to report online fraud. Highly recommended!"</p>
      </div>

      {/* Review 2 */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-xl">
        <img src="/user2.jpeg" alt="User 2" className="w-20 h-20 rounded-full mb-4" />
        <p className="text-lg font-semibold">Priya</p>
        <div className="flex text-yellow-500 my-2">⭐⭐⭐⭐⭐</div>
        <p className="text-gray-600">"Tracking my complaint was seamless. The updates were very helpful!"</p>
      </div>

      {/* Review 3 */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-xl">
        <img src="/user3.jpeg" alt="User 3" className="w-20 h-20 rounded-full mb-4" />
        <p className="text-lg font-semibold">Vikram</p>
        <div className="flex text-yellow-500 my-2">⭐⭐⭐⭐⭐</div>
        <p className="text-gray-600">"Excellent initiative! Helps in spreading awareness about cyber threats."</p>
      </div>

    </div>
    
    {/* Contact Us Section */}
<section className="bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 py-20 mt-12">
  <div className="container mx-auto text-center">
    <h2 className="text-4xl font-bold text-white mb-12 animate__animated animate__fadeInUp">Contact Us</h2>

    <div className="bg-white p-10 rounded-lg shadow-xl max-w-lg mx-auto transition-transform transform hover:scale-105 hover:shadow-2xl animate__animated animate__fadeInUp">
      <form action="#" method="POST">
        {/* First Name */}
        <div className="relative mb-8">
          <input
            type="text"
            name="first-name"
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out peer"
            placeholder=" "
          />
          <label className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:text-blue-600 peer-focus:text-lg transition-all duration-300">
            First Name
          </label>
        </div>

        {/* Email */}
        <div className="relative mb-8">
          <input
            type="email"
            name="email"
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out peer"
            placeholder=" "
          />
          <label className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:text-blue-600 peer-focus:text-lg transition-all duration-300">
            Email
          </label>
        </div>

        {/* Message */}
        <div className="relative mb-8">
          <textarea
            name="message"
            rows="4"
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out peer"
            placeholder=" "
          ></textarea>
          <label className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:text-blue-600 peer-focus:text-lg transition-all duration-300">
            Message
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg transform hover:scale-110 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
</section>

    
  </div>
</section>

{/* Footer Section */}
<footer className="bg-gray-900 text-white text-center py-6 mt-10">
  <div className="container mx-auto">
    <p className="text-sm">&copy; {new Date().getFullYear()} Cyber Crime Portal. All Rights Reserved.</p>
  </div>
</footer>

    </div>
  );
};



export default Landing;
