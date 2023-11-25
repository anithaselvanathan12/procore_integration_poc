const express = require("express");
const app = express();
const {
  PROCORE_CLIENT_ID,
  PROCORE_CLIENT_SECRET_ID,
  PROCORE_COMPANY_ID,
  PROCORE_PROJECT_ID,
  ACCESS_TOKEN,
  AUTHORIZATION_CODE,
} = require("./constant");
const port = process.env.PORT || "8000";

app.get("/", (req, res) => {
  res.status(200).send("WHATABYTE: Food For Devs");
});

app.get("/get_access_token", async (req, res) => {
  try {
    const PROCORE_REQUEST_URL = "https://sandbox.procore.com/oauth/token";
    const payload = {
      grant_type: "authorization_code",
      client_id: PROCORE_CLIENT_ID,
      client_secret: PROCORE_CLIENT_SECRET_ID,
      code: AUTHORIZATION_CODE,
      redirect_uri: "http://localhost:4200/integrations",
    };
    const response = await axios.post(PROCORE_REQUEST_URL, payload);
    /* //To get new access token using refresh token
    const data = {
      grant_type: "refresh_token",
      refresh_token: response.data.refresh_token,
      client_id: PROCORE_CLIENT_ID,
      client_secret: PROCORE_CLIENT_SECRET_ID,
    };
    await axios.post(PROCORE_REQUEST_URL, payload);
    */
    if (response) {
      res.status(200).json({
        status: 200,
        message: "procore access token generated successfully.",
        data: procore_vendors,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/get_procore_vendors", async (req, res) => {
  try {
    const PROCORE_REQUEST_URL = `https://sandbox.procore.com/rest/v1.1/projects/${PROCORE_PROJECT_ID}/vendors`;
    const procore_vendors = await axios.get(PROCORE_REQUEST_URL, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Procore-Company-Id": `${PROCORE_COMPANY_ID}`,
      },
    });
    if (procore_users) {
      res.status(200).json({
        status: 200,
        message: "procore vendors listed successfully.",
        data: procore_vendors,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/get_procore_users", async (req, res) => {
  const PROCORE_REQUEST_URL = `https://sandbox.procore.com/rest/v1.0/projects/${PROCORE_PROJECT_ID}/users`;
  try {
    const procore_users = await axios.get(PROCORE_REQUEST_URL, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Procore-Company-Id": `${PROCORE_COMPANY_ID}`,
      },
    });
    if (procore_users) {
      res.status(200).json({
        status: 200,
        message: "procore users listed successfully.",
        data: procore_users,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
});

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
