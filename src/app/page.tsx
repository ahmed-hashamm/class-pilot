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
          description="Stop spending hours marking assignments and classwork by hand. AI automates the grading process, providing instant scores and personalized feedback drafts."
          buttonText="Learn More"
          imageSrc="/ai-grading.png"
          imagePosition="right"
          bgColor="white"
        />

        <FeatureSection
          title="Seamless Collaboration,"
          titleHighlight="unified submissions"
          description="Empower students to work together in real time. Teams can collaborate on assignments and submit unified projects, drastically reducing repetitive grading for educators."
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
