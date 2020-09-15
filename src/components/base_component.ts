// General Component Class
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  template: HTMLTemplateElement;
  hostContainer: T;
  element: U;

  constructor(
    templateId: string,
    hostContainerId: string,
    insertBeginning: boolean,
    newElementId?: string
  ) {
    this.template = document.getElementById(templateId)! as HTMLTemplateElement;
    this.hostContainer = document.getElementById(hostContainerId)! as T;

    const importedNote = document.importNode(this.template.content, true);
    this.element = importedNote.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attatch(insertBeginning);
  }

  private attatch(insertAtStart: boolean) {
    this.hostContainer.insertAdjacentElement(
      insertAtStart ? "afterbegin" : "beforeend",
      this.element
    );
  }

  // make these two methods required
  abstract config(): void;
  // abstract renderContent?(): void;
}
