"use client";

/** Frequently Asked Questions accordion/list (static) */
export default function FaqSection() {
  const faq = [
    {
      q: "Can I access my old conversations?",
      a:
        "With the pay-as-you-go plan, conversations are not retained after your session ends unless you download them. With the monthly plan, all your conversations are securely stored and accessible anytime.",
    },
    {
      q: "What’s included in the monthly plan?",
      a:
        "The $50/month premium plan includes unlimited AI usage, permanent chat history retention, advanced data analytics, priority support, and custom conversation organization tools.",
    },
    {
      q: "Can I use the exported JSONL file?",
      a:
        "Yes, the JSONL file contains your complete conversation in a standard format. You can re-upload it in a future session, use it with other compatible AI tools, or maintain your own archive.",
    },
    {
      q: "Is there a limit to how many messages I can send?",
      a:
        "No, both the daily and monthly plans offer unlimited messages. The only difference is in data retention and additional premium features.",
    },
    {
      q: "What happens when my 24-hour period ends?",
      a:
        "When your session expires, you’ll be presented with options to extend for another 24 hours ($1), upgrade to a monthly plan ($50), or download your chat history as a JSONL file before it’s deleted.",
    },
  ];

  return (
    <section id="faq" className="bg-[#0f0f0f] py-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extralight mb-4">
            Frequently <span className="font-semibold">Asked Questions</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-700 to-amber-500 mx-auto mb-6" />
        </div>

        <div className="max-w-3xl mx-auto">
          {faq.map((item) => (
            <div key={item.q} className="mb-8 border-b border-gray-800 pb-8">
              <h3 className="text-xl font-light mb-4">{item.q}</h3>
              <p className="text-gray-400">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
