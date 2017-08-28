
const lorem = require('lorem');
const cuid = require('cuid');

const total = 10;
function arr(tam) {
  let max = Math.floor((Math.random() * 10) + 1);
  for (var a=[],i=0;i<(max-1);++i) a[i]=i+1;
  function shuffle(array) {
    var tmp, current, top = tam;
    if(top) while(--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
    }
    return array;
  }
  const testResult = shuffle(a);
  const randArray = testResult.filter(item => {
    return item;
  });
  return randArray;
}

export default function product(id) {
  let aff = arr(total);
  let product = {
    id: id,
    cuid: cuid(),
    owner: Math.floor((Math.random() * 10) + 1),
    title: lorem.ipsum('s'),
    description: lorem.ipsum('p'),
    thumb: 'https://hotmart.s3.amazonaws.com/product_pictures/cf8aaddf-858d-428e-ac92-02833c535784/CoverMeuEvento.png',
    affiliates: aff,
    totalAffiliates: aff.length,
    price: {
      currency: 'BRL',
      value: Math.floor((Math.random() * 9999) + 1),
    },
  }
  return product
}
