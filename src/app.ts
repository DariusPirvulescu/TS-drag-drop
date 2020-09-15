// Drag Events Interface
interface Draggable {
  dragSHandler(evt: DragEvent): void,
  dragEHandler(evt: DragEvent): void
}

interface DragTarget {
  dragOverHandler(evt: DragEvent): void,
  dragHandler(evt: DragEvent): void,
  DragLeaveHandler(evt: DragEvent): void
}

// Project Type
enum ProjStatus { Active, Finished }

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjStatus
  ) {}
}

// Project State Manangement
// singleton class
type Listener<T> = (item: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}


class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super()
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, numPeople: number) {
    // const newProj = {
    //   id: Math.random().toString(),
    //   title: title,
    //   description: description,
    //   people: numPeople,
    // };
    const newProj = new Project(Math.random().toString(), title, description, numPeople, ProjStatus.Active)
    this.projects.push(newProj);
    for (const listenerFn of this.listeners) {
      // listenerFn(this.projects = [...this.projects])
      listenerFn(this.projects.slice());
    }
  }
}

const projState = ProjectState.getInstance();

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
// General Component Class
abstract class Component<T extends HTMLElement, U extends HTMLElement > {
  template: HTMLTemplateElement;
  hostContainer: T;
  element: U;

  constructor(templateId: string, hostContainerId: string, insertBeginning: boolean, newElementId?: string) {
    this.template = document.getElementById(templateId)! as HTMLTemplateElement;
    this.hostContainer = document.getElementById(hostContainerId)! as T;
    
      const importedNote = document.importNode(this.template.content, true);
      this.element = importedNote.firstElementChild as U;
      if (newElementId) {
        this.element.id = newElementId;
      }

    this.attatch(insertBeginning)
  }

  private attatch(insertAtStart: boolean) {
    this.hostContainer.insertAdjacentElement(insertAtStart ? "afterbegin" : "beforeend", this.element);
  }

  // make these two methods required
  abstract config(): void;
  // abstract renderContent?(): void;
}

// Project Item
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
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

  dragSHandler(event: DragEvent) {
    console.log(event)
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

// List
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private status: "active" | "finished") {
    super("project-list", "app", false, `${status}-projects`)
    this.assignedProjects = [];

    this.config()
    this.renderList();
  }

  config() {
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

// Form
class ProjectForm extends Component<HTMLDivElement, HTMLFormElement> {

  titleInputEl: HTMLInputElement;
  descriptionInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "project-form")

    this.titleInputEl = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputEl = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputEl = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.config();
  }

  config() {
    this.element.addEventListener("submit", this.getValues);
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
      const [title, description, numPeople] = userInput;

      projState.addProject(title, description, numPeople);
      // this.titleInputEl.value = ""
      // this.descriptionInputEl.value = ""
      // this.peopleInputEl.value = ""
      // or
      this.element.reset();
    }
    console.log(userInput);
  }

  
}

const pr = new ProjectForm();

const activeProjects = new ProjectList("active");
const finishedProjects = new ProjectList("finished");
