import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { findOrCreateGoogleUser } from "../models/googleAuth.model.js";

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0]?.value;
            const avatarUrl = profile.photos?.[0]?.value || null;

            if (!email) {
                return done(new Error("NO_EMAIL_FROM_GOOGLE"), null);
            }

            const user = await findOrCreateGoogleUser(
                profile.id,
                email,
                profile.displayName,
                avatarUrl
            );

            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }
));

export default passport;