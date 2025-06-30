import React from 'react';

const WhyChooseTaskwave = () => {
    return (
<div className="bg-base-200 py-16 px-6 md:px-20">
  <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
    Why Choose TaskWave?
  </h2>
  <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
    <div className="p-6 bg-base-100 shadow-md rounded-xl text-center">
      <img src="https://i.ibb.co/x8jJWxbT/freelancer.png" alt="Verified Freelancers" className="mx-auto w-16 mb-4"/>
      <h3 className="text-2xl font-semibold mb-2">Verified Freelancers</h3>
      <p className="text-sm">
        Work with experienced and vetted professionals who are passionate about delivering high-quality results.
      </p>
    </div>
    <div className="p-6 bg-base-100 shadow-md rounded-xl text-center">
      <img src="https://i.ibb.co/hJQKGdph/secure.png" alt="Secure Payments" className="mx-auto w-16 mb-4"/>
      <h3 className="text-2xl font-semibold mb-2">Secure Payments</h3>
      <p className="text-sm">
        All transactions are handled securely on our platform. Release payment only when you’re satisfied with the work.
      </p>
    </div>
    <div className="p-6 bg-base-100 shadow-md rounded-xl text-center">
      <img src="https://i.ibb.co/BKK6XfF0/clock.png" alt="Quick Turnaround" className="mx-auto w-16 mb-4"/>
      <h3 className="text-2xl font-semibold mb-2">Quick Turnaround</h3>
      <p className="text-sm">
        Post your task and start receiving offers from freelancers within minutes. Time is money—get going fast!
      </p>
    </div>
  </div>
</div>

    );
};

export default WhyChooseTaskwave;