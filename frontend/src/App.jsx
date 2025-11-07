import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Zap, Globe, Smartphone, Palette, Rocket, Check, Star, Shield, Clock, Users, Mail, Phone, Cpu, LogIn, Key, Loader2 } from 'lucide-react';

// --- Base API URL (Set to your production backend) ---
const API_URL = "https://ai-website-builder-klgp.onrender.com";

// --- Razorpay Script Loader ---
const useRazorpay = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);
};

// --- Enhanced Loading Modal Component ---
const LoadingModal = ({ progress, currentDesign, currentDesignName }) => {
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    "AI is analyzing your business requirements...",
    "Crafting unique design concepts...",
    "Generating professional content...",
    "Optimizing for mobile devices...",
    "Applying modern animations...",
    "Finalizing your websites..."
  ];

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 2000);
    return () => clearInterval(tipInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-purple-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-xl flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 text-center max-w-md w-full"
      >
        {/* Animated Header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="flex items-center justify-center space-x-3 mb-6"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
            >
              <Cpu className="w-6 h-6 text-white" />
            </motion.div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            AI Building
          </h2>
        </motion.div>

        {/* Progress Info */}
        <div className="mb-6">
          <p className="text-white/80 text-lg mb-2">Design {currentDesign} of 6</p>
          <p className="text-purple-300 font-semibold mb-2">{currentDesignName}</p>
          <motion.p
            key={currentTip}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-purple-200 font-medium min-h-[2rem] text-sm"
          >
            {tips[currentTip]}
          </motion.p>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="relative mb-8">
          <div className="flex justify-between text-white/60 text-sm mb-2">
            <span>Starting...</span>
            <span className="font-bold text-white">{progress.toFixed(0)}%</span>
            <span>Complete!</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 relative"
            >
              {/* Shimmer effect */}
              <motion.div
                animate={{ x: ["0%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </motion.div>
          </div>
        </div>

        {/* AI Features Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { icon: Cpu, text: "DeepSeek AI", color: "from-green-500 to-emerald-500" },
            { icon: Zap, text: "Real Content", color: "from-yellow-500 to-orange-500" },
            { icon: Palette, text: "6 Designs", color: "from-blue-500 to-cyan-500" },
            { icon: Globe, text: "SEO Ready", color: "from-purple-500 to-pink-500" }
          ].map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-2xl p-3 border border-white/10"
            >
              <div className={`w-8 h-8 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <feature.icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-white/70 text-xs font-medium">{feature.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Estimated Time */}
        <div className="flex items-center justify-center space-x-2 text-white/50 text-sm">
          <Clock className="w-4 h-4" />
          <span>Powered by DeepSeek R1 AI</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Enhanced Success Modal Component ---
// This modal is no longer used in the primary flow, but kept for potential future use
const SuccessModal = ({ businessName, onNext, generationTime }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-gradient-to-br from-purple-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-xl flex items-center justify-center z-50 p-4"
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 text-center max-w-md w-full"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <Check className="w-10 h-10 text-white" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent mb-3"
      >
        Success!
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-white/80 text-lg mb-2"
      >
        6 AI-Generated Websites Ready for
      </motion.p>
      <motion.p
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-4"
      >
        {businessName}
      </motion.p>
      {generationTime && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-green-300 text-sm mb-4"
        >
          Generated in {(generationTime / 1000).toFixed(1)} seconds
        </motion.p>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-6"
      >
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { icon: Check, text: "6 AI Designs", color: "text-green-400" },
            { icon: Check, text: "Real Content", color: "text-blue-400" },
            { icon: Check, text: "Mobile Ready", color: "text-purple-400" },
            { icon: Check, text: "SEO Optimized", color: "text-yellow-400" }
          ].map((feature, index) => (
            <div key={feature.text} className="flex items-center space-x-2">
              <feature.icon className={`w-4 h-4 ${feature.color}`} />
              <span className="text-white/70">{feature.text}</span>
            </div>
          ))}
        </div>
      </motion.div>
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        onClick={onNext}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 hover:from-purple-500 hover:to-pink-500 group"
      >
        <span className="flex items-center justify-center space-x-2">
          <span>View AI Websites</span>
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.span>
        </span>
      </motion.button>
    </motion.div>
  </motion.div>
);

// --- Enhanced Preview Controls (Mobile Responsive) ---
const PreviewControls = ({ selectedDesign, websites, onDesignSelect, onNext, designs }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-4xl"
  >
    <div className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        
        <div className="text-white text-center sm:text-left mb-3 sm:mb-0">
          {/* Show design name if available, otherwise "Loading..." */}
          <h3 className="font-bold text-lg">{designs[selectedDesign]?.style || `Design ${selectedDesign + 1}`}</h3>
          <p className="text-white/60 text-sm truncate">{designs[selectedDesign]?.description || 'AI Generated Design'}</p>
        </div>

        <button
          onClick={onNext}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-5 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 group flex items-center justify-center space-x-2 w-full sm:w-auto text-sm sm:text-base flex-shrink-0"
        >
          <span>Select Design {selectedDesign + 1}</span>
          <Rocket className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="flex items-center justify-center space-x-2">
        <button
          onClick={() => onDesignSelect(Math.max(0, selectedDesign - 1))}
          disabled={selectedDesign === 0} // Disable if at first design
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 group disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        </button>

        <div className="flex space-x-1.5 sm:space-x-2">
          {/* This now works perfectly: it maps over the 'websites' array, which grows from 1 to 6 */}
          {websites.map((_, index) => (
            <button
              key={index}
              onClick={() => onDesignSelect(index)}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center text-sm relative overflow-hidden ${
                selectedDesign === index
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 scale-110'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:scale-105'
              }`}
            >
              {index + 1}
              {selectedDesign === index && (
                <motion.div
                  layoutId="activeDesign"
                  className="absolute inset-0 bg-white/20 rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
          {/* Show loading placeholders for designs not yet loaded */}
          {[...Array(Math.max(0, 6 - websites.length))].map((_, index) => (
             <div
              key={websites.length + index}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/5 flex items-center justify-center animate-pulse"
            >
                <Loader2 className="w-4 h-4 text-white/20 animate-spin"/>
             </div>
          ))}
        </div>

        <button
          onClick={() => onDesignSelect(Math.min(websites.length - 1, selectedDesign + 1))}
          disabled={selectedDesign === websites.length - 1} // Disable if at last loaded design
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 group disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  </motion.div>
);


// --- Main Application Component ---
const App = () => {
  useRazorpay(); // Load Razorpay script

  const [step, setStep] = useState('form');
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
  });
  const [error, setError] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentDesign, setCurrentDesign] = useState(1);
  const [currentDesignName, setCurrentDesignName] = useState('Initializing...');
  const [websites, setWebsites] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(0);
  const [generationTime, setGenerationTime] = useState(0); // This is no longer calculated, but we can keep the state
  const [designs, setDesigns] = useState([]);
  const [razorpayKeyId, setRazorpayKeyId] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  // --- NEW STREAMING API Call Logic ---
  const handleGenerateWebsites = async (e) => {
    e.preventDefault();
    if (!formData.businessName || !formData.businessType) {
      setError('Please fill in both fields to continue.');
      return;
    }
    setError('');
    setStep('loading');
    setLoadingProgress(0);
    setCurrentDesign(1);
    setCurrentDesignName('Initializing job...');
    setWebsites([]); // Clear previous designs
    setDesigns([]);  // Clear previous design info

    try {
      // 1. Start the generation job
      const response = await fetch(`${API_URL}/api/start-generation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start generation job.');
      }

      const data = await response.json();
      const { jobId } = data;

      if (!jobId) {
        throw new Error('Failed to get a generation Job ID.');
      }

      // 2. Connect to the event stream
      const eventSource = new EventSource(`${API_URL}/api/generation-stream/${jobId}`);
      
      // 3. Listen for incoming designs
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const { html, design, index } = data;

        // Add new design to state
        setWebsites(prev => [...prev, html]);
        setDesigns(prev => [...prev, design]);

        // Update loading modal (it will be hidden after index 0)
        setCurrentDesign(index + 1);
        setCurrentDesignName(design.style);
        setLoadingProgress(((index + 1) / 6) * 100);

        // --- THIS IS THE KEY ---
        // As soon as the first design is ready, move to preview
        if (index === 0) {
          setStep('preview');
          setSelectedDesign(0);
        }
      };

      // 4. Listen for the "done" event
      eventSource.addEventListener('done', (event) => {
        console.log('Stream complete.');
        setLoadingProgress(100);
        eventSource.close();
      });

      // 5. Listen for errors
      eventSource.addEventListener('error', (event) => {
        console.error('EventSource failed:', event);
        const errorData = event.data ? JSON.parse(event.data).error : 'Streaming connection failed.';
        setError(errorData);
        setStep('form');
        eventSource.close();
      });

    } catch (err) {
      console.error("Failed to start stream:", err);
      setError(err.message || 'Network error or API key issue.');
      setStep('form');
    }
  };


  // --- Razorpay Payment Handler ---
  const handlePayment = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const phone = e.target.phone.value;

    if (!email || !phone) {
      setError("Please enter both email and phone number.");
      return;
    }
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
       setError("Please enter a valid 10-digit phone number.");
       return;
    }

    setError('');

    try {
      const orderRes = await fetch(`${API_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 199 }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.error || "Failed to create payment order.");

      const currentRazorpayKeyId = orderData.razorpayKeyId;
       if (!currentRazorpayKeyId) {
           console.error("Razorpay Key ID not received from backend.");
           setError("Payment gateway configuration error (Key missing).");
           return;
       }
       setRazorpayKeyId(currentRazorpayKeyId);

      const options = {
        key: currentRazorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "SK Website Builder",
        description: `Advance for ${formData.businessName}`,
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${API_URL}/api/payment/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: {
                  phone: phone,
                  email: email,
                  businessName: formData.businessName,
                  businessType: formData.businessType,
                  selectedWebsiteHtml: websites[selectedDesign],
                  selectedDesignStyle: designs[selectedDesign]?.style,
                }
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setStep('form');
              setFormData({ businessName: '', businessType: '' });
              setWebsites([]);
              setDesigns([]);
              setSelectedDesign(0);
              setError('Payment Successful! Your order is confirmed. Our team will contact you shortly.');
            } else {
              throw new Error(verifyData.error || 'Payment verification failed.');
            }
          } catch (verifyError) {
             console.error("Payment verification error:", verifyError);
             setError(`Payment verification failed: ${verifyError.message}. Please contact support with Payment ID: ${response.razorpay_payment_id}`);
          }
        },
        prefill: {
          name: formData.businessName,
          email: email,
          contact: phone,
        },
        notes: {
            businessName: formData.businessName,
            businessType: formData.businessType,
            selectedDesign: designs[selectedDesign]?.style
        },
        theme: {
          color: "#6D28D9", // Purple
        },
        modal: {
          ondismiss: function() {
            console.log('Checkout form closed');
            setError("Payment cancelled or closed.");
          }
        }
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response){
                console.error("Razorpay Payment Failed:", response.error);
                setError(`Payment Failed: ${response.error.description || 'Unknown error'} (Code: ${response.error.code || 'N/A'}). Please try again or contact support.`);
        });
        rzp.open();
      } else {
        throw new Error("Razorpay script not loaded properly.");
      }

    } catch (err) {
      console.error("Payment setup error:", err);
      setError(`Payment process failed: ${err.message}. Please try again.`);
    }
  };


  // Dynamic layout classes
  const getMainLayoutClasses = () => {
    const baseClasses = "min-h-screen w-full transition-all duration-500";
    if (step === 'preview') {
      return `${baseClasses} flex flex-col bg-gray-900`;
    }
    return `${baseClasses} flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900`;
  };

  const renderContent = () => {
    switch (step) {
      case 'form':
        return (
          <div className="w-full max-w-2xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
               <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center"
                  >
                    <Cpu className="w-8 h-8 text-white" />
                  </motion.div>
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  AI Website Builder
                </h1>
              </div>
              <p className="text-xl text-purple-200/80 mb-2">
                Generate 6 Unique AI Websites in Seconds
              </p>
               <div className="flex items-center justify-center space-x-6 text-sm text-purple-200/60">
                 <div className="flex items-center space-x-1">
                   <Shield className="w-4 h-4 text-green-400" />
                   <span>Free Preview</span>
                 </div>
               </div>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleGenerateWebsites}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="font-bold text-white/80 text-lg flex items-center space-x-2" htmlFor="businessName">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span>Business Name</span>
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-white/10 text-white rounded-2xl border border-white/20 focus:ring-2 focus:ring-purple-400 focus:outline-none placeholder-white/50 transition-all duration-300 focus:bg-white/15 focus:scale-105"
                    placeholder="e.g., SK Infotech"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-bold text-white/80 text-lg flex items-center space-x-2" htmlFor="businessType">
                    <Palette className="w-5 h-5 text-purple-400" />
                    <span>Business Type</span>
                  </label>
                  <input
                    type="text"
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-white/10 text-white rounded-2xl border border-white/20 focus:ring-2 focus:ring-purple-400 focus:outline-none placeholder-white/50 transition-all duration-300 focus:bg-white/15 focus:scale-105"
                    placeholder="e.g., Construction Materials"
                  />
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-2xl text-center border ${
                    error.startsWith('Payment Successful')
                      ? 'text-green-300 bg-green-900/50 border-green-500/30'
                      : 'text-red-300 bg-red-900/50 border-red-500/30'
                  }`}
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group relative overflow-hidden"
              >
                 <span className="relative z-10 flex items-center justify-center space-x-2 text-lg">
                   <Cpu className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                   <span>Generate 6 AI Websites</span>
                 </span>
                 <motion.div
                   className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500"
                   initial={{ x: "-100%" }}
                   whileHover={{ x: 0 }}
                   transition={{ duration: 0.3 }}
                 />
              </motion.button>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
                {[
                  { icon: Cpu, text: "AI Powered", sub: "DeepSeek R1" },
                  { icon: Smartphone, text: "6 Designs", sub: "Unique styles" },
                  { icon: Zap, text: "Real Content", sub: "AI Generated" },
                  { icon: Shield, text: "Free Preview", sub: "No cost" }
                ].map((feature) => (
                  <div key={feature.text} className="text-center">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <feature.icon className="w-5 h-5 text-purple-300" />
                    </div>
                    <div className="text-white/80 font-medium text-sm">{feature.text}</div>
                    <div className="text-white/50 text-xs">{feature.sub}</div>
                  </div>
                ))}
              </div>
            </motion.form>
             <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-8"
            >
              <p className="text-purple-200/60 text-sm">
                🤖 Powered by SK Infotech AI - Generating real website content and designs
              </p>
            </motion.div>
          </div>
        );

      case 'preview':
        if (websites.length === 0) {
             // This case handles if we land here with no websites
             setStep('form');
             return null;
        }
        return (
          <div className="w-full flex-grow relative flex flex-col">
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm flex items-center space-x-2">
                  <Cpu className="w-4 h-4" />
                  {/* Show which design is selected, even if others are loading */}
                  <span>AI Generated Website - {designs[selectedDesign]?.style || `Design ${selectedDesign+1}`}</span>
                </div>
              </div>
            <iframe
              // Show the selected website HTML
              srcDoc={websites[selectedDesign] || ''}
              title={`AI Design ${selectedDesign + 1}`}
              className="w-full flex-grow border-0 bg-white"
              sandbox="allow-scripts allow-same-origin"
            />
            <PreviewControls
              selectedDesign={selectedDesign}
              websites={websites} // Pass the growing array
              designs={designs}   // Pass the growing array
              onDesignSelect={setSelectedDesign}
              onNext={() => setStep('booking')}
            />
          </div>
        );

      case 'booking':
        if (websites.length === 0) {
            setStep('form');
            return null;
        }
        return (
          <div className="w-full max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 text-gray-800"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent mb-2">
                  Perfect Choice!
                </h2>
                <p className="text-gray-600 text-lg">Your AI website is ready to go live</p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
                <h3 className="font-bold text-gray-800 mb-4 text-lg">AI Generation Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Business</span>
                    <span className="font-semibold">{formData.businessName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Selected Design</span>
                    <span className="font-semibold">{designs[selectedDesign]?.style || `Design ${selectedDesign+1}`}</span>
                  </div>
                </div>
              </div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-2 mb-4">
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold px-4 py-1 rounded-full text-sm">
                    33% OFF
                  </span>
                  <span className="text-sm text-gray-500">Limited Time Offer</span>
                </div>
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <span className="text-5xl font-bold text-gray-800">₹3999</span>
                  <span className="text-2xl text-gray-500 line-through">₹6000</span>
                </div>
                <p className="text-gray-600">One-time payment • All features included</p>
              </div>
              <div className="text-center">
                <p className="text-purple-600 font-semibold mb-4 flex items-center justify-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Refundable Advance - ₹199 only</span>
                </p>
                <button
                  onClick={() => setStep('payment')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  Secure Your AI Website Now
                </button>
                <p className="text-gray-500 text-sm mt-3">7-day money back guarantee • No hidden fees</p>
              </div>
            </motion.div>
          </div>
        );

      case 'payment':
        return (
          <div className="w-full max-w-lg mx-auto">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handlePayment}
              className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 text-gray-800"
            >
              <div className="flex justify-between items-center mb-8">
                <button
                  type="button"
                  onClick={() => setStep('booking')}
                  className="flex items-center space-x-2 text-purple-600 font-bold hover:text-purple-700 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Pay Advance</h2>
                <div className="w-16"/> {/* Spacer */}
              </div>

              {error && (
                <p className="text-red-600 bg-red-100 p-3 rounded-lg text-center mb-6">
                  {error}
                </p>
              )}

              <div className="space-y-6">
                 <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 flex items-center space-x-2" htmlFor="email">
                      <Mail className="w-4 h-4" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="your@email.com"
                      className="w-full p-4 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:outline-none transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 flex items-center space-x-2" htmlFor="phone">
                      <Phone className="w-4 h-4" />
                      <span>Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="9876543210"
                      maxLength={10}
                      onChange={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                      className="w-full p-4 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:outline-none transition-all duration-3D"
                      required
                    />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Advance Amount</span>
                    <span className="text-2xl font-bold text-purple-600">₹199</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">Remaining ₹3800 to be paid after website delivery</p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Shield className="w-5 h-5" />
                  <span>Pay Securely - ₹199</span>
                </button>

                 <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
                   <Shield className="w-4 h-4" />
                   <span>SSL Encrypted • 100% Secure Payment</span>
                 </div>
              </div>
            </motion.form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className={getMainLayoutClasses()}>
      {/* Animated Background (only for non-preview steps) */}
      {step !== 'preview' && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-400/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                x: [null, Math.random() * window.innerWidth],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className={`w-full flex flex-col ${step === 'preview' ? 'flex-grow h-full' : ''} ${step !== 'preview' ? 'justify-center items-center' : ''}`}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Enhanced Modals (Render outside the main content transition) */}
      <AnimatePresence>
        {step === 'loading' && (
          <LoadingModal
            progress={loadingProgress}
            currentDesign={currentDesign}
            currentDesignName={currentDesignName}
          />
        )}
        {/* SuccessModal is no longer called in the new streamflow, but we leave it here */}
        {step === 'successModal' && (
          <SuccessModal
            businessName={formData.businessName}
            generationTime={generationTime}
            onNext={() => setStep('preview')}
          />
        )}
      </AnimatePresence>
    </main>
  );
};

export default App;