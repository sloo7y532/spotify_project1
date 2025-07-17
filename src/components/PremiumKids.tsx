import { useTranslation } from "react-i18next";
import "../styles/PremiumKids.css";

export default function PremiumKids() {
    const { t } = useTranslation();

    return (
        <div className="premium-kids-banner">
            <div className="premium-kids-text">
                <h2>{t("kidsBanner.title")}</h2>
                <p>{t("kidsBanner.subtitle")}</p>
            </div>
        </div>
    );
}
