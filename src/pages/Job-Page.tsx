import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/Job-Page.css"
import Footer from "../components/Footer.tsx";

export default function JobPage() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [resume, setResume] = useState<File | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const isFilled = name && email && resume;
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuccess(true);



    };

    return (
        <div className="job-application-page ">
            <div className="container pb-5 py-5">
                <div className="row shadow-lg rounded bg-white overflow-hidden">

                    <div className="col-md-6 p-0 d-none d-md-block">
                        <img
                            src="https://plus.unsplash.com/premium_photo-1683141090419-32e7d3dcf294?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Career"
                            className="img-fluid h-100 w-100 object-fit-cover"
                        />
                    </div>


                    <div className="col-md-6 p-4">
                        <h2 className="mb-4 text-center text-dark mt-4">Job Application</h2>
                        <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "30px auto" }}>
                            <div className="mb-3">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    onChange={(e) => setName(e.target.value)}
                                    className="form-control mb-2"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-control mb-2"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Phone Number</label>
                                <input type="tel" className="form-control" placeholder="Enter your phone number" />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Why do you want to work with us?</label>
                                <textarea className="form-control" rows={2} placeholder="Tell us something..." />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Upload Resume</label>
                                <input
                                    type="file"
                                    onChange={(e) => setResume(e.target.files?.[0] || null)}
                                    className="form-control"
                                />
                            </div>

                            <button className="btn btn-success w-100" disabled={!isFilled}>
                                Submit
                            </button>
                        </form>


                        {showSuccess && (
                            <div
                                className="modal fade show"
                                style={{ display: "block" }}

                            >
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content text-center">
                                        <div className="modal-header border-0">
                                            <h5 className="modal-title w-100">Success</h5>
                                        </div>
                                        <div className="modal-body">
                                            <p className="mb-3 text-dark"> Your application was uploaded successfully!</p>
                                            <button type="button" className="btn btn-success" onClick={() => setShowSuccess(false)}>
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );

}
