import React, { useState, useRef, useEffect } from 'react';
import { Camera, Home, Users, Award, Settings, X, RotateCw, Grid3x3, Zap, ZapOff, ChevronLeft, Plus } from 'lucide-react';

const ChickenTracksApp = () => {
  // State Management
  const [currentView, setCurrentView] = useState('home');
  const [eggs, setEggs] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraContext, setCameraContext] = useState(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [flash, setFlash] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [hasFlash, setHasFlash] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  
  // Phase 1: Quest System
  const [dailyCheckIn, setDailyCheckIn] = useState(false);
  const [photoStreak, setPhotoStreak] = useState(3);
  const [visitStreak, setVisitStreak] = useState(5);
  const [lastCheckInDate, setLastCheckInDate] = useState(null);
  const [completedQuests, setCompletedQuests] = useState([]);
  const [activeQuestId, setActiveQuestId] = useState(null);
  
  // Intruder Alert Settings
  const [alertStartTime, setAlertStartTime] = useState('06:00');
  const [alertEndTime, setAlertEndTime] = useState('20:00');
  const [selectedChicken, setSelectedChicken] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Logo Base64 from v7
  const logoBase64 = "data:image/jpeg;base64,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";

  // v7 Color Scheme
  const colors = {
    navy: '#2D3E50',
    navyLight: '#3D5166',
    navyDark: '#1E2A36',
    redAccent: '#E63946',
    cream: '#F5F0E6',
    gold: '#D4943D',
    sage: '#8FAE7C',
    blueGray: '#4A5C6A',
    textMuted: '#7A8B99',
    oliveGreen: '#6B8E23',
  };

  // Chickens data (from v7)
  const chickens = [
    { id: 1, name: 'Wednesday', breed: 'Olive Egger', color: colors.gold, emoji: '🐔', photos: [], totalPhotos: 0 },
    { id: 2, name: 'Goldy', breed: 'Golden Comet', color: colors.cream, emoji: '🐓', photos: [], totalPhotos: 0 },
    { id: 3, name: 'Florence', breed: 'Rhode Island Red', color: colors.redAccent, emoji: '🐔', photos: [], totalPhotos: 0 },
    { id: 4, name: 'Capri', breed: 'Barred Rock', color: colors.blueGray, emoji: '🐓', photos: [], totalPhotos: 0 }
  ];

  // Phase 1: Daily Photo Quests
  const photoQuests = [
    {
      id: 'morning-headcount',
      title: 'Morning Headcount',
      description: 'Photo of all chickens together',
      reward: 50,
      difficulty: 'easy',
      emoji: '📸',
      timeEstimate: '5 min',
      type: 'photo'
    },
    {
      id: 'egg-discovery',
      title: 'Egg Discovery',
      description: 'Capture finding an egg in the nest',
      reward: 75,
      difficulty: 'easy',
      emoji: '🥚',
      timeEstimate: '5 min',
      type: 'photo'
    },
    {
      id: 'feeding-frenzy',
      title: 'Feeding Frenzy',
      description: 'Photo of chickens eating',
      reward: 40,
      difficulty: 'easy',
      emoji: '🌽',
      timeEstimate: '5 min',
      type: 'photo'
    },
    {
      id: 'dust-bath',
      title: 'Dust Bath',
      description: 'Capture a chicken dust bathing',
      reward: 60,
      difficulty: 'medium',
      emoji: '💨',
      timeEstimate: '10 min',
      type: 'photo'
    },
    {
      id: 'water-check',
      title: 'Water Check',
      description: 'Photo of fresh water bowls',
      reward: 30,
      difficulty: 'easy',
      emoji: '💧',
      timeEstimate: '3 min',
      type: 'photo'
    },
    {
      id: 'action-shot',
      title: 'Action Shot',
      description: 'Chicken mid-flight or running',
      reward: 150,
      difficulty: 'hard',
      emoji: '⚡',
      timeEstimate: '15 min',
      type: 'photo'
    },
    {
      id: 'chicken-selfie',
      title: 'Chicken Selfie',
      description: 'You + chicken in frame',
      reward: 80,
      difficulty: 'medium',
      emoji: '🤳',
      timeEstimate: '5 min',
      type: 'photo'
    },
    {
      id: 'sunset-flock',
      title: 'Sunset Flock',
      description: 'Golden hour chicken photos',
      reward: 175,
      difficulty: 'hard',
      emoji: '🌅',
      timeEstimate: '20 min',
      type: 'photo'
    },
    {
      id: 'funny-moment',
      title: 'Funny Moment',
      description: 'Capture silly chicken behavior',
      reward: 100,
      difficulty: 'medium',
      emoji: '😂',
      timeEstimate: '10 min',
      type: 'photo'
    },
    {
      id: 'portrait-gallery',
      title: 'Portrait Gallery',
      description: 'Individual photo of each chicken',
      reward: 200,
      difficulty: 'hard',
      emoji: '🖼️',
      timeEstimate: '20 min',
      type: 'photo'
    }
  ];

  // Get daily active quests (rotate 3 per day)
  const getDailyQuests = () => {
    const today = new Date().getDate();
    const startIndex = today % photoQuests.length;
    const dailyQuests = [];
    for (let i = 0; i < 3; i++) {
      dailyQuests.push(photoQuests[(startIndex + i) % photoQuests.length]);
    }
    return dailyQuests;
  };

  const dailyQuests = getDailyQuests();
  const OliveEggSVG = () => (
    <svg width="32" height="40" viewBox="0 0 32 40" className="inline-block">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <ellipse cx="16" cy="22" rx="12" ry="16" fill="#6B8E23" filter="url(#glow)" stroke="#fff" strokeWidth="1"/>
    </svg>
  );

  const currencyItems = [
    { 
      id: 1, 
      name: 'Brown Egg', 
      icon: '🥚', 
      count: 245,
      render: () => <span style={{ fontSize: '32px' }}>🥚</span>
    },
    { 
      id: 2, 
      name: 'Olive Egg', 
      count: 89,
      render: () => <OliveEggSVG />
    },
    { 
      id: 3, 
      name: 'Double Yolks', 
      count: 34,
      render: () => <span style={{ fontSize: '28px' }}>🍳🍳</span>
    },
    { 
      id: 4, 
      name: 'Chicken Tracks', 
      count: 156,
      render: () => (
        <img 
          src={logoBase64} 
          alt="Chicken Tracks" 
          style={{ width: '70px', height: '70px', objectFit: 'contain', borderRadius: '50%' }} 
        />
      )
    }
  ];

  // Camera Functions (Enhanced from v7)
  const openCamera = (context = null, questId = null) => {
    setCameraContext(context);
    setActiveQuestId(questId);
    setShowCamera(true);
    setCurrentView('camera');
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 }
        },
        audio: false
      });
      
      const track = mediaStream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      if (capabilities.torch) {
        setHasFlash(true);
      }
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraError(null);
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError(err.message);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
    setCameraContext(null);
    setCapturedImage(null);
    setActiveQuestId(null);
  };

  const flipCamera = async () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newMode },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    }
  };

  const toggleFlash = async () => {
    if (stream && hasFlash) {
      const track = stream.getVideoTracks()[0];
      try {
        await track.applyConstraints({
          advanced: [{ torch: !flash }]
        });
        setFlash(!flash);
      } catch (err) {
        console.error('Flash error:', err);
      }
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.95);
      setCapturedImage(imageData);
    }
  };

  const savePhoto = () => {
    if (capturedImage) {
      // Complete quest if active
      if (activeQuestId && !completedQuests.includes(activeQuestId)) {
        const quest = photoQuests.find(q => q.id === activeQuestId);
        setCompletedQuests([...completedQuests, activeQuestId]);
        // Add reward to egg count
        if (quest) {
          setEggs(eggs + quest.reward);
        }
        alert(`Quest Complete! +${quest.reward} 🌽`);
      } else {
        alert(`Photo saved${cameraContext ? ` for ${cameraContext}` : ''}!`);
      }
      stopCamera();
    }
  };

  // Daily Check-in Handler
  const handleDailyCheckIn = () => {
    const today = new Date().toDateString();
    if (lastCheckInDate !== today) {
      setDailyCheckIn(true);
      setLastCheckInDate(today);
      setVisitStreak(visitStreak + 1);
      setEggs(eggs + 25);
      alert('Daily Check-in Complete! +25 🌽');
    }
  };

  useEffect(() => {
    if (showCamera && !stream) {
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [showCamera]);

  // Render Camera View
  const renderCamera = () => (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Camera Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex justify-between items-center">
          <button
            onClick={stopCamera}
            className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white"
          >
            <X className="w-6 h-6" />
          </button>
          
          {cameraContext && (
            <div className="text-white text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
              {cameraContext}
            </div>
          )}
          
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center ${
              showGrid ? 'bg-white text-black' : 'bg-black/30 text-white'
            }`}
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Camera Preview */}
      <div className="flex-1 relative overflow-hidden">
        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            {showGrid && (
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-white/30" />
                ))}
              </div>
            )}
          </>
        ) : (
          <img
            src={capturedImage}
            alt="Captured"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>

      {/* Camera Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
        {!capturedImage ? (
          <div className="flex justify-between items-center">
            <button
              onClick={toggleFlash}
              disabled={!hasFlash}
              className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
              style={{ opacity: hasFlash ? 1 : 0.3 }}
            >
              {flash ? (
                <Zap className="w-6 h-6 text-yellow-400" />
              ) : (
                <ZapOff className="w-6 h-6 text-white" />
              )}
            </button>

            <button
              onClick={capturePhoto}
              className="w-16 h-16 rounded-full bg-white border-4 border-black/30 hover:scale-95 transition-transform"
            />

            <button
              onClick={flipCamera}
              className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white"
            >
              <RotateCw className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => setCapturedImage(null)}
              className="flex-1 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium"
            >
              Retake
            </button>
            <button
              onClick={savePhoto}
              className="flex-1 py-3 rounded-full bg-white text-black font-medium"
            >
              Save Photo
            </button>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );

  // Render Home View
  const renderHome = () => (
    <div className="p-6 space-y-6">
      {/* Streak Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold" style={{ color: colors.navy }}>Your Streaks</h3>
            <p className="text-sm" style={{ color: colors.textMuted }}>Keep the momentum going!</p>
          </div>
          <button
            onClick={handleDailyCheckIn}
            disabled={dailyCheckIn}
            className="px-4 py-2 rounded-lg font-medium text-white"
            style={{ 
              backgroundColor: dailyCheckIn ? colors.sage : colors.redAccent,
              opacity: dailyCheckIn ? 0.7 : 1,
              cursor: dailyCheckIn ? 'not-allowed' : 'pointer'
            }}
          >
            {dailyCheckIn ? '✓ Checked In' : 'Check In'}
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-xl" style={{ backgroundColor: colors.cream }}>
            <div className="text-3xl mb-1">🔥</div>
            <div className="text-2xl font-bold" style={{ color: colors.navy }}>{visitStreak}</div>
            <div className="text-xs" style={{ color: colors.textMuted }}>Visit Streak</div>
          </div>
          <div className="text-center p-4 rounded-xl" style={{ backgroundColor: colors.cream }}>
            <div className="text-3xl mb-1">📸</div>
            <div className="text-2xl font-bold" style={{ color: colors.navy }}>{photoStreak}</div>
            <div className="text-xs" style={{ color: colors.textMuted }}>Photo Streak</div>
          </div>
        </div>
      </div>

      {/* Daily Quests Preview */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold" style={{ color: colors.navy }}>Today's Quests</h3>
          <button
            onClick={() => setCurrentView('quests')}
            className="text-sm font-medium"
            style={{ color: colors.redAccent }}
          >
            View All →
          </button>
        </div>
        
        <div className="space-y-3">
          {dailyQuests.map(quest => {
            const isCompleted = completedQuests.includes(quest.id);
            return (
              <div
                key={quest.id}
                onClick={() => !isCompleted && openCamera(quest.title, quest.id)}
                className="flex items-center gap-4 p-4 rounded-xl cursor-pointer hover:shadow-md transition-shadow"
                style={{ 
                  backgroundColor: isCompleted ? colors.sage + '30' : colors.cream,
                  opacity: isCompleted ? 0.7 : 1
                }}
              >
                <div className="text-3xl">{quest.emoji}</div>
                <div className="flex-1">
                  <h4 className="font-bold" style={{ color: colors.navy }}>{quest.title}</h4>
                  <p className="text-sm" style={{ color: colors.textMuted }}>
                    {quest.timeEstimate} • +{quest.reward} 🌽
                  </p>
                </div>
                {isCompleted ? (
                  <div className="text-2xl">✓</div>
                ) : (
                  <Camera className="w-5 h-5" style={{ color: colors.textMuted }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Log Section with Camera */}
      <div className="rounded-2xl p-6 shadow-lg" style={{ background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.gold}30 100%)` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.navy }}>Log Today's Eggs</h2>
        
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setEggs(eggs + 1)}
            className="flex-1 py-4 rounded-xl font-bold text-xl hover:opacity-90 transition-opacity text-white"
            style={{ backgroundColor: colors.redAccent }}
          >
            + Add Egg
          </button>
          <button
            onClick={() => openCamera('Egg Collection')}
            className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
          >
            <Camera className="w-7 h-7" style={{ color: colors.gold }} />
          </button>
        </div>

        <div className="text-center p-4 bg-white rounded-xl">
          <div className="text-5xl font-bold" style={{ color: colors.gold }}>{eggs}</div>
          <div className="text-sm mt-1" style={{ color: colors.textMuted }}>eggs today</div>
        </div>
      </div>

      {/* Currency Grid */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4" style={{ color: colors.navy }}>Your Collection</h3>
        <div className="grid grid-cols-2 gap-4">
          {currencyItems.map(item => (
            <div key={item.id} className="flex flex-col items-center p-4 rounded-xl" style={{ background: `linear-gradient(135deg, ${colors.cream} 0%, #e8e8e8 100%)` }}>
              <div className="mb-2">{item.render()}</div>
              <div className="text-2xl font-bold" style={{ color: colors.navy }}>{item.count}</div>
              <div className="text-xs text-center" style={{ color: colors.textMuted }}>{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render Quests View (NEW)
  const renderQuests = () => (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: colors.navy }}>Quest Board</h2>
        <p className="text-sm mb-6" style={{ color: colors.textMuted }}>
          Complete photo challenges to earn rewards and build streaks!
        </p>
      </div>

      {/* Daily Quests Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-2xl">⏰</div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: colors.navy }}>Daily Challenges</h3>
            <p className="text-xs" style={{ color: colors.textMuted }}>Resets every 24 hours</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {dailyQuests.map(quest => {
            const isCompleted = completedQuests.includes(quest.id);
            const difficultyColor = quest.difficulty === 'easy' ? colors.sage : quest.difficulty === 'medium' ? colors.gold : colors.redAccent;
            
            return (
              <div
                key={quest.id}
                className="rounded-xl p-4 cursor-pointer hover:shadow-md transition-all"
                style={{ 
                  backgroundColor: isCompleted ? colors.sage + '30' : colors.cream,
                  border: `2px solid ${isCompleted ? colors.sage : 'transparent'}`
                }}
                onClick={() => !isCompleted && openCamera(quest.title, quest.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{quest.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold" style={{ color: colors.navy }}>{quest.title}</h4>
                      {isCompleted && <span className="text-xl">✓</span>}
                    </div>
                    <p className="text-sm mb-2" style={{ color: colors.textMuted }}>
                      {quest.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="px-2 py-1 rounded-full font-medium" style={{ 
                        backgroundColor: difficultyColor + '30',
                        color: difficultyColor 
                      }}>
                        {quest.difficulty}
                      </span>
                      <span style={{ color: colors.textMuted }}>⏱️ {quest.timeEstimate}</span>
                      <span className="font-bold" style={{ color: colors.gold }}>+{quest.reward} 🌽</span>
                    </div>
                  </div>
                  {!isCompleted && (
                    <Camera className="w-6 h-6 mt-2" style={{ color: colors.textMuted }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All Quests Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-2xl">🗺️</div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: colors.navy }}>All Available Quests</h3>
            <p className="text-xs" style={{ color: colors.textMuted }}>Complete anytime</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {photoQuests.filter(q => !dailyQuests.includes(q)).map(quest => {
            const isCompleted = completedQuests.includes(quest.id);
            const difficultyColor = quest.difficulty === 'easy' ? colors.sage : quest.difficulty === 'medium' ? colors.gold : colors.redAccent;
            
            return (
              <div
                key={quest.id}
                className="rounded-xl p-4 cursor-pointer hover:shadow-md transition-all"
                style={{ 
                  backgroundColor: isCompleted ? colors.sage + '30' : colors.cream,
                  border: `2px solid ${isCompleted ? colors.sage : 'transparent'}`
                }}
                onClick={() => !isCompleted && openCamera(quest.title, quest.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{quest.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold" style={{ color: colors.navy }}>{quest.title}</h4>
                      {isCompleted && <span className="text-xl">✓</span>}
                    </div>
                    <p className="text-sm mb-2" style={{ color: colors.textMuted }}>
                      {quest.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="px-2 py-1 rounded-full font-medium" style={{ 
                        backgroundColor: difficultyColor + '30',
                        color: difficultyColor 
                      }}>
                        {quest.difficulty}
                      </span>
                      <span style={{ color: colors.textMuted }}>⏱️ {quest.timeEstimate}</span>
                      <span className="font-bold" style={{ color: colors.gold }}>+{quest.reward} 🌽</span>
                    </div>
                  </div>
                  {!isCompleted && (
                    <Camera className="w-6 h-6 mt-2" style={{ color: colors.textMuted }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quest Stats */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold mb-4" style={{ color: colors.navy }}>Your Progress</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-xl" style={{ backgroundColor: colors.cream }}>
            <div className="text-3xl font-bold" style={{ color: colors.navy }}>{completedQuests.length}</div>
            <div className="text-xs" style={{ color: colors.textMuted }}>Quests Completed</div>
          </div>
          <div className="text-center p-4 rounded-xl" style={{ backgroundColor: colors.cream }}>
            <div className="text-3xl font-bold" style={{ color: colors.gold }}>{eggs}</div>
            <div className="text-xs" style={{ color: colors.textMuted }}>Total Rewards</div>
          </div>
        </div>
      </div>
    </div>
  );
  const renderFlock = () => (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4" style={{ color: colors.navy }}>Your Flock</h2>
      
      {chickens.map(chicken => (
        <div key={chicken.id} className="rounded-2xl p-5 shadow-md" style={{ backgroundColor: chicken.color + '40', border: `2px solid ${chicken.color}` }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{chicken.emoji}</span>
              <div>
                <h3 className="text-xl font-bold" style={{ color: colors.navy }}>{chicken.name}</h3>
                <p className="text-sm" style={{ color: colors.textMuted }}>{chicken.breed}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedChicken(chicken);
                openCamera(chicken.name);
              }}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
            >
              <Camera className="w-5 h-5" style={{ color: colors.navy }} />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="bg-white/60 rounded-lg py-2">
              <div className="font-bold" style={{ color: colors.navy }}>12</div>
              <div className="text-xs" style={{ color: colors.textMuted }}>This Week</div>
            </div>
            <div className="bg-white/60 rounded-lg py-2">
              <div className="font-bold" style={{ color: colors.navy }}>45</div>
              <div className="text-xs" style={{ color: colors.textMuted }}>This Month</div>
            </div>
            <div className="bg-white/60 rounded-lg py-2">
              <div className="font-bold" style={{ color: colors.navy }}>234</div>
              <div className="text-xs" style={{ color: colors.textMuted }}>All Time</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Render Rewards View
  const renderRewards = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4" style={{ color: colors.navy }}>Achievements</h2>
      
      <div className="rounded-2xl p-6 shadow-lg" style={{ background: `linear-gradient(135deg, ${colors.sage}30 0%, ${colors.cream} 100%)` }}>
        <div className="text-center mb-4">
          <div className="text-6xl mb-2">🏆</div>
          <h3 className="text-xl font-bold" style={{ color: colors.navy }}>Egg Master</h3>
          <p className="text-sm" style={{ color: colors.textMuted }}>Collect 1000 eggs</p>
        </div>
        <div className="rounded-full h-3 overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
          <div className="h-full" style={{ width: '68%', backgroundColor: colors.sage }} />
        </div>
        <div className="text-center mt-2 text-sm font-medium" style={{ color: colors.navy }}>680 / 1000</div>
      </div>

      <div className="space-y-3">
        {[
          { emoji: '⭐', name: 'First Egg', desc: 'Log your first egg', complete: true },
          { emoji: '🔥', name: '7 Day Streak', desc: 'Log eggs 7 days in a row', complete: true },
          { emoji: '📸', name: 'Photographer', desc: 'Take 50 chicken photos', complete: false, progress: '32/50' },
          { emoji: '🎯', name: 'Century Club', desc: 'Collect 100 eggs', complete: true }
        ].map((achievement, idx) => (
          <div key={idx} className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: achievement.complete ? colors.sage + '30' : colors.cream }}>
            <div className="text-3xl">{achievement.emoji}</div>
            <div className="flex-1">
              <h4 className="font-bold" style={{ color: colors.navy }}>{achievement.name}</h4>
              <p className="text-sm" style={{ color: colors.textMuted }}>{achievement.desc}</p>
              {achievement.progress && (
                <p className="text-xs mt-1" style={{ color: colors.textMuted }}>{achievement.progress}</p>
              )}
            </div>
            {achievement.complete && (
              <div className="font-bold" style={{ color: colors.sage }}>✓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Render Settings View
  const renderSettings = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4" style={{ color: colors.navy }}>Settings</h2>
      
      <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
        <h3 className="text-lg font-bold" style={{ color: colors.navy }}>Intruder Alert System</h3>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: colors.navy }}>
            Start Time
          </label>
          <input
            type="time"
            value={alertStartTime}
            onChange={(e) => setAlertStartTime(e.target.value)}
            className="w-full p-3 rounded-xl"
            style={{ border: `2px solid ${colors.blueGray}` }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: colors.navy }}>
            End Time
          </label>
          <input
            type="time"
            value={alertEndTime}
            onChange={(e) => setAlertEndTime(e.target.value)}
            className="w-full p-3 rounded-xl"
            style={{ border: `2px solid ${colors.blueGray}` }}
          />
        </div>

        <button 
          className="w-full py-3 rounded-xl font-medium text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: colors.redAccent }}
        >
          Preview Alert
        </button>
      </div>

      <div className="rounded-2xl p-6" style={{ backgroundColor: colors.cream }}>
        <h3 className="text-lg font-bold mb-2" style={{ color: colors.navy }}>About</h3>
        <p className="text-sm" style={{ color: colors.textMuted }}>ChickenTracks v7</p>
        <p className="text-sm" style={{ color: colors.textMuted }}>Track your backyard flock with ease</p>
      </div>
    </div>
  );

  // Main Render
  return (
    <div className="max-w-md mx-auto min-h-screen pb-20 relative" style={{ backgroundColor: colors.cream }}>
      {/* Header */}
      <div className="p-6 text-white" style={{ background: colors.navy }}>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">ChickenTracks</h1>
          <img 
            src={logoBase64} 
            alt="ChickenTracks Logo" 
            className="w-16 h-16 object-contain rounded-full p-1 backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          />
        </div>
        <p style={{ color: colors.cream }}>Your backyard flock companion</p>
      </div>

      {/* Content Area */}
      <div className="pb-4">
        {currentView === 'home' && renderHome()}
        {currentView === 'flock' && renderFlock()}
        {currentView === 'quests' && renderQuests()}
        {currentView === 'camera' && !showCamera && renderHome()}
        {currentView === 'rewards' && renderRewards()}
        {currentView === 'settings' && renderSettings()}
      </div>

      {/* Floating Action Button (Camera) */}
      {!showCamera && currentView !== 'camera' && (
        <button
          onClick={() => openCamera()}
          className="fixed right-6 bottom-24 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform z-40"
          style={{ background: `linear-gradient(135deg, ${colors.redAccent} 0%, ${colors.navy} 100%)` }}
        >
          <Camera className="w-7 h-7" />
        </button>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t max-w-md mx-auto" style={{ borderColor: colors.cream }}>
        <div className="flex justify-around items-center py-2">
          <button
            onClick={() => setCurrentView('home')}
            className="flex flex-col items-center gap-1 px-3 py-2"
            style={{ color: currentView === 'home' ? colors.redAccent : colors.textMuted }}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => setCurrentView('quests')}
            className="flex flex-col items-center gap-1 px-3 py-2"
            style={{ color: currentView === 'quests' ? colors.redAccent : colors.textMuted }}
          >
            <Award className="w-6 h-6" />
            <span className="text-xs font-medium">Quests</span>
          </button>

          <button
            onClick={() => openCamera()}
            className="flex flex-col items-center gap-1 px-3 py-2 -mt-6"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${colors.redAccent} 0%, ${colors.navy} 100%)` }}>
              <Camera className="w-7 h-7" />
            </div>
            <span className="text-xs font-medium mt-1" style={{ color: colors.textMuted }}>Camera</span>
          </button>

          <button
            onClick={() => setCurrentView('flock')}
            className="flex flex-col items-center gap-1 px-3 py-2"
            style={{ color: currentView === 'flock' ? colors.redAccent : colors.textMuted }}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs font-medium">Flock</span>
          </button>

          <button
            onClick={() => setCurrentView('settings')}
            className="flex flex-col items-center gap-1 px-3 py-2"
            style={{ color: currentView === 'settings' ? colors.redAccent : colors.textMuted }}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </div>

      {/* Camera View (Full Screen Overlay) */}
      {showCamera && renderCamera()}
    </div>
  );
};

export default ChickenTracksApp;
