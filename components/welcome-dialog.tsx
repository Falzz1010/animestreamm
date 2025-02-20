'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { X, User } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  FaDiscord,
  FaInstagram,
  FaLinkedin,
  FaFacebook,
  FaTelegram,
  FaGithub,
} from 'react-icons/fa'

export function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(true)

  const socialLinks = [
    {
      name: 'Discord',
      icon: <FaDiscord size={20} />,
      url: 'https://discord.gg/yourdiscord',
      color: 'bg-[#5865F2] hover:bg-[#4752C4]',
    },
    {
      name: 'Instagram',
      icon: <FaInstagram size={20} />,
      url: 'https://instagram.com/youraccount',
      color: 'bg-[#E4405F] hover:bg-[#D32D4B]',
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedin size={20} />,
      url: 'https://linkedin.com/in/yourprofile',
      color: 'bg-[#0A66C2] hover:bg-[#084D93]',
    },
    {
      name: 'Facebook',
      icon: <FaFacebook size={20} />,
      url: 'https://facebook.com/yourpage',
      color: 'bg-[#1877F2] hover:bg-[#1364D3]',
    },
    {
      name: 'Telegram',
      icon: <FaTelegram size={20} />,
      url: 'https://t.me/yourchannel',
      color: 'bg-[#26A5E4] hover:bg-[#1E96D1]',
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] max-w-[260px] mx-auto p-4 sm:p-6">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-2 sm:right-4 top-2 sm:top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        <DialogHeader className="space-y-1 sm:space-y-2">
          <DialogTitle className="text-lg sm:text-xl">Welcome to Anime List! 🎉</DialogTitle>
          <DialogDescription className="text-sm">
            Discover, track, and share your favorite anime with our community.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
          <div className="flex flex-col items-center space-y-4">
            <Image
              src="/assets/img.jpg"
              alt="Welcome Banner"
              width={350}
              height={200}
              className="rounded-lg w-full h-auto"
            />
            <p className="text-center text-sm text-muted-foreground">
              Join thousands of anime fans and start tracking your watchlist
              today!
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-sm sm:text-base">Features:</h4>
            <ul className="list-disc pl-4 sm:pl-5 text-xs sm:text-sm text-muted-foreground">
              <li>Track your watching progress</li>
              <li>Get personalized recommendations</li>
              <li>Join discussions with other fans</li>
              <li>Stay updated with new releases</li>
            </ul>
          </div>
          <div className="pt-1 sm:pt-2">
            <a
              href="https://www.naufalrizkyp.my.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                size="lg"
              >
                <User className="mr-2 h-5 w-5" />
                Visit My Portfolio
              </Button>
            </a>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-medium text-sm sm:text-base">Follow Us:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    className={`w-full ${social.color} text-white p-2 sm:p-3`}
                    variant="ghost"
                  >
                    {social.icon}
                    <span className="sr-only">{social.name}</span>
                  </Button>
                </a>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
