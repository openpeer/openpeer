import './globals.css';
import Image, { StaticImageData } from 'next/image';
import logo from '../public/logo.svg';
import twitterLogo from '../public/twitter.svg';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <div className="container mx-auto">{children}</div>
        {/* Footer */}
        <div className="bg-black text-white">
          <div className="container mx-auto p-10 flex justify-between">
            <div className='flex flex-col'>
              <a className="text-3xl font-bold leading-none" href="#">
                <Image src={logo} alt="openpeer logo" width={132} height={51} />
              </a>
              <p className="w-80 mt-8">
                OpenPeer is a completely decentralized P2P on/off ramp for emerging markets.
              </p>
              <a href="" className='bg-[#A790F7] w-40 rounded-md p-2 text-center mt-8'>
                Launch App
              </a>
            </div>
            <div className="flex">
              <a href="" className="px-2">Docs</a>
              <a href="" className="px-2">FAQ</a>
              <a href="" className="px-2">
                <Image src={twitterLogo} alt="openpeer logo" width={24} height={24} />
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
