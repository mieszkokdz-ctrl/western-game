// STUN alone often fails to connect two phones on cellular data, since mobile
// carriers commonly use NAT that blocks direct peer-to-peer connections. TURN
// relays the media through a server instead when a direct path can't be
// found. These are the widely-published, free, no-signup-required credentials
// for the Open Relay Project (openrelay.metered.ca) — the standard fallback
// used across public WebRTC examples when no dedicated TURN server exists.
export const LIVE_ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'turn:openrelay.metered.ca:80', username: 'openrelayproject', credential: 'openrelayproject' },
  { urls: 'turn:openrelay.metered.ca:443', username: 'openrelayproject', credential: 'openrelayproject' },
  {
    urls: 'turn:openrelay.metered.ca:443?transport=tcp',
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
];
