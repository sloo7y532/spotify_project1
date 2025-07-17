import { useTranslation } from "react-i18next";
import "../styles/Premium.css";

export default function Premium() {
    const { t } = useTranslation();

    return (
        <div className="premium-banner text-white text-center d-flex align-items-center justify-content-center">
            <div>
                <h1>{t("premiumBanner.title")}</h1>
                <p className="lead">{t("premiumBanner.subtitle")}</p>
            </div>
        </div>
    );
}