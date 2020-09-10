class Project {
  template: HTMLTemplateElement
  hostContainer: HTMLDivElement
  formElement: HTMLFormElement

  constructor() {
    this.template = document.getElementById("project-input")! as HTMLTemplateElement
    this.hostContainer = document.getElementById("app")! as HTMLDivElement

    const importedNote = document.importNode(this.template.content, true)
    this.formElement = importedNote.firstElementChild as HTMLFormElement
  }

  attatch() {
    this.hostContainer.insertAdjacentElement("afterbegin", this.formElement)
  }
}

const pr = new Project()
pr.attatch();