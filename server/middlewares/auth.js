import jwt from "jsonwebtoken";

// create middleware function     ->when success is true then call next method to execute the controller function and middleware execute before controller function
const userAuth = async (req, res, next) => {
  const { token } = req.headers;
  // console.log("fzxsndskd", token);
  if (!token) {
    return res.json({
      success: false,
      message: "Not authorized. Login again.",
    });
  }
  // first decode token verify and token 
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("fzx", tokenDecode.id);
    
    // if token is valid then assign tokenid to req body

    if (tokenDecode.id) {
      req.body = req.body || {}; // Initialize req.body if it's undefined
      req.body.userId = tokenDecode.id;      
    } else {
    res.json({ success: false, message: "Not authorized. Login again. Please provide a valid token." });

    }
    // if token is valid then call next method to execute controller function that return user credit
    next();
  } catch (error) {
    res.json({ success: false, message: `Token verification failed: ${error.message}` });

  }
};

export default userAuth;
