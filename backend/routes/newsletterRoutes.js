import express from "express";
import { getNewsletterSubscribers, subscribeNewsletter } from "../controllers/newsletterController.js";

const newsletterRouter = express.Router();

newsletterRouter.post("/subscribe", subscribeNewsletter);
newsletterRouter.get("/subguests", getNewsletterSubscribers);

export default newsletterRouter;

