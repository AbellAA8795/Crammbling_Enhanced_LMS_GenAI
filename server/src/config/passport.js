import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { findOrCreateGoogleUser } from "../models/Authentication/googleAuth.model.js";

// Google sign-in is optional for local development: without credentials the
// strategy can't be created (it throws and would crash the whole API), so
// skip it and let the /api/auth/google routes answer 503 instead.
export const googleAuthEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

if (!googleAuthEnabled) {
    console.warn("Google sign-in disabled: set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable it.");
} else passport.use(new GoogleStrategy(
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