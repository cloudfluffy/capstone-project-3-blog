import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.locals.blogs = [{ title: "Test Blog", date: "01/01/2010", time: "11:00 AM", content: "Hello, World!" }];

// Declare the location of static files
app.use(express.static("public"));

// Parse user inputs into body
app.use(bodyParser.urlencoded({ extended: false }));

// Process data and store the blog to locals
app.use("/submit", (req, res, next) => {
    let blog = { title: req.body.title, date: getDate(), time: getTime(), content: req.body.content };
    app.locals.blogs.push(blog)
    next();
});

// Edit the blog
app.use("/edit", (req, res, next) => {
    let index = req.body.index;
    let newTitle = req.body.title;
    let newContent = req.body.content;
    let blog = app.locals.blogs[index];
    blog.title = newTitle;
    blog.content = newContent;
    blog.edited = true;
    blog.editTime = getTime();
    blog.editDate = getDate();
    next();
});

// Delete the blog from locals
app.post("/delete", (req, res) => {
    let index = parseInt(req.body.index);
    app.locals.blogs.splice(index, 1);
    res.redirect("/");
});

// Redirects to homepage after blog creation
app.post("/submit", (req, res) => {
    res.redirect("/");
});

// Edits the post and redirects to homepage
app.post("/edit", (req, res) => {
    res.redirect("/");
});

// Give the client the blog edit page passing the index of the blog as well
app.post("/toedit", (req, res) => {
    let index = req.body.index;
    res.render("edit.ejs", { "index": index });
});

// Give client the blog creation page
app.get("/create", (req, res) => {
    res.render("create.ejs");
});

// Give client the homepage
app.get("/", (req, res) => {
    res.render("index.ejs");
});

// Start the server
app.listen(port, () => {
    console.log(`The server is running at port ${port}.`);
});

// Return the current date as string in the format mm/dd/yyy
function getDate() {
    let now = new Date();
    let mm = now.getMonth() + 1;
    let dd = now.getDate();
    let yyyy = now.getFullYear();

    let date = "";
    if (mm < 10 && dd < 10) {
        date = `0${mm}/0${dd}/${yyyy}`;
    } else if (mm < 10) {
        date = `0${mm}/${dd}/${yyyy}`;
    } else if (dd < 10) {
        date = `${mm}/0${dd}/${yyyy}`;
    } else {
        date = `${mm}/${dd}/${yyyy}`;
    }
    return date;
}

// Return the current time as string in the format hh:mm A/PM
function getTime() {
    let now = new Date();
    let hh = now.getHours();
    let mm = now.getMinutes();
    let time = "";
    if (hh >= 12) {
        if (hh !== 12) {
            hh = hh % 12;
        }
        if (hh < 10 && mm < 10) {
            time = `0${hh}:0${mm} PM`;
        } else if (hh < 10) {
            time = `0${hh}:${mm} PM`;
        } else if (mm < 10) {
            time = `${hh}:0${mm} PM`;
        } else {
            time = `${hh}:${mm} PM`;
        }
    } else {
        if (hh === 0) {
            hh = 12;
        }
        if (hh < 10 && mm < 10) {
            time = `0${hh}:0${mm} AM`;
        } else if (hh < 10) {
            time = `0${hh}:${mm} AM`;
        } else if (mm < 10) {
            time = `${hh}:0${mm} AM`;
        } else {
            time = `${hh}:${mm} AM`;
        }
    }
    return time;
}