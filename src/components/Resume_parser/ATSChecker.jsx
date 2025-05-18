import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUpload, FiCheck, FiAlertCircle, FiLock, FiCheckCircle, FiXCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { useTheme } from '@/context/ThemeContext';
import Header from '../shared/Header';
import Footer from '../shared/Footer';
import axios from 'axios';
const RESUME_PARSER_API_END_POINT = import.meta.env.VITE_RESUME_PARSER_API_END_POINT;
// Modern Gauge Component with Framer Motion
const ModernGauge = ({ value, size = 200 }) => {
  const ranges = [
    { min: 0, max: 20, label: 'Low', color: '#ef4444', bgColor: '#fee2e2' },
    { min: 21, max: 40, label: 'Medium', color: '#f97316', bgColor: '#ffedd5' },
    { min: 41, max: 60, label: 'Intermediate', color: '#eab308', bgColor: '#fef9c3' },
    { min: 61, max: 80, label: 'Proficient', color: '#22c55e', bgColor: '#dcfce7' },
    { min: 81, max: 100, label: 'High', color: '#16a34a', bgColor: '#bbf7d0' }
  ]

  const currentRange = ranges.find(range => value >= range.min && value <= range.max)
  const rotation = ((value - 0) / (100 - 0)) * 180

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative" 
      style={{ width: size, height: size / 2 }}
    >
      <div className="absolute w-full h-full">
        <svg viewBox="0 0 200 100">
          <path
            d="M 0 100 A 100 100 0 0 1 200 100"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="20"
          />
          {ranges.map((range, index) => {
            const startAngle = (range.min / 100) * 180
            const endAngle = (range.max / 100) * 180
            const startX = 100 + 80 * Math.cos((startAngle * Math.PI) / 180)
            const startY = 100 - 80 * Math.sin((startAngle * Math.PI) / 180)
            const endX = 100 + 80 * Math.cos((endAngle * Math.PI) / 180)
            const endY = 100 - 80 * Math.sin((endAngle * Math.PI) / 180)
            
            return (
              <motion.path
                key={index}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: index * 0.1 }}
                d={`M ${startX} ${startY} A 80 80 0 0 1 ${endX} ${endY}`}
                fill="none"
                stroke={range.color}
                strokeWidth="20"
              />
            )
          })}
        </svg>
      </div>
      
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: rotation }}
        transition={{ duration: 1, type: "spring" }}
        className="absolute bottom-0 left-1/2 origin-bottom"
        style={{
          transform: `translateX(-50%)`,
          width: '4px',
          height: '80px',
          backgroundColor: currentRange?.color || '#000',
          transformOrigin: 'bottom center'
        }}
      />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        style={{
          width: '12px',
          height: '12px',
          backgroundColor: currentRange?.color || '#000',
          borderRadius: '50%'
        }}
      />

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-16 text-center"
      >
        <div className="text-4xl font-bold" style={{ color: currentRange?.color }}>
          {value}%
        </div>
        <div className="text-sm font-medium" style={{ color: currentRange?.color }}>
          {currentRange?.label}
        </div>
      </motion.div>
    </motion.div>
  )
}

// Loading Animation Component
const LoadingAnimation = () => (
  <div className="flex flex-col items-center justify-center space-y-6">
    <div className="relative w-full max-w-lg">
      <img
        src="https://res.cloudinary.com/dtsuvx8dz/image/upload/v1716357077/o1imiun4wwcpia9uucgs.gif"
        alt="Resume Analysis in Progress"
        className="w-full h-auto rounded-lg"
      />
    </div>
    <div className="text-center space-y-2">
      <h3 className="text-xl font-semibold text-primary">Analyzing Your Resume</h3>
      <p className="text-gray-600">Please wait while we process your resume...</p>
    </div>
  </div>
)

// Metric Card Component
const MetricCard = ({ title, score, color, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
  >
    <div className="flex justify-between items-center mb-4">
      <h4 className="text-sm font-medium text-gray-700">{title}</h4>
      <span className="text-sm font-semibold" style={{ color }}>{score}/100</span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
    <p className="text-xs text-gray-500">{description}</p>
  </motion.div>
)

const Gauge = ({ value }) => {
  // value: 0-100
  const angle = (value / 100) * 180;
  const r = 48;
  const cx = 60;
  const cy = 60;
  const start = {
    x: cx - r * Math.cos(Math.PI),
    y: cy - r * Math.sin(Math.PI),
  };
  const end = {
    x: cx + r * Math.cos(Math.PI),
    y: cy - r * Math.sin(Math.PI),
  };
  const largeArc = value > 50 ? 1 : 0;
  const theta = (angle * Math.PI) / 180;
  const x = cx + r * Math.cos(Math.PI - theta);
  const y = cy - r * Math.sin(Math.PI - theta);
  return (
    <svg width="120" height="70" viewBox="0 0 120 70">
      {/* Background arc */}
      <path d="M12 60 A48 48 0 0 1 108 60" fill="none" stroke="#e5e7eb" strokeWidth="10" />
      {/* Value arc */}
      <path
        d={`M12 60 A48 48 0 0 1 ${x} ${y}`}
        fill="none"
        stroke="#22c55e"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Needle */}
      <line
        x1={cx}
        y1={cy}
        x2={cx + r * Math.cos(Math.PI - theta)}
        y2={cy - r * Math.sin(Math.PI - theta)}
        stroke="#22c55e"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Center dot */}
      <circle cx={cx} cy={cy} r="5" fill="#22c55e" />
    </svg>
  );
};

// Combined Score and Recommendations Component
const ScoreAndRecommendations = ({ scores, recommendations, strengths, improvements }) => {
  const getCategoryColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCategoryIcon = (score) => {
    if (score >= 80) return <FiCheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 60) return <FiAlertCircle className="w-5 h-5 text-yellow-600" />;
    if (score >= 40) return <FiAlertCircle className="w-5 h-5 text-orange-600" />;
    return <FiXCircle className="w-5 h-5 text-red-600" />;
  };

  const getCategoryBgColor = (score) => {
    if (score >= 80) return 'bg-green-50';
    if (score >= 60) return 'bg-yellow-50';
    if (score >= 40) return 'bg-orange-50';
    return 'bg-red-50';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#16a34a'; // green
    if (score >= 60) return '#eab308'; // yellow
    if (score >= 40) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const categories = [
    { name: 'Content Quality', weight: 15, description: 'Relevance, clarity, and professional tone of content' },
    { name: 'ATS Parse Rate', weight: 15, description: 'Machine readability and format compatibility' },
    { name: 'Quantifying Impact', weight: 15, description: 'Use of metrics and achievement quantification' },
    { name: 'Repetition Check', weight: 10, description: 'Content uniqueness and word variety' },
    { name: 'Spelling & Grammar', weight: 10, description: 'Language accuracy and consistency' },
    { name: 'Format', weight: 10, description: 'Document structure and visual hierarchy' },
    { name: 'Sections', weight: 12.5, description: 'Required sections and content organization' },
    { name: 'Style', weight: 12.5, description: 'Professional appearance and design elements' }
  ];

  return (
    <div className="space-y-8">
      {/* Detailed Analysis Grid */}
      <div className="grid  gap-8">
        {/* Left Column: Category Scores */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-primary mb-6">Category Analysis</h3>
          {categories.map((category, index) => {
            const score = scores[category.name] || 0;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${getCategoryBgColor(score)} rounded-xl p-6 shadow-sm dark:bg-transparent`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    {getCategoryIcon(score)}
                    <div>
                      <h4 className={`text-lg font-semibold ${getCategoryColor(score)}`}>
                        {category.name}
                      </h4>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-bold ${getCategoryColor(score)}`}>
                      {score}/100
                    </span>
                    <div className="text-xs text-gray-500">{category.weight}% weight</div>
                  </div>
                </div>

                <div className="w-full bg-white/50 rounded-full h-2 mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: getScoreColor(score) }}
                  />
                </div>

                {/* Show recommendations for all categories with scores below 80 */}
                {score < 80 && recommendations.filter(rec => 
                  rec.toLowerCase().includes(category.name.toLowerCase()) && 
                  rec.length > 50 && 
                  !rec.includes("consider improving")
                ).length > 0 && (
                  <div className="mt-4">
                    <h6 className="font-medium text-primary mb-2">Recommendations for {category.name}:</h6>
                    <div className="space-y-3">
                      {recommendations
                        .filter(rec => {
                          // Check if recommendation is for this category
                          const categoryMatch = rec.toLowerCase().includes(category.name.toLowerCase());
                          // Check if recommendation contains specific content (not generic)
                          const hasSpecificContent = rec.length > 50 && !rec.includes("consider improving");
                          return categoryMatch && hasSpecificContent;
                        })
                        .map((rec, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start space-x-3"
                          >
                            <span className="text-primary mt-1">•</span>
                            <div className="flex-1">
                              <p className="text-gray-700 text-sm leading-relaxed">{rec}</p>
                              {rec.includes("Example:") && (
                                <div className="mt-2 pl-4 border-l-2 border-indigo-200">
                                  <p className="text-gray-600 text-sm italic">
                                    {rec.split("Example:")[1].trim()}
                                  </p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Right Column: Best Practices */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-primary mb-6">Best Practices & Tips</h3>
          <div className="grid  gap-6">
            {[
              {
                title: "Content Quality",
                icon: <FiCheckCircle className="w-5 h-5 text-green-600" />,
                tips: [
                  "Use clear, concise language",
                  "Focus on achievements, not just responsibilities",
                  "Include relevant keywords from the job description",
                  "Maintain a professional tone throughout"
                ]
              },
              {
                title: "Format & Structure",
                icon: <FiAlertCircle className="w-5 h-5 text-blue-600" />,
                tips: [
                  "Use consistent formatting",
                  "Include clear section headers",
                  "Maintain proper spacing and margins",
                  "Use bullet points for better readability"
                ]
              },
              {
                title: "Keywords & Skills",
                icon: <FiLock className="w-5 h-5 text-purple-600" />,
                tips: [
                  "Include industry-specific keywords",
                  "List relevant technical skills",
                  "Use standard job title terminology",
                  "Highlight transferable skills"
                ]
              },
              {
                title: "Achievements",
                icon: <FiCheckCircle className="w-5 h-5 text-indigo-600" />,
                tips: [
                  "Quantify your accomplishments",
                  "Use action verbs to start bullet points",
                  "Focus on results and impact",
                  "Include relevant metrics and numbers"
                ]
              }
            ].map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center space-x-3 mb-4">
                  {section.icon}
                  <h5 className="text-lg font-semibold text-primary">{section.title}</h5>
                </div>
                <ul className="space-y-1">
                  {section.tips.map((tip, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <span className="text-primary">•</span>
                      <span className="text-gray-700 text-sm">{tip}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
        
        
      </div>
    </div>
  );
};

const ATSChecker = () => {
  const { theme } = useTheme();
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [expanded, setExpanded] = useState([true, false, false, false, false]);
  const [detailedScores, setDetailedScores] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  // Helper functions
  const getCategoryColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCategoryIcon = (score) => {
    if (score >= 80) return <FiCheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 60) return <FiAlertCircle className="w-5 h-5 text-yellow-600" />;
    if (score >= 40) return <FiAlertCircle className="w-5 h-5 text-orange-600" />;
    return <FiXCircle className="w-5 h-5 text-red-600" />;
  };

  const getCategoryBgColor = (score) => {
    if (score >= 80) return 'bg-green-50';
    if (score >= 60) return 'bg-yellow-50';
    if (score >= 40) return 'bg-orange-50';
    return 'bg-red-50';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#16a34a'; // green
    if (score >= 60) return '#eab308'; // yellow
    if (score >= 40) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  // Define categories array
  const categories = [
    { name: 'Content Quality', weight: 15, description: 'Relevance, clarity, and professional tone of content' },
    { name: 'ATS Parse Rate', weight: 15, description: 'Machine readability and format compatibility' },
    { name: 'Quantifying Impact', weight: 15, description: 'Use of metrics and achievement quantification' },
    { name: 'Repetition Check', weight: 10, description: 'Content uniqueness and word variety' },
    { name: 'Spelling & Grammar', weight: 10, description: 'Language accuracy and consistency' },
    { name: 'Format', weight: 10, description: 'Document structure and visual hierarchy' },
    { name: 'Sections', weight: 12.5, description: 'Required sections and content organization' },
    { name: 'Style', weight: 12.5, description: 'Professional appearance and design elements' }
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setError(null)
    setResult(null)
    setDetailedScores(null)
    setRecommendations([])

    const formData = new FormData()
    formData.append('pdf_doc', file)

    try {
      const response = await axios.post(`${RESUME_PARSER_API_END_POINT}/process`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = response.data;
      setResult(data);
      // Parse and set detailed scores
      if (data.detailed_scores) {
        setDetailedScores(data.detailed_scores);
      }
      // Parse and set recommendations
      if (data.recommendations) {
        setRecommendations(data.recommendations);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process resume');
    } finally {
      setLoading(false);
    }
  }

  const handleExpand = (idx) => {
    setExpanded(expanded.map((v, i) => i === idx ? !v : v));
  };

  // Dynamic values from backend or fallback
  const atsScore = result?.ats_score ?? 92;
  const issuesCount = result?.issues_count ?? 24;
  const checks = result?.checks ?? [
    { label: 'ATS Parse Rate', status: 'success' },
    { label: 'Quantifying Impact', status: 'success' },
    { label: 'Repetition', status: 'error' },
    { label: 'Spelling & Grammar', status: 'locked' },
    { label: 'Summarize Resume', status: 'locked' },
  ];
  const sections = result?.sections ?? [
    { label: 'CONTENT', percent: 90, color: 'text-green-500', bg: 'bg-green-100' },
    { label: 'FORMAT & BREVITY', percent: 84, color: 'text-green-500', bg: 'bg-green-100' },
    { label: 'STYLE', percent: 40, color: 'text-red-400', bg: 'bg-red-100' },
    { label: 'SECTIONS', percent: 40, color: 'text-red-400', bg: 'bg-red-100' },
    { label: 'SKILLS', percent: 68, color: 'text-yellow-500', bg: 'bg-yellow-100' },
  ];

  return (
    <div className={`min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 ${theme === 'dark' ? 'dark' : ''}`}>
      <Header />
      <main className="flex-1 w-full flex items-start justify-center">
        <div className="max-w-7xl w-full flex flex-col lg:flex-row gap-8 px-6 py-12">
          {/* Left Side */}
          <div className="flex-1 flex flex-col justify-start max-w-xl">
            <div className="mb-2 text-xs font-bold text-indigo-600 tracking-widest uppercase">Resume Checker</div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-primary leading-tight mb-4">Is your resume good enough?</h1>
            <div className="flex items-center text-sm mb-4">
              <a href="#" className="text-[#3b82f6] font-medium">Home</a>
              <span className="mx-1 text-gray-400">&gt;</span>
              <span className="text-gray-500">Resume Checker</span>
            </div>
            <div className="text-lg text-gray-600 mb-8">
              A free and fast AI resume checker doing 16 crucial checks to ensure your resume is ready to perform and get you interview callbacks.
            </div>

            <form onSubmit={handleSubmit}>
              <div className="bg-background border border-dashed border-border rounded-2xl p-8 shadow-sm max-w-lg transition-colors duration-300">
                <div className="text-center text-foreground mb-4">
                  Drop your resume here or choose a file.<br />
                  <span className="text-muted-foreground text-sm">PDF &amp; DOCX only. Max 2MB file size.</span>
                </div>
                <label className="flex flex-col items-center justify-center cursor-pointer">
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                  <div className="flex flex-col items-center justify-center w-full py-4">
                    <FiUpload className="w-8 h-8 text-primary mb-2" />
                    <span className="text-primary font-semibold">Upload Your Resume</span>
                  </div>
                </label>
                {file && (
                  <div className="mt-2 text-sm text-muted-foreground text-center">Selected: {file.name}</div>
                )}
                <button type="submit" className="mt-4 w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-primary/90 transition">{loading ? 'Analyzing...' : 'Analyze Resume'}</button>
                <div className="mt-4 text-xs text-muted-foreground text-center">&#128274; Privacy guaranteed</div>
                {error && <div className="mt-2 text-xs text-red-500 text-center">{error}</div>}
              </div>
            </form>
          </div>

          {/* Right Side */}
          <div className="flex-1 flex flex-col space-y-8">
            {result && (
              <>
                {/* ATS Score Display */}
                <div className="bg-background border border-border rounded-2xl p-8 shadow-sm">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-4">
                      <Gauge value={result.ats_score ?? 0} />
                    </div>
                    <div className="text-5xl font-extrabold text-primary mb-2">{result.ats_score ?? 0}/100</div>
                    <div className="text-lg font-semibold text-primary mb-1">ATS Score</div>
                    <div className="text-sm text-muted-foreground">Your resume's ATS compatibility</div>
                  </div>
                </div>

                {/* Category Analysis */}
                <div className="bg-background border border-border rounded-2xl p-8 shadow-sm">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-primary mb-6">Resume Analysis</h3>
                    {categories.map((category, index) => {
                      const score = detailedScores?.[category.name] || 0;
                      return (
                        <motion.div
                          key={category.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`${getCategoryBgColor(score)} rounded-xl p-6 shadow-sm dark:bg-transparent`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                              {getCategoryIcon(score)}
                              <div>
                                <h4 className={`text-lg font-semibold ${getCategoryColor(score)}`}>
                                  {category.name}
                                </h4>
                                <p className="text-sm text-muted-foreground">{category.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-2xl font-bold ${getCategoryColor(score)}`}>
                                {score}/100
                              </span>
                              <div className="text-xs text-muted-foreground">{category.weight}% weight</div>
                            </div>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mb-4">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${score}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-2 rounded-full bg-primary"
                            />
                          </div>
                          {score < 80 && recommendations.filter(rec => 
                            rec.toLowerCase().includes(category.name.toLowerCase()) && 
                            rec.length > 50 && 
                            !rec.includes("consider improving")
                          ).length > 0 && (
                            <div className="mt-4">
                              <h6 className="font-medium text-primary mb-2">Recommendations for {category.name}:</h6>
                              <div className="space-y-3">
                                {recommendations
                                  .filter(rec => {
                                    const categoryMatch = rec.toLowerCase().includes(category.name.toLowerCase());
                                    const hasSpecificContent = rec.length > 50 && !rec.includes("consider improving");
                                    return categoryMatch && hasSpecificContent;
                                  })
                                  .map((rec, idx) => (
                                    <motion.div
                                      key={idx}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: idx * 0.1 }}
                                      className="flex items-start space-x-3"
                                    >
                                      <span className="text-primary mt-1">•</span>
                                      <div className="flex-1">
                                        <p className="text-foreground text-sm leading-relaxed">{rec}</p>
                                        {rec.includes("Example:") && (
                                          <div className="mt-2 pl-4 border-l-2 border-border">
                                            <p className="text-muted-foreground text-sm italic">
                                              {rec.split("Example:")[1].trim()}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Best Practices Section - Moved here */}
                <div className="bg-background border border-border rounded-2xl p-8 shadow-sm">
                  <h3 className="text-2xl font-bold text-primary mb-6">Best Practices & Tips</h3>
                  <div className="grid gap-6">
                    {[
                      {
                        title: "Content Quality",
                        icon: <FiCheckCircle className="w-5 h-5 text-primary" />,
                        tips: [
                          "Use clear, concise language",
                          "Focus on achievements, not just responsibilities",
                          "Include relevant keywords from the job description",
                          "Maintain a professional tone throughout"
                        ]
                      },
                      {
                        title: "Format & Structure",
                        icon: <FiAlertCircle className="w-5 h-5 text-primary" />,
                        tips: [
                          "Use consistent formatting",
                          "Include clear section headers",
                          "Maintain proper spacing and margins",
                          "Use bullet points for better readability"
                        ]
                      },
                      {
                        title: "Keywords & Skills",
                        icon: <FiLock className="w-5 h-5 text-primary" />,
                        tips: [
                          "Include industry-specific keywords",
                          "List relevant technical skills",
                          "Use standard job title terminology",
                          "Highlight transferable skills"
                        ]
                      },
                      {
                        title: "Achievements",
                        icon: <FiCheckCircle className="w-5 h-5 text-primary" />,
                        tips: [
                          "Quantify your accomplishments",
                          "Use action verbs to start bullet points",
                          "Focus on results and impact",
                          "Include relevant metrics and numbers"
                        ]
                      }
                    ].map((section, index) => (
                      <motion.div
                        key={section.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-background border border-border rounded-xl p-6 shadow-sm"
                      >
                        <div className="flex items-center space-x-3 mb-4">
                          {section.icon}
                          <h5 className="text-lg font-semibold text-primary">{section.title}</h5>
                        </div>
                        <ul className="space-y-1">
                          {section.tips.map((tip, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-start space-x-3"
                            >
                              <span className="text-primary">•</span>
                              <span className="text-foreground text-sm">{tip}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Additional Analysis Section */}
                {result?.additional_analysis && (
                  <div className="bg-white/80 rounded-2xl p-8 shadow-sm mt-8">
                    <h3 className="text-2xl font-bold text-primary mb-6">Detailed Resume Analysis</h3>
                    <div className="grid gap-6">
                      {/* Skills Analysis */}
                      {result.additional_analysis.skills && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-xl p-6 shadow-sm"
                        >
                          <h4 className="text-lg font-semibold text-primary mb-4">Skills Analysis</h4>
                          <div className="space-y-4">
                            {result.additional_analysis.skills.map((skill, idx) => (
                              <div key={idx} className="flex items-start space-x-3">
                                <span className="text-primary mt-1">•</span>
                                <p className="text-gray-700 text-sm">{skill}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Experience Analysis */}
                      {result.additional_analysis.experience && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-xl p-6 shadow-sm"
                        >
                          <h4 className="text-lg font-semibold text-primary mb-4">Experience Analysis</h4>
                          <div className="space-y-4">
                            {result.additional_analysis.experience.map((exp, idx) => (
                              <div key={idx} className="flex items-start space-x-3">
                                <span className="text-primary mt-1">•</span>
                                <p className="text-gray-700 text-sm">{exp}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Education Analysis */}
                      {result.additional_analysis.education && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-xl p-6 shadow-sm"
                        >
                          <h4 className="text-lg font-semibold text-primary mb-4">Education Analysis</h4>
                          <div className="space-y-4">
                            {result.additional_analysis.education.map((edu, idx) => (
                              <div key={idx} className="flex items-start space-x-3">
                                <span className="text-primary mt-1">•</span>
                                <p className="text-gray-700 text-sm">{edu}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Keyword Optimization */}
                      {result.additional_analysis.keywords && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-xl p-6 shadow-sm"
                        >
                          <h4 className="text-lg font-semibold text-primary mb-4">Keyword Optimization</h4>
                          <div className="space-y-4">
                            {result.additional_analysis.keywords.map((keyword, idx) => (
                              <div key={idx} className="flex items-start space-x-3">
                                <span className="text-primary mt-1">•</span>
                                <p className="text-gray-700 text-sm">{keyword}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Career Progression */}
                      {result.additional_analysis.career_progression && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-xl p-6 shadow-sm"
                        >
                          <h4 className="text-lg font-semibold text-primary mb-4">Career Progression</h4>
                          <div className="space-y-4">
                            {result.additional_analysis.career_progression.map((prog, idx) => (
                              <div key={idx} className="flex items-start space-x-3">
                                <span className="text-primary mt-1">•</span>
                                <p className="text-gray-700 text-sm">{prog}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {!result && !loading && (
              <div className="bg-transparent max-w-lg w-full flex flex-col items-center justify-center">
                <img
                  src="https://res.cloudinary.com/dtsuvx8dz/image/upload/v1716357077/o1imiun4wwcpia9uucgs.gif"
                  alt="App screenshot"
                  width="2432"
                  height="1442"
                  className="w-[28rem] max-w-full rounded-md"
                />
              </div>
            )}

            {loading && <LoadingAnimation />}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ATSChecker
