import React, { useState } from "react";

export default function CifarApp() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);
        setPreview(URL.createObjectURL(uploadedFile));
    };

    const handleSubmit = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);
        setResult(null);

        try {
            const response = await fetch("https://skin-lesion-densenet121-api.onrender.com/predict", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to get prediction");

            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({ error: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-body p-5 text-center">
                            <h1 className="fw-bold mb-3 text-primary">
                                Skin Lesion Grading
                            </h1>
                            <p className="text-muted mb-4">
                                Upload an image and let the AI grade it into one of the 7 Skin Lesion categories:
                            </p>

                            <div className="d-flex justify-content-center flex-wrap mb-4">
                                {['akiec', 'bcc', 'bkl', 'df', 'mel', 'nv', 'vasc'].map((c) => (
                                    <span key={c} className="badge bg-light text-dark m-1 px-3 py-2">
                    {c}
                  </span>
                                ))}
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="form-control mb-3"
                            />

                            {preview && (
                                <img
                                    src={preview}
                                    alt="preview"
                                    className="img-fluid rounded mb-3 shadow-sm"
                                    style={{maxHeight: "300px"}}
                                />
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={!file || loading}
                                className="btn btn-primary w-100 py-2 fw-semibold"
                            >
                                {loading ? "Predicting..." : "Classify Image"}
                            </button>
                            <p className="text-muted mb-4">_</p>
                            <div className="d-flex justify-content-center flex-wrap mb-3">
                                ! the back end is running on a free tier instance, it spins down with inactivity, which
                                can delay requests by 50 seconds or more.
                            </div>

                            {result && (
                                <div className="mt-4">
                                    {result.error ? (
                                        <div className="alert alert-danger">{result.error}</div>
                                    ) : (
                                        <h5 className="fw-bold">
                                            Prediction:{" "}
                                            <span className="text-success">{result.predicted_class}</span>
                                        </h5>
                                    )}
                                </div>
                            )}

                            <div className="d-flex justify-content-center flex-wrap mb-3">
                                'akiec' = Actinic keratoses/Bowen’s disease ||
                                'bcc' = Basal cell carcinoma ||
                                'bkl' = Benign keratosis-like lesions ||
                                'df' = Dermatofibroma ||
                                'mel' = Melanoma ||
                                'nv' = Melanocytic nevi ||
                                'vasc' = Vascular lesions
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
