import { useState } from "react"


import { Play, ArrowUpRight, Check, X, Plus, Minus, ChevronRight, Zap } from "lucide-react"

function Home() {

  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [expandedFaq, setExpandedFaq] = useState<number>(0)

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? -1 : index)
  }

  return (
    <div className="min-h-screen bg-zinc-200 font-sans">
      {/* Hero Section */}
     
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex items-center gap-2 rounded-full bg-[#fff4e5] px-4 py-2">
            <Zap className="h-5 w-5 text-[#ff9500]" />
            <span className="text-xl font-bold">
              <span className="text-[#ff9500]">Unlock</span> Your Creative Potential
            </span>
          </div>

          <h1 className="mb-4 text-2xl font-bold text-[#262626] md:text-3xl lg:text-4xl">
            with Online Design and Development Courses.
          </h1>

          <p className="mb-8 text-[#4c4c4d] md:text-lg">Learn from Industry Experts and Enhance Your Skills.</p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <a href="/course-explore" className="rounded-md bg-[#ff9500] px-6 py-3 font-medium text-white transition-all hover:bg-[#ff9500]/90">
              Explore Courses
            </a>
            <a href="/pricing" className="rounded-md border border-[#e5e5e5] bg-white px-6 py-3 font-medium text-[#262626] transition-all hover:bg-gray-50">
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="border-y border-[#f1f1f3] bg-[#fcfcfd] py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <div className="text-[#59595a]">zapier</div>
            <div className="text-[#59595a]">
              <span className="mr-1 text-lg">●</span>Spotify
            </div>
            <div className="text-[#59595a]">zoom</div>
            <div className="text-[#59595a]">amazon</div>
            <div className="text-[#59595a]">Adobe</div>
            <div className="text-[#59595a]">Notion</div>
            <div className="text-[#59595a]">NETFLIX</div>
          </div>
        </div>
      </section>

      {/* Hero Image Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-xl">
          <video
            src="../../public/img/invideo-ai-1080 Boostez vos compétences avec notre eLear 2025-04-25.mp4"
            alt="Étudiants collaborant sur un projet de design"
            className="h-72 w-full object-cover" 
            controls
          />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-[#262626] md:text-4xl">Benefits</h2>
          <a href="#" className="flex items-center gap-1 text-sm font-medium text-[#262626]">
            View All
          </a>
        </div>

        <p className="mb-12 max-w-3xl text-[#4c4c4d]">
          Lorem ipsum dolor sit amet consectetur. Tempus tincidunt etiam eget elit id imperdiet et. Cras eu sit
          dignissim lorem nisi et. Ac cum eget habitasse in velit fringilla feugiat senectus in.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Benefit 1 */}
          <div className="flex flex-col">
            <h3 className="mb-6 text-5xl font-bold text-[#262626]">01</h3>
            <h4 className="mb-3 text-xl font-bold text-[#262626]">Flexible Learning Schedule</h4>
            <p className="mb-4 text-[#4c4c4d]">Fit your coursework around your existing commitments and obligations.</p>
            <a href="#" className="mt-auto flex items-center self-start text-sm font-medium text-[#262626]">
              <ArrowUpRight className="h-5 w-5" />
            </a>
          </div>

          {/* Benefit 2 */}
          <div className="flex flex-col">
            <h3 className="mb-6 text-5xl font-bold text-[#262626]">02</h3>
            <h4 className="mb-3 text-xl font-bold text-[#262626]">Expert Instruction</h4>
            <p className="mb-4 text-[#4c4c4d]">
              Learn from industry experts who have hands-on experience in design and development.
            </p>
            <a href="#" className="mt-auto flex items-center self-start text-sm font-medium text-[#262626]">
              <ArrowUpRight className="h-5 w-5" />
            </a>
          </div>

          {/* Benefit 3 */}
          <div className="flex flex-col">
            <h3 className="mb-6 text-5xl font-bold text-[#262626]">03</h3>
            <h4 className="mb-3 text-xl font-bold text-[#262626]">Diverse Course Offerings</h4>
            <p className="mb-4 text-[#4c4c4d]">
              Explore a wide range of design and development courses covering various topics.
            </p>
            <a href="#" className="mt-auto flex items-center self-start text-sm font-medium text-[#262626]">
              <ArrowUpRight className="h-5 w-5" />
            </a>
          </div>

          {/* Benefit 4 */}
          <div className="flex flex-col">
            <h3 className="mb-6 text-5xl font-bold text-[#262626]">04</h3>
            <h4 className="mb-3 text-xl font-bold text-[#262626]">Updated Curriculum</h4>
            <p className="mb-4 text-[#4c4c4d]">
              Access courses with up-to-date content reflecting the latest trends and industry practices.
            </p>
            <a href="#" className="mt-auto flex items-center self-start text-sm font-medium text-[#262626]">
              <ArrowUpRight className="h-5 w-5" />
            </a>
          </div>

          {/* Benefit 5 */}
          <div className="flex flex-col">
            <h3 className="mb-6 text-5xl font-bold text-[#262626]">05</h3>
            <h4 className="mb-3 text-xl font-bold text-[#262626]">Practical Projects and Assignments</h4>
            <p className="mb-4 text-[#4c4c4d]">
              Develop a portfolio showcasing your skills and abilities to potential employers.
            </p>
            <a href="#" className="mt-auto flex items-center self-start text-sm font-medium text-[#262626]">
              <ArrowUpRight className="h-5 w-5" />
            </a>
          </div>

          {/* Benefit 6 */}
          <div className="flex flex-col">
            <h3 className="mb-6 text-5xl font-bold text-[#262626]">06</h3>
            <h4 className="mb-3 text-xl font-bold text-[#262626]">Interactive Learning Environment</h4>
            <p className="mb-4 text-[#4c4c4d]">
              Collaborate with fellow learners, exchanging ideas and feedback to enhance your understanding.
            </p>
            <a href="#" className="mt-auto flex items-center self-start text-sm font-medium text-[#262626]">
              <ArrowUpRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="bg-white py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold md:text-4xl">Our Courses</h2>
            <a href="#" className="rounded-md border border-white/20 px-4 py-2 text-sm font-medium text-white">
              View All
            </a>
          </div>

          <p className="mb-12 max-w-3xl text-gray-400">
            Lorem ipsum dolor sit amet consectetur. Tempus tincidunt etiam eget elit id imperdiet et. Cras eu sit
            dignissim lorem nisi et. Ac cum eget habitasse in velit fringilla feugiat senectus in.
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Course 1 */}
            <div className="overflow-hidden rounded-lg bg-zinc-100
            ">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="../../public/img/webdesign.jfif"
                  alt="Web Design Fundamentals"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">4 Weeks</span>
                    <span className="text-sm text-gray-400">Beginner</span>
                  </div>
                  <span className="text-sm text-gray-400">By John Smith</span>
                </div>
                <h3 className="mb-2 text-xl font-bold">Web Design Fundamentals</h3>
                <p className="mb-4 text-sm text-gray-400">
                  Learn the fundamentals of web design, including HTML, CSS, and responsive design principles. Develop
                  the skills to create visually appealing and user-friendly websites.
                </p>
                <button className="mt-2 rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-white/10">
                  Get It Now
                </button>
              </div>
            </div>

            {/* Course 2 */}
            <div className="overflow-hidden rounded-lg bg-zinc-100">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="../../public/img/uiux.jfif"
                  alt="UI/UX Design"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400">6 Weeks</span>
                    <span className="text-sm text-gray-400">Intermediate</span>
                  </div>
                  <span className="text-sm text-gray-400">By Emily Johnson</span>
                </div>
                <h3 className="mb-2 text-xl font-bold">UI/UX Design</h3>
                <p className="mb-4 text-sm text-gray-400">
                  Master the art of creating intuitive user interfaces (UI) and enhancing user experiences (UX). Learn
                  design principles, wireframing, prototyping, and usability testing techniques.
                </p>
                <button className="mt-2 rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-white/10">
                  Get It Now
                </button>
              </div>
            </div>

            {/* Course 3 */}
            <div className="overflow-hidden rounded-lg bg-zinc-100
            ">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="../../public/img/mobileapp.jfif"
                  alt="Mobile App Development"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400">8 Weeks</span>
                    <span className="text-sm text-gray-400">Intermediate</span>
                  </div>
                  <span className="text-sm text-gray-400">By David Brown</span>
                </div>
                <h3 className="mb-2 text-xl font-bold">Mobile App Development</h3>
                <p className="mb-4 text-sm text-gray-400">
                  Dive into the world of mobile app development. Learn to build native iOS and Android applications
                  using industry-leading frameworks like Swift and Kotlin.
                </p>
                <button className="mt-2 rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-white/10">
                  Get It Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-3xl font-bold text-[#262626] md:text-4xl">Our Pricing</h2>
        <p className="mb-12 max-w-3xl text-[#4c4c4d]">
          Lorem ipsum dolor sit amet consectetur. Tempus tincidunt etiam eget elit id imperdiet et. Cras eu sit
          dignissim lorem nisi et. Ac cum eget habitasse in velit fringilla feugiat senectus in.
        </p>

        <div className="mb-12 flex justify-end">
          <div className="inline-flex rounded-md border border-[#e5e5e5] p-1">
            <button
              className={`px-4 py-2 text-sm font-medium ${billingCycle === "monthly" ? "rounded bg-[#ff9500] text-white" : "text-[#4c4c4d]"}`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${billingCycle === "yearly" ? "rounded bg-[#ff9500] text-white" : "text-[#4c4c4d]"}`}
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Free Plan */}
          <div className="overflow-hidden rounded-lg border border-[#f1f1f3] bg-white">
            <div className="bg-[#fff8ee] p-6">
              <h3 className="text-xl font-bold text-[#262626]">Free Plan</h3>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <span className="text-5xl font-bold text-[#262626]">$0</span>
                <span className="text-[#4c4c4d]">/month</span>
              </div>

              <h4 className="mb-4 text-lg font-medium text-[#262626]">Available Features</h4>

              <ul className="mb-8 space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-[#ff9500]" />
                  <span className="text-[#4c4c4d]">Access to selected free courses.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-[#ff9500]" />
                  <span className="text-[#4c4c4d]">Limited course materials and resources.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-[#ff9500]" />
                  <span className="text-[#4c4c4d]">Basic community support.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-[#ff9500]" />
                  <span className="text-[#4c4c4d]">No certification upon completion.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-[#ff9500]" />
                  <span className="text-[#4c4c4d]">Ad-supported platform.</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="mt-0.5 h-5 w-5 text-gray-400" />
                  <span className="text-[#4c4c4d]">Access to exclusive Pro Plan community forums.</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="mt-0.5 h-5 w-5 text-gray-400" />
                  <span className="text-[#4c4c4d]">Early access to new courses and updates.</span>
                </li>
              </ul>

              <button className="w-full rounded-md bg-[#ff9500] px-6 py-3 font-medium text-white transition-all hover:bg-[#ff9500]/90">
                Get Started
              </button>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="overflow-hidden rounded-lg border border-[#f1f1f3] bg-white">
            <div className="bg-[#fff8ee] p-6">
              <h3 className="text-xl font-bold text-[#262626]">Pro Plan</h3>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <span className="text-5xl font-bold text-[#262626]">$79</span>
                <span className="text-[#4c4c4d]">/month</span>
              </div>

              <h4 className="mb-4 text-lg font-medium text-[#262626]">Available Features</h4>

              <ul className="mb-8 space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-[#ff9500]" />
                  <span className="text-[#4c4c4d]">Unlimited access to all courses.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-[#ff9500]" />
                  <span className="text-[#4c4c4d]">Unlimited course materials and resources.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-[#ff9500]" />
                  <span className="text-[#4c4c4d]">Priority support from instructors.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-[#ff9500]" />
                  <span className="text-[#4c4c4d]">Course completion certificates.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-[#ff9500]" />
                  <span className="text-[#4c4c4d]">Ad-free experience.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-[#ff9500]" />
                  <span className="text-[#4c4c4d]">Access to exclusive Pro Plan community forums.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-[#ff9500]" />
                  <span className="text-[#4c4c4d]">Early access to new courses and updates.</span>
                </li>
              </ul>

              <button className="w-full rounded-md bg-[#ff9500] px-6 py-3 font-medium text-white transition-all hover:bg-[#ff9500]/90">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-black py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold md:text-4xl">Our Testimonials</h2>
            <a href="#" className="rounded-md border border-white/20 px-4 py-2 text-sm font-medium text-white">
              View All
            </a>
          </div>

          <p className="mb-12 max-w-3xl text-gray-400">
            Lorem ipsum dolor sit amet consectetur. Tempus tincidunt etiam eget elit id imperdiet et. Cras eu sit
            dignissim lorem nisi et. Ac cum eget habitasse in velit fringilla feugiat senectus in.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Testimonial 1 */}
            <div className="rounded-lg bg-[#111] p-6">
              <p className="mb-6 text-gray-300">
                "The web design course provided a solid foundation for me. The instructors were knowledgeable and
                supportive, and the interactive learning environment was engaging. I highly recommend it!"
              </p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-700">
                  <img src="/placeholder.svg?height=50&width=50" alt="Sarah L" className="h-full w-full object-cover" />
                </div>
                <div>
                  <h4 className="font-medium">Sarah L</h4>
                </div>
                <a href="#" className="ml-auto text-sm text-gray-400 hover:text-white">
                  Read Full Story
                </a>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-lg bg-[#111] p-6">
              <p className="mb-6 text-gray-300">
                "The UI/UX design course exceeded my expectations. The instructor's expertise and practical assignments
                helped me improve my design skills. I feel more confident in my career now. Thank you!"
              </p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-700">
                  <img src="/placeholder.svg?height=50&width=50" alt="Jason M" className="h-full w-full object-cover" />
                </div>
                <div>
                  <h4 className="font-medium">Jason M</h4>
                </div>
                <a href="#" className="ml-auto text-sm text-gray-400 hover:text-white">
                  Read Full Story
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-16 md:grid-cols-3">
          <div>
            <h2 className="text-3xl font-bold text-[#262626] md:text-4xl">Frequently Asked Questions</h2>
            <p className="mt-4 text-[#4c4c4d]">
              Still you have any questions? Contact our Team via support@skillbridge.com
            </p>
            <button className="mt-8 rounded-md border border-[#e5e5e5] px-6 py-3 font-medium text-[#262626] transition-all hover:bg-gray-50">
              See All FAQ's
            </button>
          </div>

          <div className="md:col-span-2">
            <div className="space-y-4">
              {/* FAQ Item 1 */}
              <div className="overflow-hidden rounded-lg border border-[#f1f1f3]">
                <button
                  className="flex w-full items-center justify-between bg-white p-6 text-left"
                  onClick={() => toggleFaq(0)}
                >
                  <h3 className="text-lg font-medium text-[#262626]">Can I enroll in multiple courses at once?</h3>
                  {expandedFaq === 0 ? (
                    <Minus className="h-5 w-5 text-[#ff9500]" />
                  ) : (
                    <Plus className="h-5 w-5 text-[#262626]" />
                  )}
                </button>
                {expandedFaq === 0 && (
                  <div className="bg-[#f7f7f8] p-6">
                    <p className="text-[#4c4c4d]">
                      You can enroll in multiple courses simultaneously and access them at your convenience.
                    </p>
                    <div className="mt-4 rounded-lg bg-[#f1f1f3] p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[#262626]">Enrollment Process for Different Courses</span>
                        <ChevronRight className="h-5 w-5 text-[#262626]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* FAQ Item 2 */}
              <div className="overflow-hidden rounded-lg border border-[#f1f1f3]">
                <button
                  className="flex w-full items-center justify-between bg-white p-6 text-left"
                  onClick={() => toggleFaq(1)}
                >
                  <h3 className="text-lg font-medium text-[#262626]">
                    What kind of support can I expect from instructors?
                  </h3>
                  {expandedFaq === 1 ? (
                    <Minus className="h-5 w-5 text-[#ff9500]" />
                  ) : (
                    <Plus className="h-5 w-5 text-[#262626]" />
                  )}
                </button>
                {expandedFaq === 1 && (
                  <div className="bg-[#f7f7f8] p-6">
                    <p className="text-[#4c4c4d]">
                      Our instructors provide comprehensive support through discussion forums, live Q&A sessions, and
                      personalized feedback on assignments. Pro Plan members receive priority support with faster
                      response times.
                    </p>
                  </div>
                )}
              </div>

              {/* FAQ Item 3 */}
              <div className="overflow-hidden rounded-lg border border-[#f1f1f3]">
                <button
                  className="flex w-full items-center justify-between bg-white p-6 text-left"
                  onClick={() => toggleFaq(2)}
                >
                  <h3 className="text-lg font-medium text-[#262626]">
                    Are the courses self-paced or do they have specific start and end dates?
                  </h3>
                  {expandedFaq === 2 ? (
                    <Minus className="h-5 w-5 text-[#ff9500]" />
                  ) : (
                    <Plus className="h-5 w-5 text-[#262626]" />
                  )}
                </button>
                {expandedFaq === 2 && (
                  <div className="bg-[#f7f7f8] p-6">
                    <p className="text-[#4c4c4d]">
                      Most of our courses are self-paced, allowing you to learn according to your own schedule. Some
                      advanced courses may have cohort-based schedules with specific start and end dates to facilitate
                      collaborative projects.
                    </p>
                  </div>
                )}
              </div>

              {/* FAQ Item 4 */}
              <div className="overflow-hidden rounded-lg border border-[#f1f1f3]">
                <button
                  className="flex w-full items-center justify-between bg-white p-6 text-left"
                  onClick={() => toggleFaq(3)}
                >
                  <h3 className="text-lg font-medium text-[#262626]">Are there any prerequisites for the courses?</h3>
                  {expandedFaq === 3 ? (
                    <Minus className="h-5 w-5 text-[#ff9500]" />
                  ) : (
                    <Plus className="h-5 w-5 text-[#262626]" />
                  )}
                </button>
                {expandedFaq === 3 && (
                  <div className="bg-[#f7f7f8] p-6">
                    <p className="text-[#4c4c4d]">
                      Prerequisites vary by course. Beginner courses typically have no prerequisites, while intermediate
                      and advanced courses may require prior knowledge or completion of foundational courses. Each
                      course page clearly lists any prerequisites.
                    </p>
                  </div>
                )}
              </div>

              {/* FAQ Item 5 */}
              <div className="overflow-hidden rounded-lg border border-[#f1f1f3]">
                <button
                  className="flex w-full items-center justify-between bg-white p-6 text-left"
                  onClick={() => toggleFaq(4)}
                >
                  <h3 className="text-lg font-medium text-[#262626]">
                    Can I download the course materials for offline access?
                  </h3>
                  {expandedFaq === 4 ? (
                    <Minus className="h-5 w-5 text-[#ff9500]" />
                  ) : (
                    <Plus className="h-5 w-5 text-[#262626]" />
                  )}
                </button>
                {expandedFaq === 4 && (
                  <div className="bg-[#f7f7f8] p-6">
                    <p className="text-[#4c4c4d]">
                      Yes, Pro Plan members can download course materials including videos, slides, and resources for
                      offline access. Free Plan members have limited offline access to selected materials.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home ;