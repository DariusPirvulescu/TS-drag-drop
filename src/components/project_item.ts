// Project Item
export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
  private project: Project;

  get persString() {
    // refac
    if (this.project.people === 1) {
      return "1 person "
    } else {
      return `${this.project.people} persons `
    }
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id)
    this.project = project
    
    this.config()
    this.renderProj()
    
  }

  @Binder
  dragSHandler(event: DragEvent) {
    event.dataTransfer!.setData("text/plain", this.project.id)
    event.dataTransfer!.effectAllowed = "move"
  }

  dragEHandler(_: DragEvent) {
    console.log("end drag")
  }


  config() {
    this.element.addEventListener("dragstart", this.dragSHandler)
    this.element.addEventListener("dragend", this.dragEHandler)

  }

  renderProj() {
    // destructure
    this.element.querySelector("h2")!.textContent = this.project.title
    this.element.querySelector("h3")!.textContent = this.persString + "assigned"
    this.element.querySelector("p")!.textContent = this.project.description
  }
}
