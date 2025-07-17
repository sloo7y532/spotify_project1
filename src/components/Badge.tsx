import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import "../styles/Badge.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Badge() {
    // Accessing the authenticated user from the Redux store
    const user = useSelector((state: RootState) => state.auth.user);

    // Local state to store the current user's subscription plan
    const [userPlan, setUserPlan] = useState<string | null>(null);

    useEffect(() => {
        // Function to fetch the latest subscription plan for the current user
        const fetchPlan = async () => {
            // Exit early if user is not authenticated or email is missing
            if (!user || !user.email) return;

            try {
                // Fetch all subscription records from Firebase
                const res = await axios.get(
                    "https://spotify-project-123-default-rtdb.firebaseio.com/selectedPlans.json"
                );

                const data = res.data;
                const allPlans = Object.values(data || {}) as any[];

                // Normalize user email for accurate comparison
                const userEmail = user.email.trim().toLowerCase();

                // Filter plans matching the current user's email and sort by newest first
                const myPlans = allPlans
                    .filter(entry => entry.email?.trim().toLowerCase() === userEmail)
                    .sort((a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );

                const latestPlan = myPlans[0];

                // If a valid plan exists, update state
                if (latestPlan?.plan) {
                    setUserPlan(latestPlan.plan.trim().toLowerCase());
                }
            } catch (error) {
                console.error("Error fetching plan:", error);
            }
        };

        // Call the plan fetch function on component mount or when user changes
        fetchPlan();
    }, [user]);

    // Do not render the badge if user has no active plan
    if (!userPlan) return null;

    // Determine if the plan is for Kids
    const isKids = userPlan === "premium kids" || userPlan === "بريميوم الاطفال";

    // Determine if the plan is one of the Premium types
    const isPremium = [
        "premium individual",
        "premium student",
        "بريميوم فردي",
        "بريميوم الطلاب"
    ].includes(userPlan);

    return (
        <div className={`subscription-badge ${isKids ? "kids" : isPremium ? "premium" : ""}`}>
            <i className="fab fa-spotify me-1"></i>
            {isKids && (
                <>
                    Premium Kids <i className="fas fa-child me-1"></i>
                </>
            )}
            {isPremium && <>Premium</>}
        </div>
    );
}
