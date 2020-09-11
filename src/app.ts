function Binder(target: any, _: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value

  console.log("Target:: ", target)
  console.log("meth:: ", descriptor)
  const adjustDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const configFn = method.bind(this)
      return configFn
    }
  }
  return adjustDescriptor
}


class Project {
  template: HTMLTemplateElement
  hostContainer: HTMLDivElement
  formElement: HTMLFormElement

  titleInputEl: HTMLInputElement
  descriptionInputEl: HTMLInputElement
  peopleInputEl: HTMLInputElement


  constructor() {
    this.template = document.getElementById("project-input")! as HTMLTemplateElement
    this.hostContainer = document.getElementById("app")! as HTMLDivElement

    const importedNote = document.importNode(this.template.content, true)
    this.formElement = importedNote.firstElementChild as HTMLFormElement
    this.formElement.id = "project-form"

    this.titleInputEl = this.formElement.querySelector("#title") as HTMLInputElement
    this.descriptionInputEl = this.formElement.querySelector("#description") as HTMLInputElement
    this.peopleInputEl = this.formElement.querySelector("#people") as HTMLInputElement

    this.config()
  }

  attatch() {
    this.hostContainer.insertAdjacentElement("afterbegin", this.formElement)
  }

  @Binder
  private getValues(event: Event) {
    event.preventDefault();
    console.log(this.titleInputEl.value)
  }

  private config() {
    this.formElement.addEventListener("submit", this.getValues)
  }
}

const pr = new Project()
pr.attatch();