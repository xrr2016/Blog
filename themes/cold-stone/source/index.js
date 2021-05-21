// Copyright (c) 2021 Cold Stone
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
const backgrounds = [
  '#ffffff',
  '#fafafa',
  '#fafaf0',
  '#f0fef6',
  '#f0fef6',
  '#fff0f0',
]

let index = 0
let root = document.documentElement

document.getElementById('color').addEventListener('click', () => {
  index++
  if (index >= backgrounds.length) {
    index = 0
  }
  console.log(index)
  root.style.setProperty('--bg-color', backgrounds[index])
})

document.querySelectorAll('.highlight').forEach((block) => {
  hljs.highlightBlock(block)
})
