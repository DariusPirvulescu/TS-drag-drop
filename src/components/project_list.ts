// List
export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget{
  assignedProjects: Project[];

  constructor(private status: "active" | "finished") {
    super("project-list", "app", false, `${status}-projects`)
    this.assignedProjects = [];
    
    // ADDING DEFAULT PROJECT
    projState.addProject("fasfsa", "fasvcxvjhxckvxckv", 3);
    
    this.config()
    this.renderList();
  }

  @Binder
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault()
      // console.log(event)
      const listContainer = this.element.querySelector("ul")!
      listContainer.classList.add("droppable")
    }
  }

  @Binder
  dropHandler(event: DragEvent) {
    console.log(event.dataTransfer!.getData("text/plain"))
    const projectId = event.dataTransfer!.getData("text/plain")
    projState.moveProj(projectId, this.status === "active" ? ProjStatus.Active : ProjStatus.Finished)

    const listContainer = this.element.querySelector("ul")!
    listContainer.classList.remove("droppable")
  }

  @Binder
  DragLeaveHandler(_: DragEvent) {
    const listContainer = this.element.querySelector("ul")!
    listContainer.classList.remove("droppable")
  }

  config() {
    this.element.addEventListener("dragover", this.dragOverHandler)
    this.element.addEventListener("drop", this.dropHandler)
    this.element.addEventListener("dragleave", this.DragLeaveHandler)

    projState.addListener((project: Project[]) => {
      const filteredProj = project.filter(proj => {
        if (this.status === "active") {
          return proj.status === ProjStatus.Active
        }
        return proj.status === ProjStatus.Finished
      })
      this.assignedProjects = filteredProj;
      this.renderProjects();
    });
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.status}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = "";
    for (const proj of this.assignedProjects) {
      new ProjectItem(listEl.id, proj)
      // const listItem = document.createElement("li");
      // listItem.textContent = proj.title;
      // listEl.appendChild(listItem);
    }
  }

  private renderList() {
    const listId = `${this.status}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector(
      "h2"
    )!.innerHTML = `${this.status[0].toUpperCase() + this.status.slice(1)} Projects`;
  }

}

const activeProjects = new ProjectList("active");
const finishedProjects = new ProjectList("finished");
