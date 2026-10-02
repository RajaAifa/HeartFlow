import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
    const navigate = useNavigate();

    return (
        <div className='flex px-8 my-24 bg-gradient-to-r from-red-600 to-rose-500 rounded-[2.5rem] sm:px-12 md:px-16 lg:px-20 md:mx-10 shadow-2xl shadow-red-100 relative overflow-hidden'>
            
            <div className='absolute top-0 right-0 w-64 h-64 -mt-20 -mr-20 rounded-full bg-white/5 blur-3xl'></div>

            <div className='z-10 flex-1 py-12 sm:py-16 md:py-20 lg:py-28'>
                <div className='space-y-2'>
                    <div className='inline-block px-4 py-1 mb-4 border rounded-full bg-white/20 backdrop-blur-md border-white/30'>
                        <p className='text-[10px] font-black text-white uppercase tracking-[0.2em]'>24/7 Intelligent Support</p>
                    </div>
                    <h1 className='text-3xl font-black leading-none tracking-tighter text-white uppercase sm:text-4xl md:text-5xl lg:text-6xl'>
                        Instant Answers <br /> <span className='text-red-100'>Via Neural Chat</span>
                    </h1>
                </div>
                
                <button
                    onClick={() => { navigate('/chatbot'); window.scrollTo(0, 0); }}
                    className='flex items-center gap-3 px-10 py-4 mt-10 text-xs font-black tracking-widest text-red-600 uppercase transition-all duration-500 bg-white shadow-xl group rounded-2xl hover:bg-gray-900 hover:text-white active:scale-95'
                >
                    Launch AI Assistant
                    <span className='transition-transform group-hover:translate-x-1'>→</span>
                </button>
            </div>

            <div className='hidden md:block md:w-1/2 lg:w-[400px] relative'>
                <img 
                    className='absolute bottom-0 right-0 w-full max-w-md drop-shadow-[-20px_20px_50px_rgba(0,0,0,0.2)]' 
                    src={assets.appointment_img} 
                    alt="AI Support" 
                />
            </div>
        </div>
    );
};

const faqs = [
    { question: "What is HeartFlow Medical Care?", answer: "HeartFlow integrates advanced AI diagnostics with a network of elite cardiologists to provide high-precision, data-driven heart health management." },
    { question: "How does the AI Predictor work?", answer: "Our Neural Engine analyzes cardiovascular metrics in real-time to provide risk assessments and early warning signs based on global clinical datasets." },
    { question: "Can I use HeartFlow for emergencies?", answer: "HeartFlow is a monitoring and diagnostic tool. In case of acute symptoms or emergencies, please contact your local emergency services immediately." },
    { question: "Is my medical data secure?", answer: "Absolutely. We use hospital-grade encryption and decentralized protocols to ensure your health records remain private and accessible only to you and your specialists." },
];

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section className="px-8 py-20 bg-white">
            <div className="max-w-4xl mx-auto">
                <div className='mb-16 text-center'>
                    <h2 className="text-3xl font-black tracking-tighter text-gray-900 uppercase md:text-4xl">
                        Patient <span className='text-red-600'>Intelligence</span> Base
                    </h2>
                    <div className='w-12 h-1.5 bg-red-600 mx-auto rounded-full mt-4'></div>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className={`transition-all duration-500 rounded-3xl border ${openIndex === index ? 'border-red-200 bg-red-50/30' : 'border-gray-100 bg-gray-50'}`}>
                            <button
                                className="flex items-center justify-between w-full p-6 text-left focus:outline-none"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <span className={`font-black text-sm uppercase tracking-tight ${openIndex === index ? 'text-red-600' : 'text-gray-700'}`}>
                                    {faq.question}
                                </span>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${openIndex === index ? 'bg-red-600 text-white rotate-180' : 'bg-white text-gray-400 border border-gray-100'}`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>
                            
                            <div className={`overflow-hidden transition-all duration-500 ${openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <p className="px-6 pb-6 text-sm font-medium leading-relaxed text-gray-600">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const BannerAndFAQ = () => (
    <div className='pb-20'>
        <Banner />
        <FAQSection />
    </div>
);

export default BannerAndFAQ;