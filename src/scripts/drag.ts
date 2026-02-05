// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 Choi Madeleine

let index = 1;

function drag(el: HTMLElement) {
  var pos = [0, 0, 0, 0];
  const header = el.firstElementChild as HTMLElement;
  if (!header) throw new Error();

  function mousedown(e: MouseEvent) {
    e.preventDefault();
    pos[3] = e.clientX;
    pos[4] = e.clientY;
    document.onmouseup = mouseup;
    document.onmousemove = mousemove;
  }

  function mousemove(e: MouseEvent) {
    e.preventDefault();
    pos[1] = pos[3] - e.clientX;
    pos[2] = pos[4] - e.clientY;
    pos[3] = e.clientX;
    pos[4] = e.clientY;
    el.style.top = el.offsetTop - pos[2] + "px";
    el.style.left = el.offsetLeft - pos[1] + "px";
    el.style.zIndex = (index++).toString();
  }

  function mouseup() {
    document.onmouseup = null;
    document.onmousemove = null;
  }

  header.onmousedown = mousedown;
}

document.querySelectorAll(".draggable").forEach((el) => {
  drag(el as HTMLElement);
});
