import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { json } from "express";
import { Product } from "../models/product.model.js";

//generate access and refresh token->
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    //find user by id
    const user = await User.findById(userId);

    //store value of access anf refresh token in variable
    const accessToken = await user.generateAcceessToken();
    const refreshToken = await user.generateRefreshToken();
    console.log("function jwt", accessToken, refreshToken);
    // pitting value in variable from response from user

    user.refreshToken = refreshToken;

    //saving in database
    //validationBeforeSave -> saving without any validation . know what to do
    await user.save({ validateBeforeSave: false });

    //send as object
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "something went wrong");
  }
};

const testapi = async (req, res) => {
  return res.json({ message: "test api " });
};

const registerUser = async (req, res) => {
  const { fullname, username, password, email } = req.body;
  console.log("email", email);
  console.log(req.body);
  let avtar = req.files.avatar[0];
  console.log("avaatrt", avtar);

  if (
    [username, fullname, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all field required");
  }

  const exsistingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (exsistingUser) {
    throw new ApiError(409, "user with username or email allready exsist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  console.log(avatarLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  } else {
    console.log("images path", avatarLocalPath);
  }

  console.log("images path", avatarLocalPath);

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  console.log("avatr image", avatarLocalPath);

  const user = await User.create({
    fullname,
    avatar: avatar.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  console.log("password", password, "after validation", user.password);
  const createdUser = await User.findById(user._id).select(
    " -password -refreshtoken"
  );

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "registered succesfully"));
};

//login user ->
const loginUser = async (req, res) => {
  //req body -> data
  //username or email
  //find the user
  //password check
  //access and refresh token
  //send through cookie

  const { email, username, password } = req.body;

  // console.log(email,username,password)
  console.log(req.body);
  if (!(email || username)) {
    //(!(email || username))
    // throw new ApiError(400, "username or email required");
    return res.json({ message: "username or email not found", success: false });
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(400, "user does not exsist");
  }

  const isPasswordValid = await user.isPassowrdCorrect(password);

  if (!isPasswordValid) {
    // throw new ApiError(401, "invalid user credentials");
    return res.status(400).json({ message: "invalid cred" });
  }

  //function for generation of access  and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  console.log("raw", accessToken, refreshToken);
  //get user details by id and only show fields except password and refresh token
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // res.json(loggedInUser)

  //send cookies ->

  //option is an object . httpOnly allow user not to edit cookies from frontend .only edited at backend
  const options = {
    httpOnly: true,
    secure: true,
  };

  // const accessToken = await user.generateAcceessToken(loggedInUser._id)
  // console.log(accessToken)

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user logged in successfully"
      )
    );

  console.log(req.user);
  // return res.json({ message: 'logged in success', user: loggedInUser});
};

//logout user ->

const logoutUser = async (req, res) => {
  console.log(req.user);
  await User.findByIdAndUpdate(
    req.user._id,
    {
      refreshToken: null, //set value of updated field
    },
    {
      new: true, //show updated result in response
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out"));
};

const allusers = async (req, res) => {
  let user = await User.find({});
  return res.json({ message: "all user", user });
};

// order route
const userOrder = async (req, res) => {
  const {
    total_price,
    quantity,
    status,
    delivery_address,
    location,
    product,
    loc,
    lattitude,
    longitude,
  } = req.body;

  let orderedBy = req.user._id;

  const order = await Order.create({
    user: orderedBy,
    product,
    total_price,
    quantity,
    status,
    delivery_address,
    location,
    loc,
    orderDate: new Date(),
  });

  let currentuser = await User.findById(orderedBy);
  console.log(currentuser);
  await currentuser.updateOne({ $push: { Orderhistory: order._id } });
  return res
    .status(201)
    .json(new ApiResponse(200, order, "order placed  succesfully"));
};

//product route
const addProducts = async (req, res) => {
  const url = "https://fakestoreapi.com/products";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    let product;
    for (let i = 0; i <= json.length; i++) {
      console.log(json[i]);
      product = await Product.create({
        name: json[i].title,
        price: json[i].price,
        category: json[i].category,
        description: json[i].description,
        images: json[i].image,
        stock: json[i].rating.count,
      });
    }

    // return res
    //   .status(201)
    //   .json(new ApiResponse(200, "product placed  succesfully"));
  } catch (error) {
    console.error(error.message);
  }
};

const getProducts = async (req, res) => {
  try {
    let allProducts = await Product.find({});
    return res.json({
      message: "fetched all product",
      success: true,
      allProducts,
    });
  } catch (error) {
    console.error(error.message);
  }
};

const getOrders = async (req, res) => {
  try {
    let allOrders = await Order.find({});
    return res.json({
      message: "fetched all order",
      success: true,
      allOrders,
    });
  } catch (error) {
    console.error(error.message);
  }
};

const getOrderDist = async (req, res) => {
  try {
    let pendingOrder = await Order.find({})
      .where({ $or: [{ status: "pending" }, { status: "Pending" }] })
      .countDocuments();
    let processOrder = await Order.find({})
      .where({ $or: [{ status: "processing" }, { status: "Processing" }] })
      .countDocuments();
    let deliveredOrder = await Order.find({})
      .where({ $or: [{ status: "delivered" }, { status: "Delivered" }] })
      .countDocuments();
    let shippedOrders = await Order.find({})
      .where({ $or: [{ status: "shipped" }, { status: "Shipped" }] })
      .countDocuments();

    return res.json({
      message: "fetched all order",
      success: true,
      pendingOrder,
      processOrder,
      deliveredOrder,
      shippedOrders,
    });
  } catch (error) {
    console.error(error.message);
  }
};
const getCategoryDist = async (req, res) => {
  try {
    let mencloth = await Product.find({})
      .where({
        $or: [{ category: "men's clothing" }, { catrogory: "mens clothing" }],
      })
      .countDocuments();
    let womencloth = await Product.find({})
      .where({
        $or: [
          { category: "women's clothing" },
          { category: "womens clothing" },
        ],
      })
      .countDocuments();
    let jewelery = await Product.find({})
      .where({ $or: [{ category: "jewelery" }, { category: "Jewelery" }] })
      .countDocuments();
    let electronic = await Product.find({})
      .where({
        $or: [{ category: "electronics" }, { category: "Electronics" }],
      })
      .countDocuments();

    return res.json({
      message: "fetched all order",
      success: true,
      mencloth,
      womencloth,
      jewelery,
      electronic,
    });
  } catch (error) {
    console.error(error.message);
  }
};

const getsalesDist = async (req, res) => {
  try {
    let salesbymonth = await Order.aggregate([
      // Order is the model of userSchema
      {
        $group: {
          _id: { $month: "$createdAt" }, // group by the month *number*, mongodb doesn't have a way to format date as month names
          numberofdocuments: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: false, // remove _id
          month: {
            // set the field month as the month name representing the month number
            $arrayElemAt: [
              [
                "", // month number starts at 1, so the 0th element can be anything
                "january",
                "february",
                "march",
                "april",
                "may",
                "june",
                "july",
                "august",
                "september",
                "october",
                "november",
                "december",
              ],
              "$_id",
            ],
          },
          numberofdocuments: true, // keep the count
        },
      },
    ]);

    return res.json({ message: "monthly sales", salesbymonth });
  } catch (error) {
    console.log(error.message);
  }
};

// aggreagate sale
const totalSale = async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$total_price" }, // Sum the totalAmount field
        },
      },
    ]);

    console.log(totalSales);
    const result = totalSales.length ? totalSales[0].total : 0;
    res.json({ totalSales: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// aggreagate sale
const totalStock = async (req, res) => {
  try {
    const totalStock = await Product.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$stock" }, // Sum the stock field across all products
        },
      },
    ]);

    const result = totalStock.length ? totalStock[0].total : 0;
    res.json({ totalStock: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const salesOverview = async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } }, // Group by date
          totalSales: { $sum: "$total_price" }, // Sum the total amount for each date
        },
      },
      { $sort: { _id: 1 } }, // Sort by date ascending
    ]);

    res.json(
      salesData.map((item) => ({ date: item._id, totalSales: item.totalSales }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const salesOverviewMonth = async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$orderDate" } }, // Group by date
          totalSales: { $sum: "$total_price" }, // Sum the total amount for each date
        },
      },
      { $sort: { _id: 1 } }, // Sort by date ascending
    ]);

    res.json(
      salesData.map((item) => ({
        month: item._id,
        totalSales: item.totalSales,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const totalOrder = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const pendingOrder = async (req, res) => {
  try {
    const pendingOrders = await Order.countDocuments({ status: "pending" }); // Adjust field name as necessary
    res.json({ pendingOrders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const completedOrder = async (req, res) => {
  try {
    const completedOrders = await Order.countDocuments({ status: "delivered" }); // Adjust status name if needed
    res.json({ completedOrders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const dailyOrder = async (req, res) => {
  try {
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } }, // Group by day
          totalOrders: { $sum: 1 }, // Count the number of orders per day
        },
      },
      { $sort: { _id: 1 } }, // Sort by date ascending
    ]);

    // Format data for the frontend
    res.json(
      dailyOrders.map((item) => ({
        date: item._id,
        totalOrders: item.totalOrders,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  userOrder,
  addProducts,
  getProducts,
  allusers,
  testapi,
  getOrders,
  getOrderDist,
  getCategoryDist,
  getsalesDist,
  totalSale,
  totalStock,
  salesOverview,
  salesOverviewMonth,
  totalOrder,
  pendingOrder,
  completedOrder,
  dailyOrder,
};
