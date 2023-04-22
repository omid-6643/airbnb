"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
const Logo = () => {
  const router = useRouter();
  return (
    <Image
      alt="logo"
      height="100"
      width="100"
      className="hidden cursor-pointer md:block"
      src="/images/logo.png"
    />
  );
};

export default Logo;
