// const isNum = a => /[\d]/.test(a)
// const isUpper = a => /[A-Z]/.test(a);

// function countOfLetters(formula) {
//   const stack = [];
//   const map = new Map();

//   stack.push([]);
//   let i = 0;

//   const getNums = index => {
//     let num = '';
//     while (isNum(formula[index])) {
//       num += formula[index];
//       index++;
//     }
//     return num;
//   };

//   while (i < formula.length) {
//     if (isUpper(formula[i])) {
//       let atom = formula[i]
//       i += atom.length;
//       let obj = {};
//       obj['name'] = atom;
//       if (isNum(formula[i])) {
//         let num = getNums(i);
//         i += num.length;
//         obj['value'] = Number(num);
//       } else {
//         obj['value'] = 1;
//       }
//       stack[stack.length - 1].push(obj);
//     } else if (formula[i] === '(') {
//       stack.push([]);
//       i++;
//     } else if (formula[i] === ')') {
//       i++;
//       let multi = getNums(i);
//       i += multi.length;
//       let left = stack[stack.length - 2];
//       let right = stack[stack.length - 1];
//       for (let j = 0; j < right.length; ++j) {
//         let obj = {};
//         obj['value'] = multi * right[j].value;
//         obj['name'] = right[j].name;
//         left.push(obj);
//       }
//       stack.pop();
//     }
//   }

//   // console.log(stack[0])

//   const obj = {};
//   /*  这里要遍历两次，因为有重复的元素。第一次所有key都赋0，第二次加上value。*/
//   for (let i = 0; i < stack[0].length; ++i) {
//     obj[stack[0][i].name] = 0;
//   }
//   for (let i = 0; i < stack[0].length; ++i) {
//     obj[stack[0][i].name] += stack[0][i].value;
//   }

//   return obj
// }


// const res = countOfLetters('C4(A(A3B)2)2')
// console.log(res)


function flatten(obj, parentKey = "", result = {}) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      let keyName = `${parentKey}${key}`;
      if (typeof obj[key] === 'object')
        flatten(obj[key], keyName + ".", result)
      else
        result[keyName] = obj[key];
    }
  }
  return result;
}

var input = {
  a: 1,
  b: [1, 2, { c: true }, [3]],
  d: { e: 2, f: 3 },
  g: null,
}
var output = flatten(input);

console.log(output)
