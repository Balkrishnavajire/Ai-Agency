'use client'

import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Zap, 
  Brain, 
  Rocket, 
  Shield, 
  TrendingUp,
  ArrowRight,
  Bot,
  MessageSquare,
  BarChart3,
  Users,
  X,
  Mail,
  Phone,
  User,
  Send,
  Minimize2
} from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [consultationDetails, setConsultationDetails] = useState<{ meetingDate?: string, meetingTimeFormatted?: string } | null>(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'automatic' | 'manual'>('automatic')
  const [particles, setParticles] = useState<Array<{
    width: number
    height: number
    initialX: number
    initialY: number
    initialOpacity: number
    animateY: number
    animateOpacity1: number
    animateOpacity2: number
    duration: number
    delay: number
  }>>([])
  const [scrollProgress, setScrollProgress] = useState(0)
  
  // Your payment details - UPDATE THESE with your actual details
  const paymentDetails = {
    upiId: 'your-upi-id@paytm', // e.g., 'aiagency@paytm' or 'yourname@upi'
    bankName: 'Your Bank Name',
    accountNumber: '1234567890',
    ifscCode: 'BANK0001234',
    accountHolderName: 'AI Agency',
    phoneNumber: '+91 1234567890', // For UPI payment reference
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    setIsMounted(true)
    
    // Generate particles only on client
    if (typeof window !== 'undefined') {
      const newParticles = Array.from({ length: 12 }, () => ({
        width: Math.random() * 2 + 1,
        height: Math.random() * 2 + 1,
        initialX: Math.random() * window.innerWidth,
        initialY: Math.random() * window.innerHeight,
        initialOpacity: Math.random() * 0.3 + 0.1,
        animateY: Math.random() * window.innerHeight,
        animateOpacity1: Math.random() * 0.4 + 0.1,
        animateOpacity2: Math.random() * 0.2 + 0.05,
        duration: Math.random() * 15 + 15,
        delay: Math.random() * 5,
      }))
      setParticles(newParticles)
    }
    
    const handleScroll = () => {
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        setScrollY(window.scrollY)
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
        setScrollProgress(scrollHeight > 0 ? window.scrollY / scrollHeight : 0)
      }
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll)
      handleScroll() // Initial calculation
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Load Razorpay script
  useEffect(() => {
    if (showPayment && typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      document.body.appendChild(script)
      
      return () => {
        // Cleanup script on unmount
        const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
        if (existingScript) {
          document.body.removeChild(existingScript)
        }
      }
    }
  }, [showPayment])

  useEffect(() => {
    if (isModalOpen || selectedService !== null) {
      document.body.style.overflow = 'hidden'
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsModalOpen(false)
          setSelectedService(null)
        }
      }
      window.addEventListener('keydown', handleEscape)
      return () => {
        document.body.style.overflow = 'unset'
        window.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isModalOpen, selectedService])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  // Initialize chat with welcome message
  useEffect(() => {
    if (isChatOpen && chatMessages.length === 0) {
      setChatMessages([{
        role: 'assistant',
        content: "Hi! I'm your AI assistant. I can help you understand what to expect in your consultation and what prerequisites you should prepare. What would you like to know?"
      }])
    }
  }, [isChatOpen, chatMessages.length])

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isChatOpen) {
      const chatContainer = document.querySelector('[data-chat-messages]')
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight
      }
    }
  }, [chatMessages, isChatOpen, isTyping])

  // Chat responses based on keywords
  const getChatResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('prerequisite') || lowerMessage.includes('prepare') || lowerMessage.includes('need')) {
      return `Great question! Here's what you should prepare for your consultation:\n\n📋 Prerequisites:\n• Current business challenges you're facing\n• Your goals and objectives\n• Budget considerations\n• Timeline expectations\n• Any existing tools or systems you're using\n\n💡 What to Bring:\n• Questions about AI automation\n• Examples of tasks you want to automate\n• Your business process documentation (if available)\n\nThis will help us tailor the perfect AI solution for your needs!`
    }
    
    if (lowerMessage.includes('expect') || lowerMessage.includes('happen') || lowerMessage.includes('meeting')) {
      return `Here's what to expect in your 30-minute consultation:\n\n⏱️ Meeting Structure:\n• 5 min: Introduction & understanding your business\n• 15 min: Discussion of your needs and challenges\n• 8 min: AI solution recommendations\n• 2 min: Next steps and Q&A\n\n🎯 We'll Cover:\n• Your current business processes\n• Automation opportunities\n• Custom AI agent solutions\n• Implementation timeline\n• Pricing and packages\n\n📅 The meeting will be conducted online via video call. You'll receive the meeting link via email before the scheduled time.`
    }
    
    if (lowerMessage.includes('duration') || lowerMessage.includes('long') || lowerMessage.includes('time')) {
      return `The consultation is 30 minutes long. 🎉\n\nWe'll use this time to:\n• Understand your business needs\n• Identify automation opportunities\n• Discuss potential AI solutions\n• Answer your questions\n\nConsultation fee: ₹1000\n\nIt's a focused conversation to understand your needs and provide tailored solutions.`
    }
    
    if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('free') || lowerMessage.includes('fee')) {
      return `The consultation fee is ₹1000 (Indian Rupees). 💰\n\nThis includes:\n• 30-minute personalized consultation\n• Custom AI solution proposal\n• Implementation timeline\n• Detailed recommendations\n• Follow-up support\n\nPayment can be made after booking confirmation. We'll send you payment details via email.`
    }
    
    if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('do')) {
      return `We offer comprehensive AI agent services:\n\n🤖 AI Chatbots - 24/7 customer support\n📊 Data Analytics - AI-powered business insights\n💬 Automated Support - Streamlined customer service\n📈 Sales Automation - Lead qualification & deal closing\n\nAll solutions are customized for small businesses and designed to scale with you. Would you like details on any specific service?`
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return `Hello! 👋 I'm here to help you prepare for your consultation. You can ask me about:\n\n• What to prepare before the meeting\n• What to expect during the consultation\n• Our services and solutions\n• Pricing and packages\n• Any other questions!\n\nWhat would you like to know?`
    }
    
    // Default response
    return `I understand you're asking about "${message}". For your consultation, I'd recommend:\n\n✅ Before the meeting:\n• Think about your main business challenges\n• Consider what tasks take up most of your time\n• Have your goals in mind\n\n✅ During the meeting:\n• We'll discuss your specific needs\n• Explore AI automation opportunities\n• Get personalized recommendations\n\nFeel free to ask me more specific questions! You can ask about prerequisites, what to expect, our services, or anything else.`
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || isTyping) return

    const userMessage = chatInput.trim()
    setChatInput('')
    
    // Add user message
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }])
    
    // Simulate typing
    setIsTyping(true)
    
    // Get response after a short delay
    setTimeout(() => {
      const response = getChatResponse(userMessage)
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }])
      setIsTyping(false)
    }, 1000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to schedule consultation')
      }

      setSubmitStatus('success')
      setConsultationDetails({
        meetingDate: data.meetingDate,
        meetingTimeFormatted: data.meetingTimeFormatted
      })
      
      // Show payment section after 1 second
      setTimeout(() => {
        setShowPayment(true)
      }, 1000)
    } catch (error: any) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
      alert(error.message || 'Failed to schedule consultation. Please try again or contact us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePayment = async () => {
    if (!consultationDetails) return
    
    setIsProcessingPayment(true)
    
    try {
      // Create Razorpay order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 1000, // ₹1000
          currency: 'INR',
          consultationId: `consultation_${Date.now()}`,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create payment order')
      }

      // Initialize Razorpay checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'AI Agency',
        description: 'Consultation Fee',
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.verified) {
              // Payment successful
              alert(`Payment successful! ✅\n\nConsultation Details:\nDate: ${consultationDetails.meetingDate}\nTime: ${consultationDetails.meetingTimeFormatted}\n\nCheck your email for calendar invite.`)
              setIsModalOpen(false)
              setFormData({ name: '', email: '', phone: '', company: '', message: '' })
              setSubmitStatus('idle')
              setShowPayment(false)
              setConsultationDetails(null)
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (error: any) {
            console.error('Payment verification error:', error)
            alert('Payment verification failed. Please contact support.')
          } finally {
            setIsProcessingPayment(false)
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#3b82f6',
        },
        modal: {
          ondismiss: function() {
            setIsProcessingPayment(false)
          },
        },
      }

      // @ts-ignore - Razorpay is loaded dynamically
      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error: any) {
      console.error('Payment error:', error)
      alert(error.message || 'Failed to initiate payment. Please try again.')
      setIsProcessingPayment(false)
    }
  }

  const services = [
    {
      icon: Bot,
      title: 'AI Chatbots',
      description: 'Intelligent customer service agents that work 24/7',
      color: 'from-cyan-500 to-blue-500',
      details: {
        overview: 'Transform your customer service with AI-powered chatbots that understand context, learn from interactions, and provide instant, accurate responses around the clock.',
        features: [
          'Natural language processing for human-like conversations',
          'Multi-language support for global reach',
          'Integration with your existing CRM and support systems',
          'Sentiment analysis to understand customer emotions',
          'Seamless handoff to human agents when needed',
          'Customizable personality and tone matching your brand'
        ],
        benefits: [
          'Reduce response time from hours to seconds',
          'Handle multiple conversations simultaneously',
          'Cut customer service costs by up to 30%',
          'Improve customer satisfaction scores',
          'Available 24/7 without breaks or holidays',
          'Learn and improve from every interaction'
        ],
        useCases: [
          'Customer support and troubleshooting',
          'Product recommendations and inquiries',
          'Order tracking and status updates',
          'FAQ handling and information retrieval',
          'Appointment scheduling and bookings',
          'Lead qualification and initial screening'
        ]
      }
    },
    {
      icon: BarChart3,
      title: 'Data Analytics',
      description: 'AI-powered insights to drive your business decisions',
      color: 'from-purple-500 to-pink-500',
      details: {
        overview: 'Unlock the power of your data with AI-driven analytics that automatically identifies patterns, predicts trends, and provides actionable insights to grow your business.',
        features: [
          'Automated data collection and processing',
          'Predictive analytics for future trends',
          'Real-time dashboards and visualizations',
          'Anomaly detection and alerting',
          'Custom report generation',
          'Integration with all major data sources'
        ],
        benefits: [
          'Make data-driven decisions faster',
          'Identify opportunities before competitors',
          'Reduce manual reporting time by 80%',
          'Predict customer behavior and preferences',
          'Optimize operations and reduce waste',
          'Increase revenue through better insights'
        ],
        useCases: [
          'Sales forecasting and pipeline analysis',
          'Customer behavior and segmentation',
          'Inventory optimization',
          'Marketing campaign performance',
          'Financial trend analysis',
          'Operational efficiency monitoring'
        ]
      }
    },
    {
      icon: MessageSquare,
      title: 'Automated Support',
      description: 'Handle customer inquiries instantly and efficiently',
      color: 'from-blue-500 to-cyan-500',
      details: {
        overview: 'Streamline your support operations with intelligent automation that handles routine inquiries, escalates complex issues, and ensures every customer gets timely assistance.',
        features: [
          'Intelligent ticket routing and prioritization',
          'Automated response templates with personalization',
          'Knowledge base integration for instant answers',
          'Multi-channel support (email, chat, social media)',
          'Automated follow-up and satisfaction surveys',
          'Performance analytics and optimization'
        ],
        benefits: [
          'Resolve 70% of inquiries without human intervention',
          'Reduce average response time by 90%',
          'Improve first-contact resolution rates',
          'Scale support without proportional cost increase',
          'Ensure consistent service quality',
          'Free up team for complex, high-value issues'
        ],
        useCases: [
          'Technical support and troubleshooting',
          'Account management and billing inquiries',
          'Product information and specifications',
          'Return and refund processing',
          'Service status updates',
          'General information requests'
        ]
      }
    },
    {
      icon: TrendingUp,
      title: 'Sales Automation',
      description: 'AI agents that qualify leads and close deals',
      color: 'from-pink-500 to-purple-500',
      details: {
        overview: 'Accelerate your sales process with AI agents that qualify leads, nurture prospects, schedule meetings, and help close deals faster than ever before.',
        features: [
          'Intelligent lead scoring and qualification',
          'Automated email sequences and follow-ups',
          'Meeting scheduling and calendar management',
          'CRM integration and data synchronization',
          'Sales pipeline tracking and forecasting',
          'Personalized outreach at scale'
        ],
        benefits: [
          'Increase lead conversion rates by 40%',
          'Reduce sales cycle time significantly',
          'Never miss a follow-up opportunity',
          'Focus on high-value prospects',
          'Scale outreach without hiring more staff',
          'Improve sales team productivity'
        ],
        useCases: [
          'Lead qualification and scoring',
          'Prospect nurturing campaigns',
          'Meeting scheduling and reminders',
          'Proposal and quote generation',
          'Sales pipeline management',
          'Customer onboarding automation'
        ]
      }
    },
  ]

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Deploy AI agents in days, not months'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security for your business'
    },
    {
      icon: Brain,
      title: 'Intelligent',
      description: 'AI that learns and adapts to your needs'
    },
    {
      icon: Rocket,
      title: 'Scalable',
      description: 'Grows with your business effortlessly'
    },
  ]

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Subtle background gradient */}
      <div 
        className="fixed inset-0 opacity-20 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.08) 0%, transparent 50%)`
        }}
      />

      {/* Subtle gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute top-20 left-10 w-[600px] h-[600px] bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-[0.03]"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-10 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-[0.03]"
          animate={{
            x: [0, -40, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>

      {/* Minimal floating particles */}
      {isMounted && particles.length > 0 && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/5"
              style={{
                width: `${particle.width}px`,
                height: `${particle.height}px`,
              }}
              initial={{
                x: particle.initialX,
                y: particle.initialY,
                opacity: particle.initialOpacity,
              }}
              animate={{
                y: [null, particle.animateY],
                opacity: [null, particle.animateOpacity1, particle.animateOpacity2],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {/* AI Circuit Pattern Background */}
      <div className="fixed inset-0 circuit-pattern opacity-30 pointer-events-none z-0" />
      
      {/* Neural Network Pattern */}
      <div className="fixed inset-0 neural-network opacity-40 pointer-events-none z-0" />
      
      {/* Data Stream Overlay */}
      <div className="fixed inset-0 data-stream opacity-20 pointer-events-none z-0" />
      
      {/* Subtle grid pattern */}
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Scroll Progress Indicator */}
      {isMounted && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 z-50 origin-left"
          style={{
            scaleX: scrollProgress,
          }}
        />
      )}

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-blue-400/20 rounded-full blur-lg"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity
                }}
              />
              <Brain className="w-7 h-7 text-blue-400 relative z-10" />
            </div>
            <span className="text-2xl font-semibold gradient-text tracking-tight relative">
              AI Agency
              <motion.span
                className="absolute -bottom-1 left-0 text-[6px] font-mono text-blue-400/30"
                animate={{
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                01000001
              </motion.span>
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-6 items-center"
          >
            <motion.a 
              href="#services" 
              className="text-gray-300 hover:text-white transition-colors relative group text-sm font-medium"
            >
              Services
              <span className="absolute bottom-0 left-0 w-0 h-px bg-white/40 group-hover:w-full transition-all duration-300" />
            </motion.a>
            <motion.a 
              href="#features" 
              className="text-gray-300 hover:text-white transition-colors relative group text-sm font-medium"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-px bg-white/40 group-hover:w-full transition-all duration-300" />
            </motion.a>
            <motion.a 
              href="#contact" 
              className="text-gray-300 hover:text-white transition-colors relative group text-sm font-medium"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-px bg-white/40 group-hover:w-full transition-all duration-300" />
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-medium text-sm transition-all backdrop-blur-sm"
            >
              Get Started
            </motion.button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center px-6 pt-20"
        style={isMounted ? {
          y: scrollY * 0.3,
        } : {}}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <motion.div 
              className="inline-block mb-6 relative"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              {/* AI Brain Icon with Neural Network Effect */}
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-blue-400/20 rounded-full blur-2xl"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity
                  }}
                />
                <Brain className="w-12 h-12 text-blue-400/80 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)] relative z-10" />
                {/* Neural network connections */}
                <motion.svg
                  className="absolute inset-0 w-12 h-12 z-0"
                  viewBox="0 0 48 48"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.line
                    x1="12"
                    y1="12"
                    x2="24"
                    y2="24"
                    stroke="rgba(59, 130, 246, 0.3)"
                    strokeWidth="0.5"
                    animate={{
                      pathLength: [0, 1, 0],
                      opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 0
                    }}
                  />
                  <motion.line
                    x1="36"
                    y1="12"
                    x2="24"
                    y2="24"
                    stroke="rgba(59, 130, 246, 0.3)"
                    strokeWidth="0.5"
                    animate={{
                      pathLength: [0, 1, 0],
                      opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 0.3
                    }}
                  />
                  <motion.line
                    x1="24"
                    y1="24"
                    x2="24"
                    y2="36"
                    stroke="rgba(59, 130, 246, 0.3)"
                    strokeWidth="0.5"
                    animate={{
                      pathLength: [0, 1, 0],
                      opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 0.6
                    }}
                  />
                </motion.svg>
              </div>
            </motion.div>
            <motion.h1 
              className="text-5xl md:text-7xl font-semibold mb-6 tracking-tight relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* AI Data Visualization Background */}
              <motion.div
                className="absolute -inset-4 opacity-10 blur-xl"
                animate={{
                  background: [
                    "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
                    "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
                    "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)"
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity
                }}
              />
              <motion.span 
                className="gradient-text inline-block relative z-10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                AI Agents
              </motion.span>
              <br />
              <motion.span 
                className="text-white inline-block relative z-10"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                For Your Business
              </motion.span>
              {/* Binary code decoration */}
              <motion.div
                className="absolute -bottom-2 left-0 text-[8px] font-mono text-blue-400/20 opacity-50"
                animate={{
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                01000001 01001001
              </motion.div>
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Transform your small business with intelligent AI agents that automate workflows,
              engage customers, and drive growth.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3.5 bg-white text-black rounded-lg font-medium text-base flex items-center gap-2 hover:bg-white/90 transition-all shadow-lg shadow-black/20 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Your Journey
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="px-8 py-3.5 glass-effect rounded-lg font-medium text-base border border-white/20 hover:border-white/30 hover:bg-white/5 transition-all relative overflow-hidden group"
            >
              <span className="relative z-10">Learn More</span>
              <motion.div
                className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100"
                initial={false}
              />
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 mb-40 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { number: '24/7', label: 'Always Available', icon: Zap },
              { number: '10x', label: 'Faster Response', icon: Rocket },
              { number: '99%', label: 'Satisfaction Rate', icon: TrendingUp },
            ].map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -4, rotateZ: 1 }}
                  className="glass-effect p-6 rounded-xl neon-border relative overflow-visible group"
                  style={{
                    zIndex: 5,
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                  />
                  <div className="relative z-10">
                    <motion.div 
                      className="flex items-center gap-3 mb-2"
                      whileHover={{ x: 2 }}
                    >
                      <motion.div 
                        className="p-2 rounded-md bg-white/5"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-4 h-4 text-blue-400" />
                      </motion.div>
                      <motion.div 
                        className="text-3xl font-semibold gradient-text"
                        animate={{ 
                          scale: [1, 1.05, 1],
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          delay: i * 0.3
                        }}
                      >
                        {stat.number}
                      </motion.div>
                    </motion.div>
                    <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">{stat.label}</div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Spacer to prevent overlap */}
      <div className="h-32"></div>

      {/* Services Section */}
      <section id="services" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "200px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
            style={{
              position: 'relative',
              zIndex: 1,
            }}
          >
            <h2 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight">
              <span className="gradient-text">Our Services</span>
            </h2>
            <p className="text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Custom AI solutions designed to automate and enhance your business operations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, i) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    duration: 0.6, 
                    delay: i * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -5,
                    transition: { duration: 0.3 }
                  }}
                  onHoverStart={() => setHoveredCard(i)}
                  onHoverEnd={() => setHoveredCard(null)}
                  onClick={() => setSelectedService(i)}
                  className="glass-effect p-8 rounded-xl neon-border group cursor-pointer relative overflow-visible"
                  style={{
                    transformStyle: "preserve-3d",
                    zIndex: hoveredCard === i ? 10 : 1,
                  }}
                >
                  {/* Animated background gradient */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                    initial={false}
                  />
                  
                  {/* AI Circuit Pattern on Hover */}
                  <motion.div
                    className="absolute inset-0 circuit-pattern opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                    initial={false}
                  />
                  
                  {/* Shimmer effect on hover */}
                  <motion.div
                    className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100"
                    initial={false}
                  />
                  
                  {/* Binary code overlay */}
                  <motion.div
                    className="absolute bottom-2 right-2 text-[6px] font-mono text-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                  >
                    01001001
                  </motion.div>
                  
                  <div className="relative z-10">
                    <motion.div 
                      className={`w-14 h-14 rounded-lg bg-gradient-to-br ${service.color} p-3 mb-5 flex items-center justify-center transition-all group-hover:shadow-lg group-hover:shadow-blue-500/20 relative ai-glow`}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Neural network connection dots */}
                      <motion.div
                        className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0, 0.6, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: 0.5
                        }}
                      />
                      <motion.div
                        className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0, 0.6, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: 1
                        }}
                      />
                      <Icon className="w-7 h-7 text-white relative z-10" />
                    </motion.div>
                    <motion.h3 
                      className="text-xl font-semibold mb-3 text-white group-hover:text-white/90 transition-colors"
                      animate={hoveredCard === i ? { x: [0, 2, 0] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {service.title}
                    </motion.h3>
                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">{service.description}</p>
                    <motion.div 
                      className="mt-5 text-blue-400 text-sm font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      animate={hoveredCard === i ? { x: [0, 4, 0] } : {}}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                    >
                      Learn More <ArrowRight className="w-3.5 h-3.5" />
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight">
              Why Choose <span className="gradient-text">Us</span>
            </h2>
            <p className="text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Built specifically for small businesses that want enterprise-level AI
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.6, 
                    delay: i * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -8,
                    rotateX: 5,
                    transition: { duration: 0.3 }
                  }}
                  className="glass-effect p-8 rounded-xl neon-border text-center relative overflow-hidden group"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                  />
                  <div className="relative z-10">
                    <motion.div 
                      className="inline-block mb-5"
                      whileHover={{ 
                        scale: 1.2,
                        rotate: [0, -10, 10, 0]
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all">
                        <Icon className="w-6 h-6 text-blue-400" />
                      </div>
                    </motion.div>
                    <motion.h3 
                      className="text-lg font-semibold mb-3 text-white"
                      animate={{
                        textShadow: [
                          "0 0 0px rgba(59, 130, 246, 0)",
                          "0 0 10px rgba(59, 130, 246, 0.3)",
                          "0 0 0px rgba(59, 130, 246, 0)"
                        ]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.5
                      }}
                    >
                      {feature.title}
                    </motion.h3>
                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">{feature.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-effect p-12 rounded-3xl neon-border"
          >
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight">
              Ready to <span className="gradient-text">Transform</span> Your Business?
            </h2>
            <p className="text-base text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Let's discuss how AI agents can revolutionize your operations and drive growth.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="px-10 py-4 bg-white text-black rounded-lg font-medium text-base flex items-center gap-2 mx-auto hover:bg-white/90 transition-all shadow-lg shadow-black/20 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                Schedule Consultation (₹1000)
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
              />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Sparkles className="w-5 h-5 text-blue-400/80" />
            <span className="text-lg font-semibold gradient-text tracking-tight">AI Agency</span>
          </div>
          <div className="text-gray-500 text-sm">
            © 2024 AI Agency. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Consultation Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          
          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl glass-effect rounded-3xl neon-border p-8 md:p-12 max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full glass-effect hover:bg-cyan-500/20 transition-colors group"
            >
              <X className="w-6 h-6 text-gray-400 group-hover:text-cyan-400 transition-colors" />
            </button>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {showPayment ? (
                  <span className="gradient-text">Complete Payment</span>
                ) : (
                  <>
                    <span className="gradient-text">Schedule</span> Your Consultation
                  </>
                )}
              </h2>
              <p className="text-gray-300 text-lg">
                {showPayment 
                  ? 'Secure payment to confirm your consultation booking'
                  : "Let's discuss how AI agents can transform your business"
                }
              </p>
            </div>

            {/* Payment Section */}
            {showPayment && consultationDetails ? (
              <div className="space-y-6">
                <div className="glass-effect rounded-xl p-6 border border-green-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-2xl">✓</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Consultation Scheduled!</h3>
                      <p className="text-gray-400 text-sm">Please complete payment to confirm</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                      <span className="text-gray-300">Date</span>
                      <span className="text-white font-semibold">{consultationDetails.meetingDate}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                      <span className="text-gray-300">Time</span>
                      <span className="text-white font-semibold">{consultationDetails.meetingTimeFormatted}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                      <span className="text-gray-300">Duration</span>
                      <span className="text-white font-semibold">30 minutes</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-300">Consultation Fee</span>
                      <span className="text-2xl font-bold gradient-text">₹1,000</span>
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-300 mb-3">Choose Payment Method:</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setPaymentMethod('automatic')}
                        className={`px-4 py-3 rounded-xl border-2 transition-all ${
                          paymentMethod === 'automatic'
                            ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                            : 'border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        <div className="text-xs font-semibold mb-1">Automatic</div>
                        <div className="text-xs">2% fee (₹980)</div>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('manual')}
                        className={`px-4 py-3 rounded-xl border-2 transition-all ${
                          paymentMethod === 'manual'
                            ? 'border-green-500 bg-green-500/10 text-green-400'
                            : 'border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        <div className="text-xs font-semibold mb-1">Manual (UPI)</div>
                        <div className="text-xs">0% fee (₹1,000)</div>
                      </button>
                    </div>
                  </div>

                  {/* Automatic Payment (Razorpay) */}
                  {paymentMethod === 'automatic' && (
                    <>
                      <motion.button
                        onClick={handlePayment}
                        disabled={isProcessingPayment}
                        whileHover={{ scale: isProcessingPayment ? 1 : 1.02 }}
                        whileTap={{ scale: isProcessingPayment ? 1 : 0.98 }}
                        className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessingPayment ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Sparkles className="w-5 h-5" />
                            </motion.div>
                            Processing...
                          </>
                        ) : (
                          <>
                            Pay ₹1,000 (You receive ₹980)
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </motion.button>
                      <p className="text-center text-gray-400 text-xs mt-2">
                        Secure payment powered by Razorpay (2% transaction fee)
                      </p>
                    </>
                  )}

                  {/* Manual Payment (UPI/Bank Transfer) */}
                  {paymentMethod === 'manual' && (
                    <div className="space-y-4">
                      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm font-semibold mb-3 flex items-center gap-2">
                          <span>✓</span> 100% Free - No Transaction Fees!
                        </p>
                        <div className="space-y-3 text-sm">
                          <div>
                            <p className="text-gray-400 mb-1">UPI ID:</p>
                            <div className="flex items-center gap-2">
                              <code className="px-3 py-2 bg-black/30 rounded-lg text-cyan-400 font-mono text-base flex-1">
                                {paymentDetails.upiId}
                              </code>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(paymentDetails.upiId)
                                  alert('UPI ID copied to clipboard!')
                                }}
                                className="px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg text-cyan-400 transition-colors text-xs"
                              >
                                Copy
                              </button>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-gray-700/50">
                            <p className="text-gray-400 mb-2">Or Bank Transfer:</p>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Bank:</span>
                                <span className="text-white">{paymentDetails.bankName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Account:</span>
                                <span className="text-white font-mono">{paymentDetails.accountNumber}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">IFSC:</span>
                                <span className="text-white font-mono">{paymentDetails.ifscCode}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Name:</span>
                                <span className="text-white">{paymentDetails.accountHolderName}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-xs mb-2 font-semibold">📱 How to Pay:</p>
                        <ol className="text-xs text-gray-300 space-y-1 list-decimal list-inside">
                          <li>Open your UPI app (PhonePe, GPay, Paytm, etc.)</li>
                          <li>Send ₹1,000 to the UPI ID above</li>
                          <li>Add reference: "{formData.name} - Consultation"</li>
                          <li>After payment, reply to the confirmation email with payment screenshot</li>
                        </ol>
                      </div>
                      <motion.button
                        onClick={() => {
                          alert(`Payment instructions sent to ${formData.email}!\n\nPlease complete payment via UPI or Bank Transfer and reply to the confirmation email with payment proof.`)
                          setIsModalOpen(false)
                          setFormData({ name: '', email: '', phone: '', company: '', message: '' })
                          setSubmitStatus('idle')
                          setShowPayment(false)
                          setConsultationDetails(null)
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-8 py-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-green-500/50 transition-all"
                      >
                        I'll Pay via UPI/Bank Transfer
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setShowPayment(false)
                    setSubmitStatus('idle')
                    setPaymentMethod('automatic')
                  }}
                  className="text-center w-full text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
                >
                  ← Back to form
                </button>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 glass-effect rounded-xl border border-cyan-500/30 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-gray-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-cyan-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 glass-effect rounded-xl border border-cyan-500/30 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-gray-500 transition-all"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-cyan-400" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 glass-effect rounded-xl border border-cyan-500/30 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-gray-500 transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 glass-effect rounded-xl border border-cyan-500/30 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-gray-500 transition-all"
                    placeholder="Your Company"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  Tell us about your needs
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 glass-effect rounded-xl border border-cyan-500/30 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-gray-500 transition-all resize-none"
                  placeholder="What AI solutions are you interested in? How can we help your business?"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                    Submitting...
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <span className="text-green-400">✓</span>
                    Success! We'll be in touch soon.
                  </>
                ) : submitStatus === 'error' ? (
                  <>
                    <span className="text-red-400">✗</span>
                    Error. Please try again.
                  </>
                ) : (
                  <>
                    Schedule Consultation
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Service Detail Modal */}
      {selectedService !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedService(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          
          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl glass-effect rounded-3xl neon-border p-8 md:p-12 max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full glass-effect hover:bg-cyan-500/20 transition-colors group"
            >
              <X className="w-6 h-6 text-gray-400 group-hover:text-cyan-400 transition-colors" />
            </button>

            {services[selectedService] && (() => {
              const service = services[selectedService]
              const Icon = service.icon
              return (
                <>
                  {/* Header */}
                  <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.color} p-5 flex items-center justify-center`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-2">
                          <span className="gradient-text">{service.title}</span>
                        </h2>
                        <p className="text-gray-300 text-lg">{service.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Overview */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-cyan-400" />
                      Overview
                    </h3>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {service.details.overview}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Features */}
                    <div className="glass-effect p-6 rounded-2xl neon-border">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-cyan-400" />
                        Key Features
                      </h3>
                      <ul className="space-y-3">
                        {service.details.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-300">
                            <span className="text-cyan-400 mt-1">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits */}
                    <div className="glass-effect p-6 rounded-2xl neon-border">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                        Benefits
                      </h3>
                      <ul className="space-y-3">
                        {service.details.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-300">
                            <span className="text-purple-400 mt-1">•</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Use Cases */}
                    <div className="glass-effect p-6 rounded-2xl neon-border">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Rocket className="w-5 h-5 text-pink-400" />
                        Use Cases
                      </h3>
                      <ul className="space-y-3">
                        {service.details.useCases.map((useCase, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-300">
                            <span className="text-pink-400 mt-1">•</span>
                            <span>{useCase}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedService(null)
                      setIsModalOpen(true)
                    }}
                    className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-cyan-500/50 transition-all"
                  >
                    Get Started with {service.title}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </>
              )
            })()}
          </motion.div>
        </motion.div>
      )}

      {/* Interactive Chat Widget */}
      {!isChatOpen ? (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-2xl hover:shadow-blue-500/50 transition-all group"
        >
          <Bot className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" />
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 h-[600px] max-h-[calc(100vh-3rem)] glass-effect rounded-2xl neon-border flex flex-col shadow-2xl"
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI Assistant</h3>
                <p className="text-xs text-gray-400">Ask about consultation</p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              <Minimize2 className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Chat Messages */}
          <div data-chat-messages className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'glass-effect text-gray-200 border border-white/10'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-blue-400 font-medium">AI Assistant</span>
                    </div>
                  )}
                  <div 
                    className="text-sm whitespace-pre-line leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: message.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br />')
                    }}
                  />
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="glass-effect rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-blue-400 font-medium">AI Assistant</span>
                  </div>
                  <div className="flex gap-1">
                    <motion.div
                      className="w-2 h-2 bg-blue-400 rounded-full"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-blue-400 rounded-full"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-blue-400 rounded-full"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick Suggestions */}
          {chatMessages.length === 1 && (
            <div className="px-4 pb-2 space-y-2">
              <p className="text-xs text-gray-400 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {['What to prepare?', 'What to expect?', 'How long?', 'What is the fee?'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      if (isTyping) return
                      const userMessage = suggestion
                      setChatMessages(prev => [...prev, { role: 'user', content: userMessage }])
                      setIsTyping(true)
                      setTimeout(() => {
                        const response = getChatResponse(userMessage)
                        setChatMessages(prev => [...prev, { role: 'assistant', content: response }])
                        setIsTyping(false)
                      }, 1000)
                    }}
                    className="px-3 py-1.5 text-xs glass-effect rounded-full border border-white/10 hover:border-blue-400/50 hover:text-blue-400 transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input */}
          <form onSubmit={handleChatSubmit} className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about consultation..."
                className="flex-1 px-4 py-2.5 glass-effect rounded-xl border border-white/10 focus:border-blue-400/50 focus:outline-none text-white placeholder-gray-500 text-sm"
              />
              <motion.button
                type="submit"
                disabled={!chatInput.trim() || isTyping}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-11 h-11 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}
    </main>
  )
}

