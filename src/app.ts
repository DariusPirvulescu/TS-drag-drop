const btn = document.getElementById("load")


function show() {
  const template = document.querySelector("template")!
  const clone = template.content.cloneNode(true)
  const app = document.getElementById("app")!
  app.appendChild(clone)
  console.log("CLI")
}

btn?.addEventListener("click", function() {
  show()
})


