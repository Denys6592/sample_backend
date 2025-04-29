const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Portfolio = require("../models/Portfolio");
const WorkHistory = require("../models/WorkHistory");
const Education = require("../models/Education");
const Project = require("../models/Project");
const Feedback = require("../models/Feedback");
const Review = require("../models/Review");
const nodemailer = require("nodemailer");

require("dotenv").config();

const secretKey = "secret";
const API_URL = process.env.BACKEND_API;

exports.signup = async (req, res) => {
  try {
    const {
      uid,
      fullName,
      email,
      userName,
      profilePicture,
      role,
      provider = "default",
      password
    } = req.body;

    const user = new User({
      uid,
      fullName,
      email,
      userName,
      role,
      provider,
      password,
      avatar: profilePicture
    });
    await user.save();

    res.status(200).send("User sign up successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};

exports.sendResetPasswordEmail = async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email } = req.body;

  const resetLink = `http://localhost:3000/reset-password?email=${encodeURIComponent(
    email
  )}`;

  const mailOptions = {
    from: "Freelancing Platform Support Team",
    to: email,
    subject: "Password Reset Request",
    html: `<p>You requested a password reset. Click the link below to reset your password:</p> <a href="${resetLink}">Reset my password</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send("Error sending email.");
    }
    console.log("Email sent:", info.response);
    res.send("Password reset email sent successfully!");
  });
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.uid })
      .populate("workHistory")
      .populate("education");
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

exports.getUserFullData = async (req, res) => {
  try {
    const user = await User.findById(req.query.id)
      .populate("workHistory")
      .populate("education");
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (error) {
    res.status(500).send("Server error");
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const userId = req.uid;
    const {
      fullName,
      location,
      description,
      skills,
      hourlyRate,
      linkedInProfile,
      githubProfile,
      behanceProfile,
    } = req.body;

    const updateFields = {
      fullName,
      location,
      description,
      hourlyRate,
      linkedInProfile,
      githubProfile,
      behanceProfile,
    };
    updateFields.skills = skills.split(",");

    const portfolioTitles = Array.isArray(req.body.portfolioTitles)
      ? req.body.portfolioTitles
      : [];
    const portfolioDescriptions = Array.isArray(req.body.portfolioDescriptions)
      ? req.body.portfolioDescriptions
      : [];
    const portfolioSkills = Array.isArray(req.body.portfolioSkills)
      ? req.body.portfolioSkills
      : [];

    if (req.files && req.files["avatar"]) {
      updateFields.avatar = `${API_URL}/api/${req.files["avatar"][0].path}`;
    }

    let portfoliosArray = [];
    const portfoliosFiles =
      req.files && req.files["portfolios"] ? req.files["portfolios"] : [];
    if (portfoliosFiles && Array.isArray(portfoliosFiles)) {
      portfoliosArray = await Promise.all(
        portfoliosFiles.map(async (file, index) => {
          const portfolio = new Portfolio({
            filePath: file.path,
            title: portfolioTitles[index] || "",
            description: portfolioDescriptions[index] || "",
            portfolioSkills: portfolioSkills[index] || "",
          });
          await portfolio.save();
          return portfolio._id;
        })
      );
    }

    if (portfoliosArray.length > 0) {
      updateFields.portfolios = portfoliosArray;
    }

    let workHsitoriesArray = [];
    const workHistories = req.body.workHistory
      ? JSON.parse(req.body.workHistory)
      : [];
    if (workHistories && Array.isArray(workHistories)) {
      workHsitoriesArray = await Promise.all(
        workHistories.map(async (history, index) => {
          const workHistory = new WorkHistory({
            company: history.company,
            position: history.position,
          });
          await workHistory.save();
          return workHistory._id;
        })
      );
    }

    if (workHsitoriesArray.length > 0) {
      updateFields.workHistory = workHsitoriesArray;
    }

    let educationArray = [];
    const educations = req.body.education ? JSON.parse(req.body.education) : [];
    if (educations && Array.isArray(educations)) {
      educationArray = await Promise.all(
        educations.map(async (item, index) => {
          const education = new Education({
            degree: item.degree,
            school: item.school,
            year: item.year,
          });
          await education.save();
          return education._id;
        })
      );
    }

    if (educationArray.length > 0) {
      updateFields.education = educationArray;
    }

    const updatedUser = await User.findOneAndUpdate(
      { uid: userId },
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ error: "User not found." });
    }

    res.send({
      message: "User profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send({ error: "Failed to update user profile." });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.uid;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).send({ error: "User not found." });
    }

    res.status(200).send({ message: "User profile successfully deleted." });
  } catch (error) {
    res.status(500).send({ error: "Failed to delete user profile." });
  }
};

exports.getBestMatchProjects = async (req, res) => {
  try {
    const userId = req.uid;
    console.log(userId);
    const user = User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Extract query parameters
    let { skills, location, hourlyRate } = req.query;

    // Convert skills into an array if passed
    const skillArray = skills ? skills.split(",") : user.skills;

    // Construct query
    const query = {
      $or: [
        { skills: { $in: skillArray } },
        { location: location || user.location },
        {
          hourlyRate: {
            $lte: hourlyRate ? parseFloat(hourlyRate) : user.hourlyRate,
          },
        },
      ],
    };

    // Fetch projects
    const projects = await Project.find(query).sort({ hourlyRate: -1 });

    res.status(200).json({ projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get best match projects." });
  }
};

exports.filterTalents = async (req, res) => {
  try {
    const { skills, minRate, maxRate, locations, types, levels } = req.query;

    const query = { role: "freelancer" };

    if (locations && locations.length) {
      const locationArray = locations.split(",");
      query.location = { $in: locationArray };
    }

    if (minRate && maxRate) {
      query.hourlyRate = { $gte: minRate, $lte: maxRate };
    }

    const users = await User.find(query);

    res.status(200).json({ users: users });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to filter projects", details: error.message });
  }
};

exports.giveFeedback = async (req, res) => {
  try {
    const userId = req.uid;
    const { targetUserId, projectId, feedback } = req.body;

    const newFeedback = new Feedback({
      project: projectId,
      from: userId,
      to: targetUserId,
      feedback: feedback,
    });

    await newFeedback.save();

    res.status(200).json({ message: "Thank you for your feedback." });
  } catch (error) {
    res.status(500).send({ error: "Failed to give feedback." });
  }
};

exports.updateFeedback = async (req, res) => {
  try {
    const { id, newFeedback } = req.body;

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found." });
    }

    const creationDate = feedback.createdAt;
    const currentDate = new Date();

    const timeDifference = currentDate - creationDate;
    const oneMonthMilliseconds = 30 * 24 * 60 * 60 * 1000;

    if (timeDifference > oneMonthMilliseconds) {
      return res
        .status(403)
        .json({
          error: "You can update feedback only within 1 month of creation.",
        });
    }

    feedback.feedback = newFeedback;
    await feedback.save();

    res.status(200).json({ message: "Updated the feedback successfully." });
  } catch (error) {
    res.status(500).send({ error: "Failed to update the feedback." });
  }
};

exports.setReview = async (req, res) => {
  try {
    const userId = req.uid;
    const {
      projectId,
      targetUserId,
      skills,
      availability,
      communication,
      quality,
      deadlines,
      cooperation,
    } = req.body;

    const newReview = new Review({
      project: projectId,
      from: userId,
      to: targetUserId,
      skills: skills,
      availability: availability,
      communication: communication,
      quality: quality,
      deadlines: deadlines,
      cooperation: cooperation,
    });

    await newReview.save();

    res
      .status(200)
      .json({
        message: "Set review successfully.",
        meanReview:
          (skills +
            availability +
            communication +
            quality +
            deadlines +
            cooperation) /
          6,
      });
  } catch (error) {
    res.status(500).send({ error: "Failed to set review." });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const {
      id,
      skills,
      availability,
      communication,
      quality,
      deadlines,
      cooperation,
    } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found." });
    }

    const creationDate = review.createdAt;
    const currentDate = new Date();

    const timeDifference = currentDate - creationDate;
    const oneMonthMilliseconds = 30 * 24 * 60 * 60 * 1000;

    if (timeDifference > oneMonthMilliseconds) {
      return res
        .status(403)
        .json({
          error: "You can update review only within 1 month of creation.",
        });
    }

    review.skills = skills;
    review.availability = availability;
    review.communication = communication;
    review.quality = quality;
    review.deadlines = deadlines;
    review.cooperation = cooperation;

    await review.save();

    res.status(200).json({ message: "Updated the review successfully." });
  } catch (error) {
    res.status(500).send({ error: "Failed to update the review." });
  }
};

exports.getClientHistory = async (req, res) => {
  try {
    const userId = req.uid;

    const projects = await Project.find({
      status: "completed",
      owner: userId,
    }).populate("owner");

    const projectIds = projects.map((project) => project._id);

    const feedbacks = await Feedback.find({ project: { $in: projectIds } });

    const reviews = await Review.find({ project: { $in: projectIds } });

    const projectDetails = projects.map((project) => ({
      ...project.toJSON(),
      feedback: feedbacks.filter((feedback) =>
        feedback.project.equals(project._id)
      ),
      review: reviews.filter((review) => review.project.equals(project._id)),
    }));

    res.status(200).json(projectDetails);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to get history." });
  }
};

exports.getFreelancerHistory = async (req, res) => {
  try {
    const userId = req.uid;

    const projects = await Project.find({
      status: "completed",
      freelancer: userId,
    }).populate("freelancer");

    const projectIds = projects.map((project) => project._id);

    const feedbacks = await Feedback.find({ project: { $in: projectIds } });

    const reviews = await Review.find({ project: { $in: projectIds } });

    const projectDetails = projects.map((project) => ({
      ...project.toJSON(),
      feedback: feedbacks.filter((feedback) =>
        feedback.project.equals(project._id)
      ),
      review: reviews.filter((review) => review.project.equals(project._id)),
    }));

    res.status(200).json(projectDetails);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to get history." });
  }
};
