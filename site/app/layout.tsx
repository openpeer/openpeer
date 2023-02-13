import "./globals.css"

import Image from "next/image"

import logo from "../public/logo.svg"
import twitterLogo from "../public/twitter.svg"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <div className="container mx-auto px-4">{children}</div>
        {/* Footer */}
        <div className="bg-black text-white">
          <div className="container mx-auto p-12 flex flex-col md:flex-row md:justify-between">
            <div className="flex flex-col items-center md:items-start">
              <a className="text-3xl font-bold leading-none" href="#">
                <Image src={logo} alt="openpeer logo" width={132} height={51} />
              </a>
              <p className="w-80 mt-8">
                OpenPeer is a completely decentralized P2P on/off ramp for emerging
                markets.
              </p>
            </div>
            <div className="flex content-center mt-8 md:mt-0 justify-center md:justify-start">
              <a href="" className="px-2">
                Docs
              </a>
              <a href="" className="px-2">
                FAQ
              </a>
              <a href="" className="px-2">
                <Image src={twitterLogo} alt="openpeer logo" width={20} height={20} />
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
