import React, { useState, useEffect, useRef } from 'react';

// ChickenTracks v7 - FULL CAMERA EXPERIENCE
// getUserMedia • Live Preview • Professional Controls • Premium Feel

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
  
  // v7 CAMERA STATE
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [hasFlash, setHasFlash] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [cameraSupported, setCameraSupported] = useState(true);

  
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
  
  const logoBase64 = "data:image/jpeg;base64,/9j/4QDKRXhpZgAATU0AKgAAAAgABgESAAMAAAABAAEAAAEaAAUAAAABAAAAVgEbAAUAAAABAAAAXgEoAAMAAAABAAIAAAITAAMAAAABAAEAAIdpAAQAAAABAAAAZgAAAAAAAABIAAAAAQAAAEgAAAABAAeQAAAHAAAABDAyMjGRAQAHAAAABAECAwCgAAAHAAAABDAxMDCgAQADAAAAAQABAACgAgAEAAAAAQAAAi+gAwAEAAAAAQAAAb6kBgADAAAAAQAAAAAAAAAAAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYYXBwbAQAAABtbnRyUkdCIFhZWiAH5gABAAEAAAAAAABhY3NwQVBQTAAAAABBUFBMAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGzs/aOOOIVHw220vU962hgvAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApkZXNjAAAA/AAAADBjcHJ0AAABLAAAAFB3dHB0AAABfAAAABRyWFlaAAABkAAAABRnWFlaAAABpAAAABRiWFlaAAABuAAAABRyVFJDAAABzAAAACBjaGFkAAAB7AAAACxiVFJDAAABzAAAACBnVFJDAAABzAAAACBtbHVjAAAAAAAAAAEAAAAMZW5VUwAAABQAAAAcAEQAaQBzAHAAbABhAHkAIABQADNtbHVjAAAAAAAAAAEAAAAMZW5VUwAAADQAAAAcAEMAbwBwAHkAcgBpAGcAaAB0ACAAQQBwAHAAbABlACAASQBuAGMALgAsACAAMgAwADIAMlhZWiAAAAAAAAD21QABAAAAANMsWFlaIAAAAAAAAIPfAAA9v////7tYWVogAAAAAAAASr8AALE3AAAKuVhZWiAAAAAAAAAoOAAAEQsAAMi5cGFyYQAAAAAAAwAAAAJmZgAA8qcAAA1ZAAAT0AAACltzZjMyAAAAAAABDEIAAAXe///zJgAAB5MAAP2Q///7ov///aMAAAPcAADAbv/bAIQAAQEBAQEBAgEBAgMCAgIDBAMDAwMEBQQEBAQEBQYFBQUFBQUGBgYGBgYGBgcHBwcHBwgICAgICQkJCQkJCQkJCQEBAQECAgIEAgIECQYFBgkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJ/90ABAAj/8AAEQgBvgIvAwEiAAIRAQMRAf/EAaIAAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKCxAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6AQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgsRAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/Q/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/R/v4ooooAKKKKACiimO6RIZJCFVRkk8ACgB9FfKPxC/bt/Yt+FEstr8RPit4U0meCQRSQTata+cjnPytEshcHg/w9q3Phf+2N+yd8a5YrX4TfEjw14guJiVS3stTtpJyVOCPJD+YCDxjbW/1Wpy83K7ehHtI7XPpKiivhD/gpB+3P4R/4J3/sqat+0h4psTqs1rLDY6bp4fy/tV7cnEUZcBtqgBnY4+6pA5xU0aMqk1TgtWFSajHmlsj7vor+Pv8A4Jdf8HJPxZ/ax/bM0T9mz9pPwnomi6T4zd7TR77STPWS3torpVkkm8yOZRsDbY2V2XcFAYV/YJXZmWVVsHU9lXVmc+DxtOvHnpPQKKKK846wor5w/a4/ai+Gn7GH7O3if9pX4tvIND8MWwmkjgAM08kjrDBBEGIXfLK6oCSFXOSQoJr+NHwz/wAHb37QMnxXXUfFXwu0H/hBml5s7We5/tNIAfvfaCxhZyn3cRbCVIyowR6+W5DisWnLDxvY4MVmVGg1Go7H93tFeT/Ar41fD/8AaN+Dvhv46fCy7+2+H/FNhFqFlKRtby5RnY6/wyRnKOv8CCckdq9YryXG2jO5PsFFFFIYUUUnSgBaK/ih/a7/AODp/wCKPw1/ap17wH+zp4I0XWPA/hC+l016jUzP9r1B7VnnnkhlEcEbMuIlMb/LhnchdgP9aX7JP7S/gT9sT9nLwn+0n8N1ki0nxXYrdJBNjzIJASksL443RSKyZHBxkcGvWx+R4nC041K0bJ7HDhsxo1pOFN7H0ZRRRXkncFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRVG41PTbNtl3cRRH0dgv8qq/8JF4fzt+3W+fTzU7fjTsBs0Vk/wBvaF/z+wf9/F/xqW21fSb1/Ks7mKVvRHVj+QNFgNGiiikAUUUUAFFFFABRRRQAUUUUAFFFFABRRXGfEbx74b+Ffw/1z4m+MpTb6T4esLjUryQDcVgtY2lkIUdTtU4A6nihLougHZ0V/CHqX/B2x8f1+NDXmlfDTQ/+FeLebbdpft94LpbMOFL+erGFXEbK/wDqj3UIdQ/tv+CvxW8M/Hb4P+F/jV4M3jSfFmlWmr2glG2RYbyFZkVx2ZQ2CPUVxYvLK2HaVWNm/U7cPjadaPPSd0eQg4GK+av2y/FPxX8Dfsk/Ezxn8CoPtPjLSvDGqXeixhQzG9htZHh2qcBmDAFVPBIAwelfStFVCVmmKSurH+MP41+JnxM+Ifiy/wDE/xW8Q6tea5dzzSXdxqM7yXLTf3ZHmPy46YGAOlc6NQuJU4vJT/21Nf6+fjD9hv8AYv8AiDrc3ibxz8J/CGrajeM7yXV1ottLNIznLF3aIsTnk5PJr+Ej/g53+APwT/Z5/bC8C6L8DfC+m+ErLU/Cq3dxbaXBHa27Speyxh/IjG3hVUMqIN3Hpn9ryHjOni60cMqVj86zDh2WGpOrz3P5xpdS1CJctdyf99mtXwD8RviN4A8Waf4s+F+t6lpWu2dwr2k9hcOs+8H5cbTz9K/Xb/g35+EXws+PX/BUDwn4C+MugWPibRP7N1S5axv4UngaW2tXkhMkbg+YiMAVDgjcAe1f6Mfg79hj9i34e69B4p8DfCbwhpGpWrK8N1aaLZRTRsv3SjrEGUjsR0rTiHi6ngav1Z076GeWZFLEw9rCdjR/Yx8TfFHxn+yP8M/FvxtiaHxdqXhnS7nV1cFX+2SWsbSlwQCGLcsMDBzwOlfTFfjz/wViv8Agpl4e/4JZfBvRvEFloa+JvGPi6a4t9E06STyrcfZVRpp7lxgiJN6DAK5JwCOlflJ/wAE8f8Ag6K+HXxg1XxN4b/b20/S/h42lWLX+napisebe6KdbPyCZ5fPYcxNkI+3HDHA25Jk2Nr0Vi6VP3PL9EeNPNKFOoqE5an9cNFfwg/HD/g7i+N8/wAUJ1/Zx+HGhweDrecrbtrzXEl/dxIQNzCKaCODzQwKA527iV+av6tf+CZH7f8A4N/4KR/ssab+0J4Y09tGvVuJNO1bTXYP9lvrcKZFVhkMjBlZf7uSh+ZTU5hw7i8LSVatCyYYTNqFeXJSZ+hNFfk5/wAFkP8Agsr+y3/wTP0eDSfiJLJ4g8balaC50/w3p7KJ3TO0SXErZS3iLYUMwLMcBEav5RfG3/B2Z+3bqHiRr/wB4H8Gabhv3drdQ3tzMVbBTfKLqEAj7jBU+VuvHFaZZwzjMXHno09PM4cbnOHw75aj1P8AQdor+XD/AIJ/f8HPP7NfxA8P3+h/tiaevwy8T6ZaSXSywmS40+/WFC0iQHBeOZcY8sl1J/j5UH4fs/8Ag7l1b/hoM2mofDC0T4Wtf/Z1uEnnOsJbCQr9of8A5d922N3lgbe3mZ4rd8I5jKcqcaXM/wCtBPPMIoqXOf230Vh+GPEmieM/DWn+LvDU63WnarbRXlrMv3ZIJ0EkbjODhlIIrmfir8WPht8Dfh9qnxV+LutWnh7w7o0LT3l9eyCOJJF9+pY9FRQWYsQqgsQDXjqLvcvdGvRX8Xf7XH/B2lpOk+I7rwz+xD4Bi1yytnaN9b8SM8MUoQ8vHZwOkiIR9zzHDt/zyFfD3h//AIOxP2/LHVVu/EfgzwVqFkGBeCK3vYTj/nmkq3coDe5U/StaPBOYzhz8ljLqLCxdpH+hLXwv/wAFOjt/4J1fHA9P+KI1v/0ilr86P+CWn/Bf79n7/god4zg+BevaDd+A/iLcRO9rYXEnn2epeSu6X7JcbRyyBjsdRuVcoW6V+iH/AAVEZI/+CcXxwcjp4H1v/wBIpa8j6hVw2KjSrxs7o9D6xCpRc6b0sf5JtvGAWx2xX+s9/wAEomLf8E0PgQx6/wDCEaL/AOkkdfkn/wAGwf7Bmn/s9fswaH+1HqFsV8TfELQ7a7tnMgYJp0kzNFtwCBvKK5r9sP2OPgX4l/Zz/Zv8I/BDxjqFvquqeGrFbW5u7VXWGViWJZFf5gPmxz61+l8fZ/Sr1IYaD1j+p8Zw7lk6UZVprc/i3/4O/vMk8cfArJ/1S2evHGMeRdH+Ffx2aH4Z1bxXrNl4b8O2kl9qN9KtvbW0KF5JZJDtVEUckk8ACv7Fv+Dvls/Fn4HjH3bDWz/5Fsq/Ir/g3P8ACugeMf8AgrZ8PLHxBAt0thbardwLIu8LNa2UrxsD1LIxyGfkdq/R8hxLoZOqy6Rl+bPns3oKpmPsz7Y+Gv8AwbAfEXXvhFp3i/x/8YbXRfEN9Gs50+10w3MdnvHzIJmnh81hk8lEGfxFfqp+yH/wbd/sm/AXxVp/xB+Mur3PxL1fT9s0dvPD9l01JefnMCu7TFT0MpKd1yME/wBGVRTTw28RmnYIijJLHAA9a/LMx41xmIk/Z+6n0R+jYPh3D0Vq7s/MH9o/9gL9lHUP2Rf2gfD3w5+F3g/w34g8U+FdS8OR6paaZZwX8eoXdm0cbyXwj+02pMxDERyqdu/JBJFfxBQ/8G637Rf/AA0F/wAKqk8e+HwP7R+x/bfs0/2f7NvK/aPL/wBbnYQ+3pt4r/UFmmitomuJ2CIgyzMQAAOpJr+cv/gnT/wWU0b9or4la3+zv8bbWDw54jt9Smj0e8P7uC6tZJT5VtK5IV5gn3ZP46/M+AvpJZlkGNrYXL6EXKpvLe3pb/hj9R438D8vzzB0a+Pry9nT+GOzfrf+rHxqP8Ag1C8IDRhff8AC2b/AO37cx/Y9L83zv8Arn9px+tezfCj/g16/Zh8P3v2r4ufEPXfFBVwwt7CKLSo3U9RIwknfn+6u38a/ruor6HGeMGfVo+znV09LHgUOCcvg+aMNT8efhd/wR4/4Jx/B+CO38PfCTRtSYY/f65v1WZz/eMl6ZfXolep/Hb/AIJlfsS/tMfCzS/hB418CaTp+kaDuGlR6FH/AGR9jLxiPiWz8t5RtAAWUuNvAr7torwK3EWMnL2s6jv52PWp5Xh4x5YwVj+Sn4q/8Go/wt1HXJJ/g58Vr7RdNaT5bTU9OW/aNME4WRJLfkYXBcHkkn0r8rv2wP+DZP9q34LaLceNP2ePEdl8SLG3BZ7FIv7P1MhRyYrd5JYZe2FE4c8/KOlf3yUV9Hg/ELNaFP2cZ3Xn/wTyK/DGDqS5nGx/kcfETwn8UPgJ8Up/hV8WtJuvDviPSpoTc2F4nlTR+dGskRKH/aRwQecj2r/AErf+Cf3xs1L9of9jD4afFnW2LalqGiwRXrNktLcWu62lkJ7mR4mb8a/zA/29/CXi34cftz/ABk8K+OYpIdStPGWtmQShg7o97K8TjJ+6YyjJ1yr5OecV/dh/wAG8nxUtviR/wAEpPAunpIHn8K3OpaJcDPIeO7e4UHj/nlcL9DX9FZhSpZrl1HN8LtJK68+58Xlzng8XPA1+jdvQ+jP+Crf7N978aP2Xp/E3he1N1rvgm5GsW6ovzSW2zbdRdhyissg9DjvX+ap8NP2ofGuj/8ABVTR/wBpbxdOy6pZeKoGmJ5K2EAWGBdvP3LeMMAfXNf7OV1aw31pLZXK7o5kaNx6qwwR+Rr/ACfv26f2UpP2GP20fG3wGu1MOl2t7Lc6EjDAk0u+LS24iHPyxZ8tvSvO8NsypzlUwU3ra6/r8jsz+nVpqNWC6H9oN1/wdj/8E9ILiSG18JeOLhFYhXTT7Ja+cv8Ag4g/bV/Zj/4KC/AH4W/Ef9mDWH1KDwv4jvLa7klsrm0kgXULEHyvLuoY2ILQEblBViD1AwOP8HfAD4ufEHwnZ+NvBPhfU9X0m/3/AGe8tLZ5bebymaOTZIODtdWXI4zXyb+25+xR+0j+xfo3gXU/2hNBk0OTxvLqSWUcjRSM0WnC2DH92xChPPVCT6Cv3TL8FRwld1lO0rbH5xiqcq0eWcT+4P8A4Ne/2W7T4C/8E5rf4panaBNX+KF/carc7huItY3+y2qA/wB0rG03+9MfSv6KK+Rf2Lv2fbb9l39l3wT8DoIRFcaNpkCag6jAm1CTMt5Jn+IPcPIQexIr66r8PzzMHi8XUxD6s/QMuw6o0I0+yCiiivMO0KKKKACiiigAooooAKKKKACiiigD/9L+/iiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKK+DP2rP+Cm37Dn7EnjCw+H37TXj218M63qdn9vtrJoLm4le23tGJNtvFJgFkYKDydpwK+Vf+Igv/gkeDg/FmEf9w3Uv/kWu6jleJqR5qdNteSOapjKMNJSS+aP2dr8Mf+Div9pY/s5f8EtvG9npVybfWfHj2/haxCEq5W+cG7xtIb/j0SZRjPzMq4OcV3qf8F/f+CSjqGHxbtQD62Goj/22r+RP/g4+/wCClPwa/b0+LPgPwN+zbr7eIPBPg/Tbi7luFimt45NSupAHISdI9yxRRRqWO0DewFe9w3kVeeOgqsGktdV2PNzXMqUMPJwkr2P5pzEFGAKqvHWq6+lVXUV+9pn5kY7xDNO0nQLrxJrdn4d09DJPfzxW8aKOS0rBFAH41bZBnmvrL9gHxZ8HPh7+238MPiH+0HcfZvBmg6/ZX+qS+S9xiG3PnbisZDHd8pfCN8ueK5cXPlg5JbGuHjeaR/rofAD4cWHwe+BPgz4TaYpS38M6Hp+lxg4BC2ltHCM4AH8PYAV67X4nx/8ABxH/AMEgJMA/F23Td03adqI9v+farg/4OF/+CP3lGVvjHZqBnrYajzj0/wBFr+dZZPjN3Sl9zP1mOMo2spL70fgB/wAF6vDK/svf8F1/2bf2wbZBb6b4rjtNPv5k4Pn2s72krMT8uPs9xCAO++32rn/+ChP7Df7e37Mn/BYH4a/8FKf+Cfei2PjK7u9W0a41bSZntLeSBLGRZGlWS/lhikgmgP8AD5cySKeQ6gn67/4OWP8Agpl/wS2/bg/Y28M6d+zh4/g8R/EDwn4kt9S0+KG1uoXjtnRkurn97BAirj93g/xSrXr37RNhF+11/wAElbbxDroaa58WeArK8dbdz9ne5+zxTcP/AMsvNjr894jqf7DxBk+ZYuDS+DXTVPT80fsXh01jcizPLKUunN+H/AP6iv2RvGMfxE/ZS+GXj6Jt6614U0a+yO/n2UMn9a+hq/ko/wCCT/8AwcKf8E4Ph5/wT5+FXwg/aI8dnw14z8HaFa6BqFlLp97Lzp6/ZopA8MUqkPEiMTkYJIwOleH/APBXX/g6G+HmhfC+3+Ff/BL3WRrXirXBi68ST2csMWmwngJaxXUaGW5kPyhyhjj5xl/ufp74axcsQ6MYaXte2n3n4r/alCNPnclseIf8HFHwY1X/AIJoftx/Dv8A4K7/ALNZisf+Esvn0zxVpeQsV5crExdmjGN6XduWEo/56IG+8wx7R+2v8CNJ/by/Zw+HX/BQD9h+6XR/iR4Jgt/FnhSa2VIvtGzy55LOVvLG5kZGRF4BkBU8Gvz68P8A7En/AATP8UeF9L+JH/BUb9pmf4j/ABC1CNb7UoLnxJ51taSzAPJbIq+awKN8rsXVXHCgCv1h+EH/AAUM/wCCUHwm0nwt+zx8CPiRolpZQNHpWk2Nos5RCf8AV5l8nuT1J61/Lnixxf7TGYbHZHSm61Baz5bJx6fdt6dD+pPDbhadPBVsDm9SKpVFpG+3f+kfrx/wST/4K+fs/wD/AAVG+ClrrHh68h0X4i6RCkPiTwxO6rcW10igSyW6k5mtWbJR1ztGFfB6/rwzKi7mOAK/jP8A2+P+CQv7IHx/1qT46tc6n8LPF8R3za74XiYeb6yXFvbxguf+moIPrX5ceFP+CT/wT+KF3JoviX9u241iBDsks21ELKMdjDd3n7v8q+8yLxj4czCm6jnKlL+Xlvb0aa/I/P8AO/BvOsJNKhFVIdHex/o4xXdpO2yCVHPopB/lViv4FV/4N6vg6LNbr9nP9pjXbfxIq/6JK97bOjSfW2YS18k+Cv8AgpN/wVn/AOCIn7Ttt8Dv2mPE0/xD8NJsum03Vrxr63vdLZtonsbqY+bbvw2AWCq4y8ZTivvOGM4y3OpujltVua+zKPL92rR8JxNw3mWTwVXG0vcfWLvb5WTP9KCivwJ+Gf8Awcr/APBKfxx4LsvEninxje+Fb+dF+0abfaZeSyQS4+ZPMtYpYXCsCu9Wwcdq9DH/AAcRf8Eiz/zVLH/cK1If+21e7LJMYtHSl9zPnFmOH/nR+2dFfiqv/Bwx/wAEkHGV+Ka/+CvUv/kak/4iGf8AgkhnH/C0h/4KtS/+Rqn+x8X/AM+n9zD+0KH86+9H7V0V+Kx/4OF/+CR68N8VFH/cL1L/AORqG/4OF/8Agkgrbf8AhaQ9P+QVqfBzjH/Hr1o/sbF/8+pfcx/X6H86+9H7U0V+LH/EQp/wSTxkfFIf+CvUv/kamf8AEQv/AMEkhwfijj/uFal/8jUf2Pi/+fT+5i/tCh/OvvR+1VFfik3/AAcN/wDBI9DhvikP/BVqX/yNR/xEOf8ABI3/AKKmB/3CtT/+RaP7Gxf/AD6l9zH9fofzr70ftbRX4vJ/wcHf8EkXAK/FaPH/AGDNS6YJz/x69MA02X/g4R/4JHxHB+K0Z+mmal/8jUv7Hxf/AD6f3Mf16h/OvvR+zV5aW1/aS2F4iyQzIY3RhlWVhggj0I4xX+N7+1j8K5fgX+1V8SPgvOR/xS/ibUdLGBhWjt7iVRx/1zVa/wBJmT/g4i/4JExkA/FQf+CrU/8A5Fr+DT/gs18Z/wBnX9o3/gob41+OX7L+ptrHhjxItpc/amgktt90IIobkKsqRsF81eSw27mO5XbaK+74DoYihiJRqU2k12tsfLcUTpVKUJQktOx+XtFFFfqh8UMkUbD78V/oqf8ABqd8bk+IP/BOTUPhHe3Rmvvh94lvLQR5yI7S/C3kOPQGV5+OgxwSOa/zrz83Br9/v+Deb/go98K/+CfP7Sfiy3/aB1iTSPA3jbSViuZxFJOsN7YO0ltKY4VdzlHljHyhgHA2gR7U+Y4wwLxOBkqau46nucP4pUsTZ7bH+mBRX4rj/g4V/wCCSJXcPimnH/UM1H/5Gpv/ABEL/wDBJPOP+For/wCCzUP/AJHr8Y/sbF/8+pfcz9A/tCh/OvvR+1VFfmb+zf8A8Fg/+Cd/7WfxUs/gn8CviFDq/ibUEle2sns7y2MvkKXdVeeFI94VWIQsGIU4HFfplXHWw86T5akbP7jqhOMleIUUUViUFFFFABRRRQAUUUUAFFFFABRRRQB//9P+/iiiigAooooAKKKKACiiigAooooAKKKKACiiigAoor8w/wDgsZ+1e37G/wDwTv8AiH8VtMuBba3eWX9iaOd21vt2pn7NG6YZTuiVmlGDn5OPStsPQlUnGnHd6EVJqMXJ9D/PJ/4LG/tQSftgf8FHfiP8TrC4Fzo9hf8A9g6QyAmP+z9M/wBHjZWbIw7b5lCMqM7tuFfmQygEUzzt2FVt+CST1JJ5NEtxBt3s3y9Py/8A1V/SOFwkKVFUafRWPx+viPaTdRkLj5fpVZxxmrjDtUBXsa6TIpOO4qq646dKvsuOvSoGT8qcXYDNdKqPHmtR04qpIoAye1bIDEliSRd4UD6V+l/7Bn/BID9pj9v+2PjTRbyy8HeCI5PLfW9TZV86T/p2iA/efoPevzUuJIznOBXPX/2m4gWA3Unlp/Csj7K+c4iwGYYnCOnl1WNKfeSv+B7uQY3BYfExq46k50+17fif1u+F/wDg12+BVhrEF38WPjTd6np0bo0trYpaWhl/6Z+Y27H5V/Sh4R0HwZ8I/AWieE/CEaReGtEs4tNtgjeaiW0CeUBn2Ar/ACsZNFt584mc4/2n/wAK/S//AIJrf8FPvjP/AME2/Gktnp4fxP4B1R86nodxJuGQP9ZbY/1Uv+TX8f8Aip9HribNaEcTUx/1icPhhbl/8B038j+p/DTxy4ewFV4WOD9jCe70/Gy+47f/AIKmf8EwPj5+yr+0X4p+IfgLwpe698MvEl/Pqek6jpVvJcxWsV3J5otpfKH7ow79o9e1fkNJfNbbrPUIJrYr/wA9I3Sv9BHXv2jdD/as/Z3vv2kf+CWvxah8OeM9BtH1e78LX5ikguhDH5stldWM33eN+Jof/wBX5W/CX/g52sNX0+LTv2tvgzpur3AG2a80YoFb/t2uBP8A+hV9R4feLHEjy/6pSwXtnR0evLJeq1T9VueRx/4ccORxaxP1r2Kq6pWvH5PZen3H8nEMfh+/3TyDeffFak3hzT7yMJtK4bcpUfcFf18fEj4pf8G/P/BUTQpdFeaP4NfEG6X/AEPVJdP/ALMKT/8ATWSHNvLH9SK/mH+M/wAHvEP7PfxW1z4ReIL2y1eXRrny4rzT5Y57S5t/+WdxFJF/z2jr9s4E8SFm03ha+HnQrR+zNflsfjXGnAc8pUa9KsqlN/C0/wBNl8j9Rf2QP+C9v7c37L2jWPgjx4LH4k+G7JfKji1cSC/SPtHFdQ8/9/Qa+Tf+Ck37RvwJ/bb/AGgrT9oT4O+Cp/BGoanp8aa9alozBPeQvj7TH5Y/55YH4V8PEQyHJkFaC3EQAW1K9f8APStss8LMlwWZLNsJS5Jvfl+F+iObM/EvNsXgf7PxVXng+/T5mTpmhXWnTpeafcTW00f3Hid467q81PxDr92uqeKtRutVuI02JLeSSTP5f/PP97WdA6tgJg/5/wDrVe+XhT29q+8jhqKl7RR94+IWKm48kpe6PSOTA/8ArVpIgHSmxrk1ZXArpbZzkig9qnHApqLxgVKqjvUAIFJ6U8IBS5AGfSo4rhH5U4K8Y9KLATdqQinYOOlGKAISrfWo8AdKscUwlD1osBHjIqEgjrVgr6UzjoaAK5UEVCU29KslfSmZBpgQe9FTFR6UBF9KQDEXNS0VIq9zQA8DirSgZ4qBRk/SpgQOfSgD6B/ZN+Nuu/sy/tNeBfj54fO248J65Y3x25+eMSo06OyvGzLKnyEIpUg8jFf6/wB4J8YaD8QvBmkePfC0wudM1uygv7SUdHguI1kjb8VYV/jAyyRhMMeor/T3/wCDe748R/Hb/glf8PTcXJudR8Jfa/Dl3n+H7DO32dRyx2i1eEDJ7e1fmviHgP3VLEdtD7HhPGXbon7X0UUV+Un24UUUUAFFFFABRRRQAUUUUAFFFFAH/9T+/iiiigAooooAKKKKACiiigAooooAKKKKACiiigArgPiR8Kfhh8Y/Dn/CH/Fvw7pnifSfMWX7HqtpDeQeYuQr+XMrLuGTg4yK7+imnbYLHxdJ/wAE4f8Agn5K26T4I+BSf+wBp/8A8Zqq3/BNT/gnk/3vgd4F4/6gGn//ABmvtuiulY2t/O/vMvYw7I/gk/4OkfhP+y78A9e+Efws+AXgDw/4Q1O8g1LVdQk0Wwhs2kg3QW8KyJbIoP3ZdpdTkAouDiv5LGVj96v3l/4OFviD8V/2hf8AgqH4w+y+G9WbSfBdva+GdNcWjmN4rHM8zqwU5EtxLNgj+HFfiD/wg3xKUkSeGdVXHrZXH/xFfvXC+HdLA01Ul5/efmmdVHLEztt/kckUwKiKD6V2J8A/EJolz4d1UE9P9EnH4fcpr+AviN90eHNU/Czn/wDjde57SJ5PI+x5/cq0cOBzxX+oh/wTB/4Jhfsg+Ef2BfhVD8UvhP4V1jxLqHh+11LUrvU9Htbi6ee/QXDCR7iN5MqrhNpPG3GK/wA4b4A/s2fF74y/Hnwb8KdK8Maxu13WrGyytlKAqyTBGO5lAVE5ZieABmv9iLR9LtND0m10XT12wWcKQRj0SNQqjj2Ffm3iJmDjGlQpy8z6/hTD3lOpJeR8i/8ADuj9gH/oiXgX/wAJ/Tv/AIxVdv8Agm//AME+X+98D/An/hP6d/8AGK+06K/MPrlX+Z/efZ+xh2Piv/h27/wT4xj/AIUf4E7f8y/p3YYH/LD0rP1D/gmR/wAE6NUt3tL/AOBfgOSNxhh/wj+nj+UIr7koqvr1b+d/eHsYdj+Mb/gpz/was+BvEq6p8dv+CZt5J4T8SiPc3hGW4KafccBdljcswa1O3P7qVnhP3QEHFfVP/BF3/glx+zF8Sf8Agn1pXhD9uL9nHQ9O+IXhnU77RtUk1rSFi1K4MDpLFOZ2USlTHIqK0b+WQnyErX9SFFetV4lxVTDqhUle2z6+nockctpRqe0SPw6+JX/BuT/wSB+JFkbdfhTF4fmOcXGjX15ayLn0BlePHtsxX8/v7av/AAaWePfAV7H8QP2CvFB8XWNtMssvhrxI0MF6Yw6EpBeosUEvC4xIITj+NjxX949FGA4ox2HlzQqN+T1RNfKcPU+KCPg7Qv8Agml/wT3/ALFtDdfAbwLbSmFC8J0KwcxsVG5d3knOOme+K0ZP+CZ3/BOyX/W/AzwIf+4Bp/8A8Zr7goryHjK2/M/vOz2EOyPh9f8Agmd/wTsXlfgZ4EH/AHANP/8AjNTD/gmr/wAE8h0+B3gT/wAJ/T//AIzX21RT+vVv5394ewh2R8VL/wAE3P8AgnwgYL8EfA2G6/8AEhsPYf8APH2H5VXb/gmj/wAE72+98DfAh/7gGn//ABmvt2il9drfzv7w9hDsj4k/4dqf8E8R0+B3gT/wn9P/APjNSj/gm1/wT2Xp8D/Av/gg0/8A+M19rUU/rtb+d/eHsIfyo+Kx/wAE3v8AgnyOR8EfAv8A4INP/wDjNRP/AME1/wDgnpI+9/gf4FJwR/yANP6HGf8Alj7Cvtmij69W/nf3h7Cn/Kj4kP8AwTU/4J4t1+B3gT/wQaf/APGakH/BNr/gnsowvwQ8Cj/uAaf/APGa+16KX12t/O/vF9Xp/wAq+4+J/wDh2v8A8E9P+iHeBP8Awn9P/wDjNM/4dqf8E8f+iG+BP/Cf0/8A+M19t0U/r1b+d/eP6vT/AJUfFQ/4Jt/8E91IK/BDwKNvTGgaeO2P+ePpQf8Agm5/wT4br8EPAv8A4INP/wDjNfatFL67W/nf3h7CHZHxQv8AwTa/4J7Kcr8D/Aoz/wBQDT//AIzXxB/wUn/4JZfsbeLP2EPitZ/Cf4Q+FtJ8UW3hy9vtKu9K0q0srtLqyiNxEI5oUjcZMe3AYZzxg4x+21V7u0tr+0lsbyNZYZkMbowyrKwwQR0II4xWlDMK1OampPQiphaco8rSP8U213vCPOHzDg/UcVY2Cvp79rv9nLx9+z3+1L8Rfg/LoOoND4f8Q39pA6W06LLDDcuqNHuUoqSJ8yspwQeK+d20PxUELto2oBR3+yzY/wDQK/pKnWhOKlHY/H3Fx92XQywoXpUoTj0raPhrxXjjSL7Pp9lm/wDjdQHw54t3YbRdQH+7bTH+S1SlEdj+lz/g2F0H9lv4r/tE/ED4AftIeB/D/iu/1nSbbUtEfWrKG98t7J5DcRRLPCVRnjlEhKt0iP8AFur+2g/8E3f+CfJ6/BHwMf8AuAaf/wDGa/zG/wDgmv8AFT4k/ssft4/C3426XouqGDS9ct4b2OK1ZvMsbkm1uF4AP+okYj3Ar/W2Vgyhl6GvxzjujUoYxSjLSS/LQ/QOGZqeG5ZR2PitP+Cbf/BPeM5T4IeBh9NAsP8A4zX0P8KPgn8HvgT4ek8JfBTwtpPhLS5ZmuJLTSLOGyhaVgA0jJCqKWIABJGeK9Por4adeclaTPpI04rZBRRRWRYUUUUAFFFFABRRRQAUUUUAFFFFAH//1f7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q==";
  
  // === CAMERA FUNCTIONS (v7) ===
  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraSupported(false);
        setCameraError('Camera not supported');
        return;
      }
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 }
        }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      if (capabilities.torch) setHasFlash(true);
      setCameraStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraError(null);
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError(err.message);
      setCameraSupported(false);
    }
  };
  
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  };
  
  const toggleFlash = async () => {
    if (cameraStream && hasFlash) {
      const track = cameraStream.getVideoTracks()[0];
      try {
        await track.applyConstraints({ advanced: [{ torch: !flashEnabled }] });
        setFlashEnabled(!flashEnabled);
      } catch (err) {
        console.error('Flash error:', err);
      }
    }
  };
  
  const flipCamera = async () => {
    stopCamera();
    setFacingMode(facingMode === 'user' ? 'environment' : 'user');
  };
  
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedPhoto(imageData);
  };
  
  const savePhoto = () => {
    if (!capturedPhoto || !selectedChicken) return;
    const photoData = {
      id: Date.now(),
      data: capturedPhoto,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };
    setFlock(prev => prev.map(chicken => 
      chicken.id === selectedChicken.id
        ? { ...chicken, photos: [...(chicken.photos || []), photoData], totalPhotos: (chicken.totalPhotos || 0) + 1 }
        : chicken
    ));
    setCapturedPhoto(null);
    setShowCamera(false);
    stopCamera();
  };
  
  const retakePhoto = () => setCapturedPhoto(null);
  const closeCamera = () => { setShowCamera(false); setCapturedPhoto(null); stopCamera(); };
  const openCamera = (chicken) => { setSelectedChicken(chicken); setShowCamera(true); };

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
  

  // Camera lifecycle
  useEffect(() => {
    if (showCamera && cameraSupported) {
      startCamera();
    }
    return () => {
      if (showCamera) stopCamera();
    };
  }, [showCamera, facingMode]);

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
  

  // === CAMERA COMPONENT (v7) ===
  if (showCamera) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: colors.navyDark, zIndex: 9999, display: 'flex', flexDirection: 'column' }}>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        {/* Header */}
        <div style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.5)' }}>
          <button onClick={closeCamera} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '28px', cursor: 'pointer' }}>✕</button>
          <div style={{ color: 'white', fontSize: '18px', fontWeight: '600' }}>{selectedChicken?.name}</div>
          <div style={{ width: '28px' }} />
        </div>
        
        {/* Camera/Photo View */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          {!capturedPhoto ? (
            <>
              {cameraSupported && !cameraError ? (
                <>
                  <video ref={videoRef} autoPlay={true} playsInline={true} muted={true} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr 1fr', opacity: 0.2 }}>
                    {[...Array(9)].map((_, i) => <div key={i} style={{ border: '1px solid white' }} />)}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', color: 'white', padding: '40px' }}>
                  <div style={{ fontSize: '60px', marginBottom: '20px' }}>📷</div>
                  <p>Camera not available</p>
                  <p style={{ fontSize: '14px', color: '#ccc', marginTop: '10px' }}>{cameraError || 'Using file upload instead'}</p>
                  <input ref={photoInputRef} type="file" accept="image/*" capture="environment" onChange={(e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => { const photoData = { id: Date.now(), data: ev.target.result, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() }; setFlock(prev => prev.map(chicken => chicken.id === selectedChicken.id ? { ...chicken, photos: [...(chicken.photos || []), photoData], totalPhotos: (chicken.totalPhotos || 0) + 1 } : chicken)); setShowCamera(false); }; reader.readAsDataURL(file); } e.target.value = ''; }} style={{ display: 'none' }} />
                  <button onClick={() => photoInputRef.current?.click()} style={{ marginTop: '30px', background: colors.redAccent, color: 'white', padding: '15px 40px', border: 'none', borderRadius: '25px', fontSize: '18px', fontWeight: '600', cursor: 'pointer' }}>Choose Photo</button>
                </div>
              )}
            </>
          ) : (
            <img src={capturedPhoto} alt="Captured" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          )}
        </div>
        
        {/* Controls */}
        <div style={{ padding: '30px 20px', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          {!capturedPhoto ? (
            <>
              <button onClick={toggleFlash} disabled={!hasFlash} style={{ background: flashEnabled ? colors.gold : 'transparent', border: '2px solid white', borderRadius: '50%', width: '50px', height: '50px', fontSize: '24px', cursor: hasFlash ? 'pointer' : 'not-allowed', opacity: hasFlash ? 1 : 0.3 }}>⚡</button>
              <button onClick={capturePhoto} style={{ background: 'white', border: `4px solid ${colors.redAccent}`, borderRadius: '50%', width: '70px', height: '70px', cursor: 'pointer' }} />
              <button onClick={flipCamera} style={{ background: 'transparent', border: '2px solid white', borderRadius: '50%', width: '50px', height: '50px', fontSize: '24px', cursor: 'pointer' }}>🔄</button>
            </>
          ) : (
            <>
              <button onClick={retakePhoto} style={{ background: 'transparent', color: 'white', border: '2px solid white', borderRadius: '25px', padding: '12px 30px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>↻ Retake</button>
              <button onClick={savePhoto} style={{ background: colors.redAccent, color: 'white', border: 'none', borderRadius: '25px', padding: '12px 30px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>✓ Save Photo</button>
            </>
          )}
        </div>
      </div>
    );
  }


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
            📷 Take Photo
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
