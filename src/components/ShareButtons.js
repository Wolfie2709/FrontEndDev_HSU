"use client"

import { useState } from "react"

function ShareButtons({ recipe }) {
  const [showCopyMessage, setShowCopyMessage] = useState(false)

  const shareUrl = `${window.location.origin}/recipe/${recipe.id}`
  const shareText = `Check out this amazing recipe: ${recipe.title}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setShowCopyMessage(true)
      setTimeout(() => setShowCopyMessage(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setShowCopyMessage(true)
      setTimeout(() => setShowCopyMessage(false), 2000)
    }
  }

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, "_blank", "width=550,height=420")
  }

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(facebookUrl, "_blank", "width=550,height=420")
  }

  return (
    <div className="share-buttons">
      <h4>Share this recipe:</h4>
      <div className="share-buttons-container">
        <button className="share-btn twitter-btn" onClick={handleTwitterShare} title="Share on Twitter">
          🐦 Twitter
        </button>

        <button className="share-btn facebook-btn" onClick={handleFacebookShare} title="Share on Facebook">
          📘 Facebook
        </button>

        <button className="share-btn copy-btn" onClick={handleCopyLink} title="Copy Link">
          🔗 Copy Link
        </button>
      </div>

      {showCopyMessage && <div className="copy-message">✅ Link copied to clipboard!</div>}
    </div>
  )
}

export default ShareButtons
