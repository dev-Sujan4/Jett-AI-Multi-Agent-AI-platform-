const DEMO_USER = {
  _id: "demo-user",
  userId: "demo-user",
  name: "Demo User",
  email: "demo@example.com",
};

export const getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json(req.user || DEMO_USER);
  } catch (error) {
    return res.status(500).json({ message: `get current user error ${error}` });
  }
};


