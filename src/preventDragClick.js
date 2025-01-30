export class PreventDragClick {
  constructor(element) {
    this.mouseMoved;
    // mouseMoved는 마우스가 움직였는지 판정하는 플래그
    let clickStartX, clickStartY, clickStartTime;
    element.addEventListener("mousedown", (e) => {
      clickStartX = e.clientX;
      clickStartY = e.clientY;
      clickStartTime = Date.now();
    });
    element.addEventListener("mouseup", (e) => {
      const xGap = Math.abs(clickStartX - e.clientX);
      const yGap = Math.abs(clickStartY - e.clientY);
      const timeGap = Date.now() - clickStartTime;

      if (xGap < 5 && yGap < 5 && timeGap < 200) {
        this.mouseMoved = false;
      } else {
        this.mouseMoved = true;
      }
    });
  }
}
