import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/home/HeroSection';
import FeatureSection from '@/components/home/FeatureSection';
import ChatFeatureSection from '@/components/home/ChatFeatureSection';
import LearningSection from '@/components/home/LearningSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen ">
      <Navbar />

      <main className="mt-[1px]">
        <HeroSection />
        <FeatureSection
          title="Automatic Grading with"
          titleHighlight="AI"
          description="Stop spending time marking assignments, class work, or assignments by hand. AI does what's automatic instantly."
          buttonText="Learn More"
          imageSrc="/ai-grading.png"
          imagePosition="right"
          bgColor="white"
        />

        <FeatureSection
          title="Work together,"
          titleHighlight="submit together"
          description="From students to teams or whole classes — collaborate, submit, and manage everything in one place."
          buttonText="Try It Now"
          imageSrc="/group-work.png"
          imagePosition="left"
          bgColor="gray"
        />

        <ChatFeatureSection />
        <LearningSection />
        {/* <TestimonialsSection /> */}
        <CTASection />
        <Footer />
      </main>
    </div>
  );
}
