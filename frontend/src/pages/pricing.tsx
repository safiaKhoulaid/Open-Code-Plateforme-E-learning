import Link from "next/link"
import { Check, X, ChevronRight, Plus, Facebook, Twitter, Linkedin, MapPin, Phone, Mail } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Banner */}
     
      <main className="flex-grow">
        {/* Pricing Header */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#262626] mb-4">Our Pricings</h1>
            </div>
            <div>
              <p className="text-[#4c4c4d] leading-relaxed">
                Welcome to SkillBridge's Pricing Plan page, where we offer two comprehensive options to cater to your
                needs: Free and Pro. We believe in providing flexible and affordable pricing options for individuals and
                businesses seeking professional development solutions, we have a plan that suits you. Explore our
                pricing options below and choose the one that best fits your requirements.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Toggle */}
        <section className="container mx-auto px-4 mb-8">
          <div className="flex justify-center">
            <div className="inline-flex bg-[#f7f7f8] p-1 rounded-md">
              <button className="bg-[#ff9500] text-white px-6 py-2 rounded-md text-sm font-medium">Monthly</button>
              <button className="text-[#4c4c4d] px-6 py-2 rounded-md text-sm font-medium">Yearly</button>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="container mx-auto px-4 mb-16">
          <div className="bg-[#fcfcfd] rounded-xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Free Plan */}
              <div className="bg-[#fff9f0] rounded-lg p-8">
                <h3 className="text-xl font-semibold text-[#262626] mb-6">Free Plan</h3>
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-4xl md:text-5xl font-bold text-[#262626]">$0</span>
                    <span className="text-[#59595a] ml-1">/month</span>
                  </div>
                </div>
                <div className="mb-8">
                  <h4 className="font-medium text-[#262626] mb-4">Available Features</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#ff9500] mr-3 mt-0.5" />
                      <span className="text-[#4c4c4d]">Access to selected free courses.</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#ff9500] mr-3 mt-0.5" />
                      <span className="text-[#4c4c4d]">Limited course materials and resources.</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#ff9500] mr-3 mt-0.5" />
                      <span className="text-[#4c4c4d]">Basic community support.</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#ff9500] mr-3 mt-0.5" />
                      <span className="text-[#4c4c4d]">No certification upon completion.</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#ff9500] mr-3 mt-0.5" />
                      <span className="text-[#4c4c4d]">Ad-supported platform.</span>
                    </li>
                    <li className="flex items-start">
                      <X className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                      <span className="text-[#4c4c4d]">Access to exclusive Pro Plan community forums.</span>
                    </li>
                    <li className="flex items-start">
                      <X className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                      <span className="text-[#4c4c4d]">Early access to new courses and updates.</span>
                    </li>
                  </ul>
                </div>
                <button className="w-full bg-[#ff9500] text-white py-3 rounded-md font-medium">Get Started</button>
              </div>

              {/* Pro Plan */}
              <div className="bg-white border border-[#e4e4e7] rounded-lg p-8">
                <h3 className="text-xl font-semibold text-[#262626] mb-6">Pro Plan</h3>
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-4xl md:text-5xl font-bold text-[#262626]">$79</span>
                    <span className="text-[#59595a] ml-1">/month</span>
                  </div>
                </div>
                <div className="mb-8">
                  <h4 className="font-medium text-[#262626] mb-4">Available Features</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#ff9500] mr-3 mt-0.5" />
                      <span className="text-[#4c4c4d]">Unlimited access to all courses.</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#ff9500] mr-3 mt-0.5" />
                      <span className="text-[#4c4c4d]">Unlimited course materials and resources.</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#ff9500] mr-3 mt-0.5" />
                      <span className="text-[#4c4c4d]">Priority support from instructors.</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#ff9500] mr-3 mt-0.5" />
                      <span className="text-[#4c4c4d]">Course completion certificates.</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#ff9500] mr-3 mt-0.5" />
                      <span className="text-[#4c4c4d]">Ad-free experience.</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#ff9500] mr-3 mt-0.5" />
                      <span className="text-[#4c4c4d]">Access to exclusive Pro Plan community forums.</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#ff9500] mr-3 mt-0.5" />
                      <span className="text-[#4c4c4d]">Early access to new courses and updates.</span>
                    </li>
                  </ul>
                </div>
                <button className="w-full bg-[#ff9500] text-white py-3 rounded-md font-medium">Get Started</button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-12 mb-16">
          <div className="bg-white rounded-xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#262626] mb-4">
                  Frequently
                  <br />
                  Asked Questions
                </h2>
                <p className="text-[#4c4c4d] mb-6">
                  Still you have any questions? Contact our
                  <br />
                  Team via support@skillbridge.com
                </p>
                <button className="text-[#333333] font-medium text-sm">See All FAQ's</button>
              </div>
              <div className="space-y-4">
                {/* FAQ Item 1 - Open */}
                <div className="border border-[#e4e4e7] rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-[#262626]">Can I enroll in multiple courses at once?</h3>
                    <button className="bg-[#fff9f0] p-1 rounded-md">
                      <X className="h-5 w-5 text-[#ff9500]" />
                    </button>
                  </div>
                  <div className="text-[#4c4c4d] text-sm">
                    <p>You can enroll in multiple courses simultaneously and access them at your convenience.</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#e4e4e7]">
                    <button className="flex items-center text-[#333333] text-sm font-medium">
                      Enrollment Process for Different Courses
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* FAQ Item 2 - Closed */}
                <div className="border border-[#e4e4e7] rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-[#262626]">What kind of support can I expect from instructors?</h3>
                    <button className="bg-[#fff9f0] p-1 rounded-md">
                      <Plus className="h-5 w-5 text-[#ff9500]" />
                    </button>
                  </div>
                </div>

                {/* FAQ Item 3 - Closed */}
                <div className="border border-[#e4e4e7] rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-[#262626]">
                      Are the courses self-paced or do they have specific start and end dates?
                    </h3>
                    <button className="bg-[#fff9f0] p-1 rounded-md">
                      <Plus className="h-5 w-5 text-[#ff9500]" />
                    </button>
                  </div>
                </div>

                {/* FAQ Item 4 - Closed */}
                <div className="border border-[#e4e4e7] rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-[#262626]">Are there any prerequisites for the courses?</h3>
                    <button className="bg-[#fff9f0] p-1 rounded-md">
                      <Plus className="h-5 w-5 text-[#ff9500]" />
                    </button>
                  </div>
                </div>

                {/* FAQ Item 5 - Closed */}
                <div className="border border-[#e4e4e7] rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-[#262626]">
                      Can I download the course materials for offline access?
                    </h3>
                    <button className="bg-[#fff9f0] p-1 rounded-md">
                      <Plus className="h-5 w-5 text-[#ff9500]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      
    </div>
  )
}
