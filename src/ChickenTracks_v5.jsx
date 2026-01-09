import React, { useState, useEffect } from 'react';

// Chicken Tracks App v5 - Get Outside, Track Your Flock!
// NEW: Daily Coop Intruder Alerts to motivate outdoor visits

export default function ChickenTracksApp() {
  const [currentView, setCurrentView] = useState('home');
  const [streak, setStreak] = useState(12);
  const [level, setLevel] = useState(4);
  const [todayComplete, setTodayComplete] = useState(false);
  const [showQuestComplete, setShowQuestComplete] = useState(false);
  const [selectedChicken, setSelectedChicken] = useState(null);
  const [showWelcomeBack, setShowWelcomeBack] = useState(true);
  const [outdoorMinutes, setOutdoorMinutes] = useState(47);
  const [activeQuest, setActiveQuest] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const [showRewardDrop, setShowRewardDrop] = useState(false);
  const [lastDrop, setLastDrop] = useState(null);
  const [showConversionShop, setShowConversionShop] = useState(false);
  
  // NEW: Intruder Alert System
  const [showIntruderAlert, setShowIntruderAlert] = useState(false);
  const [todaysIntruder, setTodaysIntruder] = useState(null);
  const [intruderSettings, setIntruderSettings] = useState({
    enabled: true,
    checkTimeStart: '07:00',
    checkTimeEnd: '08:00',
    lastCheckDate: null,
  });

  // Tiered Currency System
  const [inventory, setInventory] = useState({
    cornScratch: 847,
    mealworms: 84,
    oliveEggers: 8,
    doubleYolks: 0,
    chickenTracks: 0,
  });

  // Brand colors from the Chicken Tracks logo
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
    mealwormBrown: '#8B4513',
    warning: '#FF6B35',
  };

  // Intruder types with personalities
  const intruderTypes = [
    { 
      id: 'raccoon',
      emoji: '🦝',
      name: 'Sneaky Raccoon',
      description: 'A masked bandit was spotted eyeing your coop!',
      threat: 'high',
      funFact: 'Raccoons can open latches and remember solutions for up to 3 years!',
    },
    {
      id: 'fox',
      emoji: '🦊',
      name: 'Sly Fox',
      description: 'A cunning fox has been prowling around!',
      threat: 'high',
      funFact: 'Foxes can hear a mouse squeaking 100 feet away!',
    },
    {
      id: 'squirrel',
      emoji: '🐿️',
      name: 'Greedy Squirrel',
      description: 'A fluffy-tailed thief is after your chicken feed!',
      threat: 'low',
      funFact: 'Squirrels plant thousands of trees each year by forgetting where they buried their nuts!',
    },
    {
      id: 'hawk',
      emoji: '🦅',
      name: 'Circling Hawk',
      description: 'A sharp-eyed hawk has been spotted overhead!',
      threat: 'medium',
      funFact: 'Hawks can spot a mouse from 100 feet in the air!',
    },
    {
      id: 'skunk',
      emoji: '🦨',
      name: 'Stinky Skunk',
      description: 'A stripe-tailed visitor is near the coop!',
      threat: 'medium',
      funFact: 'Skunks can spray their scent up to 10 feet with amazing accuracy!',
    },
    {
      id: 'rat',
      emoji: '🐀',
      name: 'Sneaky Rat',
      description: 'A whisker-twitching rat is after the feed!',
      threat: 'medium',
      funFact: 'Rats can squeeze through holes the size of a quarter!',
    },
    {
      id: 'dog',
      emoji: '🐕',
      name: "Neighbor's Dog",
      description: "The neighbor's curious dog is sniffing around!",
      threat: 'low',
      funFact: 'Dogs have a sense of time and can tell when their routine is off!',
    },
    {
      id: 'cat',
      emoji: '🐈',
      name: 'Prowling Cat',
      description: 'A stealthy cat has discovered your chickens!',
      threat: 'low',
      funFact: 'Cats spend 70% of their lives sleeping - but not when chickens are nearby!',
    },
  ];

  const OliveEgg = ({ size = '24px' }) => (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size,
      position: 'relative',
      verticalAlign: 'middle',
    }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 12px white) drop-shadow(0 0 6px white)' }}>
        <ellipse cx="50" cy="50" rx="38" ry="48" fill="#6B8E23" />
      </svg>
    </span>
  );

  // Reward tier definitions
  const rewardTiers = {
    cornScratch: { name: 'Corn Scratch', emoji: '🌽', color: colors.gold, rarity: 'Common', dropRate: 1.0 },
    mealworms: { name: 'Mealworms', emoji: '🪱', color: colors.mealwormBrown, rarity: 'Uncommon', dropRate: 0.25 },
    oliveEggers: { name: 'Olive Egg', emoji: '🥚', color: colors.oliveGreen, rarity: 'Rare', dropRate: 0.10 },
    doubleYolks: { name: 'Double Yolk', emoji: '🥚🥚', color: colors.gold, rarity: 'Legendary', dropRate: 0.02 },
    chickenTracks: { name: 'Chicken Track', emoji: '🛤️', color: colors.blueGray, rarity: 'Ultra-Rare', dropRate: 0.005 },
  };

  // Conversion rates (10:1)
  const conversionRates = {
    cornScratch: { converts: 10, into: 'mealworms' },
    mealworms: { converts: 10, into: 'oliveEggers' },
    oliveEggers: { converts: 10, into: 'doubleYolks' },
    doubleYolks: { converts: 10, into: 'chickenTracks' },
  };

  // Simulate checking if user should get an intruder alert
  useEffect(() => {
    if (!showSplash && intruderSettings.enabled) {
      // For demo: Show intruder alert if it's the first time or randomly
      const shouldShowIntruder = Math.random() > 0.5; // 50% chance for demo
      
      if (shouldShowIntruder && !todaysIntruder) {
        const randomIntruder = intruderTypes[Math.floor(Math.random() * intruderTypes.length)];
        setTodaysIntruder(randomIntruder);
        setTimeout(() => setShowIntruderAlert(true), 3000); // Show after 3 seconds
      }
    }
  }, [showSplash]);

  // Hide splash after 2 seconds
  useEffect(() => {
    const splashTimer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(splashTimer);
  }, []);

  // Hide welcome after 3 seconds
  useEffect(() => {
    if (!showSplash) {
      const timer = setTimeout(() => setShowWelcomeBack(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  // Sample flock data
  const flock = [
    { id: 1, name: 'Wednesday', breed: 'Buff Orpington', age: '9 months', personality: 'The Lookout', color: '#D4943D', photos: 67, avatar: '🐔' },
    { id: 2, name: 'Goldy', breed: 'Barred Rock', age: '9 months', personality: 'Boss Hen', color: '#4A5568', photos: 52, avatar: '🐓' },
    { id: 3, name: 'Florence', breed: 'Blue Andalusian', age: '8 months', personality: 'Speed Demon', color: '#4A7B9D', photos: 48, avatar: '🐔' },
    { id: 4, name: 'Capri', breed: 'Rhode Island Red', age: '9 months', personality: 'Treat Beggar', color: '#8B4513', photos: 55, avatar: '🐔' },
  ];

  // Today's outdoor quests
  const todaysQuests = [
    { id: 1, title: 'Egg Collection', icon: '🥚', completed: true, reward: 25 },
    { id: 2, title: 'Fresh Water', icon: '💧', completed: true, reward: 15 },
    { id: 3, title: 'Dust Bath Thursday', icon: '🪣', completed: false, reward: 30 },
    { id: 4, title: 'Health Check', icon: '🩺', completed: false, reward: 20 },
  ];

  const memories = [
    { id: 1, photo: '📷', caption: "Wednesday's first egg!", date: '3 days ago', likes: 24 },
    { id: 2, photo: '📷', caption: 'All four dust bathing together', date: '5 days ago', likes: 31 },
    { id: 3, photo: '📷', caption: 'Capri begging for treats again', date: '1 week ago', likes: 18 },
  ];

  const handleConvert = (fromCurrency) => {
    const conversion = conversionRates[fromCurrency];
    const currentAmount = inventory[fromCurrency];
    const convertAmount = conversion.converts;

    if (currentAmount >= convertAmount) {
      setInventory(prev => ({
        ...prev,
        [fromCurrency]: prev[fromCurrency] - convertAmount,
        [conversion.into]: prev[conversion.into] + 1,
      }));
    }
  };

  const handleCompleteQuest = (questId) => {
    setActiveQuest(questId);
    setShowQuestComplete(true);
    setTodayComplete(true);
    setOutdoorMinutes(prev => prev + 15);
    
    // Simulate random reward drops based on tier probabilities
    const drops = [];
    Object.entries(rewardTiers).forEach(([key, tier]) => {
      if (Math.random() < tier.dropRate) {
        const amount = key === 'cornScratch' ? Math.floor(Math.random() * 20) + 10 : 1;
        drops.push({ currency: key, amount, tier });
      }
    });

    if (drops.length > 0) {
      const bestDrop = drops.reduce((best, current) => {
        return rewardTiers[current.currency].dropRate < rewardTiers[best.currency].dropRate ? current : best;
      });

      setLastDrop(bestDrop);
      
      drops.forEach(drop => {
        setInventory(prev => ({
          ...prev,
          [drop.currency]: prev[drop.currency] + drop.amount,
        }));
      });

      setTimeout(() => setShowRewardDrop(true), 500);
    }

    setTimeout(() => {
      setShowQuestComplete(false);
      setTimeout(() => setShowRewardDrop(false), 3000);
    }, 2000);
  };

  const handleScareIntruder = () => {
    // User "scared away" the intruder - give bonus rewards!
    setInventory(prev => ({
      ...prev,
      cornScratch: prev.cornScratch + 50,
      mealworms: prev.mealworms + 5,
    }));
    
    // Mark today as checked
    setIntruderSettings(prev => ({
      ...prev,
      lastCheckDate: new Date().toDateString(),
    }));

    setShowIntruderAlert(false);
    setTodayComplete(true);
    setOutdoorMinutes(prev => prev + 10);
  };

  // Actual Chicken Tracks logo as base64
  const logoBase64 = "data:image/jpeg;base64,/9j/4QDKRXhpZgAATU0AKgAAAAgABgESAAMAAAABAAEAAAEaAAUAAAABAAAAVgEbAAUAAAABAAAAXgEoAAMAAAABAAIAAAITAAMAAAABAAEAAIdpAAQAAAABAAAAZgAAAAAAAABIAAAAAQAAAEgAAAABAAeQAAAHAAAABDAyMjGRAQAHAAAABAECAwCgAAAHAAAABDAxMDCgAQADAAAAAQABAACgAgAEAAAAAQAAAi+gAwAEAAAAAQAAAb6kBgADAAAAAQAAAAAAAAAAAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYYXBwbAQAAABtbnRyUkdCIFhZWiAH5gABAAEAAAAAAABhY3NwQVBQTAAAAABBUFBMAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGzs/aOOOIVHw220vU962hgvAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApkZXNjAAAA/AAAADBjcHJ0AAABLAAAAFB3dHB0AAABfAAAABRyWFlaAAABkAAAABRnWFlaAAABpAAAABRiWFlaAAABuAAAABRyVFJDAAABzAAAACBjaGFkAAAB7AAAACxiVFJDAAABzAAAACBnVFJDAAABzAAAACBtbHVjAAAAAAAAAAEAAAAMZW5VUwAAABQAAAAcAEQAaQBzAHAAbABhAHkAIABQADNtbHVjAAAAAAAAAAEAAAAMZW5VUwAAADQAAAAcAEMAbwBwAHkAcgBpAGcAaAB0ACAAQQBwAHAAbABlACAASQBuAGMALgAsACAAMgAwADIAMlhZWiAAAAAAAAD21QABAAAAANMsWFlaIAAAAAAAAIPfAAA9v////7tYWVogAAAAAAAASr8AALE3AAAKuVhZWiAAAAAAAAAoOAAAEQsAAMi5cGFyYQAAAAAAAwAAAAJmZgAA8qcAAA1ZAAAT0AAACltzZjMyAAAAAAABDEIAAAXe///zJgAAB5MAAP2Q///7ov///aMAAAPcAADAbv/bAIQAAQEBAQEBAgEBAgMCAgIDBAMDAwMEBQQEBAQEBQYFBQUFBQUGBgYGBgYGBgcHBwcHBwgICAgICQkJCQkJCQkJCQEBAQECAgIEAgIECQYFBgkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJ/90ABAAj/8AAEQgBvgIvAwEiAAIRAQMRAf/EAaIAAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKCxAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6AQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgsRAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/Q/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/R/v4ooooAKKKKACiimO6RIZJCFVRkk8ACgB9FfKPxC/bt/Yt+FEstr8RPit4U0meCQRSQTata+cjnPytEshcHg/w9q3Phf+2N+yd8a5YrX4TfEjw14guJiVS3stTtpJyVOCPJD+YCDxjbW/1Wpy83K7ehHtI7XPpKiivhD/gpB+3P4R/4J3/sqa1+0h4psTqs1rLDY6bp4fy/tV7cnEUZ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";

  // Splash Screen
  if (showSplash) {
    return (
      <div style={{
        background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyDark} 100%)`,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeOut 0.5s ease-out 1.5s forwards',
      }}>
        <img src={logoBase64} alt="Chicken Tracks" style={{
          width: '280px',
          height: 'auto',
          marginBottom: '30px',
          animation: 'bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        }} />
        <h1 style={{
          color: colors.cream,
          fontSize: '42px',
          fontWeight: '800',
          margin: '0 0 12px',
          animation: 'fadeIn 1s ease-out 0.5s both',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>Chicken Tracks</h1>
        <p style={{
          color: colors.textMuted,
          fontSize: '18px',
          margin: 0,
          animation: 'fadeIn 1s ease-out 0.7s both',
        }}>Get Outside, Track Your Flock!</p>
      </div>
    );
  }

  // Intruder Alert Screen
  if (showIntruderAlert && todaysIntruder) {
    return (
      <div style={{
        background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.redAccent} 100%)`,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        animation: 'shake 0.5s ease-in-out',
      }}>
        {/* Warning pulse effect */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: colors.warning,
          borderRadius: '50%',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse 1.5s infinite',
          boxShadow: '0 0 30px rgba(255, 107, 53, 0.8)',
        }}>
          <span style={{ fontSize: '40px' }}>⚠️</span>
        </div>

        {/* Intruder Animal - BIG! */}
        <div style={{
          fontSize: '220px',
          marginBottom: '20px',
          animation: 'bounce 1s infinite alternate',
          filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
        }}>
          {todaysIntruder.emoji}
        </div>

        {/* Alert Title */}
        <h1 style={{
          color: colors.cream,
          fontSize: '48px',
          fontWeight: '900',
          margin: '0 0 12px',
          textAlign: 'center',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          animation: 'fadeIn 0.5s',
        }}>
          {todaysIntruder.name.toUpperCase()} ALERT!
        </h1>

        {/* Description */}
        <p style={{
          color: colors.cream,
          fontSize: '22px',
          textAlign: 'center',
          margin: '0 0 30px',
          maxWidth: '600px',
          lineHeight: '1.4',
        }}>
          {todaysIntruder.description}
        </p>

        {/* Fun Fact */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '40px',
          maxWidth: '500px',
          backdropFilter: 'blur(10px)',
        }}>
          <p style={{
            color: colors.cream,
            fontSize: '14px',
            margin: 0,
            opacity: 0.9,
          }}>
            💡 <strong>Did you know?</strong> {todaysIntruder.funFact}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleScareIntruder}
          style={{
            background: `linear-gradient(135deg, ${colors.gold} 0%, #C87D2F 100%)`,
            color: colors.navy,
            fontSize: '24px',
            fontWeight: '800',
            padding: '20px 60px',
            borderRadius: '16px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            animation: 'pulse 2s infinite',
          }}
        >
          🏃‍♀️ SCARE IT AWAY!
        </button>

        {/* Bonus Reward Preview */}
        <p style={{
          color: colors.cream,
          fontSize: '16px',
          marginTop: '20px',
          opacity: 0.8,
        }}>
          Quick response bonus: +50 🌽 +5 🪱
        </p>

        {/* Skip option (small) */}
        <button
          onClick={() => setShowIntruderAlert(false)}
          style={{
            background: 'transparent',
            color: colors.textMuted,
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer',
            marginTop: '20px',
            textDecoration: 'underline',
          }}
        >
          Check later
        </button>

        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
          
          @keyframes bounce {
            from { transform: translateY(0px); }
            to { transform: translateY(-20px); }
          }
        `}</style>
      </div>
    );
  }

  // Settings View
  if (currentView === 'settings') {
    return (
      <div style={{ 
        background: colors.cream,
        minHeight: '100vh',
        paddingBottom: '80px',
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyLight} 100%)`,
          padding: '20px',
          borderRadius: '0 0 32px 32px',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <button
              onClick={() => setCurrentView('home')}
              style={{
                background: 'transparent',
                border: 'none',
                color: colors.cream,
                fontSize: '24px',
                cursor: 'pointer',
                marginRight: '12px',
              }}
            >
              ←
            </button>
            <h1 style={{
              color: colors.cream,
              fontSize: '28px',
              fontWeight: '800',
              margin: 0,
            }}>
              Settings
            </h1>
          </div>
        </div>

        <div style={{ padding: '0 20px' }}>
          {/* Intruder Alert Settings */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '32px', marginRight: '12px' }}>🦝</span>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: colors.navy,
                margin: 0,
              }}>
                Coop Intruder Alerts
              </h2>
            </div>

            <p style={{
              color: colors.textMuted,
              fontSize: '14px',
              lineHeight: '1.5',
              marginBottom: '20px',
            }}>
              Get a fun reminder if you haven't checked on your chickens during your usual time.
            </p>

            {/* Enable Toggle */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '20px',
              borderBottom: `1px solid ${colors.cream}`,
            }}>
              <span style={{ color: colors.navy, fontWeight: '600' }}>
                Enable Alerts
              </span>
              <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                <input
                  type="checkbox"
                  checked={intruderSettings.enabled}
                  onChange={(e) => setIntruderSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: intruderSettings.enabled ? colors.sage : '#ccc',
                  borderRadius: '34px',
                  transition: '0.3s',
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '',
                    height: '26px',
                    width: '26px',
                    left: intruderSettings.enabled ? '30px' : '4px',
                    bottom: '4px',
                    background: 'white',
                    borderRadius: '50%',
                    transition: '0.3s',
                  }} />
                </span>
              </label>
            </div>

            {intruderSettings.enabled && (
              <>
                {/* Time Window Picker */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    color: colors.navy,
                    fontWeight: '600',
                    marginBottom: '8px',
                  }}>
                    My usual check time:
                  </label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                      type="time"
                      value={intruderSettings.checkTimeStart}
                      onChange={(e) => setIntruderSettings(prev => ({ ...prev, checkTimeStart: e.target.value }))}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '12px',
                        border: `2px solid ${colors.cream}`,
                        fontSize: '16px',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                      }}
                    />
                    <span style={{ color: colors.textMuted }}>to</span>
                    <input
                      type="time"
                      value={intruderSettings.checkTimeEnd}
                      onChange={(e) => setIntruderSettings(prev => ({ ...prev, checkTimeEnd: e.target.value }))}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '12px',
                        border: `2px solid ${colors.cream}`,
                        fontSize: '16px',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                      }}
                    />
                  </div>
                </div>

                {/* Info */}
                <div style={{
                  background: colors.cream,
                  borderRadius: '12px',
                  padding: '16px',
                  marginTop: '16px',
                }}>
                  <p style={{
                    color: colors.navy,
                    fontSize: '14px',
                    margin: 0,
                    lineHeight: '1.5',
                  }}>
                    💡 If you don't check in during this time, we'll send you a fun intruder alert 30 minutes after your window ends.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Preview Button */}
          <button
            onClick={() => {
              const randomIntruder = intruderTypes[Math.floor(Math.random() * intruderTypes.length)];
              setTodaysIntruder(randomIntruder);
              setShowIntruderAlert(true);
            }}
            style={{
              width: '100%',
              background: `linear-gradient(135deg, ${colors.redAccent} 0%, #C62F3A 100%)`,
              color: 'white',
              fontSize: '16px',
              fontWeight: '700',
              padding: '16px',
              borderRadius: '16px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(230, 57, 70, 0.3)',
            }}
          >
            🦝 Preview Intruder Alert
          </button>
        </div>
      </div>
    );
  }

  // Flock View
  if (currentView === 'flock') {
    return (
      <div style={{ 
        background: colors.cream,
        minHeight: '100vh',
        paddingBottom: '80px',
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyLight} 100%)`,
          padding: '20px',
          borderRadius: '0 0 32px 32px',
          marginBottom: '20px',
        }}>
          <h1 style={{
            color: colors.cream,
            fontSize: '28px',
            fontWeight: '800',
            margin: 0,
          }}>
            My Flock
          </h1>
        </div>

        <div style={{ padding: '0 20px' }}>
          {flock.map(chicken => (
            <div
              key={chicken.id}
              onClick={() => setSelectedChicken(chicken)}
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: '20px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              <div style={{
                fontSize: '48px',
                width: '64px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: colors.cream,
                borderRadius: '50%',
              }}>
                {chicken.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: colors.navy,
                  margin: '0 0 4px',
                }}>{chicken.name}</h3>
                <p style={{
                  fontSize: '14px',
                  color: colors.textMuted,
                  margin: '0 0 4px',
                }}>{chicken.breed} • {chicken.age}</p>
                <p style={{
                  fontSize: '12px',
                  color: chicken.color,
                  margin: 0,
                  fontWeight: '600',
                }}>{chicken.personality}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: colors.navy }}>
                  {chicken.photos}
                </div>
                <div style={{ fontSize: '13px', color: colors.textMuted, fontWeight: '600' }}>photos</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          borderTop: `2px solid ${colors.cream}`,
          display: 'flex',
          justifyContent: 'space-around',
          padding: '12px 0',
        }}>
          <button
            onClick={() => setCurrentView('home')}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              opacity: 0.5,
            }}
          >
            🏠
          </button>
          <button
            onClick={() => setCurrentView('flock')}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              opacity: 1,
            }}
          >
            🐔
          </button>
          <button
            onClick={() => setCurrentView('rewards')}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              opacity: 0.5,
            }}
          >
            🎁
          </button>
          <button
            onClick={() => setCurrentView('settings')}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              opacity: 0.5,
            }}
          >
            ⚙️
          </button>
        </div>
      </div>
    );
  }

  // Rewards/Memories View
  if (currentView === 'rewards') {
    return (
      <div style={{ 
        background: colors.cream,
        minHeight: '100vh',
        paddingBottom: '80px',
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyLight} 100%)`,
          padding: '20px',
          borderRadius: '0 0 32px 32px',
          marginBottom: '20px',
        }}>
          <h1 style={{
            color: colors.cream,
            fontSize: '28px',
            fontWeight: '800',
            margin: 0,
          }}>
            Memories
          </h1>
        </div>

        <div style={{ padding: '0 20px' }}>
          {memories.map(memory => (
            <div
              key={memory.id}
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: '20px',
                marginBottom: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              <div style={{
                width: '100%',
                height: '200px',
                background: colors.cream,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '64px',
                marginBottom: '16px',
              }}>
                {memory.photo}
              </div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: colors.navy,
                margin: '0 0 8px',
              }}>{memory.caption}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: colors.textMuted }}>
                  {memory.date}
                </span>
                <span style={{ fontSize: '14px', color: colors.redAccent }}>
                  ❤️ {memory.likes}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          borderTop: `2px solid ${colors.cream}`,
          display: 'flex',
          justifyContent: 'space-around',
          padding: '12px 0',
        }}>
          <button
            onClick={() => setCurrentView('home')}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              opacity: 0.5,
            }}
          >
            🏠
          </button>
          <button
            onClick={() => setCurrentView('flock')}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              opacity: 0.5,
            }}
          >
            🐔
          </button>
          <button
            onClick={() => setCurrentView('rewards')}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              opacity: 1,
            }}
          >
            🎁
          </button>
          <button
            onClick={() => setCurrentView('settings')}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              opacity: 0.5,
            }}
          >
            ⚙️
          </button>
        </div>
      </div>
    );
  }

  // Main Home View (rest of the app continues as before...)
  return (
    <div style={{ 
      background: colors.cream,
      minHeight: '100vh',
      paddingBottom: '80px',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Welcome Back Banner */}
      {showWelcomeBack && !todayComplete && (
        <div style={{
          background: `linear-gradient(135deg, ${colors.sage} 0%, #7A9D6A 100%)`,
          padding: '16px 20px',
          animation: 'slideDown 0.5s ease-out',
        }}>
          <p style={{
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            margin: 0,
            textAlign: 'center',
          }}>
            🌅 Good morning! Your chickens are waiting! ✨
          </p>
        </div>
      )}

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyLight} 100%)`,
        padding: '20px',
        borderRadius: '0 0 32px 32px',
        marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{
              color: colors.cream,
              fontSize: '28px',
              fontWeight: '800',
              margin: '0 0 4px 0',
            }}>Today's Quests</h1>
            <p style={{
              color: colors.textMuted,
              fontSize: '14px',
              margin: 0,
            }}>Thursday, January 8</p>
          </div>
          <img src={logoBase64} alt="Logo" style={{ width: '80px', height: 'auto' }} />
        </div>

        {/* Streak & Stats Card */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyLight} 100%)`,
          borderRadius: '24px',
          padding: '24px',
          marginBottom: '20px',
          border: `3px solid ${colors.gold}`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '16px',
            alignItems: 'center',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '4px' }}>🔥</div>
              <div style={{ color: colors.gold, fontSize: '32px', fontWeight: '800' }}>{streak}</div>
              <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>Day Streak</div>
            </div>
            
            <div style={{ width: '2px', height: '60px', background: colors.blueGray }}></div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '4px' }}>⏱️</div>
              <div style={{ color: colors.sage, fontSize: '32px', fontWeight: '800' }}>{outdoorMinutes}</div>
              <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>Mins Outside</div>
            </div>
          </div>
        </div>

        {/* Current Streak - Currency Display */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '20px',
          backdropFilter: 'blur(10px)',
        }}>
          <h3 style={{
            color: colors.cream,
            fontSize: '16px',
            fontWeight: '700',
            margin: '0 0 16px 0',
          }}>Current Rewards</h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '4px' }}>🌽</div>
              <div style={{ color: colors.cream, fontSize: '20px', fontWeight: '700' }}>{inventory.cornScratch}</div>
              <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>Corn Scratch</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '4px' }}>🪱</div>
              <div style={{ color: colors.cream, fontSize: '20px', fontWeight: '700' }}>{inventory.mealworms}</div>
              <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>Mealworms</div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <div style={{ fontSize: '28px', marginBottom: '4px' }}>🍳🍳</div>
              <div style={{ color: colors.cream, fontSize: '20px', fontWeight: '700', marginTop: '4px' }}>{inventory.doubleYolks}</div>
              <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>Double Yolks</div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <div style={{ fontSize: '28px', marginBottom: '4px' }}>
                <OliveEgg size="28px" />
              </div>
              <div style={{ color: colors.cream, fontSize: '20px', fontWeight: '700', marginTop: '4px' }}>{inventory.oliveEggers}</div>
              <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>Olive Egg</div>
            </div>
            
            <div style={{ textAlign: 'center', gridColumn: 'span 2' }}>
              <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>
                <img src={logoBase64} alt="Chicken Tracks" style={{ width: '70px', height: 'auto' }} />
              </div>
              <div style={{ color: colors.cream, fontSize: '20px', fontWeight: '700' }}>{inventory.chickenTracks}</div>
              <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>Chicken Tracks</div>
            </div>
          </div>

          <button
            onClick={() => setShowConversionShop(true)}
            style={{
              width: '100%',
              marginTop: '16px',
              background: `linear-gradient(135deg, ${colors.gold} 0%, #C87D2F 100%)`,
              color: colors.navy,
              fontSize: '14px',
              fontWeight: '700',
              padding: '12px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            🔄 Convert Rewards
          </button>
        </div>
      </div>

      {/* Rest of app content... */}
      <div style={{ padding: '0 20px' }}>
        {/* Quest Cards */}
        <div style={{ marginBottom: '24px' }}>
          {todaysQuests.map(quest => (
            <div
              key={quest.id}
              onClick={() => !quest.completed && handleCompleteQuest(quest.id)}
              style={{
                background: quest.completed 
                  ? `linear-gradient(135deg, ${colors.sage} 0%, #7A9D6A 100%)`
                  : 'white',
                borderRadius: '20px',
                padding: '20px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: quest.completed ? 'default' : 'pointer',
                boxShadow: quest.completed ? 'none' : '0 4px 12px rgba(0,0,0,0.08)',
                border: quest.completed ? 'none' : `2px solid ${colors.cream}`,
                opacity: quest.completed ? 0.7 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <div style={{
                  fontSize: '32px',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: quest.completed ? 'rgba(255,255,255,0.3)' : colors.cream,
                  borderRadius: '50%',
                }}>
                  {quest.completed ? '✅' : quest.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: quest.completed ? 'white' : colors.navy,
                    margin: '0 0 4px',
                  }}>{quest.title}</h3>
                  <p style={{
                    fontSize: '14px',
                    color: quest.completed ? 'rgba(255,255,255,0.9)' : colors.textMuted,
                    margin: 0,
                  }}>
                    {quest.completed ? 'Complete!' : `+${quest.reward} 🌽`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        borderTop: `2px solid ${colors.cream}`,
        display: 'flex',
        justifyContent: 'space-around',
        padding: '12px 0',
      }}>
        <button
          onClick={() => setCurrentView('home')}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            opacity: currentView === 'home' ? 1 : 0.5,
          }}
        >
          🏠
        </button>
        <button
          onClick={() => setCurrentView('flock')}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            opacity: currentView === 'flock' ? 1 : 0.5,
          }}
        >
          🐔
        </button>
        <button
          onClick={() => setCurrentView('rewards')}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            opacity: currentView === 'rewards' ? 1 : 0.5,
          }}
        >
          🎁
        </button>
        <button
          onClick={() => setCurrentView('settings')}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            opacity: currentView === 'settings' ? 1 : 0.5,
          }}
        >
          ⚙️
        </button>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fadeOut {
          to { opacity: 0; visibility: hidden; }
        }
        
        @keyframes bounceIn {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
