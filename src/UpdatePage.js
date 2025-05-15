import React from 'react';

const UpdatePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 pt-24"> {/* Add pt-24 for padding-top */}
      {/* Previous Section: Latest News */}
      <div className="container mx-auto py-10">
        <h2 className="text-3xl font-bold text-center mb-8">Latest Updates</h2>
        <div className="flex justify-around gap-8">
          <div className="w-1/4 bg-white p-6 rounded-lg shadow-lg">
            <img src="/CyberNews.jpg" alt="News" className="w-50 h-50 mb-6 animate-fadeIn shadow-lg rounded-lg" />
            <h3 className="text-xl font-semibold text-center">Cyber News</h3>
            <p className="text-gray-600 text-center">Latest information about new threats and trends in cybersecurity.</p>
          </div>
          <div className="w-1/4 bg-white p-6 rounded-lg shadow-lg">
            <img src="/CyberTips.jpg" alt="Tips" className="w-50 h-50 mb-6 animate-fadeIn shadow-lg rounded-lg" />
            <h3 className="text-xl font-semibold text-center">Cyber Tips</h3>
            <p className="text-gray-600 text-center">Helpful tips to secure your devices and online presence.</p>
          </div>
          <div className="w-1/4 bg-white p-6 rounded-lg shadow-lg">
            <img src="/CyberCases.jpg" alt="Cases" className="w-50 h-50 mb-6 animate-fadeIn shadow-lg rounded-lg" />
            <h3 className="text-xl font-semibold text-center">Cyber Cases</h3>
            <p className="text-gray-600 text-center">Real-life cases of cybercrime and how they were solved.</p>
          </div>
          <div className="w-1/4 bg-white p-6 rounded-lg shadow-lg">
            <img src="/CyberLaws.jpg" alt="Laws" className="w-50 h-50 mb-6 animate-fadeIn shadow-lg rounded-lg" />
            <h3 className="text-xl font-semibold text-center">Cyber Laws</h3>
            <p className="text-gray-600 text-center">Understand the laws that help fight cybercrime and protect victims.</p>
          </div>
        </div>
      </div>

      {/* New Section: Cyber Security Alerts */}
      <div className="container mx-auto py-10 bg-gray-200">
        <h2 className="text-3xl font-bold text-center mb-8">Cyber Security Alerts</h2>
        <div className="flex justify-center">
          <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-center">Latest Alerts</h3>
            <ul className="space-y-4">
              <li className="text-gray-600">New phishing scam targeting online banking users. <span className="font-semibold text-red-500">Urgent!</span></li>
              <li className="text-gray-600">Malware disguised as a popular app detected. <span className="font-semibold text-red-500">Immediate action required!</span></li>
              <li className="text-gray-600">Data breach reported at a major e-commerce site. <span className="font-semibold text-red-500">Be cautious!</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* New Section: Expert Insights / Blogs */}
      <div className="container mx-auto py-10">
        <h2 className="text-3xl font-bold text-center mb-8">Expert Insights & Blogs</h2>
        <div className="flex justify-around gap-8">
          <div className="w-1/4 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">How to Protect Your Data</h3>
            <p className="text-gray-600">In this blog, experts share key tips on how to secure your online data against hackers.</p>
            <button className="mt-4 text-blue-600 hover:underline">Read More</button>
          </div>
          <div className="w-1/4 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Cybersecurity in the Age of AI</h3>
            <p className="text-gray-600">Explore how artificial intelligence is both a threat and a tool in the fight against cybercrime.</p>
            <button className="mt-4 text-blue-600 hover:underline">Read More</button>
          </div>
          <div className="w-1/4 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Top 5 Cybersecurity Tools</h3>
            <p className="text-gray-600">A list of the best tools you can use to keep your devices secure.</p>
            <button className="mt-4 text-blue-600 hover:underline">Read More</button>
          </div>
        </div>
      </div>

      {/* New Section: Upcoming Events / Webinars */}
      <div className="container mx-auto py-10 bg-gray-200">
        <h2 className="text-3xl font-bold text-center mb-8">Upcoming Cybersecurity Events</h2>
        <div className="flex justify-center">
          <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-center">Ethical Hacking Webinar</h3>
            <p className="text-gray-600">Join us for an in-depth session on ethical hacking techniques used to safeguard systems. <span className="text-blue-600">Register Now</span></p>
            <p className="text-gray-600">Date: March 10, 2025</p>
          </div>
        </div>
      </div>

      {/* New Section: User Stories / Case Studies */}
      <div className="container mx-auto py-10">
        <h2 className="text-3xl font-bold text-center mb-8">User Stories / Case Studies</h2>
        <div className="flex justify-center">
          <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">How John Recovered ₹50,000 Lost in an Online Scam</h3>
            <p className="text-gray-600">John shares his journey of recovering the money he lost to a fraudulent online investment scheme.</p>
            <button className="mt-4 text-blue-600 hover:underline">Read Full Story</button>
          </div>
        </div>
      </div>

      {/* New Section: Cyber Crime Statistics */}
      <div className="container mx-auto py-10 bg-gray-200">
        <h2 className="text-3xl font-bold text-center mb-8">Cyber Crime Statistics</h2>
        <div className="flex justify-center">
          <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Recent Cyber Crime Stats</h3>
            <ul className="space-y-4 text-gray-600">
              <li>30% increase in phishing attacks in 2024</li>
              <li>40% rise in identity theft cases in the last year</li>
              <li>50% of businesses experienced cyber-attacks in the past year</li>
            </ul>
            <button className="mt-4 text-blue-600 hover:underline">View More Stats</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePage;
