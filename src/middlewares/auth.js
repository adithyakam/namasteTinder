const isAuthenticated = (req, res, next) => {
  let token = "abc";
  if (token !== "abc") {
    res.status(401).send("Not authorized");
  } else {
    next();
  }
};

const isAdmin = (req, res, next) => {
  let isAdmin = true;

  if (!isAdmin) {
    res.status(401).send("Not Admin");
  } else {
    next();
  }
};

module.exports = {
  isAuthenticated,
  isAdmin,
};
