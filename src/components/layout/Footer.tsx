import { Twitter, Facebook, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navy text-primary-foreground py-6">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-primary-foreground/70">
            <span>© Yes ok</span>
            <a href="#" className="hover:text-accent transition-colors">Terms & Privacy</a>
            <a href="#" className="hover:text-accent transition-colors">How It Works</a>
            <span>©2025 Class Pilot</span>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-accent transition-colors">
              <Facebook size={18} />
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              <Twitter size={18} />
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

