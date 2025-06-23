"use client";

/** Testimonials grid */
export default function TestimonialsSection() {
  const testimonials = [
    {
      initials: "JD",
      name: "Jonathan Drake",
      role: "Marketing Specialist",
      quote:
        "The pay-as-you-go model is perfect for me. I only need AI assistance occasionally, and $1 for 24 hours is an incredible value.",
    },
    {
      initials: "SL",
      name: "Sophia Liu",
      role: "Product Designer",
      quote:
        "I love the focus on privacy. Being able to download my chat history as a JSONL file gives me peace of mind that I won’t lose important information.",
    },
    {
      initials: "MC",
      name: "Michael Chen",
      role: "Software Engineer",
      quote:
        "The monthly plan is worth every penny. Having my chat history retained saves me countless hours of repeating information. The advanced features are just a bonus.",
    },
  ];

  return (
    <section className="bg-[#0c0c0c] py-20">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extralight mb-4">
            What Our <span className="font-semibold">Users Say</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-700 to-amber-500 mx-auto mb-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.initials}
              className="p-8 border border-gray-800 bg-black/20"
            >
              <div className="flex items-center mb-6">
                <div className="mr-4 w-10 h-10 rounded-full bg-amber-900 flex items-center justify-center text-amber-500 font-semibold">
                  {t.initials}
                </div>
                <div>
                  <h4 className="font-medium">{t.name}</h4>
                  <p className="text-gray-500 text-sm">{t.role}</p>
                </div>
              </div>
              <p className="text-gray-300">“{t.quote}”</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
