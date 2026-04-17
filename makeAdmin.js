const { sequelize, User } = require("./models");

const makeAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connected to DB.");

        // Update all users to have role = 'admin'
        await User.update({ role: "admin" }, { where: {} });

        console.log("SUCCESS: All users are now Admins.");
    } catch (err) {
        console.error("Error:", err);
    } finally {
        // Exit
        process.exit();
    }
};

makeAdmin();
