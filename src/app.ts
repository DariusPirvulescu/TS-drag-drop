// Project State Manangement
// singleton class
class ProjectState {
  private listeners: any[] = [];
  private projects: any[] = [];
  private static instance: ProjectState

  private constructor() {
    
  }

  static getInstance() {
    if (this.instance) {
      return this.instance
    }
    this.instance = new ProjectState()
    return this.instance
  }

  addListener(listenerFn: Function){
    this.listeners.push(listenerFn)
  }

  addProject(title: string, description: string, numPeople: number) {
    const newProj = {
      id: Math.random().toString(),
      title: title,
      description: description,
      people: numPeople
    }
    this.projects.push(newProj)
    for (const listenerFn of this.listeners) {
      // listenerFn(this.projects = [...this.projects])
      listenerFn(this.projects.slice())
    }
  }
}

const projState = ProjectState.getInstance()

// Autobind Decorator
function Binder(_: any, _2: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  const adjustDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const configFn = method.bind(this);
      return configFn;
    },
  };
  return adjustDescriptor;
}

// Validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validateInput: Validatable) {
  // ! destructure
  let isValid = true;
  if (validateInput.required) {
    isValid = isValid && validateInput.value.toString().trim().length != 0;
  }

  if (
    validateInput.minLength != null &&
    typeof validateInput.value === "string"
  ) {
    isValid = isValid && validateInput.value.length >= validateInput.minLength;
  }

  if (
    validateInput.maxLength != null &&
    typeof validateInput.value === "string"
  ) {
    isValid = isValid && validateInput.value.length <= validateInput.maxLength;
  }

  if (validateInput.min && typeof validateInput.value === "number") {
    isValid = isValid && validateInput.value >= validateInput.min;
  }
  if (validateInput.max && typeof validateInput.value === "number") {
    isValid = isValid && validateInput.value <= validateInput.max;
  }
  return isValid;
}

// List
class ProjectList {
  template: HTMLTemplateElement;
  hostContainer: HTMLDivElement;
  projectsElement: HTMLElement;
  assignedProjects: any[];


  constructor(private status: "Active" | "Finished") {
    this.template = document.getElementById("project-list")! as HTMLTemplateElement
    this.hostContainer = document.getElementById("app")! as HTMLDivElement;
    this.assignedProjects = []
    
    const importedNote = document.importNode(this.template.content, true)
    this.projectsElement = importedNote.firstElementChild as HTMLElement
    this.projectsElement.id = `${this.status}-projects`

    projState.addListener((project: any[]) => {
      this.assignedProjects = project;
      this.renderProjects();
    })

    this.attatch();
    this.renderList();
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.status}-projects-list`)! as HTMLUListElement;
    for (const proj of this.assignedProjects) {
      const listItem = document.createElement("li")
      listItem.textContent = proj.title
      listEl.appendChild(listItem)

    }
  }

  private renderList() {
    const listId = `${this.status}-projects-list`
    this.projectsElement.querySelector("ul")!.id = listId
    this.projectsElement.querySelector("h2")!.innerHTML = `${this.status} Projects`
  }

  private attatch() {
    this.hostContainer.insertAdjacentElement("beforeend", this.projectsElement)
  }
}


// Form
class ProjectForm {
  template: HTMLTemplateElement;
  hostContainer: HTMLDivElement;
  formElement: HTMLFormElement;

  titleInputEl: HTMLInputElement;
  descriptionInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    this.template = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostContainer = document.getElementById("app")! as HTMLDivElement;

    const importedNote = document.importNode(this.template.content, true);
    this.formElement = importedNote.firstElementChild as HTMLFormElement;
    this.formElement.id = "project-form";

    this.titleInputEl = this.formElement.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputEl = this.formElement.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputEl = this.formElement.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.config();
  }

  attatch() {
    this.hostContainer.insertAdjacentElement("afterbegin", this.formElement);
  }

  private getUserInput(): [string, string, number] | void {
    const title = this.titleInputEl.value.trim();
    const description = this.descriptionInputEl.value.trim();
    const people = this.peopleInputEl.value.trim();

    const titleInputCheck: Validatable = {
      value: title,
      required: true,
    };
    const descriptionInputCheck: Validatable = {
      value: description,
      required: true,
      minLength: 5,
    };
    const peopleInputCheck: Validatable = {
      value: +people,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      validate(titleInputCheck) &&
      validate(descriptionInputCheck) &&
      validate(peopleInputCheck)
    ) {
      return [title, description, +people];
    } else {
      alert("Invalid Input");
      return;
    }
  }

  @Binder
  private getValues(event: Event) {
    event.preventDefault();
    const userInput = this.getUserInput();

    // if (Array.isArray(userInput)) {
    if (userInput) {
      const [ title, description, numPeople ] = userInput

      projState.addProject(
        title,
        description,
        numPeople
      )
      // this.titleInputEl.value = ""
      // this.descriptionInputEl.value = ""
      // this.peopleInputEl.value = ""
      // or
      this.formElement.reset();
    }
    console.log(userInput);
  }

  private config() {
    this.formElement.addEventListener("submit", this.getValues);
  }
}

const pr = new ProjectForm();
pr.attatch();

const activeProjects = new ProjectList("Active")
const finishedProjects = new ProjectList("Finished")
