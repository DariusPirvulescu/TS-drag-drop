// Drag Events Interface
export interface Draggable {
  dragSHandler(evt: DragEvent): void,
  dragEHandler(evt: DragEvent): void
}

export interface DragTarget {
  dragOverHandler(evt: DragEvent): void,
  dropHandler(evt: DragEvent): void,
  DragLeaveHandler(evt: DragEvent): void
}