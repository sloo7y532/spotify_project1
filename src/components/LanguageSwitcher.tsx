import React from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

/**
 * Props interface for LanguageSwitcher component
 */
interface LanguageSwitcherProps {
  className?: string; // Optional additional CSS classes
}

/**
 * LanguageSwitcher Component
 *
 * A toggle button that switches between Arabic and English languages.
 *
 * Features:
 * - Toggle between Arabic (عر) and English (EN) languages
 * - Visual globe icon indicator
 * - Hover effects for better UX
 * - Bilingual tooltips (Arabic/English)
 * - Inline styling for portability
 * - Integration with react-i18next for global language state
 *
 * Used in:
 * - Navbar component for global language switching
 * - Any component that needs language toggle functionality
 */
const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = "",
}) => {
  // Get i18n instance for language management
  const { i18n } = useTranslation();

  // Get current language from i18n state
  const currentLanguage = i18n.language;

  /**
   * Toggles between Arabic and English languages
   * Updates global i18n language state which triggers
   * re-renders throughout the application
   */
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`language-switcher ${className}`}
      title={
        currentLanguage === "ar" ? "Switch to English" : "التبديل إلى العربية"
      }
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 12px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        backgroundColor: "transparent",
        color: "inherit", // Inherit color from parent
        cursor: "pointer",
        fontSize: "14px",
        transition: "all 0.2s ease", // Smooth hover transitions
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "#f0f0f0";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      {/* Globe icon to indicate language functionality */}
      <Globe size={16} />

      {/* Language label that changes based on current language */}
      <span>{currentLanguage === "ar" ? "EN" : "عر"}</span>
    </button>
  );
};

export default LanguageSwitcher;
