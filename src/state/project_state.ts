import { Project, ProjStatus } from "../interfaces/project_model";

// singleton class
type Listener<T> = (item: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

// Project State Manangement
class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
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
    const newProj = new Project(
      Math.random().toString(),
      title,
      description,
      numPeople,
      ProjStatus.Active
    );
    this.projects.push(newProj);
    // for (const listenerFn of this.listeners) {
    //   // listenerFn(this.projects = [...this.projects])
    //   listenerFn(this.projects.slice());
    // }
    this.updateListeners();
  }

  moveProj(projId: string, projStatus: ProjStatus) {
    const project = this.projects.find((prj) => prj.id === projId);
    if (project && project.status != projStatus) {
      project.status = projStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      // listenerFn(this.projects = [...this.projects])
      listenerFn(this.projects.slice());
    }
  }
}

export const projState = ProjectState.getInstance();
