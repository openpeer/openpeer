'use client';
import Image, { StaticImageData } from 'next/image';
import { useState } from 'react';

import { Manrope } from '@next/font/google';

import arrows from '../public/arrows.svg';
import lock from '../public/lock.png';
import logo from '../public/logo.svg';
import passport from '../public/passport.png';
import people from '../public/people.png';
import styles from './page.module.css';

const regular = Manrope({
  subsets: ['latin'],
  weight: '400'
});
const semibold = Manrope({
  subsets: ['latin'],
  weight: '600'
});
const bold = Manrope({
  subsets: ['latin'],
  weight: '800'
});

interface FeatureParams {
  title: string;
  description: string;
  image: StaticImageData;
}

const Feature = ({ title, description, image }: FeatureParams) => {
  return (
    <div className="flex flex-col items-center mb-12">
      <Image src={image} alt={title} width={176} className="mb-4" />
      <h3 className="text-2xl mb-4">{title}</h3>
      <div className={regular.className}>
        <p className="text-center text-base">{description}</p>
      </div>
    </div>
  );
};

export default function Home() {
  const [navbar, setNavbar] = useState(false);

  return (
    <div>
      <nav className="mt-10 relative  flex justify-between items-center w-full">
        <a className="text-3xl font-bold leading-none" href="#">
          <Image src={logo} alt="openpeer logo" width={234} height={51} />
        </a>
        <div className="sm:hidden" onClick={() => setNavbar(!navbar)}>
          <button className="navbar-burger flex items-center p-3">
            <svg
              className="block h-4 w-4 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Mobile menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </button>
        </div>

        <div className="flex flex-row justify-between space-x-8 text-xl hidden sm:block">
          <a href="faq.html">FAQ</a>
          <a href="docs.html">Docs</a>
        </div>
      </nav>

      <div className={`navbar-menu ${navbar ? '' : 'hidden'}`}>
        <div className="flex flex-column space-x-8 text-xl">
          <ul className="text-center flex-1">
            <li>
              <a href="faq.html">FAQ</a>
            </li>
            <li>
              <a href="docs.html">Docs</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-20 sm:mt-40 mb-20">
        <div className="text-center text-5xl sm:text-6xl mb-8">
          <div className={semibold.className}>
            <h1>Decentralized P2P</h1>
          </div>
        </div>
        <div className={regular.className}>
          <div className="flex flex-row justify-center space-x-4 text-3xl mb-12">
            <h2>crypto</h2>
            <Image src={arrows} alt="swap arrows" />
            <h2>fiat</h2>
          </div>
        </div>
        <div className="text-center">
          <a href="https://minke.app" className="bg-[#222222] px-20 py-4 rounded-lg">
            Launch App
          </a>
        </div>
      </div>
      <div className="flex flex-col justify-around mx-20 md:space-x-20 md:flex-row">
        {[
          {
            title: 'Self-custodial',
            description:
              'Only you control your crypto. Deploy a smart contract with your funds that can only be withdrawn by the other party upon payment.',
            image: lock
          },
          {
            title: 'No KYC',
            description:
              'No KYC necessary. Funds are never custodied by any central party. Earn reputation for every successful transaction.',
            image: passport
          },
          {
            title: 'Community Moderated',
            description:
              'Disputes are moderated by a decentralized autonomous organization (DAO) of local experts who review evidence and vote on an outcome.',
            image: people
          }
        ].map((item) => (
          <Feature key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
}
