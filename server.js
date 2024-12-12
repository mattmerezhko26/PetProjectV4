const projectData = require("./modules/projects");
const path = require("path");

const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render("home");
});

app.get('/about', (req, res) => {
  res.render("about");
});

app.get("/solutions/projects", async (req, res) => {
  try {
    let projects;
    if (req.query.sector) {
      projects = await projectData.getProjectsBySector(req.query.sector);
      console.log("Projects by sector:", projects); // Add this line to check
      if (projects.length === 0) {
        return res.status(404).render("404", { message: `No projects found for sector: ${req.query.sector}` });
      }
    } else {
      projects = await projectData.getAllProjects();
      console.log("All projects:", projects); // Add this line to check
    }
    res.render("projects", { projects });
  } catch (err) {
    console.error("Error fetching projects:", err); // Log any errors
    res.status(404).render("404", { message: "An error occurred while fetching projects." });
  }
});

app.get("/solutions/projects/:id", async (req, res) => {
  try {
    const project = await projectData.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).render("404", { message: `Project with ID ${req.params.id} not found.` });
    }
    res.render("projectDetails", { project });
  } catch (err) {
    res.status(404).render("404", { message: "An error occurred while fetching the project." });
  }
});
app.get('/solutions/addProject',async(req,res) =>{
  try{
    const sectors = await projectData.getAllSectors();
    res.render("AddProject",{sectors});
  } catch(err){
    res.render("500",{message: "Failed to load sectors"});
  }
});
app.post('/solutions/addProject',async (req,res) =>{
  const projectData = req.body;
  try{
    await projectData.addProject(projectData);
    res.redirect('/solutions/project');
  } catch(err) {
    res.render("500",{message:"Error"});
  }
});
app.get('/solutions/editProject/:id', async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await projectData.getProjectById(projectId);
    const sectors = await projectData.getAllSectors();

    if (!project) {
      return res.status(404).render("404", { message: `Project with ID ${projectId} not found.` });
    }
    res.render("editProject", { project, sectors });
  } catch (err) {
    res.status(404).render("404", { message: `Error fetching project or sectors: ${err.message}` });
  }
});
app.post('/solutions/editProject', async (req, res) => {
  const projectId = req.body.id; 
  const projectData = req.body;

  try {
    await projectData.editProject(projectId, projectData);
    res.redirect('/solutions/projects');
  } catch (err) {
    res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err.message}` });
  }
});
app.get('/solutions/deleteProject/:id', (req, res) => {
  const projectId = req.params.id;

  // Call the deleteProject function from the projects module
  projectData.deleteProject(projectId)
    .then(() => {
      // Redirect to the projects list page after successful deletion
      res.redirect('/solutions/projects');
    })
    .catch((err) => {
      // If there was an error, render the 500 error page with the appropriate message
      res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
    });
});
app.use((req, res, next) => {
  res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"})
});


projectData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});