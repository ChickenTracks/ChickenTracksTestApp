import React, { useState, useEffect, useRef } from 'react';

// ChickenTracks v6 - REAL USER TESTING VERSION
// Start from scratch • Add your chickens • Take real photos • Build real streaks

export default function ChickenTracksApp() {
  // === STATE ===
  const [appState, setAppState] = useState('splash'); // splash, onboarding, home
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [currentView, setCurrentView] = useState('home');
  const [flock, setFlock] = useState([]);
  const [streak, setStreak] = useState(0);
  const [lastVisitDate, setLastVisitDate] = useState(null);
  const [todayComplete, setTodayComplete] = useState(false);
  const [outdoorMinutes, setOutdoorMinutes] = useState(0);
  const [todaysQuests, setTodaysQuests] = useState([
    { id: 1, title: 'Collect Eggs', icon: '🥚', completed: false, reward: 25, time: '5 min' },
    { id: 2, title: 'Fresh Water', icon: '💧', completed: false, reward: 15, time: '3 min' },
    { id: 3, title: 'Health Check', icon: '🩺', completed: false, reward: 20, time: '5 min' },
  ]);
  const [inventory, setInventory] = useState({
    cornScratch: 0,
    mealworms: 0,
    oliveEggers: 0,
    doubleYolks: 0,
    chickenTracks: 0,
  });
  const [selectedChicken, setSelectedChicken] = useState(null);
  const [showAddChicken, setShowAddChicken] = useState(false);
  const [showQuestComplete, setShowQuestComplete] = useState(false);
  const [showRewardDrop, setShowRewardDrop] = useState(false);
  const [lastDrop, setLastDrop] = useState(null);
  const [newChicken, setNewChicken] = useState({ name: '', breed: '', age: '', personality: '', color: '#D4943D' });
  
  const photoInputRef = useRef(null);
  
  // === CONSTANTS ===
  const colors = {
    navy: '#2D3E50', navyLight: '#3D5166', navyDark: '#1E2A36',
    redAccent: '#E63946', cream: '#F5F0E6', gold: '#D4943D',
    sage: '#8FAE7C', blueGray: '#4A5C6A', textMuted: '#7A8B99',
    oliveGreen: '#6B8E23', mealwormBrown: '#8B4513',
  };
  
  const rewardTiers = {
    cornScratch: { name: 'Corn Scratch', emoji: '🌽', color: colors.gold, dropRate: 1.0 },
    mealworms: { name: 'Mealworms', emoji: '🪱', color: colors.mealwormBrown, dropRate: 0.25 },
    oliveEggers: { name: 'Olive Egg', emoji: '🥚', color: colors.oliveGreen, dropRate: 0.10 },
  };
  
  const logoBase64 = "data:image/jpeg;base64,/9j/4QDKRXhpZgAATU0AKgAAAAgABgESAAMAAAABAAEAAAEaAAUAAAABAAAAVgEbAAUAAAABAAAAXgEoAAMAAAABAAIAAAITAAMAAAABAAEAAIdpAAQAAAABAAAAZgAAAAAAAABIAAAAAQAAAEgAAAABAAeQAAAHAAAABDAyMjGRAQAHAAAABAECAwCgAAAHAAAABDAxMDCgAQADAAAAAQABAACgAgAEAAAAAQAAAi+gAwAEAAAAAQAAAb6kBgADAAAAAQAAAAAAAAAAAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYYXBwbAQAAABtbnRyUkdCIFhZWiAH5gABAAEAAAAAAABhY3NwQVBQTAAAAABBUFBMAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGzs/aOOOIVHw220vU962hgvAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApkZXNjAAAA/AAAADBjcHJ0AAABLAAAAFB3dHB0AAABfAAAABRyWFlaAAABkAAAABRnWFlaAAABpAAAABRiWFlaAAABuAAAABRyVFJDAAABzAAAACBjaGFkAAAB7AAAACxiVFJDAAABzAAAACBnVFJDAAABzAAAACBtbHVjAAAAAAAAAAEAAAAMZW5VUwAAABQAAAAcAEQAaQBzAHAAbABhAHkAIABQADNtbHVjAAAAAAAAAAEAAAAMZW5VUwAAADQAAAAcAEMAbwBwAHkAcgBpAGcAaAB0ACAAQQBwAHAAbABlACAASQBuAGMALgAsACAAMgAwADIAMlhZWiAAAAAAAAD21QABAAAAANMsWFlaIAAAAAAAAIPfAAA9v////7tYWVogAAAAAAAASr8AALE3AAAKuVhZWiAAAAAAAAAoOAAAEQsAAMi5cGFyYQAAAAAAAwAAAAJmZgAA8qcAAA1ZAAAT0AAACltzZjMyAAAAAAABDEIAAAXe///zJgAAB5MAAP2Q///7ov///aMAAAPcAADAbv/bAIQAAQEBAQEBAgEBAgMCAgIDBAMDAwMEBQQEBAQEBQYFBQUFBQUGBgYGBgYGBgcHBwcHBwgICAgICQkJCQkJCQkJCQEBAQECAgIEAgIECQYFBgkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJ/90ABAAj/8AAEQgBvgIvAwEiAAIRAQMRAf/EAaIAAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKCxAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6AQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgsRAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/Q/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/R/v4ooooAKKKKACiimO6RIZJCFVRkk8ACgB9FfKPxC/bt/Ys+FEtp8RPit4U0nSCOSRTStra78qTzW78o5c4/hRq3vh";
  
  // === EFFECTS ===
  useEffect(() => {
    if (appState === 'splash') {
      const timer = setTimeout(() => {
        setAppState(flock.length === 0 ? 'onboarding' : 'home');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [appState, flock.length]);
  
  useEffect(() => {
    if (appState === 'home') {
      const today = new Date().toDateString();
      if (lastVisitDate && lastVisitDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastVisitDate !== yesterday.toDateString()) {
          setStreak(0);
        }
        setTodaysQuests(prev => prev.map(q => ({ ...q, completed: false })));
        setTodayComplete(false);
      }
      setLastVisitDate(today);
    }
  }, [appState]);
  
  // === HANDLERS ===
  const handleAddChicken = () => {
    if (newChicken.name.trim()) {
      const chicken = {
        id: Date.now(),
        name: newChicken.name,
        breed: newChicken.breed || 'Mixed Breed',
        age: newChicken.age || 'Unknown',
        personality: newChicken.personality || 'Curious Explorer',
        color: newChicken.color,
        photos: [],
        totalPhotos: 0,
        dateAdded: new Date().toLocaleDateString(),
      };
      setFlock([...flock, chicken]);
      setNewChicken({ name: '', breed: '', age: '', personality: '', color: '#D4943D' });
      setShowAddChicken(false);
      if (appState === 'onboarding' && onboardingStep === 1) {
        setTimeout(() => setOnboardingStep(2), 500);
      }
    }
  };
  
  const handleCompleteQuest = (questId) => {
    const quest = todaysQuests.find(q => q.id === questId);
    if (quest && !quest.completed) {
      setTodaysQuests(prev => prev.map(q => q.id === questId ? { ...q, completed: true } : q));
      setOutdoorMinutes(prev => prev + parseInt(quest.time));
      
      const drops = [];
      Object.entries(rewardTiers).forEach(([key, tier]) => {
        if (Math.random() < tier.dropRate) {
          const amount = key === 'cornScratch' ? Math.floor(Math.random() * 20) + 10 : 1;
          drops.push({ currency: key, amount, tier });
        }
      });
      
      if (drops.length > 0) {
        const bestDrop = drops[0];
        setLastDrop(bestDrop);
        drops.forEach(drop => {
          setInventory(prev => ({ ...prev, [drop.currency]: prev[drop.currency] + drop.amount }));
        });
        setShowRewardDrop(true);
        setTimeout(() => setShowRewardDrop(false), 3000);
      }
      
      const allComplete = todaysQuests.every(q => q.id === questId || q.completed);
      if (allComplete) {
        setTodayComplete(true);
        setStreak(prev => prev + 1);
        setShowQuestComplete(true);
        setTimeout(() => setShowQuestComplete(false), 3000);
      }
    }
  };
  
  const handlePhotoCapture = (event, chickenId) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoData = {
          id: Date.now(),
          data: e.target.result,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
        };
        setFlock(prev => prev.map(chicken => 
          chicken.id === chickenId
            ? { ...chicken, photos: [...(chicken.photos || []), photoData], totalPhotos: (chicken.totalPhotos || 0) + 1 }
            : chicken
        ));
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };
  
  // === RENDER HELPERS ===
  const Button = ({ children, onClick, primary, disabled, style }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? colors.textMuted : primary ? colors.redAccent : 'transparent',
        color: primary ? 'white' : colors.redAccent,
        padding: primary ? '18px 50px' : '10px 30px',
        border: primary ? 'none' : `2px solid ${colors.redAccent}`,
        borderRadius: '30px',
        fontSize: '18px',
        fontWeight: '600',
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: primary ? `0 6px 20px ${colors.redAccent}40` : 'none',
        ...style,
      }}
    >
      {children}
    </button>
  );
  
  // === SPLASH SCREEN ===
  if (appState === 'splash') {
    return (
      <div style={{
        background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyDark} 100%)`,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img src={logoBase64} alt="ChickenTracks" style={{ width: '280px', marginBottom: '30px' }} />
        <div style={{
          width: '60px',
          height: '60px',
          border: `4px solid ${colors.cream}`,
          borderTop: `4px solid ${colors.redAccent}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  
  // === ONBOARDING ===
  if (appState === 'onboarding') {
    return (
      <div style={{ background: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px 20px', maxWidth: '500px', margin: '0 auto' }}>
          {onboardingStep === 0 && (
            <>
              <img 
                src={logoBase64} 
                alt="ChickenTracks" 
                style={{ 
                  width: '280px', 
                  height: 'auto', 
                  marginBottom: '30px',
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }} 
              />
              <h1 style={{ color: colors.navy, fontSize: '36px', fontWeight: '700', marginBottom: '15px' }}>
                Welcome to<br/>ChickenTracks!
              </h1>
              <p style={{ color: colors.textMuted, fontSize: '18px', lineHeight: '1.6', marginBottom: '40px' }}>
                Track your flock daily, build streaks, and earn rewards for taking care of your chickens!
              </p>
              <Button onClick={() => setOnboardingStep(1)} primary>Get Started →</Button>
            </>
          )}
          
          {onboardingStep === 1 && (
            <>
              <div style={{ fontSize: '70px', marginBottom: '20px' }}>🐔</div>
              <h2 style={{ color: colors.navy, fontSize: '32px', fontWeight: '700', marginBottom: '10px' }}>
                Add Your First Chicken
              </h2>
              <p style={{ color: colors.textMuted, fontSize: '16px', marginBottom: '30px' }}>
                {flock.length === 0 ? "Let's start by adding one of your chickens" : `Added ${flock.length} chicken${flock.length > 1 ? 's' : ''}!`}
              </p>
              
              {!showAddChicken && flock.length === 0 ? (
                <Button onClick={() => setShowAddChicken(true)} primary>+ Add Chicken</Button>
              ) : showAddChicken ? (
                <div style={{ textAlign: 'left' }}>
                  <input
                    type="text"
                    placeholder="Chicken Name *"
                    value={newChicken.name}
                    onChange={(e) => setNewChicken({ ...newChicken, name: e.target.value })}
                    style={{ width: '100%', padding: '15px', marginBottom: '15px', border: `2px solid ${colors.blueGray}`, borderRadius: '10px', fontSize: '16px', boxSizing: 'border-box' }}
                  />
                  <input
                    type="text"
                    placeholder="Breed (optional)"
                    value={newChicken.breed}
                    onChange={(e) => setNewChicken({ ...newChicken, breed: e.target.value })}
                    style={{ width: '100%', padding: '15px', marginBottom: '15px', border: `2px solid ${colors.blueGray}`, borderRadius: '10px', fontSize: '16px', boxSizing: 'border-box' }}
                  />
                  <input
                    type="text"
                    placeholder="Age (optional)"
                    value={newChicken.age}
                    onChange={(e) => setNewChicken({ ...newChicken, age: e.target.value })}
                    style={{ width: '100%', padding: '15px', marginBottom: '25px', border: `2px solid ${colors.blueGray}`, borderRadius: '10px', fontSize: '16px', boxSizing: 'border-box' }}
                  />
                  <Button onClick={handleAddChicken} disabled={!newChicken.name.trim()} primary style={{ width: '100%', marginBottom: '10px' }}>
                    Add Chicken
                  </Button>
                  <button onClick={() => setShowAddChicken(false)} style={{ width: '100%', background: 'transparent', color: colors.textMuted, padding: '10px', border: 'none', fontSize: '16px', cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  {flock.map(chicken => (
                    <div key={chicken.id} style={{ background: colors.cream, padding: '15px', borderRadius: '15px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ fontSize: '40px' }}>🐔</div>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{ color: colors.navy, fontWeight: '600', fontSize: '18px' }}>{chicken.name}</div>
                        <div style={{ color: colors.textMuted, fontSize: '14px' }}>{chicken.breed}</div>
                      </div>
                    </div>
                  ))}
                  <Button onClick={() => setShowAddChicken(true)} style={{ marginRight: '10px', marginTop: '15px' }}>+ Add Another</Button>
                  <Button onClick={() => setOnboardingStep(2)} primary style={{ marginTop: '15px' }}>Continue →</Button>
                </div>
              )}
            </>
          )}
          
          {onboardingStep === 2 && (
            <>
              <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎉</div>
              <h2 style={{ color: colors.navy, fontSize: '32px', fontWeight: '700', marginBottom: '10px' }}>You're All Set!</h2>
              <p style={{ color: colors.textMuted, fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
                Complete daily quests to earn rewards and build your streak!
              </p>
              <div style={{ background: colors.cream, padding: '25px', borderRadius: '20px', marginBottom: '30px', textAlign: 'left' }}>
                <h3 style={{ color: colors.navy, fontSize: '20px', marginBottom: '15px', textAlign: 'center' }}>Today's Quests</h3>
                {todaysQuests.map(quest => (
                  <div key={quest.id} style={{ padding: '12px 0', borderBottom: `1px solid ${colors.blueGray}30`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '24px' }}>{quest.icon}</span>
                      <div>
                        <div style={{ color: colors.navy, fontWeight: '600' }}>{quest.title}</div>
                        <div style={{ color: colors.textMuted, fontSize: '12px' }}>{quest.time}</div>
                      </div>
                    </div>
                    <div style={{ color: colors.gold, fontSize: '14px', fontWeight: '600' }}>+{quest.reward} 🌽</div>
                  </div>
                ))}
              </div>
              <Button onClick={() => { setAppState('home'); setLastVisitDate(new Date().toDateString()); }} primary>
                Start Tracking! 🚀
              </Button>
            </>
          )}
        </div>
        
        <div style={{ textAlign: 'center', padding: '20px', marginTop: '20px' }}>
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: i === onboardingStep ? colors.redAccent : colors.textMuted,
                margin: '0 5px',
              }}
            />
          ))}
        </div>
      </div>
    );
  }
  
  // === MAIN APP (HOME VIEW) ===
  if (currentView === 'home') {
    return (
      <div style={{ background: colors.cream, minHeight: '100vh', paddingBottom: '80px' }}>
        {/* Header */}
        <div style={{ background: colors.navy, padding: '20px', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
            <img src={logoBase64} alt="Logo" style={{ height: '50px' }} />
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', color: colors.cream }}>Streak</div>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>🔥 {streak}</div>
            </div>
          </div>
          
          <div style={{ background: colors.navyLight, padding: '15px', borderRadius: '15px' }}>
            <div style={{ fontSize: '14px', marginBottom: '5px', color: colors.cream }}>Today's Progress</div>
            <div style={{ background: colors.navyDark, height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${(todaysQuests.filter(q => q.completed).length / todaysQuests.length) * 100}%`,
                height: '100%',
                background: colors.redAccent,
                transition: 'width 0.3s ease',
              }} />
            </div>
            <div style={{ fontSize: '12px', marginTop: '5px', color: colors.cream }}>
              {todaysQuests.filter(q => q.completed).length} of {todaysQuests.length} quests complete
            </div>
          </div>
        </div>
        
        {/* Quests */}
        <div style={{ padding: '20px' }}>
          <h2 style={{ color: colors.navy, fontSize: '24px', marginBottom: '15px' }}>Today's Quests</h2>
          {todaysQuests.map(quest => (
            <div
              key={quest.id}
              onClick={() => !quest.completed && handleCompleteQuest(quest.id)}
              style={{
                background: quest.completed ? colors.sage + '30' : 'white',
                padding: '20px',
                borderRadius: '15px',
                marginBottom: '10px',
                cursor: quest.completed ? 'default' : 'pointer',
                border: quest.completed ? `2px solid ${colors.sage}` : '2px solid transparent',
                opacity: quest.completed ? 0.7 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '32px' }}>{quest.icon}</span>
                  <div>
                    <div style={{ color: colors.navy, fontWeight: '600', fontSize: '18px' }}>{quest.title}</div>
                    <div style={{ color: colors.textMuted, fontSize: '14px' }}>{quest.time} • +{quest.reward} 🌽</div>
                  </div>
                </div>
                {quest.completed ? (
                  <span style={{ fontSize: '24px' }}>✅</span>
                ) : (
                  <div style={{ width: '24px', height: '24px', border: `3px solid ${colors.textMuted}`, borderRadius: '50%' }} />
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Flock Preview */}
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ color: colors.navy, fontSize: '24px' }}>Your Flock</h2>
            <button
              onClick={() => setCurrentView('flock')}
              style={{ background: 'transparent', color: colors.redAccent, border: 'none', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
            >
              View All →
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
            {flock.slice(0, 4).map(chicken => (
              <div
                key={chicken.id}
                onClick={() => { setSelectedChicken(chicken); setCurrentView('chicken'); }}
                style={{
                  background: 'white',
                  padding: '15px',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '50px', marginBottom: '10px' }}>🐔</div>
                <div style={{ color: colors.navy, fontWeight: '600', fontSize: '16px' }}>{chicken.name}</div>
                <div style={{ color: colors.textMuted, fontSize: '12px' }}>{chicken.totalPhotos || 0} photos</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Rewards Summary */}
        <div style={{ padding: '20px' }}>
          <h2 style={{ color: colors.navy, fontSize: '24px', marginBottom: '15px' }}>Current Rewards</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {Object.entries(inventory).slice(0, 3).map(([key, amount]) => (
              <div key={key} style={{ background: 'white', padding: '15px', borderRadius: '15px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px' }}>{rewardTiers[key]?.emoji}</div>
                <div style={{ color: colors.navy, fontWeight: '700', fontSize: '20px' }}>{amount}</div>
                <div style={{ color: colors.textMuted, fontSize: '11px' }}>{rewardTiers[key]?.name}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Quest Complete Overlay */}
        {showQuestComplete && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}>
            <div style={{ textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎉</div>
              <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>All Quests Complete!</h2>
              <p style={{ fontSize: '18px' }}>Streak: {streak} days!</p>
            </div>
          </div>
        )}
        
        {/* Reward Drop Overlay */}
        {showRewardDrop && lastDrop && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}>
            <div style={{ textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: '80px', marginBottom: '20px' }}>{lastDrop.tier.emoji}</div>
              <h2 style={{ fontSize: '28px', marginBottom: '10px' }}>+{lastDrop.amount} {lastDrop.tier.name}!</h2>
              <p style={{ fontSize: '16px', color: lastDrop.tier.color }}>{lastDrop.tier.rarity}</p>
            </div>
          </div>
        )}
        
        {/* Bottom Nav */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          padding: '15px 20px',
          boxShadow: '0 -4px 10px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-around',
        }}>
          {['home', 'flock', 'rewards'].map(view => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              style={{
                background: 'transparent',
                border: 'none',
                color: currentView === view ? colors.redAccent : colors.textMuted,
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {view === 'home' && '🏠'} {view === 'flock' && '🐔'} {view === 'rewards' && '🏆'}
              <div style={{ marginTop: '5px' }}>{view}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  // === FLOCK VIEW ===
  if (currentView === 'flock') {
    return (
      <div style={{ background: colors.cream, minHeight: '100vh', paddingBottom: '80px' }}>
        <div style={{ background: colors.navy, padding: '20px', color: 'white' }}>
          <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>Your Flock</h1>
          <p style={{ color: colors.cream, fontSize: '14px' }}>{flock.length} chicken{flock.length !== 1 ? 's' : ''}</p>
        </div>
        
        <div style={{ padding: '20px' }}>
          <Button onClick={() => setShowAddChicken(true)} primary style={{ width: '100%', marginBottom: '20px' }}>
            + Add New Chicken
          </Button>
          
          {showAddChicken && (
            <div style={{ background: 'white', padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
              <h3 style={{ color: colors.navy, marginBottom: '15px' }}>New Chicken</h3>
              <input
                type="text"
                placeholder="Name *"
                value={newChicken.name}
                onChange={(e) => setNewChicken({ ...newChicken, name: e.target.value })}
                style={{ width: '100%', padding: '12px', marginBottom: '10px', border: `2px solid ${colors.blueGray}`, borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }}
              />
              <input
                type="text"
                placeholder="Breed"
                value={newChicken.breed}
                onChange={(e) => setNewChicken({ ...newChicken, breed: e.target.value })}
                style={{ width: '100%', padding: '12px', marginBottom: '10px', border: `2px solid ${colors.blueGray}`, borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }}
              />
              <input
                type="text"
                placeholder="Age"
                value={newChicken.age}
                onChange={(e) => setNewChicken({ ...newChicken, age: e.target.value })}
                style={{ width: '100%', padding: '12px', marginBottom: '15px', border: `2px solid ${colors.blueGray}`, borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button onClick={handleAddChicken} disabled={!newChicken.name.trim()} primary style={{ flex: 1 }}>Add</Button>
                <Button onClick={() => setShowAddChicken(false)} style={{ flex: 1 }}>Cancel</Button>
              </div>
            </div>
          )}
          
          {flock.map(chicken => (
            <div
              key={chicken.id}
              onClick={() => { setSelectedChicken(chicken); setCurrentView('chicken'); }}
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '15px',
                marginBottom: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <div style={{ fontSize: '60px' }}>🐔</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: colors.navy, fontSize: '20px', marginBottom: '5px' }}>{chicken.name}</h3>
                <p style={{ color: colors.textMuted, fontSize: '14px', marginBottom: '5px' }}>{chicken.breed}</p>
                <p style={{ color: colors.textMuted, fontSize: '12px' }}>
                  {chicken.totalPhotos || 0} photos • Added {chicken.dateAdded}
                </p>
              </div>
              <div style={{ color: colors.redAccent, fontSize: '20px' }}>→</div>
            </div>
          ))}
        </div>
        
        {/* Bottom Nav */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          padding: '15px 20px',
          boxShadow: '0 -4px 10px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-around',
        }}>
          {['home', 'flock', 'rewards'].map(view => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              style={{
                background: 'transparent',
                border: 'none',
                color: currentView === view ? colors.redAccent : colors.textMuted,
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {view === 'home' && '🏠'} {view === 'flock' && '🐔'} {view === 'rewards' && '🏆'}
              <div style={{ marginTop: '5px' }}>{view}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  // === CHICKEN DETAIL VIEW ===
  if (currentView === 'chicken' && selectedChicken) {
    return (
      <div style={{ background: colors.cream, minHeight: '100vh', paddingBottom: '80px' }}>
        <div style={{ background: colors.navy, padding: '20px', color: 'white' }}>
          <button
            onClick={() => setCurrentView('flock')}
            style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '20px', marginBottom: '10px', cursor: 'pointer' }}
          >
            ← Back
          </button>
          <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>{selectedChicken.name}</h1>
          <p style={{ color: colors.cream }}>{selectedChicken.breed} • {selectedChicken.age}</p>
        </div>
        
        <div style={{ padding: '20px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '15px', marginBottom: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '100px', marginBottom: '15px' }}>🐔</div>
            <p style={{ color: colors.textMuted, fontSize: '14px' }}>{selectedChicken.personality}</p>
          </div>
          
          <Button
            onClick={() => photoInputRef.current?.click()}
            primary
            style={{ width: '100%', marginBottom: '20px' }}
          >
            📷 Add Photo
          </Button>
          
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => handlePhotoCapture(e, selectedChicken.id)}
            style={{ display: 'none' }}
          />
          
          <h3 style={{ color: colors.navy, fontSize: '20px', marginBottom: '15px' }}>
            Photo Gallery ({selectedChicken.photos?.length || 0})
          </h3>
          
          {selectedChicken.photos && selectedChicken.photos.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
              {selectedChicken.photos.map(photo => (
                <div
                  key={photo.id}
                  style={{
                    background: 'white',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    aspectRatio: '1/1',
                  }}
                >
                  <img
                    src={photo.data}
                    alt={`${selectedChicken.name}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '10px', background: 'white' }}>
                    <p style={{ color: colors.textMuted, fontSize: '12px' }}>
                      {photo.date} at {photo.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              background: 'white',
              padding: '40px 20px',
              borderRadius: '15px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '60px', marginBottom: '15px' }}>📷</div>
              <p style={{ color: colors.textMuted }}>No photos yet!</p>
              <p style={{ color: colors.textMuted, fontSize: '14px' }}>
                Tap "Add Photo" above to start your collection
              </p>
            </div>
          )}
        </div>
        
        {/* Bottom Nav */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          padding: '15px 20px',
          boxShadow: '0 -4px 10px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-around',
        }}>
          {['home', 'flock', 'rewards'].map(view => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              style={{
                background: 'transparent',
                border: 'none',
                color: currentView === view ? colors.redAccent : colors.textMuted,
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {view === 'home' && '🏠'} {view === 'flock' && '🐔'} {view === 'rewards' && '🏆'}
              <div style={{ marginTop: '5px' }}>{view}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  // === REWARDS VIEW ===
  if (currentView === 'rewards') {
    return (
      <div style={{ background: colors.cream, minHeight: '100vh', paddingBottom: '80px' }}>
        <div style={{ background: colors.navy, padding: '20px', color: 'white' }}>
          <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>Rewards</h1>
          <p style={{ color: colors.cream, fontSize: '14px' }}>Streak: {streak} days • {outdoorMinutes} min outside</p>
        </div>
        
        <div style={{ padding: '20px' }}>
          <h3 style={{ color: colors.navy, fontSize: '20px', marginBottom: '15px' }}>Your Inventory</h3>
          
          {Object.entries(inventory).map(([key, amount]) => {
            const tier = rewardTiers[key];
            if (!tier) return null;
            return (
              <div
                key={key}
                style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '15px',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '40px' }}>{tier.emoji}</span>
                  <div>
                    <div style={{ color: colors.navy, fontWeight: '600', fontSize: '18px' }}>{tier.name}</div>
                    <div style={{ color: tier.color, fontSize: '12px' }}>{tier.rarity}</div>
                  </div>
                </div>
                <div style={{ color: colors.navy, fontWeight: '700', fontSize: '28px' }}>{amount}</div>
              </div>
            );
          })}
        </div>
        
        {/* Bottom Nav */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          padding: '15px 20px',
          boxShadow: '0 -4px 10px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-around',
        }}>
          {['home', 'flock', 'rewards'].map(view => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              style={{
                background: 'transparent',
                border: 'none',
                color: currentView === view ? colors.redAccent : colors.textMuted,
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {view === 'home' && '🏠'} {view === 'flock' && '🐔'} {view === 'rewards' && '🏆'}
              <div style={{ marginTop: '5px' }}>{view}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  return <div>Loading...</div>;
}
