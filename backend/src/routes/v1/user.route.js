"use strict";

const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middleware/auth");
const { tenantValidation } = require("../../middleware/tenantValidation");
const { getUsers, createUser } = require("../../controllers/user/user.controller");

router.get("/", authenticate, tenantValidation(), getUsers);
router.post("/", authenticate, tenantValidation(), createUser);

module.exports = router;
