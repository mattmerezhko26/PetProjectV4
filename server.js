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
app.post('/solutions/addProject', async (req, res) => {
  try {
    // Validation to ensure required fields are provided
    if (!req.body.title || !req.body.sector_id) {
      return res.status(400).render("500", { message: "Title and Sector are required." });
    }

    await projectData.addProject(req.body); // Adjust `addProject` to accept the correct structure
    res.redirect('/solutions/projects');
  } catch (err) {
    console.error("Error adding project:", err); 
    res.status(500).render("500", { message: "An error occurred while adding the project." });
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
  const projectDataInput = req.body;

  console.log("Edit Project Input:", projectId, projectDataInput); // Debugging

  try {
    await projectData.editProject(projectId, projectDataInput);
    res.redirect('/solutions/projects');
  } catch (err) {
    console.error("Error editing project:", err); // Debugging
    res.status(500).render("500", { message: `Error updating project: ${err.message}` });
  }
});
app.post("/solutions/deleteProject/:id", async (req, res) => {
  const projectId = req.params.id;

  console.log("Deleting Project with ID:", projectId); // Debugging

  try {
    await projectData.deleteProject(projectId);
    res.redirect("/solutions/projects");
  } catch (err) {
    console.error("Error deleting project:", err); // Debugging
    res.status(500).render("500", { message: `Error deleting project: ${err.message}` });
  }
});
app.use((req, res, next) => {
  res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"})
});


projectData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});