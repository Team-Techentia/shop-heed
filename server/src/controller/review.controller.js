const reviewModel = require("../Model/reviewModel");
const nodemailer = require("nodemailer");

// Configure email transporter with SMTP settings
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Create a new review (Public route)
const createReview = async (req, res) => {
    try {
        const { name, email, number, rating, message } = req.body;
        
        // Validation
        if (!name || !email || !number || !rating || !message) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required" 
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ 
                success: false, 
                message: "Rating must be between 1 and 5" 
            });
        }

        const newReview = new reviewModel({
            name,
            email,
            number,
            rating,
            message
        });

        const savedReview = await newReview.save();

        return res.status(201).json({
            success: true,
            message: "Review submitted successfully! We'll review it soon.",
            data: savedReview
        });

    } catch (error) {
        console.error("Error creating review:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error", 
            error: error.message 
        });
    }
};

// Get all reviews (Admin)
const getAllReviews = async (req, res) => {
    try {
        const { isApproved, isPublished } = req.query;
        
        let filter = {};
        if (isApproved !== undefined) filter.isApproved = isApproved === 'true';
        if (isPublished !== undefined) filter.isPublished = isPublished === 'true';

        const reviews = await reviewModel.find(filter).sort({ createdAt: -1 });

        return res.status(200).json({ 
            success: true, 
            message: "Reviews fetched successfully", 
            data: reviews 
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get review by ID (Admin)
const getReviewById = async (req, res) => {
    try {
        const review = await reviewModel.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ 
                success: false, 
                message: "Review not found" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Review fetched successfully", 
            data: review 
        });
    } catch (error) {
        console.error("Error fetching review by ID:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

// Update review (Admin)
const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedReview = await reviewModel.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ 
                success: false, 
                message: "Review not found" 
            });
        }

        return res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: updatedReview
        });

    } catch (error) {
        console.error("Error updating review:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error", 
            error: error.message 
        });
    }
};

// Delete review (Admin)
const deleteReview = async (req, res) => {
    try {
        const deletedReview = await reviewModel.findByIdAndDelete(req.params.id);

        if (!deletedReview) {
            return res.status(404).json({ 
                success: false, 
                message: "Review not found" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Review deleted successfully" 
        });
    } catch (error) {
        console.error("Error deleting review:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

// Get published reviews (Public)
const getPublishedReviews = async (req, res) => {
    try {
        const publishedReviews = await reviewModel.find({ 
            isApproved: true, 
            isPublished: true 
        })
        .select('-adminNotes -emailSent -emailSentAt') // Hide admin fields
        .sort({ createdAt: -1 });

        return res.status(200).json({ 
            success: true, 
            message: "Published reviews fetched successfully", 
            data: publishedReviews 
        });
    } catch (error) {
        console.error("Error fetching published reviews:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

// Send email with review details (Admin)
const sendReviewEmail = async (req, res) => {
    try {
        const { id } = req.params;
        const { subject, emailMessage } = req.body;

        const review = await reviewModel.findById(id);

        if (!review) {
            return res.status(404).json({ 
                success: false, 
                message: "Review not found" 
            });
        }

        // Prepare email content
        const mailOptions = {
            from: `${process.env.APP_NAME} <${process.env.SMTP_FROM}>`,
            to: review.email,
            subject: subject || "Thank you for your review!",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Hello ${review.name},</h2>
                    <p>${emailMessage || 'Thank you for taking the time to share your feedback with us!'}</p>
                    
                    <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
                        <h3>Your Review:</h3>
                        <p><strong>Rating:</strong> ${'⭐'.repeat(review.rating)}</p>
                        <p><strong>Message:</strong> ${review.message}</p>
                    </div>
                    
                    <p>We truly appreciate your feedback!</p>
                    <p>Best regards,<br/>${process.env.APP_NAME || 'The Team'}</p>
                </div>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Update review with email sent status
        review.emailSent = true;
        review.emailSentAt = new Date();
        await review.save();

        return res.status(200).json({
            success: true,
            message: "Email sent successfully",
            data: review
        });

    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to send email", 
            error: error.message 
        });
    }
};

// Approve/Reject review (Admin)
const approveReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { isApproved, isPublished } = req.body;

        const review = await reviewModel.findByIdAndUpdate(
            id,
            { 
                isApproved: isApproved !== undefined ? isApproved : true,
                isPublished: isPublished !== undefined ? isPublished : false
            },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({ 
                success: false, 
                message: "Review not found" 
            });
        }

        return res.status(200).json({
            success: true,
            message: `Review ${isApproved ? 'approved' : 'rejected'} successfully`,
            data: review
        });

    } catch (error) {
        console.error("Error approving review:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error", 
            error: error.message 
        });
    }
};
const sendReviewRequestEmail = async (req, res) => {
    try {
        const { clientName, clientEmail, customMessage } = req.body;

        // Validation
        if (!clientName || !clientEmail) {
            return res.status(400).json({ 
                success: false, 
                message: "Client name and email are required" 
            });
        }

        // Review form URL - UPDATE THIS WITH YOUR ACTUAL FRONTEND URL
        const reviewFormUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reviews`;

        // Prepare email content
        const mailOptions = {
            from: `${'shopheed'} <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to: clientEmail,
            subject: "We'd love to hear your feedback!",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-bottom: 20px;">Hello ${clientName},</h2>
                        
                        <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
                            ${customMessage || 'We hope you had a great experience with us! Your feedback is extremely valuable and helps us improve our services.'}
                        </p>
                        
                        <div style="background-color: #f0f8ff; padding: 20px; margin: 25px 0; border-radius: 8px; text-align: center;">
                            <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">📝 Share Your Experience</h3>
                            <p style="color: #666; margin-bottom: 20px;">It will only take 2 minutes!</p>
                            
                            <a href="${reviewFormUrl}" 
                               style="display: inline-block; 
                                      background-color: #4CAF50; 
                                      color: white; 
                                      padding: 15px 40px; 
                                      text-decoration: none; 
                                      border-radius: 5px; 
                                      font-weight: bold;
                                      font-size: 16px;">
                                Write a Review
                            </a>
                        </div>
                        
                        <div style="margin-top: 25px; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 5px;">
                            <p style="margin: 0; color: #856404; font-size: 14px;">
                                <strong>Note:</strong> Your honest feedback helps us serve you better and assists other customers in making informed decisions.
                            </p>
                        </div>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                            <p style="color: #555; margin: 5px 0;">Thank you for your time!</p>
                            <p style="color: #333; font-weight: bold; margin: 5px 0;">${ 'shopheed'}</p>
                        </div>
                        
                        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; text-align: center;">
                            <p style="color: #999; font-size: 12px; margin: 5px 0;">
                                If the button doesn't work, copy and paste this link:
                            </p>
                            <p style="color: #666; font-size: 12px; margin: 5px 0; word-break: break-all;">
                                ${reviewFormUrl}
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: `Review request email sent successfully to ${clientEmail}`,
        });

    } catch (error) {
        console.error("Error sending review request email:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to send email", 
            error: error.message 
        });
    }
};

module.exports = {
    createReview,
    getAllReviews,
    getReviewById,
    sendReviewRequestEmail,
    updateReview,
    deleteReview,
    getPublishedReviews,
    sendReviewEmail,
    approveReview
};