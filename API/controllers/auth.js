const User = require("../schemas/User");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const request = require("request");
const userService = require("../services/userService");
const jwtService = require("../services/jwtService");
const TwitterStrategy = require("passport-twitter").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const OAuth2Strategy = require("passport-oauth2").Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

var userToken = jwtService.tokenGenerator();

const saveToSession = (req, res, error) => {
  const payload = {
    _id: req.user._id,
    username: req.user.username,
    language: req.user.language ? req.user.language : "en"
  };
  req.session.user = payload;

  req.session.save(err => {
    if (err) throw err;
    res.redirect("http://localhost:3000/activateOauth?token=" + userToken);
  });
};

// GOOGLE
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "784800871977-tfb75n389g6f7hpvug0hmfrdh1ku8ojn.apps.googleusercontent.com",
      clientSecret: "6rBvGJbcjXGOZku2VTkI8Bxv",
      callbackURL: "http://localhost:5000/auth/google/callback"
    },
    async (token, tokenSecret, profile, done) => {
      User.findOne(
        {
          oauthID: profile.id
        },
        async (err, user) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            if (!(await userService.emailExists(profile.emails[0].value))) {
              var uniqid =
                new Date().getTime() +
                Math.floor(Math.random() * 10000 + 1).toString(16);

              user = new User({
                username: await userService.usernameExists(
                  profile.displayName.replace(" ", "-")
                ),
                email: profile.emails[0]
                  ? profile.emails[0].value.toLowerCase()
                  : "",
                language: profile._json.locale,
                firstname: profile.name.givenName ? profile.name.givenName : "",
                lastname: profile.name.familyName
                  ? profile.name.familyName
                  : "",
                img: profile.photos[0] ? profile.photos[0].value : "",
                activationKey: uniqid,
                active: true,
                token: userToken,
                oauthID: profile.id,
                google: profile._json ? profile._json : {}
              });
              user.save(function(err) {
                if (err) return done(null, false, { error: err.message });
                return done(null, user);
              });
            } else {
              User.findOneAndUpdate(
                { email: profile.emails[0].value },
                {
                  token: userToken,
                  google: profile._json ? profile._json : "",
                  oauthID: profile.id
                },
                err => {
                  if (err) console.log(err);
                }
              );
              return done(null, user);
            }
          } else {
            User.findOneAndUpdate(
              { _id: user._id },
              { token: userToken },
              err => {
                if (err) console.log(err);
              }
            );
            return done(null, user);
          }
        }
      );
    }
  )
);

// TWITTER
passport.use(
  new TwitterStrategy(
    {
      consumerKey: "t2ncc93Na5XNNVtiOhjS3gvma",
      consumerSecret: "ZEs1taRDwz0dsKG9hxhtPI4BFw93rEwlkcJI4UpxZYPcD8Mgcm",
      callbackURL: "http://localhost:5000/auth/twitter/callback",
      includeEmail: true
    },
    async (token, tokenSecret, profile, done) => {
      User.findOne(
        {
          oauthID: profile.id
        },
        async (err, user) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            if (!(await userService.emailExists(profile._json.email))) {
              var uniqid =
                new Date().getTime() +
                Math.floor(Math.random() * 10000 + 1).toString(16);
              user = new User({
                username: await userService.usernameExists(
                  profile._json.screen_name
                ),
                email: "",
                firstname: profile._json.name
                  ? profile._json.name.split(" ")[0]
                  : "",
                lastname: profile._json.name
                  ? profile._json.name.split(" ")[1]
                  : "",
                img: profile.photos[0] ? profile.photos[0].value : "",
                activationKey: uniqid,
                token: userToken,
                active: true,
                oauthID: profile.id,
                twitter: profile._json ? profile._json : {}
              });
              user.save(function(err) {
                if (err) console.error(err);
                return done(null, user);
              });
            } else {
              User.findOneAndUpdate(
                { email: profile._json.email },
                {
                  token: userToken,
                  twitter: profile._json ? profile._json : "",
                  oauthID: profile.id
                },
                err => {
                  if (err) console.log(err);
                }
              );
              return done(null, user);
            }
          } else {
            User.findOneAndUpdate(
              { _id: user._id },
              { token: userToken },
              err => {
                if (err) console.log(err);
              }
            );
            return done(null, user);
          }
        }
      );
    }
  )
);

// GITHUB
passport.use(
  new GitHubStrategy(
    {
      clientID: "b8e9c7a5e8c5b5e8c5b5",
      clientSecret: "s3cr3tK3y12345",
      callbackURL: "http://localhost:5000/auth/github/callback"
    },
    async (token, profile, done) => {
      User.findOne(
        {
          oauthID: profile.id
        },
        async (err, user) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            if (!(await userService.emailExists(profile.emails[0].value))) {
              var uniqid =
                new Date().getTime() +
                Math.floor(Math.random() * 10000 + 1).toString(16);
              user = new User({
                username: await userService.usernameExists(profile.username) || profile.name,
                email: profile.emails[0]
                  ? profile.emails[0].value.toLowerCase()
                  : "",
                firstname: profile.name.givenName ? profile.name.givenName : "",
                lastname: profile.name.familyName
                  ? profile.name.familyName
                  : "",
                img: profile.photos[0] ? profile.photos[0].value : "",
                activationKey: uniqid,
                active: true,
                token: userToken,
                oauthID: profile.id,
                github: profile._json ? profile._json : {}
              });
              user.save(function(err) {
                if (err) console.error(err);
                return done(null, user);
              });
            } else {
              User.findOneAndUpdate(
                { email: profile.emails[0].value },
                {
                  token: userToken,
                  github: profile._json ? profile._json : "",
                  oauthID: profile.id
                },
                err => {
                  if (err) console.log(err);
                }
              );
              return done(null, user);
            }
          } else {
            User.findOneAndUpdate(
              { _id: user._id },
              { token: userToken },
              err => {
                if (err) console.log(err);
              }
            );
            return done(null, user);
          }
        }
      );
    }
  )
);

// GITHUB2 (Alternative)
// passport.use(
//   new GitHubStrategy({
//     clientID: process.env.GITHUB_CLIENT_ID,
//     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     callbackURL: "/auth/github/callback"
//   },
//   (req, accessToken, profile, done) => {
//     return done(null, user);
//   })
// );

// GENERIC OAUTH2
// passport.use(
//   new OAuth2Strategy({
//     clientID: process.env.OAUTH_CLIENT_ID,
//     clientSecret: process.env.OAUTH_CLIENT_SECRET,
//     callbackURL: "/auth/oauth2/callback"
//   },
//   (req, accessToken, profile, done) => {
//     return done(null, user);
//   })
// );

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login"
  }),
  function(req, res) {
    saveToSession(req, res);
  }
);

router.get(
  "/twitter",
  passport.authenticate("twitter")
);

router.get(
  "/twitter/callback",
  passport.authenticate("twitter")
);

router.get(
  "/github",
  passport.authenticate("github", {
    failureRedirect: "http://localhost:3000/login"
  })
);

router.get(
  "/github/callback",
  passport.authenticate("github")
);

module.exports = router;