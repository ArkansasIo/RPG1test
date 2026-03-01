"use strict";
function cout(message, level) {
  if (level === 2) console.error("[GB]", message);
  else if (level === 1) console.warn("[GB]", message);
  else console.log("[GB]", message);
}
function findValue(key) {
  try {
    var v = localStorage.getItem(key);
    if (v !== null) return JSON.parse(v);
  } catch (e) {
    var s = localStorage.getItem(key);
    if (s !== null) return s;
  }
  return null;
}
function setValue(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch (e) { console.error("localStorage save failed:", e.message); }
}
function deleteValue(key) { localStorage.removeItem(key); }

var audioUnlocked = false;
function ensureAudioContext() {
  if (typeof XAudioJSWebAudioContextHandle !== "undefined" && XAudioJSWebAudioContextHandle) {
    if (XAudioJSWebAudioContextHandle.state === "suspended") {
      XAudioJSWebAudioContextHandle.resume().then(function() {
        console.log("[GB] AudioContext resumed successfully");
        audioUnlocked = true;
      });
    } else {
      audioUnlocked = true;
    }
  }
  try {
    if (!window._gbAudioCtxPrewarm) {
      window._gbAudioCtxPrewarm = new (window.AudioContext || window.webkitAudioContext)();
      window._gbAudioCtxPrewarm.resume();
    }
  } catch(e) {}
}

function unlockAudioOnInteraction() {
  ensureAudioContext();
}

["click", "touchstart", "keydown"].forEach(function(evt) {
  document.addEventListener(evt, unlockAudioOnInteraction, { once: false, passive: true });
});
