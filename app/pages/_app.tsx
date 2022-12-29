import type { AppProps } from "next/app"
import "@rainbow-me/rainbowkit/styles.css"
import "tailwindcss/tailwind.css"

import Head from "app/head"
import { Button } from "components"
import merge from "lodash.merge"
import Image from "next/image"
import Link from "next/link"
import logo from "public/logo.svg"
import { Fragment, useState } from "react"
import { configureChains, createClient, WagmiConfig } from "wagmi"
import { polygon } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public"

import { Dialog, Menu, Transition } from "@headlessui/react"
import {
  Bars3BottomLeftIcon,
  BellIcon,
  ChartBarSquareIcon,
  XMarkIcon
} from "@heroicons/react/24/outline"
import { Manrope } from "@next/font/google"
import {
  ConnectButton,
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
  Theme
} from "@rainbow-me/rainbowkit"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope"
})

const { chains, provider } = configureChains([polygon], [publicProvider()])

const { connectors } = getDefaultWallets({
  appName: "OpenPeer",
  chains
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

const myTheme = merge(lightTheme(), {
  fonts: {
    body: manrope.style.fontFamily
  }
}) as Theme

const navigation = [{ name: "P2P", href: "/", icon: ChartBarSquareIcon }]

const NavItems = ({ selected }: { selected: string | undefined }) => {
  return (
    <div>
      {navigation.map((item) => (
        <a
          key={item.name}
          href={item.href}
          className={`text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-8 text-base font-medium rounded-md ${
            selected === item.name && "marcos"
          }`}
        >
          <item.icon
            className="text-gray-400 group-hover:text-gray-300 flex-shrink-0 h-6 w-6 mr-2"
            aria-hidden="true"
          />
          {item.name}
        </a>
      ))}
    </div>
  )
}

const App = ({ Component, pageProps }: AppProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { title } = pageProps

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={myTheme}>
        <Head />
        <div className={`${manrope.variable} font-sans`}>
          <div>
            <Transition.Root show={sidebarOpen} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-40 md:hidden"
                onClose={setSidebarOpen}
              >
                <Transition.Child
                  as={Fragment}
                  enter="transition-opacity ease-linear duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity ease-linear duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                </Transition.Child>

                <div className="fixed inset-0 z-40 flex">
                  <Transition.Child
                    as={Fragment}
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="-translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in-out duration-300 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"
                  >
                    <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-black pt-5 pb-4">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                          <button
                            type="button"
                            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setSidebarOpen(false)}
                          >
                            <span className="sr-only">Close sidebar</span>
                            <XMarkIcon
                              className="h-6 w-6 text-white"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </Transition.Child>
                      <div className="flex flex-shrink-0 items-center px-4">
                        <Image
                          src={logo}
                          alt="openpeer logo"
                          className="h-8 w-auto"
                          width={104}
                          height={23}
                        />
                      </div>
                      <div className="mt-5 h-0 flex-1 overflow-y-auto">
                        <nav className="space-y-1 px-2">
                          <NavItems selected={title} />
                        </nav>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                  <div className="w-14 flex-shrink-0" aria-hidden="true">
                    {/* Dummy element to force sidebar to shrink to fit close icon */}
                  </div>
                </div>
              </Dialog>
            </Transition.Root>

            {/* Static sidebar for desktop */}
            <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex min-h-0 flex-1 flex-col bg-black">
                <div className="flex h-16 flex-shrink-0 items-center px-4">
                  <Image
                    src={logo}
                    alt="openpeer logo"
                    className="h-8 w-auto"
                    width={104}
                    height={23}
                  />
                </div>
                <div className="flex flex-1 flex-col overflow-y-auto">
                  <nav className="flex-1 space-y-1 px-2 py-4">
                    <NavItems selected={title} />
                  </nav>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:pl-64">
              <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
                <button
                  type="button"
                  className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                <div className="flex flex-1 justify-between px-4">
                  <div className="flex flex-1 items-center">
                    <h3 className="text-3xl font-bold uppercase max-w-7xl sm:px-6 md:px-8">
                      {title}
                    </h3>
                  </div>
                  <div className="flex flex-1 items-center">
                    <Link href="/sell">
                      <Button title="Sell Crypto" />
                    </Link>
                  </div>
                  <div className="ml-4 flex items-center md:ml-6">
                    <button
                      type="button"
                      className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <ConnectButton showBalance={false} />
                    </Menu>
                  </div>
                </div>
              </div>

              <main className="flex-1 bg-slate-50 min-h-screen">
                <Component {...pageProps} />
              </main>
            </div>
          </div>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App
