"use client"

import { useEffect, useState } from "react"

interface ShareRoomModalProps {
  onClose: () => void
}

export default function ShareRoomModal({
  onClose,
}: ShareRoomModalProps) {

  const [inviteUrl, setInviteUrl] = useState("");
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    const inviteUrl = window.location.href;
    const roomId = inviteUrl.split('/').pop() || "";
    setRoomId(roomId);
    setInviteUrl(inviteUrl);
    setQrCodeUrl(generateQrCodeUrl(inviteUrl));
  }, [])

  
  const generateQrCodeUrl = (inviteUrl : string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inviteUrl)}`
  }

  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const handleDownloadQR = () => {
    const link = document.createElement('a')
    link.href = qrCodeUrl;
    link.download = `room-${roomId}-qr.png`
    link.click()
  }
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Share Room</h2>
          <button
            onClick={onClose}
            className="text-2xl text-muted-foreground transition-colors hover:text-foreground"
          >
            X
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Invite Link</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inviteUrl}
              readOnly
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
            <button
              onClick={handleCopyLink}
              className={`rounded-lg px-4 py-2 cursor-pointer font-medium transition-colors ${
                copied ? 'bg-primary/20 text-primary' : 'bg-primary text-primary-foreground hover:opacity-90'
              }`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Room ID</label>
          <div className="inline-block rounded-lg bg-primary/10 px-4 py-2 text-lg font-bold text-primary">
            {roomId}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">QR Code</label>
          <div className="flex justify-center rounded-lg border border-border bg-background p-4">
            {
              qrCodeUrl ? (
                <img src={qrCodeUrl} alt="Invite QR Code" className="h-48 w-48" />
              )
              : (
                <div className="flex h-48 w-48 items-center justify-center text-sm text-muted-foreground">
                  Generating QR Code...
                </div>
              )
            }
          </div>
        </div>

        <button
          onClick={handleDownloadQR}
          className="w-full cursor-pointer rounded-lg border border-primary bg-primary/10 px-4 py-2 font-medium text-primary transition-colors hover:bg-primary/20"
        >
          Download QR Code
        </button>
      </div>
    </div>
  )
}
