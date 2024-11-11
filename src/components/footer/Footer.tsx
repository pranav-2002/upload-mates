import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Made by Pranav KSK
      </p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link
          className="text-xs hover:underline underline-offset-4"
          href="https://github.com/pranav-2002/upload-mates"
          passHref
        >
          Source Code
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;
