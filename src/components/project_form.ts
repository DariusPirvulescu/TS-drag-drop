import { Component } from "./base_component.js";
import { Validatable, validate } from "../validate/validation.js";
import { projState } from "../state/project_state.js";
import { Binder } from "../decorators/binder_decorator.js";

// Form
export class ProjectForm extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputEl: HTMLInputElement;
  descriptionInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "project-form");

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
