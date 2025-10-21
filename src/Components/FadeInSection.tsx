import React, { useEffect, useRef, useState } from "react";
// import "./FadeInSection.css";

/**
 * @author
 * @function FadeInSection
 **/

interface IDataProviderProps {
  children: React.ReactNode;
}

export const FadeInSection = ({ children }: IDataProviderProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // observer.disconnect(); // Stop observing once visible
          }
        });
      },
      {
        threshold: .1, // 10% of the component should be in view to trigger
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`fade-in-section ${isVisible ? "is-visible" : ""}`}
    >
      {children}
    </div>
  );
};
