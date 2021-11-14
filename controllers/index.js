module.exports = (app) => {
    app.use("/api/auth", require('./auth/auth.route'));
    app.use("/api/util", require('./util/util.route'));
    app.use("/api/meals", require('./meals/meals.route'));
}
