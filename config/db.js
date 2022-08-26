if (process.env.NODE_ENV === "production") {
    module.exports = {
        mongoURI:
            "mongodb+srv://railsonmateus:96956515Rm@cluster0.zim0ndl.mongodb.net/?retryWrites=true&w=majority",
    };
} else {
    module.exports = {
        mongoURI: "mongodb://localhost/forum-api-new",
    };
}
