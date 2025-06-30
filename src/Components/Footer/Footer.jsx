import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16 px-4 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="text-3xl font-semibold mb-6">Contact Us</h3>
          <p className="text-xs">
            <strong>Email:</strong> support@taskwave.com
          </p>
          <p className="text-xs">
            <strong>Phone:</strong> +1 (123) 456-7890
          </p>
          <p className="text-xs leading-6">
            <strong>Address:</strong> TaskWave HQ , 788 Freelance Avenue, Suite 300, Cloud City, Remote State, United States
          </p>
        </div>

        {/* Important Links */}
        <div>
          <h3 className="text-3xl font-semibold mb-6">Important Links</h3>
          <ul className="space-y-3 text-xs">
            <li>
              <Link className="hover:underline">Terms & Conditions</Link>
            </li>
            <li>
              <Link className="hover:underline">Privacy Policy</Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-3xl font-semibold mb-6">Follow Us</h3>
          <div className="flex flex-wrap gap-4 mt-3">
            <Link
              to="https://web.facebook.com/"
              target="_blank"
              aria-label="Facebook"
              className="hover:text-blue-400"
            >
              <FaFacebook size={24} />
            </Link>
            <Link
              to="https://www.x.com/"
              target="_blank"
              aria-label="Twitter/X"
              className="hover:text-blue-600"
            >
              <FaTwitter size={24} />
            </Link>
            <Link
              to="https://www.linkedin.com/"
              target="_blank"
              aria-label="LinkedIn"
              className="hover:text-blue-500"
            >
              <FaLinkedin size={24} />
            </Link>
            <Link
              to="https://www.instagram.com/"
              target="_blank"
              aria-label="Instagram"
              className="hover:text-pink-400"
            >
              <FaInstagram size={24} />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} TaskWave. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
