import React, { useState } from 'react'
import { Twitter, Facebook, Linkedin, Link2, Check } from 'lucide-react'

/**
 * ShareButtons Component
 * Social media share buttons and copy link functionality
 */
function ShareButtons({ article, className = '' }) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/article/${article?.id}`
    : ''
  const shareTitle = article?.title || ''
  const shareText = article?.summary || ''

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400')
  }

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400')
  }

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const buttonBaseClass = 'p-md rounded-medium bg-surface-secondary hover:bg-surface-tertiary text-on-surface-variant hover:text-on-surface transition-colors'

  return (
    <div className={`flex items-center gap-md ${className}`}>
      <span className="text-label-md text-on-surface-variant mr-sm">Share:</span>

      <button
        onClick={handleTwitterShare}
        className={buttonBaseClass}
        aria-label="Share on Twitter"
        title="Share on Twitter"
      >
        <Twitter size={18} />
      </button>

      <button
        onClick={handleFacebookShare}
        className={buttonBaseClass}
        aria-label="Share on Facebook"
        title="Share on Facebook"
      >
        <Facebook size={18} />
      </button>

      <button
        onClick={handleLinkedInShare}
        className={buttonBaseClass}
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <Linkedin size={18} />
      </button>

      <button
        onClick={handleCopyLink}
        className={`${buttonBaseClass} ${copied ? 'bg-primary text-on-primary' : ''}`}
        aria-label={copied ? 'Link copied' : 'Copy link'}
        title={copied ? 'Link copied!' : 'Copy link'}
      >
        {copied ? <Check size={18} /> : <Link2 size={18} />}
      </button>
    </div>
  )
}

export default ShareButtons
