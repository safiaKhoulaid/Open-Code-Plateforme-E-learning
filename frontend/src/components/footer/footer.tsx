
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";

export const Footer = ()=>{

return (
    <footer className="bg-gray-50 py-12 mt-16">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="bg-[#FF9500] w-10 h-10 rounded-md flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#656567]">
            <Mail className="h-4 w-4" />
            <span>hello@skillbridge.com</span>
          </div>
          <div className="flex items-center gap-2 text-[#656567]">
            <Phone className="h-4 w-4" />
            <span>+91 91813 23 2309</span>
          </div>
          <div className="flex items-center gap-2 text-[#656567]">
            <MapPin className="h-4 w-4" />
            <span>Somewhere in the World</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-[#333333]">Home</h3>
          <ul className="space-y-2">
            <li>
              <Link to="#" className="text-[#656567] hover:text-[#333333]">
                Benefits
              </Link>
            </li>
            <li>
              <Link to="#" className="text-[#656567] hover:text-[#333333]">
                Our Courses
              </Link>
            </li>
            <li>
              <Link to="#" className="text-[#656567] hover:text-[#333333]">
                Our Testimonials
              </Link>
            </li>
            <li>
              <Link to="#" className="text-[#656567] hover:text-[#333333]">
                Our FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-[#333333]">About Us</h3>
          <ul className="space-y-2">
            <li>
              <Link to="#" className="text-[#656567] hover:text-[#333333]">
                Company
              </Link>
            </li>
            <li>
              <Link to="#" className="text-[#656567] hover:text-[#333333]">
                Achievements
              </Link>
            </li>
            <li>
              <Link to="#" className="text-[#656567] hover:text-[#333333]">
                Our Goals
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-[#333333]">Social Profiles</h3>
          <div className="flex gap-4">
            <Link to="#" className="text-[#656567] hover:text-[#333333]">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link to="#" className="text-[#656567] hover:text-[#333333]">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link to="#" className="text-[#656567] hover:text-[#333333]">
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-8 pt-8 text-center text-[#656567]">
        <p>© 2023 Skillbridge. All rights reserved.</p>
      </div>
    </div>
  </footer>
)


}