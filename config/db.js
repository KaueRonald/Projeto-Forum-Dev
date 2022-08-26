if (process.env.NODE_ENV === "production") {
    module.exports = {
        mongoURI:
            "mongodb+srv://railsonpw1:96956515@cluster0.zm7jocw.mongodb.net/?retryWrites=true&w=majority",
    };
} else {
    module.exports = {
        mongoURI: "mongodb://localhost/forum-api-new",
    };
}
