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

  constructor(private status: "active" | "finished") {
    this.template = document.getElementById("project-list")! as HTMLTemplateElement
    this.hostContainer = document.getElementById("app")! as HTMLDivElement;
    // this.projects = document.getElementById("projects")! as HTMLElement;

    const importedNote = document.importNode(this.template.content, true )
    this.projectsElement = importedNote.firstElementChild as HTMLElement
    this.projectsElement.id = `${this.status} projects`
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
    if (userInput) {
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
