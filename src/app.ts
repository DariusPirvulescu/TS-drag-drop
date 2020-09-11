// autobind Decorator
function Binder(_: any, _2: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value

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

  private getUserInput(): [string, string, number] | void {
    const title = this.titleInputEl.value.trim()
    const description = this.descriptionInputEl.value.trim()
    const people = this.peopleInputEl.value.trim()
    
    if (title.length === 0 ||
    description.length === 0 ||
    people.length === 0) {
      alert("Invalid Input")
      return;
    } else {
      return [title, description, +people]
    }
  }

  @Binder
  private getValues(event: Event) {
    event.preventDefault();
    const userInput = this.getUserInput()
    if (userInput) {
      // this.titleInputEl.value = ""
      // this.descriptionInputEl.value = ""
      // this.peopleInputEl.value = ""
      // or 
      this.formElement.reset(); 
    }
    console.log(userInput)
  }

  private config() {
    this.formElement.addEventListener("submit", this.getValues)
  }
}

const pr = new Project()
pr.attatch();