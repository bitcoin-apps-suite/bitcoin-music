'use client'

// Wrapper for Tone.js with proper dynamic imports
// This ensures Tone.js is only loaded in the browser

let ToneLib: any = null

export async function getTone() {
  if (typeof window === 'undefined') {
    return null
  }
  
  if (!ToneLib) {
    try {
      // Dynamic import only in browser environment
      ToneLib = await import('tone')
    } catch (error) {
      console.error('Failed to load Tone.js:', error)
      return null
    }
  }
  
  return ToneLib
}

export async function initializeTone() {
  const Tone = await getTone()
  if (!Tone) return false
  
  try {
    await Tone.start()
    console.log('Tone.js audio context started')
    return true
  } catch (error) {
    console.error('Failed to start audio context:', error)
    return false
  }
}